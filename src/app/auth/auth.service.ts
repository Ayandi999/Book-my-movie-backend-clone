// Todo: Always update the etherial mail before starting

import db from "../db";
import * as argon2 from "argon2";
import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { LoginSchema, RegisterSchema } from "./model/verificationModel";
import { usersTable, validationTable } from "../db/schema";
import APIError from "../../common/util/api-error";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

type user = z.infer<typeof RegisterSchema>;
type loginUser = z.infer<typeof LoginSchema>;

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});
//=================Registration Service=======================
const registrationService = async (data: user) => {
  const { firstName, lastName, email, password } = data;

  //First create a hash to make the password hashe before storing it in.
  const hashedPassword = await argon2.hash(password);
  const [inserted] = await db
    .insert(usersTable)
    .values({ firstName, lastName, email, password: hashedPassword })
    .returning();
  if (!inserted) throw APIError.DBError("Something was wrong");
  await generateValidationEmail(email, inserted.id);

  return {
    firstName,
    lastName,
    registerd: true,
  };
};

//============Validation service====================

async function generateValidationEmail(email: string, id: string) {
  const validationString = crypto.randomInt(100000, 1000000).toString();
  const link = `http://localhost:8080/api/auth/validate/${validationString}`;

  //insert the validation code into the table
  const [inserted] = await db
    .insert(validationTable)
    .values({
      user_id: id,
      verification_code: validationString,
      generated_at: new Date(),
      valid_till: new Date(Date.now() + 15 * 60 * 1000),
      type: "email",
    })
    .returning();

  if (!inserted) throw APIError.DBError("Issue while inserting into DB");

  //Only if data is saved successfully
  try {
    const info = await transporter.sendMail({
      from: `BookMyMovie <${process.env.SMTP_MAIL}>`, // sender address
      to: email, // list of recipients
      subject: "Email Verification", // subject line
      html: `<h1>Welcom! to BookMyMovie</h1><d>Hey we are almost done please click on the link below to verify</d><br><a href=${link}>click here to verify</a>`, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}

async function cleanupVerificaiontable(id: string, verificationCode: string) {
  const [deleted] = await db
    .delete(validationTable)
    .where(
      and(
        eq(validationTable.verification_code, verificationCode),
        eq(validationTable.type, "email"),
      ),
    )
    .returning();
  if (!deleted)
    throw APIError.DBError("deletion failed from validation table");
}

async function validateService(verificationCode: string) {
  //search for the verificationCode part.
  const [found] = await db
    .select({
      id: validationTable.user_id,
      valid_till: validationTable.valid_till,
    })
    .from(validationTable)
    .where(
      and(
        eq(validationTable.verification_code, verificationCode),
        eq(validationTable.type, "email"),
      ),
    );
  //if not found...slap an error
  if (!found) throw APIError.ValidationFailedError("Failed to verify user");
  if (new Date() >= found.valid_till!)
    throw APIError.ValidationFailedError("Code expired");
  //if found:
  const [updated] = await db
    .update(usersTable)
    .set({ emailVerified: true })
    .where(eq(usersTable.id, found.id))
    .returning();

  if (!updated) throw APIError.DBError("failed to verify user");
  //Delete entry from db verificationTable
  await cleanupVerificaiontable(found.id, verificationCode);

  return `email was successfully verifyed`;
}

// ===========Log In service==========================
const loginService = async (data: loginUser) => {
  //Verify Email
  const { email, password } = data;
  //Check if the email acctually exist: This will return an array of jsons
  const emailFetched = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (emailFetched.length === 0)
    throw APIError.DBError("Email or password entered is wrong");
  //Verify Password

  const fetchedPassword = emailFetched[0]?.password;
  if (!(await argon2.verify(fetchedPassword!, password)))
    throw APIError.UnAuthorizedAccessError("Email/password wrong");
  if (!emailFetched[0]?.emailVerified)
    throw APIError.UnAuthorizedAccessError("Email not verifyed");
  //Generate tokens access and responce
  const accessToken = jwt.sign(
    { userId: emailFetched[0].id },
    process.env.ACCESS_SECRET!,
    { expiresIn: `15m` },
  );
  const refreshToken = jwt.sign(
    { userId: emailFetched[0].id },
    process.env.REFRESH_SECRET!,
    { expiresIn: `1d` },
  );

  //Db update
  const [updated] = await db
    .update(usersTable)
    .set({ refreshToken: refreshToken })
    .where(eq(usersTable.email, email))
    .returning();
  if (!updated) return APIError.DBError("Failed to update in DB");

  return {
    accessToken,
    refreshToken,
    email,
  };
  //return access and responce token to the user.
};

/**
 * Data recived looks like
 * 
{
  "userId": "cf9ba35e-58aa-4a81-9c79-e2f1284a8b37",
  "iat": 1775875585,
  "exp": 1775961985
}  
 */
type recivedData = {
  refreshToken: string;
  userId: string;
  iat: number;
  exp: number;
};
async function refreshService(data: recivedData) {
  //check if refresh token is valid/not
  //If valid[time has not expired] then generate new access and refresh and send back
  //If expired send throw kind of error code for controller to handle
  const user = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, data.userId));
  if (user.length === 0)
    throw APIError.UnAuthorizedAccessError("This user don't exist");
  if (user[0]?.refreshToken !== data.refreshToken)
    throw APIError.UnAuthorizedAccessError("Illegal access");

  //Generate access and refresh token
  const accessToken = jwt.sign(
    { userId: data.userId },
    process.env.ACCESS_SECRET!,
    { expiresIn: `15m` },
  );
  const refreshToken = jwt.sign(
    { userId: data.userId },
    process.env.REFRESH_SECRET!,
    { expiresIn: `1d` },
  );
  //Update refresh token in db
  try {
    await db
      .update(usersTable)
      .set({ refreshToken: refreshToken })
      .where(eq(usersTable.id, data.userId))
      .returning();
    return {
      accessToken,
      refreshToken,
    };
  } catch (e: any) {
    throw APIError.DBError(e.message);
  }
}
//===========================LOGOUT======================
//Logout service:
async function logoutService(data: string) {
  //Check is data is even there data should recive only user id
  if (!data || typeof data !== "string")
    throw APIError.BadRequest("data field missing");
  //directly try updating in the db if user is not there throw error

  const [updated] = await db
    .update(usersTable)
    .set({ refreshToken: null })
    .where(eq(usersTable.id, data))
    .returning();
  if (!updated) throw APIError.UnAuthorizedAccessError("User doesnot exist");
}
//=============================Forgot password============================
//Forgot password

async function generatePasswordResetEmail(email: string, id: string) {
  const resetString = crypto.randomInt(100000, 1000000).toString();
  const link = `http://localhost:8080/api/auth/reset/${resetString}`;

  //insert the validation code into the table
  const [inserted] = await db
    .insert(validationTable)
    .values({
      user_id: id,
      verification_code: resetString,
      generated_at: new Date(),
      valid_till: new Date(Date.now() + 15 * 60 * 1000),
      type: "password",
    })
    .returning();

  if (!inserted) throw APIError.DBError("Issue while inserting into DB");

  //Only if data is saved successfully
  try {
    const info = await transporter.sendMail({
      from: `BookMyMovie <${process.env.SMTP_MAIL}>`, // sender address
      to: email, // list of recipients
      subject: "Password reset email", // subject line
      html: `<h1>Password Reset Request</h1>
<p>We received a request to reset your password. If this was you, click the link below:</p>
<a href="${link}" style="background: blue; color: white; padding: 10px;">Reset My Password</a>
`, // HTML body
    });
  } catch (err) {
    throw err;
  }
}

async function forgotPasswordService(email: string) {
  //let me see if email exist in db
  const [userExists] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  if (!userExists)
    throw APIError.UnAuthorizedAccessError("Account doesn't exist");
  //send link via email with some kind of id that will hit reset password endpoint
  await generatePasswordResetEmail(email, userExists.id);
}

//Reset password
async function resetPasswordService(newPassword: string, code: string) {
  const [returned] = await db
    .select()
    .from(validationTable)
    .where(
      and(
        eq(validationTable.verification_code, code),
        eq(validationTable.type, "password"),
      ),
    );
  if (!returned) throw APIError.UnAuthorizedAccessError("Reset code is invalid");
  //check if the reset link has expired
  if (new Date() >= returned.valid_till!)
    throw APIError.ValidationFailedError("Reset link has expired");
  const hashedPassword = await argon2.hash(newPassword);
  await db
    .update(usersTable)
    .set({ password: hashedPassword })
    .where(eq(usersTable.id, returned.user_id));
  //cleanup: delete the used reset code so it can't be reused
  await db
    .delete(validationTable)
    .where(
      and(
        eq(validationTable.verification_code, code),
        eq(validationTable.type, "password"),
      ),
    );
}

export {
  registrationService,
  loginService,
  validateService,
  refreshService,
  logoutService,
  forgotPasswordService,
  resetPasswordService,
};

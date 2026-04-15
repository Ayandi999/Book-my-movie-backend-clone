import type { Request, Response } from "express";
import {
  registrationService,
  loginService,
  validateService,
  refreshService,
  logoutService,
  forgotPasswordService,
  resetPasswordService,
} from "./auth.service";
import APIError from "../../common/util/api-error";

async function RegisterController(req: Request, res: Response) {
  try {
    const registrationSuccessful = await registrationService(req.body);
    res.json(registrationSuccessful); //I need to return a body to this guy
  } catch (e: any) {
    res.status(e.statusCode ?? 500).json({ error: e.message });
  }
}

async function LoginController(req: Request, res: Response) {
  try {
    const loginServiceSuccessful = await loginService(req.body);
    return res.status(200).json(loginServiceSuccessful);
  } catch (e: any) {
    return res.status(e.statusCode).json({ error: e.message });
  }
}

async function ValidationController(
  req: Request<{ code: string }>,
  res: Response,
) {
  const { code } = req.params;
  if (!code) return res.status(400).json({ error: "validation failed" });
  try {
    const responce = await validateService(code!);
    return res.status(200).json({ message: "successfully verifyed" });
  } catch (e: any) {
    return res.status(e.statusCode ?? 500).json({ error: e.message });
  }
}

async function RefreshController(req: Request, res: Response) {
  try {
    const refresh = await refreshService(req.body);
    return res.json(refresh);
  } catch (e: any) {
    return res.status(e.statusCode || 400).json({ error: e.message });
  }
}

//Here you have recived the same full userid along with all the other fields as well remove all but user id
async function LogoutController(req: Request, res: Response) {
  const userId = req.body.userId;
  try {
    await logoutService(userId);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (e: any) {
    return res.status(e.statusCode).json({ error: e.message });
  }
}

//forgotpassword:
async function forgotPasswordController(req: Request, res: Response) {
  const email = req.body.email;
  if (!email) return res.status(400).json({ error: "Email is missing" });
  try {
    await forgotPasswordService(email);
    return res.status(200).json({ message: "Password reset mail generated!" });
  } catch (e: any) {
    return res.status(e.statusCode).json({ error: e.message });
  }
}
async function ResetPasswordController(
  req: Request<{ code: string }>,
  res: Response,
) {
  const { code } = req.params;
  const newPassword = req.body.password;
  if (!newPassword) throw APIError.BadRequest("Password fiels is empty");
  try {
    await resetPasswordService(newPassword, code);
    return res.status(200).json({ message: "Pasword updated successfully" });
  } catch (e: any) {
    return res.status(e.statusCode).json({ error: e.message });
  }
}

export {
  RegisterController,
  LoginController,
  ValidationController,
  RefreshController,
  LogoutController,
  forgotPasswordController,
  ResetPasswordController,
};

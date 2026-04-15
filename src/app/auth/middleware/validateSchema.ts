import type { Request, Response, NextFunction } from "express";
import { RegisterSchema, LoginSchema } from "../model/verificationModel";
import APIError from "../../../common/util/api-error";
import jwt from "jsonwebtoken";

const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  try {
    RegisterSchema.parse(req.body);
    next();
  } catch (e: any) {
    res.status(e.statusCode ?? 400).json({ error: e.message });
  }
};

const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    LoginSchema.parse(req.body);
    next();
  } catch (e: any) {
    res.status(e.statusCode ?? 400).json({ error: e.message });
  }
};

function validateToken(req: Request, res: Response, next: NextFunction) {
  //what if user forgets to send autorizatin header entirely?
  if (!req.headers["authorization"])
    return res.status(401).json({ errors: "missing required data" });
  try {
    const tokenData = jwt.verify(
      `${req.headers["authorization"]?.split(" ")[1]}`, //check the Bearer clause.
      process.env.REFRESH_SECRET!,
    );
    req.body = tokenData;
    req.body["refreshToken"] = req.headers["authorization"]?.split(" ")[1];
    next();
  } catch (e) {
    //return APIError.TokenExpiredError("Refresh token has expires/is corrupted");
    next(APIError.TokenExpiredError("Refresh token has expires/is corrupted"));
  }
}

export { validateRegister, validateLogin, validateToken };

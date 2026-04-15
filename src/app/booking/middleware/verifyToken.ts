import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import APIError from "../../../common/util/api-error";

function validateToken(req: Request, res: Response, next: NextFunction) {
  //what if user forgets to send autorizatin header entirely?
  if (!req.headers["authorization"])
    return res.status(401).json({ errors: "missing required data" });
  try {
    const tokenData = jwt.verify(
      `${req.headers["authorization"]?.split(" ")[1]}`, //check the Bearer clause.
      process.env.ACCESS_SECRET!,
    );
    req.body.info = tokenData;
    next();
  } catch (e) {
    //return APIError.TokenExpiredError("Refresh token has expires/is corrupted");
    next(APIError.TokenExpiredError("Access token has expires/is corrupted"));
  }
}

export { validateToken };

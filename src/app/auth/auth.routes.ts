import { Router } from "express";
import {
  validateLogin,
  validateToken,
  validateRegister,
} from "./middleware/validateSchema";
import {
  LoginController,
  RegisterController,
  ValidationController,
  RefreshController,
  LogoutController,
  forgotPasswordController,
  ResetPasswordController,
} from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", validateRegister, RegisterController);
authRouter.get("/validate/:code", ValidationController); //this is a direct link nothing to check here
authRouter.post("/login", validateLogin, LoginController);
//refresh expired token:
authRouter.post("/refresh", validateToken, RefreshController);
//Log out
authRouter.post("/logout", validateToken, LogoutController);
authRouter.post("/forgotpassword", forgotPasswordController);
//for testing it has to be post ideally it should be get front end should call get with a body
authRouter.post("/reset/:code", ResetPasswordController);
authRouter.get("/reset/:code", ResetPasswordController);

//Now for performing almost any actions you need to write a middleware validation service where it checks the JWT token and only allows the valid tokens

export default authRouter;

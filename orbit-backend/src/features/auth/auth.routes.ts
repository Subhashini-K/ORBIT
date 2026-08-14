import { Router } from "express";
import { loginController, signupController, forgotPasswordController } from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.post("/signup", signupController);
authRouter.post("/forgot-password", forgotPasswordController);

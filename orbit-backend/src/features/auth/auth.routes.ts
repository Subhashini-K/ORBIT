import { Router } from "express";
import { 
  loginController, 
  signupController, 
  forgotPasswordController,
  oauthAuthController,
  oauthCallbackController,
} from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/login", loginController);
authRouter.post("/signup", signupController);
authRouter.post("/forgot-password", forgotPasswordController);

// OAuth Auth (Sign in with Google/GitHub)
authRouter.get("/oauth/:provider", oauthAuthController); // e.g., /auth/oauth/google
authRouter.get("/oauth/callback/:provider", oauthCallbackController); // e.g., /auth/oauth/callback/google

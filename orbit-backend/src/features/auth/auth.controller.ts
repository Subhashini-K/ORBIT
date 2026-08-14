import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { loginSchema, signupSchema, forgotPasswordSchema } from "./auth.validation.js";
import * as authService from "./auth.service.js";

export const loginController = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);
  res.status(200).json(result);
});

export const signupController = asyncHandler(async (req: Request, res: Response) => {
  const input = signupSchema.parse(req.body);
  const result = await authService.signup(input);
  res.status(201).json(result);
});

export const forgotPasswordController = asyncHandler(async (req: Request, res: Response) => {
  const input = forgotPasswordSchema.parse(req.body);
  const result = await authService.forgotPassword(input.email);
  res.status(200).json(result);
});

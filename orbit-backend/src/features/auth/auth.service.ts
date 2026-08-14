import { User, type UserDoc } from "../../models/User.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { signToken } from "../../utils/jwt.js";
import { ApiError } from "../../utils/ApiError.js";
import { seedNewUserDefaults } from "../../utils/seedUserDefaults.js";
import type { AuthResponse, PublicUser } from "../../types/index.js";
import type { LoginInput, SignupInput } from "./auth.validation.js";

function toPublicUser(user: UserDoc): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl ?? undefined,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const user = await User.findOne({ email: input.email.toLowerCase() });
  if (!user) {
    throw ApiError.unauthorized("That password doesn't look right. Try again.");
  }

  const valid = await comparePassword(input.password, user.passwordHash);
  if (!valid) {
    throw ApiError.unauthorized("That password doesn't look right. Try again.");
  }

  const token = signToken(user.id);
  return { user: toPublicUser(user), token };
}

export async function signup(input: SignupInput): Promise<AuthResponse> {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw ApiError.conflict("An account with that email already exists.");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash,
  });

  // Give every new user the same starting set of (disconnected) sources and
  // automations the frontend's mock fixtures used, so the UI isn't empty.
  await seedNewUserDefaults(user.id);

  const token = signToken(user.id);
  return { user: toPublicUser(user), token };
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  // Deliberately does not reveal whether the account exists.
  return { message: `If an account exists for ${email}, a reset link is on its way.` };
}

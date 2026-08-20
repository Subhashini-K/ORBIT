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

  if (user.provider !== "local") {
    throw ApiError.unauthorized(`This account uses ${user.provider} sign-in. Please use the corresponding button.`);
  }

  if (!user.passwordHash) {
    throw ApiError.unauthorized("This account doesn't have a password set. Please use OAuth sign-in.");
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
    provider: "local",
  });

  // Give every new user the same starting set of (disconnected) sources and
  // automations the frontend's mock fixtures used, so the UI isn't empty.
  await seedNewUserDefaults(user.id);

  const token = signToken(user.id);
  return { user: toPublicUser(user), token };
}

/** Find or create a user from an OAuth provider profile. */
export async function findOrCreateOAuthUser(
  provider: "google" | "github",
  providerId: string,
  email: string,
  name: string,
  avatarUrl?: string,
  mode: "login" | "signup" = "login"
): Promise<AuthResponse> {
  const lowerEmail = email.toLowerCase();

  // In signup mode, check email FIRST to prevent creating duplicate accounts
  if (mode === "signup") {
    const existingByEmail = await User.findOne({ email: lowerEmail });
    if (existingByEmail) {
      throw ApiError.conflict("An account with that email already exists. Please sign in instead.");
    }
  }

  // First try to find by provider + providerId
  let user = await User.findOne({ provider, providerId });

  if (!user) {
    // Then try to find by email (link accounts) - only in login mode
    if (mode === "login") {
      user = await User.findOne({ email: lowerEmail });

      if (user) {
        // Link the OAuth provider to existing account (login mode)
        user.provider = provider;
        user.providerId = providerId;
        if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl;
        await user.save();
      } else {
        // Create new OAuth user
        user = await User.create({
          name,
          email: lowerEmail,
          passwordHash: undefined,
          provider,
          providerId,
          avatarUrl,
        });

        // Give every new user the same starting set of (disconnected) sources and automations
        await seedNewUserDefaults(user.id);
      }
    } else {
      // Signup mode: email doesn't exist, create new user
      user = await User.create({
        name,
        email: lowerEmail,
        passwordHash: undefined,
        provider,
        providerId,
        avatarUrl,
      });

      // Give every new user the same starting set of (disconnected) sources and automations
      await seedNewUserDefaults(user.id);
    }
  }

  const token = signToken(user.id);
  return { user: toPublicUser(user), token };
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  // Deliberately does not reveal whether the account exists.
  return { message: `If an account exists for ${email}, a reset link is on its way.` };
}

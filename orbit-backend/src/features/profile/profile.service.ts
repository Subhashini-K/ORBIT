import { User } from "../../models/User.js";
import { Source } from "../../models/Source.js";
import { Automation } from "../../models/Automation.js";
import { Activity } from "../../models/Activity.js";
import { Memory } from "../../models/Memory.js";
import { OAuthToken } from "../../models/OAuthToken.js";
import { OAuthState } from "../../models/OAuthState.js";
import { ApiError } from "../../utils/ApiError.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import type { PublicUser, UpdateProfileBody, ChangePasswordBody } from "../../types/index.js";

export async function getProfile(userId: string): Promise<PublicUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl ?? undefined,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function updateProfile(userId: string, data: UpdateProfileBody): Promise<PublicUser> {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  // Check email uniqueness if changing email
  if (data.email && data.email !== user.email) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw ApiError.conflict("Email already in use.");
    }
    user.email = data.email;
  }

  if (data.name) {
    user.name = data.name;
  }

  await user.save();

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl ?? undefined,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function changePassword(userId: string, data: ChangePasswordBody): Promise<void> {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  if (!user.passwordHash) {
    throw ApiError.badRequest("This account doesn't have a password set. Cannot change password for OAuth accounts.");
  }

  const isValid = await comparePassword(data.currentPassword, user.passwordHash);
  if (!isValid) {
    throw ApiError.unauthorized("Current password is incorrect.");
  }

  user.passwordHash = await hashPassword(data.newPassword);
  await user.save();
}

export async function deleteAccount(userId: string): Promise<void> {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found.");
  }

  // Cascade delete all user data
  await Promise.all([
    Source.deleteMany({ userId }),
    Automation.deleteMany({ userId }),
    Activity.deleteMany({ userId }),
    Memory.deleteMany({ userId }),
    OAuthToken.deleteMany({ userId }),
    OAuthState.deleteMany({ userId }),
    User.deleteOne({ _id: userId }),
  ]);
}

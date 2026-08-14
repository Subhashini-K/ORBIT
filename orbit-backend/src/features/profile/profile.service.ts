import { User } from "../../models/User.js";
import { ApiError } from "../../utils/ApiError.js";
import type { PublicUser } from "../../types/index.js";

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

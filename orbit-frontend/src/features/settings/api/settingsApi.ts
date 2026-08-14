import { apiFetch } from "@/lib/apiClient";
import type { PublicUser, UpdateProfileBody, ChangePasswordBody } from "@/types";

/** Real implementation of Settings-related API calls. */

export async function updateProfile(data: UpdateProfileBody): Promise<PublicUser> {
  return apiFetch<PublicUser>("/profile", {
    method: "PATCH",
    body: data,
  });
}

export async function changePassword(data: ChangePasswordBody): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/profile/change-password", {
    method: "POST",
    body: data,
  });
}

export async function deleteAccount(): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/profile", {
    method: "DELETE",
  });
}
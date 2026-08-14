import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, changePassword, deleteAccount } from "../api/settingsApi";
import { useAuth } from "@/features/auth/store/AuthContext";
import { useNavigate } from "react-router-dom";
import type { PublicUser, UpdateProfileBody, ChangePasswordBody } from "@/types";

export function useUpdateProfile() {
  const { setSession, user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileBody) => updateProfile(data),
    onSuccess: (updatedUser: PublicUser) => {
      if (user) {
        setSession({ user: updatedUser, token: user.id });
      }
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordBody) => changePassword(data),
  });
}

export function useDeleteAccount() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAccount(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });
}
import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "../api/authApi";
import { useAuth } from "../store/AuthContext";
import type { LoginPayload } from "../types";

export function useLogin() {
  const { setSession } = useAuth();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginRequest(payload),
    onSuccess: (data) => setSession(data),
  });
}

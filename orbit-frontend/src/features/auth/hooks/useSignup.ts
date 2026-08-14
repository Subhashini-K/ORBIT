import { useMutation } from "@tanstack/react-query";
import { signupRequest } from "../api/authApi";
import { useAuth } from "../store/AuthContext";
import type { SignupPayload } from "../types";

export function useSignup() {
  const { setSession } = useAuth();

  return useMutation({
    mutationFn: (payload: SignupPayload) => signupRequest(payload),
    onSuccess: (data) => setSession(data),
  });
}

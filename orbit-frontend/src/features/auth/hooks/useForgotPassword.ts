import { useMutation } from "@tanstack/react-query";
import { forgotPasswordRequest } from "../api/authApi";
import type { ForgotPasswordPayload } from "../types";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPasswordRequest(payload),
  });
}

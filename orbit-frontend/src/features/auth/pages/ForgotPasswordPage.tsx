import { AuthShell } from "../components/AuthShell";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      subtitle="Enter the email tied to your account and we'll send you a reset link."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}

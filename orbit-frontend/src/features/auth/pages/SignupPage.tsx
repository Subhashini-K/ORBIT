import { AuthShell } from "../components/AuthShell";
import { SignupForm } from "../components/SignupForm";

export default function SignupPage() {
  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account"
      subtitle="Connect your apps and let Orbit start understanding your world."
    >
      <SignupForm />
    </AuthShell>
  );
}

import { AuthShell } from "../components/AuthShell";
import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to Orbit"
      subtitle="Pick up right where you left off — your universe is waiting."
    >
      <LoginForm />
    </AuthShell>
  );
}

import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";
import { PasswordInput } from "./PasswordInput";
import { PasswordStrengthMeter } from "./PasswordStrengthMeter";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { useSignup } from "../hooks";
import type { AuthFieldErrors } from "../types";
import { ApiError } from "@/lib/apiClient";

export function SignupForm() {
  const navigate = useNavigate();
  const signup = useSignup();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<AuthFieldErrors>({});

  function validate(): boolean {
    const next: AuthFieldErrors = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (!email.trim()) next.email = "Email is required.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    if (!agreedToTerms) next.agreedToTerms = "You must accept the Terms to continue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    signup.mutate(
      { name, email, password, agreedToTerms },
      {
        onSuccess: () => navigate("/dashboard", { replace: true }),
        onError: (err) => {
          const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
          
          // If it's a 409 conflict about email already existing, show error on email field
          if (err instanceof ApiError && err.status === 409) {
            setErrors({ email: message });
          } else {
            setErrors({ form: message });
          }
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errors.form && <Alert>{errors.form}</Alert>}

      <div className="space-y-2">
        <Label htmlFor="name">Full name</Label>
        <div className="relative">
          <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            id="name"
            placeholder="Subhashini Kumar"
            autoComplete="name"
            className="pl-10"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
          />
        </div>
        {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
          />
        </div>
        {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          placeholder="Create a password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
        />
        <PasswordStrengthMeter password={password} />
        {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
      </div>

      <div className="flex items-start gap-2.5">
        <Checkbox
          id="terms"
          className="mt-0.5"
          checked={agreedToTerms}
          onCheckedChange={(v) => setAgreedToTerms(v === true)}
        />
        <Label htmlFor="terms" className="cursor-pointer font-normal leading-snug text-slate-400">
          I agree to Orbit's Terms of Service and Privacy Policy
        </Label>
      </div>
      {errors.agreedToTerms && <p className="-mt-3 text-xs text-red-400">{errors.agreedToTerms}</p>}

      <Button type="submit" className="w-full" loading={signup.isPending}>
        Create account
        <ArrowRight className="h-4 w-4" />
      </Button>

      <div className="relative py-1 text-center">
        <span className="relative bg-transparent px-3 text-xs uppercase tracking-wider text-slate-500">
          <span className="absolute left-1/2 top-1/2 -z-10 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-white/10" />
          or continue with
        </span>
      </div>

      <SocialAuthButtons mode="signup" />

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-orbit-cyan hover:text-orbit-cyan/80">
          Sign in
        </Link>
      </p>
    </form>
  );
}

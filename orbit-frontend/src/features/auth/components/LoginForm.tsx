import { useState, type FormEvent, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";
import { PasswordInput } from "./PasswordInput";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { useLogin } from "../hooks";
import type { AuthFieldErrors } from "../types";
import { ApiError } from "@/lib/apiClient";

export function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<AuthFieldErrors>({});

  // Check for error from OAuth callback redirect
  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      // If it's a 409 conflict about email already existing, show error on email field
      if (error.includes("already exists")) {
        setErrors({ email: error });
      } else {
        setErrors({ form: error });
      }
      // Clear the error from URL
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  function validate(): boolean {
    const next: AuthFieldErrors = {};
    if (!email.trim()) next.email = "Email is required.";
    if (!password) next.password = "Password is required.";
    setErrors((prev) => ({ ...prev, ...next }));
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    login.mutate(
      { email, password, remember },
      {
        onSuccess: () => navigate("/dashboard", { replace: true }),
        onError: (err) => {
          const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
          setErrors({ form: message });
        },
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {errors.form && <Alert>{errors.form}</Alert>}

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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link to="/forgot-password" className="text-xs font-medium text-orbit-cyan hover:text-orbit-cyan/80">
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
        />
        {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
      </div>

      <div className="flex items-center gap-2.5">
        <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
        <Label htmlFor="remember" className="cursor-pointer font-normal text-slate-400">
          Keep me signed in for 30 days
        </Label>
      </div>

      <Button type="submit" className="w-full" loading={login.isPending}>
        Sign in
        <ArrowRight className="h-4 w-4" />
      </Button>

      <div className="relative py-1 text-center">
        <span className="relative bg-transparent px-3 text-xs uppercase tracking-wider text-slate-500">
          <span className="absolute left-1/2 top-1/2 -z-10 h-px w-full -translate-x-1/2 -translate-y-1/2 bg-white/10" />
          or continue with
        </span>
      </div>

      <SocialAuthButtons mode="login" />

      <p className="text-center text-sm text-slate-400">
        New to Orbit?{" "}
        <Link to="/signup" className="font-medium text-orbit-cyan hover:text-orbit-cyan/80">
          Create an account
        </Link>
      </p>
    </form>
  );
}

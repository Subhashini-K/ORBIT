import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { useForgotPassword } from "../hooks";
import { ApiError } from "@/lib/apiClient";

export function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    forgotPassword.mutate(
      { email },
      {
        onError: (err) => {
          setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
        },
      }
    );
  }

  return (
    <AnimatePresence mode="wait">
      {forgotPassword.isSuccess ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-orbit shadow-glow-blue">
            <MailCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">Check your inbox</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{forgotPassword.data?.message}</p>
          </div>
          <Button asChild variant="secondary" className="w-full">
            <Link to="/login">
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5"
        >
          {error && <Alert>{error}</Alert>}

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
                aria-invalid={!!error}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" loading={forgotPassword.isPending}>
            Send reset link
          </Button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";
import { OrbitLogo } from "@/components/common/OrbitLogo";
import { StarfieldBackground } from "@/components/common/StarfieldBackground";

interface AuthShellProps {
  children: ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
}

const highlights = [
  { icon: Sparkles, text: "One workspace for every app you already use" },
  { icon: ShieldCheck, text: "Your data stays yours — encrypted, always" },
  { icon: Zap, text: "Answers that connect the dots across sources" },
];

/**
 * Shared split-screen layout for Login / Signup / Forgot Password.
 * Left: branding + orbiting visual. Right: the form itself (passed as children).
 */
export function AuthShell({ children, eyebrow, title, subtitle }: AuthShellProps) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-background">
      <StarfieldBackground density={90} />

      {/* Left branding panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-white/[0.06] p-12 lg:flex">
        <OrbitLogo />

        <div className="relative flex flex-1 items-center justify-center">
          <OrbitVisual />
        </div>

        <div className="relative space-y-4">
          <p className="max-w-sm font-display text-2xl font-semibold leading-snug text-white">
            All your data. Unified. Intelligence that understands you.
          </p>
          <ul className="space-y-2.5">
            {highlights.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 text-sm text-slate-400">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06]">
                  <Icon className="h-3.5 w-3.5 text-orbit-cyan" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form panel */}
      <div className="relative flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="mb-8 lg:hidden">
          <OrbitLogo />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <div className="mb-8 text-center lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orbit-cyan">
              {eyebrow}
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          </div>

          <div className="glass-strong rounded-2xl p-7 shadow-glass sm:p-8">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}

function OrbitVisual() {
  return (
    <div className="relative flex h-72 w-72 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-gradient-orbit-radial animate-pulse-glow" />
      <div className="absolute inset-8 rounded-full border border-white/10 animate-orbit-spin" />
      <div className="absolute inset-16 rounded-full border border-white/10 animate-orbit-spin-reverse" />
      <div className="absolute inset-24 rounded-full border border-white/[0.08]" />

      <div className="absolute inset-8 animate-orbit-spin">
        <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-orbit-cyan shadow-glow-blue" />
      </div>
      <div className="absolute inset-16 animate-orbit-spin-reverse">
        <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-orbit-violet shadow-glow-purple" />
      </div>

      <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-orbit shadow-glow-purple">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-space-900/70 backdrop-blur-sm">
          <span className="font-display text-sm font-bold tracking-wide text-white">ORBIT AI</span>
        </div>
      </div>
    </div>
  );
}

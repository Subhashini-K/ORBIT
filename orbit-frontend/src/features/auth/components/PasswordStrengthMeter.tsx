import { useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

function scorePassword(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 15;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  return Math.min(score, 100);
}

const LEVELS = [
  { max: 30, label: "Weak", colorClass: "text-destructive" },
  { max: 65, label: "Okay", colorClass: "text-orbit-amber" },
  { max: 100, label: "Strong", colorClass: "text-orbit-emerald" },
];

export function PasswordStrengthMeter({ password }: { password: string }) {
  const score = useMemo(() => scorePassword(password), [password]);
  const level = LEVELS.find((l) => score <= l.max) ?? LEVELS[LEVELS.length - 1];

  if (!password) return null;

  return (
    <div className="mt-2 flex items-center gap-3">
      <Progress value={score} className="flex-1" />
      <span className={cn("w-12 shrink-0 text-right text-[11px] font-medium", level.colorClass)}>
        {level.label}
      </span>
    </div>
  );
}

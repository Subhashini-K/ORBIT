import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  variant?: "destructive" | "success";
  children: ReactNode;
  className?: string;
}

export function Alert({ variant = "destructive", children, className }: AlertProps) {
  const Icon = variant === "destructive" ? AlertTriangle : CheckCircle2;
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm",
        variant === "destructive"
          ? "border-destructive/30 bg-destructive/10 text-red-300"
          : "border-orbit-emerald/30 bg-orbit-emerald/10 text-emerald-300",
        className
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "focus-ring flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors duration-150",
          "hover:border-white/20 focus-visible:border-primary/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

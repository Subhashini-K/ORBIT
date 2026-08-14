import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Moon, Sun, Laptop } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const APPEARANCE_OPTIONS = [
  { id: "dark", label: "Dark", icon: Moon, available: true },
  { id: "light", label: "Light", icon: Sun, available: false },
  { id: "system", label: "System", icon: Laptop, available: false },
] as const;

const ACCENTS = [
  { id: "blue-purple", label: "Blue / Purple", swatch: "bg-gradient-orbit" },
  { id: "cyan-violet", label: "Cyan / Violet", swatch: "bg-gradient-to-br from-orbit-cyan to-orbit-violet" },
  { id: "pink-blue", label: "Pink / Blue", swatch: "bg-gradient-to-br from-orbit-pink to-orbit-blue" },
];

/**
 * Mock only. Orbit ships dark-mode-only in Phase 1 — Light/System are shown
 * as disabled options so the intended surface area is visible without
 * pretending a real theme engine exists yet. Accent selection is cosmetic
 * and does not currently repaint the app.
 */
export function ThemeTab() {
  const [accent, setAccent] = useState("blue-purple");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Orbit is currently dark-mode only — more options are on the way.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 sm:max-w-md">
            {APPEARANCE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={!option.available}
                className={cn(
                  "focus-ring flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors",
                  option.available
                    ? "border-primary/50 bg-gradient-orbit/10 text-white"
                    : "cursor-not-allowed border-white/[0.06] bg-white/[0.02] text-slate-600"
                )}
              >
                <option.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{option.label}</span>
                {!option.available && <span className="text-[10px] text-slate-600">Coming soon</span>}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accent gradient</CardTitle>
          <CardDescription>Pick the gradient used across buttons, glows, and highlights.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 sm:max-w-md">
            {ACCENTS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setAccent(option.id)}
                className="focus-ring group flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-white/15"
              >
                <div className={cn("relative flex h-10 w-10 items-center justify-center rounded-full", option.swatch)}>
                  {accent === option.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white">
                      <Check className="h-4 w-4" />
                    </motion.div>
                  )}
                </div>
                <span className="text-center text-[11px] text-slate-400 group-hover:text-slate-200">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

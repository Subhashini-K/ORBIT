import { cn } from "@/lib/utils";

interface OrbitLogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: number;
}

/** Orbit's ring-and-core mark, reused in the sidebar, auth screens, and favicon concept. */
export function OrbitLogo({ className, showWordmark = true, size = 36 }: OrbitLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rounded-full bg-gradient-orbit opacity-80 blur-[6px]" />
        <svg viewBox="0 0 36 36" className="relative h-full w-full">
          <defs>
            <linearGradient id="orbit-logo-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
          </defs>
          <circle cx="18" cy="18" r="14.5" fill="none" stroke="url(#orbit-logo-gradient)" strokeWidth="3.2" />
          <circle cx="18" cy="18" r="4.5" fill="url(#orbit-logo-gradient)" />
        </svg>
      </div>
      {showWordmark && (
        <div className="leading-none">
          <div className="font-display text-lg font-bold tracking-tight text-white">ORBIT</div>
          <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
            AI Workspace
          </div>
        </div>
      )}
    </div>
  );
}

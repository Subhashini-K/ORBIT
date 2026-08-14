import { useMemo } from "react";

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
  delay: string;
  duration: string;
}

/**
 * Lightweight decorative starfield — pure CSS, no canvas.
 * Kept purely presentational (aria-hidden) so it never interferes with a11y.
 */
export function StarfieldBackground({ density = 70 }: { density?: number }) {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: density }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() < 0.85 ? 1 : Math.random() < 0.97 ? 2 : 3,
        delay: `${Math.random() * 4}s`,
        duration: `${2.5 + Math.random() * 3}s`,
      })),
    [density]
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
            opacity: 0.5,
          }}
        />
      ))}
      {/* Soft nebula glows */}
      <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-orbit-blue/10 blur-[120px]" />
      <div className="absolute -right-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-orbit-purple/10 blur-[120px]" />
      <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-orbit-violet/10 blur-[120px]" />
    </div>
  );
}

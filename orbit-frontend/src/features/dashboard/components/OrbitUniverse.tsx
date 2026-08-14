import { useMemo } from "react";
import type { BrandKey } from "@/components/common/BrandIcon";
import { UniverseNode } from "./UniverseNode";
import { useSources } from "@/features/sources/hooks/useSources";
import type { SourceId } from "@/types";

// Fixed 8-point ring layout, clockwise from the top — mirrors the reference design.
const RING: Array<{ brand: BrandKey; sourceId?: SourceId; label: string; to: string; top: number; left: number }> = [
  { brand: "google-calendar", sourceId: "google-calendar", label: "Calendar", to: "/sources", top: 10, left: 50 },
  { brand: "google-drive", sourceId: "google-drive", label: "Google Drive", to: "/sources", top: 21.7, left: 78.3 },
  { brand: "photos", sourceId: "photos", label: "Photos", to: "/sources", top: 50, left: 90 },
  { brand: "whatsapp", sourceId: "whatsapp", label: "WhatsApp", to: "/sources", top: 78.3, left: 78.3 },
  { brand: "memory", label: "Memory", to: "/memory", top: 90, left: 50 },
  { brand: "notes", sourceId: "notes", label: "Notes", to: "/sources", top: 78.3, left: 21.7 },
  { brand: "spotify", sourceId: "spotify", label: "Spotify", to: "/sources", top: 50, left: 10 },
  { brand: "gmail", sourceId: "gmail", label: "Gmail", to: "/sources", top: 21.7, left: 21.7 },
];

/**
 * "Your Universe" — the dashboard centerpiece. Purely a visual summary of
 * connected sources (mocked); it does not perform any retrieval or fusion.
 */
export function OrbitUniverse() {
  const { data: sources, isLoading } = useSources();

  const metaBySource = useMemo(() => {
    const map = new Map<SourceId, string | undefined>();
    sources?.forEach((s) => map.set(s.id, s.meta));
    return map;
  }, [sources]);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* Decorative background planets */}
      <div aria-hidden className="absolute -left-6 top-8 h-10 w-10 rounded-full bg-gradient-to-br from-rose-400/40 to-orange-300/30 blur-[1px] sm:h-14 sm:w-14" />
      <div aria-hidden className="absolute -right-4 bottom-10 h-8 w-8 rounded-full bg-gradient-to-br from-sky-400/40 to-blue-500/30 blur-[1px]" />
      <div aria-hidden className="absolute right-10 top-2 h-1.5 w-1.5 rounded-full bg-white/70" />

      {/* Orbit rings */}
      <div className="absolute inset-[8%] rounded-full border border-white/[0.07]" />
      <div className="absolute inset-[20%] rounded-full border border-white/[0.06]" />
      <div className="absolute inset-[32%] rounded-full border border-white/[0.05]" />

      {/* Central sphere */}
      <div className="absolute left-1/2 top-1/2 flex h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-orbit-radial">
        <div className="absolute h-[78%] w-[78%] animate-pulse-glow rounded-full bg-gradient-orbit opacity-90 blur-[2px]" />
        <div className="relative flex h-[68%] w-[68%] flex-col items-center justify-center rounded-full bg-space-900/80 text-center backdrop-blur-sm">
          <span className="font-display text-sm font-bold tracking-wide text-white sm:text-lg">ORBIT AI</span>
          <span className="mt-1 px-3 text-[9px] font-medium text-slate-400 sm:text-[11px]">Context Fusion Engine</span>
        </div>
      </div>

      {/* Orbiting nodes */}
      {RING.map((node, i) => (
        <UniverseNode
          key={node.label}
          brand={node.brand}
          label={node.label}
          to={node.to}
          top={node.top}
          left={node.left}
          delay={0.15 + i * 0.06}
          loading={node.sourceId ? isLoading : false}
          meta={node.sourceId ? metaBySource.get(node.sourceId) : "Always learning"}
        />
      ))}
    </div>
  );
}

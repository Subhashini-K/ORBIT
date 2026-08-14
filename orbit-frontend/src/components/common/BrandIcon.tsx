import {
  Mail,
  Calendar,
  HardDrive,
  Github,
  Image as ImageIcon,
  FileText,
  Music2,
  MessageCircle,
  Brain,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { SourceId } from "@/types";

/**
 * Visual identity for each connected source. Deliberately uses Lucide
 * glyphs on brand-colored backgrounds rather than reproducing real
 * trademarked logos — recognizable via color + icon pairing, consistent
 * with the icon language used everywhere else in the app.
 */
export type BrandKey = SourceId | "memory";

interface BrandDefinition {
  icon: LucideIcon;
  bg: string; // tailwind gradient classes
  glow: string; // tailwind shadow class
  label: string;
}

const BRANDS: Record<BrandKey, BrandDefinition> = {
  gmail: { icon: Mail, bg: "from-red-500 to-orange-400", glow: "shadow-[0_0_28px_-6px_rgba(239,68,68,0.65)]", label: "Gmail" },
  "google-calendar": { icon: Calendar, bg: "from-blue-500 to-sky-400", glow: "shadow-glow-blue", label: "Calendar" },
  "google-drive": { icon: HardDrive, bg: "from-emerald-400 via-blue-400 to-yellow-400", glow: "shadow-[0_0_28px_-6px_rgba(59,130,246,0.55)]", label: "Google Drive" },
  github: { icon: Github, bg: "from-slate-500 to-slate-700", glow: "shadow-[0_0_28px_-6px_rgba(100,116,139,0.55)]", label: "GitHub" },
  photos: { icon: ImageIcon, bg: "from-pink-500 via-rose-400 to-amber-400", glow: "shadow-[0_0_28px_-6px_rgba(244,63,94,0.55)]", label: "Photos" },
  notes: { icon: FileText, bg: "from-amber-400 to-yellow-500", glow: "shadow-[0_0_28px_-6px_rgba(245,158,11,0.6)]", label: "Notes" },
  spotify: { icon: Music2, bg: "from-emerald-400 to-green-600", glow: "shadow-[0_0_28px_-6px_rgba(34,197,94,0.6)]", label: "Spotify" },
  whatsapp: { icon: MessageCircle, bg: "from-green-400 to-emerald-600", glow: "shadow-[0_0_28px_-6px_rgba(34,197,94,0.6)]", label: "WhatsApp" },
  memory: { icon: Brain, bg: "from-orbit-purple to-orbit-violet", glow: "shadow-glow-purple", label: "Memory" },
};

export function getBrand(key: BrandKey): BrandDefinition {
  return BRANDS[key];
}

interface BrandIconProps {
  brand: BrandKey;
  size?: number;
  className?: string;
  glow?: boolean;
}

export function BrandIcon({ brand, size = 22, className, glow = false }: BrandIconProps) {
  const def = BRANDS[brand];
  const Icon = def.icon;
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br",
        def.bg,
        glow && def.glow,
        className
      )}
    >
      <Icon className="text-white" style={{ width: size * 0.55, height: size * 0.55 }} strokeWidth={2.25} />
    </div>
  );
}

import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Plug,
  MessageSquare,
  Clock,
  BarChart3,
  Workflow,
  Settings,
  ChevronRight,
} from "lucide-react";
import { OrbitLogo } from "@/components/common/OrbitLogo";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sources", label: "Sources", icon: Plug },
  { to: "/chat", label: "AI Chat", icon: MessageSquare },
  { to: "/memory", label: "Memory", icon: Clock },
  { to: "/insights", label: "Insights", icon: BarChart3 },
  { to: "/automations", label: "Automations", icon: Workflow },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/[0.06] bg-space-950/60 backdrop-blur-xl lg:flex">
      <div className="px-5 py-6">
        <OrbitLogo />
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "focus-ring group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                isActive ? "text-white" : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-gradient-orbit shadow-glow-blue"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <Icon className="relative z-10 h-[18px] w-[18px]" />
                <span className="relative z-10">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-4">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06]">
          <Sparkle />
        </div>
        <p className="font-display text-sm font-semibold text-white">Context Fusion Engine</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          All your data. Unified. Intelligence that understands you.
        </p>
        <button className="focus-ring mt-3 flex items-center gap-1 text-xs font-medium text-orbit-cyan hover:text-orbit-cyan/80">
          Learn more
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </aside>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <path
        d="M12 2 L14 9 L21 11 L14 13 L12 20 L10 13 L3 11 L10 9 Z"
        fill="url(#sidebar-sparkle-gradient)"
      />
      <defs>
        <linearGradient id="sidebar-sparkle-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

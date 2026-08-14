import { NavLink } from "react-router-dom";
import { LayoutDashboard, Plug, MessageSquare, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_ITEMS = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/sources", label: "Sources", icon: Plug },
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/insights", label: "Insights", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
];

/** Bottom tab bar shown only on small screens, mirrors the desktop sidebar. */
export function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-white/[0.06] bg-space-950/90 py-2 backdrop-blur-xl lg:hidden">
      {MOBILE_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "focus-ring flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] font-medium",
              isActive ? "text-orbit-cyan" : "text-slate-500"
            )
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

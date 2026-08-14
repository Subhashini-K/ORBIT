import { useState } from "react";
import { Bell, Search, ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/features/auth/store/AuthContext";
import { useNavigate } from "react-router-dom";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications] = useState(3);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex h-20 shrink-0 items-center justify-between gap-4 border-b border-white/[0.06] bg-space-950/40 px-6 backdrop-blur-xl lg:px-8">
      <div className="min-w-0">
        <h1 className="truncate font-display text-lg font-semibold text-white sm:text-xl">
          Welcome back, {user?.name?.split(" ")[0] ?? "there"} <span className="ml-0.5">👋</span>
        </h1>
        <p className="text-sm text-muted-foreground">Orbit is here to understand, connect and assist you.</p>
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search anything..."
            className="focus-ring h-10 w-64 rounded-xl border border-white/10 bg-white/[0.03] pl-10 pr-14 text-sm text-white placeholder:text-slate-500 transition-colors hover:border-white/20 focus-visible:border-primary/50"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
            ⌘K
          </kbd>
        </div>

        <button
          className="focus-ring relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:bg-white/[0.06]"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          {notifications > 0 && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orbit-pink shadow-glow-purple" />
          )}
        </button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="focus-ring flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-white/[0.05]">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>{user ? initials(user.name) : "OU"}</AvatarFallback>
              </Avatar>
              <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={10}
              className="glass-strong z-50 w-56 rounded-xl p-1.5 shadow-glass"
            >
              <div className="px-2.5 py-2">
                <p className="truncate text-sm font-medium text-white">{user?.name}</p>
                <p className="truncate text-xs text-slate-400">{user?.email}</p>
              </div>
              <DropdownMenu.Separator className="my-1 h-px bg-white/10" />
              <DropdownMenu.Item
                onSelect={() => navigate("/settings")}
                className="focus-ring flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-300 outline-none transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <UserIcon className="h-4 w-4" /> Profile
              </DropdownMenu.Item>
              <DropdownMenu.Item
                onSelect={() => navigate("/settings")}
                className="focus-ring flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-slate-300 outline-none transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <Settings className="h-4 w-4" /> Settings
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="my-1 h-px bg-white/10" />
              <DropdownMenu.Item
                onSelect={handleLogout}
                className="focus-ring flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-400 outline-none transition-colors hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}

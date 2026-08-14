import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";
import { StarfieldBackground } from "@/components/common/StarfieldBackground";

/** Wraps every authenticated route: sidebar + topbar + scrollable content area. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full bg-background">
      <StarfieldBackground density={50} />
      <Sidebar />
      <div className="relative flex min-h-screen flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-6 pb-24 pt-6 lg:px-8 lg:pb-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}

import { User, ShieldCheck, Palette, Plug } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileTab, SecurityTab, ThemeTab, ConnectedAppsTab } from "../components";

const TABS = [
  { value: "profile", label: "Profile", icon: User },
  { value: "security", label: "Security", icon: ShieldCheck },
  { value: "theme", label: "Theme", icon: Palette },
  { value: "connected-apps", label: "Connected Apps", icon: Plug },
];

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold text-white sm:text-2xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile, security, appearance, and connected apps.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="flex-wrap">
          {TABS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value}>
              <span className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
        <TabsContent value="theme">
          <ThemeTab />
        </TabsContent>
        <TabsContent value="connected-apps">
          <ConnectedAppsTab />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

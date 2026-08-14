import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Check, Laptop, Smartphone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PasswordInput, PasswordStrengthMeter } from "@/features/auth";

const MOCK_SESSIONS = [
  { id: "s1", device: "MacBook Pro", location: "Chennai, IN", icon: Laptop, current: true },
  { id: "s2", device: "iPhone 15", location: "Chennai, IN", icon: Smartphone, current: false },
];

/** Mock only — no real password change or session revocation happens here. */
export function SecurityTab() {
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setNewPassword("");
      setTimeout(() => setSaved(false), 2500);
    }, 700);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Choose a strong, unique password for your Orbit account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <PasswordInput
                id="new-password"
                placeholder="Enter a new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <PasswordStrengthMeter password={newPassword} />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" loading={saving} disabled={newPassword.length < 8}>
                Update password
              </Button>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-sm text-emerald-400"
                >
                  <Check className="h-4 w-4" /> Updated
                </motion.span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>Add an extra layer of protection when signing in.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-orbit shadow-glow-purple">
                <ShieldCheck className="h-4.5 w-4.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Authenticator app</p>
                <p className="text-xs text-slate-500">{twoFactor ? "Enabled" : "Not enabled"}</p>
              </div>
            </div>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>Devices currently signed in to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_SESSIONS.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="flex items-center gap-3">
                <session.icon className="h-4.5 w-4.5 text-slate-400" />
                <div>
                  <p className="text-sm text-white">{session.device}</p>
                  <p className="text-xs text-slate-500">{session.location}</p>
                </div>
              </div>
              {session.current ? (
                <span className="rounded-full bg-orbit-emerald/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
                  This device
                </span>
              ) : (
                <Button variant="outline" size="sm">
                  Sign out
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Check, Laptop, Smartphone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PasswordInput, PasswordStrengthMeter } from "@/features/auth";
import { useChangePassword, useDeleteAccount } from "../hooks/useSettings";
import { useAuth } from "@/features/auth/store/AuthContext";
import { useNavigate } from "react-router-dom";

const MOCK_SESSIONS = [
  { id: "s1", device: "MacBook Pro", location: "Chennai, IN", icon: Laptop, current: true },
  { id: "s2", device: "iPhone 15", location: "Chennai, IN", icon: Smartphone, current: false },
];

export function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const changePassword = useChangePassword();
  const deleteAccount = useDeleteAccount();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setSaved(true);
          setCurrentPassword("");
          setNewPassword("");
          setTimeout(() => setSaved(false), 2500);
        },
      }
    );
  }

  function handleDeleteAccount() {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    deleteAccount.mutate(undefined, {
      onSuccess: () => {
        logout();
        navigate("/login", { replace: true });
      },
    });
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
              <Label htmlFor="current-password">Current password</Label>
              <PasswordInput
                id="current-password"
                placeholder="Enter your current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
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
              <Button type="submit" loading={changePassword.isPending} disabled={newPassword.length < 8 || currentPassword.length === 0}>
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
              {changePassword.isError && (
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 text-sm text-red-400"
                >
                  Failed to update. Try again.
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

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger zone</CardTitle>
          <CardDescription>Irreversible actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Delete account</p>
              <p className="text-xs text-slate-500">Permanently delete your account and all data.</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleDeleteAccount} loading={deleteAccount.isPending}>
              Delete account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

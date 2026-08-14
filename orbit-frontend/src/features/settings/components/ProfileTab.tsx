import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Camera, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/features/auth/store/AuthContext";
import { useUpdateProfile } from "../hooks/useSettings";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function ProfileTab() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saved, setSaved] = useState(false);
  
  const updateProfile = useUpdateProfile();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    
    updateProfile.mutate(
      { name: name.trim() || user.name, email: email.trim() || user.email },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        },
      }
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>This is how you appear across Orbit.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback className="text-lg">{user ? initials(user.name) : "OU"}</AvatarFallback>
              </Avatar>
              <button
                type="button"
                aria-label="Change avatar"
                className="focus-ring absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-orbit text-white shadow-glow-blue transition-transform hover:scale-105"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">
                Member since {user ? new Date(user.createdAt).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Full name</Label>
              <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profile-email">Email address</Label>
              <Input id="profile-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" loading={updateProfile.isPending}>
              Save changes
            </Button>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 text-sm text-emerald-400"
              >
                <Check className="h-4 w-4" /> Saved
              </motion.span>
            )}
            {updateProfile.isError && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-1.5 text-sm text-red-400"
              >
                Failed to save. Try again.
              </motion.span>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

import { useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, XCircle } from "lucide-react";
import { StarfieldBackground } from "@/components/common/StarfieldBackground";
import { Button } from "@/components/ui/button";

const SOURCE_LABELS: Record<string, string> = {
  gmail: "Gmail",
  "google-calendar": "Google Calendar",
  "google-drive": "Google Drive",
  github: "GitHub",
};

/**
 * The backend redirects the browser here (not to the API) once an OAuth
 * connector flow finishes, with `?connector=gmail&status=success` or
 * `?connector=gmail&status=error&message=...`. This page just reconciles
 * local state with what actually happened server-side, then sends the
 * user back to Sources — it never mutates anything itself.
 */
export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const connector = searchParams.get("connector") ?? "";
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const isSuccess = status === "success";
  const label = SOURCE_LABELS[connector] ?? connector;

  useEffect(() => {
    // A real connection changed Source status/meta and may have created new
    // Activity/Memory rows — refetch everything that could be affected
    // rather than trying to patch the cache by hand.
    queryClient.invalidateQueries({ queryKey: ["sources"] });
    queryClient.invalidateQueries({ queryKey: ["activities"] });
    queryClient.invalidateQueries({ queryKey: ["memories"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
    queryClient.invalidateQueries({ queryKey: ["insights"] });
  }, [queryClient]);

  useEffect(() => {
    const timer = setTimeout(() => navigate("/sources", { replace: true }), 2200);
    return () => clearTimeout(timer);
  }, [navigate]);

  const copy = useMemo(() => {
    if (isSuccess) {
      return { title: `${label} connected`, subtitle: "Orbit will start syncing shortly." };
    }
    return { title: `Couldn't connect ${label}`, subtitle: message ?? "Something went wrong. You can try again from Sources." };
  }, [isSuccess, label, message]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-6">
      <StarfieldBackground density={60} />

      <div className="glass-strong relative w-full max-w-sm rounded-2xl p-8 text-center shadow-glass">
        <div
          className={
            isSuccess
              ? "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orbit-emerald/15"
              : "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/15"
          }
        >
          {isSuccess ? (
            <CheckCircle2 className="h-7 w-7 text-emerald-300" />
          ) : (
            <XCircle className="h-7 w-7 text-red-300" />
          )}
        </div>

        <h1 className="mt-5 font-display text-lg font-semibold text-white">{copy.title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{copy.subtitle}</p>

        <Button variant="secondary" className="mt-6 w-full" onClick={() => navigate("/sources", { replace: true })}>
          Back to Sources
        </Button>
      </div>
    </div>
  );
}

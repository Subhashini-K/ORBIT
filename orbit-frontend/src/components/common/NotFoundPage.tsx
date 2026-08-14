import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarfieldBackground } from "./StarfieldBackground";

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <StarfieldBackground density={60} />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-orbit shadow-glow-blue">
        <Compass className="h-7 w-7 text-white" />
      </div>
      <h1 className="relative mt-6 font-display text-2xl font-bold text-white">Lost in orbit</h1>
      <p className="relative mt-2 max-w-sm text-sm text-muted-foreground">
        The page you're looking for has drifted out of range.
      </p>
      <Button asChild className="relative mt-6">
        <Link to="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  );
}

import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { useOAuthCallback } from "../hooks";

export function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setSession } = useAuth();
  const callback = useOAuthCallback();

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      // Redirect to login with error
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (!token || !userStr) {
      navigate("/login?error=Invalid OAuth callback.", { replace: true });
      return;
    }

    // Complete the OAuth callback - this will store the session
    callback.mutate(
      { token, user: userStr },
      {
        onSuccess: (auth) => {
          setSession(auth);
          navigate("/dashboard", { replace: true });
        },
        onError: (err) => {
          navigate(`/login?error=${encodeURIComponent(err.message)}`, { replace: true });
        },
      }
    );
  }, [searchParams, callback, navigate, setSession]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-orbit-cyan" />
        <p className="mt-4 text-slate-400">Completing sign-in...</p>
      </div>
    </div>
  );
}
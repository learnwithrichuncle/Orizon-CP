import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  ReactNode,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, type AuthStatus } from "../../api";
import { BrandMark } from "../ui/brand-mark";
import { AuthStatusContext } from "./auth-context";

function AuthLoading() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg text-fg">
      <div
        role="status"
        aria-label="Loading"
        className="flex items-center gap-3"
      >
        <span className="sr-only">Loading</span>
        <div className="grid h-10 w-10 place-items-center border border-accent text-accent animate-pulse">
          <BrandMark className="h-5 w-5" />
        </div>
      </div>
    </main>
  );
}

export function AuthGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStatus = useCallback(async () => {
    try {
      const nextStatus = await api.authStatus();
      startTransition(() => {
        setStatus(nextStatus);
        setLoading(false);
      });
    } catch {
      startTransition(() => {
        // Fallback unauthenticated status
        setStatus({
          setupComplete: false,
          authenticated: false,
          user: null,
          secretKeyConfigured: false,
          envPath: ""
        });
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    void loadStatus();
    window.addEventListener("orizoncp-auth-changed", loadStatus);
    return () =>
      window.removeEventListener("orizoncp-auth-changed", loadStatus);
  }, [loadStatus]);

  const redirectTo = useMemo(() => {
    if (!status) return "";
    const pathname = location.pathname;
    if (!status.setupComplete && pathname !== "/onboarding")
      return "/onboarding";
    if (status.setupComplete && !status.authenticated && pathname !== "/login")
      return "/login";
    if (status.setupComplete && status.authenticated && pathname === "/login")
      return "/";
    return "";
  }, [location.pathname, status]);

  useEffect(() => {
    if (!redirectTo) return;
    if (redirectTo === "/onboarding") {
      void navigate({ to: "/onboarding" });
    } else if (redirectTo === "/login") {
      void navigate({ to: "/login" });
    } else {
      void navigate({ to: "/" });
    }
  }, [navigate, redirectTo]);

  if (loading || redirectTo) return <AuthLoading />;

  return (
    <AuthStatusContext.Provider value={status}>
      {children}
    </AuthStatusContext.Provider>
  );
}

import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AuthGate } from "../auth/auth-gate";

export function RootShell() {
  return (
    <div className="min-h-screen bg-bg text-fg font-sans">
      <AuthGate>
        <Outlet />
      </AuthGate>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}

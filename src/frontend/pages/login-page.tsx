import { LoginForm } from "../components/auth/login-form";
import { usePageTitle } from "../lib/page-title";

export function LoginPage() {
  usePageTitle("Login");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-bg px-6 py-12 text-fg">
      <div className="w-full max-w-sm">
        <LoginForm />
        <div className="mt-6 text-center">
          <p className="font-mono text-[11px] text-fg/40">
            Orizon CP • Secure Control Plane
          </p>
        </div>
      </div>
    </main>
  );
}

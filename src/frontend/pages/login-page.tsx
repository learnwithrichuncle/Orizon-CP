import { BrandMark } from "../components/ui/brand-mark";
import { LoginForm } from "../components/auth/login-form";
import { usePageTitle } from "../lib/page-title";

export function LoginPage() {
  usePageTitle("Login");

  return (
    <main className="flex flex-col items-center flex-1 shrink-0 px-5 pt-16 pb-8 min-h-dvh bg-black text-white">
      <div className="flex-1 flex flex-col justify-center w-[330px] sm:w-[384px]">
        <LoginForm />
        <div className="text-center text-balance mt-8">
          <p className="text-xs text-zinc-500 sm:mx-auto sm:max-w-sm">
            By continuing, you agree to Orizon CP's{" "}
            <a className="underline transition underline-offset-2 hover:text-white" href="#" target="_blank" rel="noreferrer noopener">Terms of Service</a>
            {" "}and{" "}
            <a className="underline transition underline-offset-2 hover:text-white" href="#" target="_blank" rel="noreferrer noopener">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </main>
  );
}

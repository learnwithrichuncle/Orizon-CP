import {
  ArrowRight02Icon,
  Login02Icon,
  ShieldUserIcon,
} from "@hugeicons/core-free-icons";
import { type FormEvent, useState } from "react";
import { api } from "../../api";
import { AppIcon } from "../ui/primitives";

function LoginField({
  label,
  type,
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  label: string;
  type: "email" | "password";
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder: string;
}) {
  return (
    <div className="relative text-base md:text-sm flex flex-col gap-2">
      <div className="transition-all duration-500 ease-in-out flex flex-row gap-2 justify-between">
        <label className="text-sm transition-colors text-white flex gap-2 items-center wrap-break-word leading-normal">
          <span>{label}</span>
        </label>
      </div>
      <div className="transition-all duration-500 ease-in-out order-1 col-span-12">
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          className="flex w-full rounded-md border border-zinc-700 bg-zinc-900 placeholder:text-zinc-500 text-white focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors duration-200 text-base md:text-sm leading-4 px-3 py-2 h-[34px]"
        />
      </div>
    </div>
  );
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.login({ email, password });
      window.dispatchEvent(new Event("orizoncp-auth-changed"));
      window.location.assign("/");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not sign in");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-4"
      aria-label="Sign in to OrizonCP"
    >
      <div className="mb-10">
        <h1 className="mt-8 mb-2 lg:text-3xl text-2xl font-hero tracking-tight text-white">
          Welcome back
        </h1>
        <h2 className="text-sm text-zinc-400">Sign in to your account</h2>
      </div>

      <div className="grid gap-y-4">
        <LoginField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          placeholder="you@example.com"
        />
        <div className="relative">
          <LoginField
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-2 border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200"
        >
          {error}
        </div>
      ) : null}

      <div className="flex items-center relative mt-2">
        <div className="w-full">
          <button
            type="submit"
            disabled={submitting}
            className="relative cursor-pointer space-x-2 text-center font-medium ease-[cubic-bezier(0.22,1,0.36,1)] duration-200 transition-[background-color,border-color,color,scale] border-0 bg-white text-black hover:bg-zinc-200 w-full flex items-center justify-center text-sm px-4 py-2 h-[42px] rounded-md disabled:opacity-60 disabled:cursor-wait"
          >
            <span className="truncate">{submitting ? "Signing in…" : "Sign in"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}

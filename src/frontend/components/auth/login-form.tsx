import { type FormEvent, useState } from "react";
import { api } from "../../api";
import { BrandMark } from "../ui/brand-mark";
import { FieldLabel, FormInput, btn } from "../ui/primitives";

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
      className="flex flex-col gap-5 border border-fg/10 bg-fg/[0.03] p-8"
      aria-label="Sign in to OrizonCP"
    >
      <div className="flex items-center gap-3 border-b border-fg/10 pb-5">
        <div className="grid h-10 w-10 place-items-center border border-accent text-accent">
          <BrandMark className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-fg">
            OrizonCP
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-wider text-fg/40">
            Sign in to continue
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <FieldLabel>Email</FieldLabel>
          <FormInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="admin@example.com"
            required
            autoFocus
          />
        </div>
        <div>
          <FieldLabel>Password</FieldLabel>
          <FormInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="border-l-2 border-fg bg-fg/5 px-3 py-2 text-xs font-mono text-fg"
        >
          ✕ {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className={`w-full ${btn("primary")}`}
      >
        {submitting ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

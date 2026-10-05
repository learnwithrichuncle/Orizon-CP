import { CopyCheckIcon, CopyIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { AppIcon } from "../ui/primitives";

export function ApiKeySecretReveal({ token, onDismiss }: { token: string; onDismiss: () => void }) {
  const [copied, setCopied] = useState(false);

  async function copyToken() {
    if (!navigator.clipboard?.writeText) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section>
      <div className="border-l-2 border-accent/30 bg-accent/10 px-4 py-3 text-sm leading-6 text-accent">
        This key is shown only once. Copy it and store it somewhere secure.
      </div>

      <div className="mt-5 flex min-w-0 items-stretch border border-fg/15 bg-fg/[0.03]">
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap px-3 py-3 font-mono text-xs text-fg/80">
          {token}
        </code>
        <button
          type="button"
          className="grid w-11 shrink-0 place-items-center border-l border-fg/15 text-fg/60 transition hover:bg-fg/5 hover:text-fg"
          onClick={() => void copyToken()}
          title={copied ? "Copied" : "Copy"}
          aria-label={copied ? "Copied API key" : "Copy API key"}
        >
          <AppIcon icon={copied ? CopyCheckIcon : CopyIcon} size={14} />
        </button>
      </div>

      <button
        type="button"
        className="mt-5 inline-flex min-h-10 w-fit items-center justify-center bg-fg px-4 text-sm text-bg transition hover:bg-fg/5"
        onClick={onDismiss}
      >
        Done
      </button>
    </section>
  );
}

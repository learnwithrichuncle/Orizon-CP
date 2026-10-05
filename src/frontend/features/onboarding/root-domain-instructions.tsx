import { CopyCheckIcon, CopyIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { AppIcon } from "../../components/ui/primitives";
import { normalizeRootDomain, wildcardRootDomain } from "../../lib/root-domain";

export function RootDomainInstructions({ rootDomain, publicIp }: { rootDomain: string; publicIp: string }) {
  const [copied, setCopied] = useState(false);
  const normalizedDomain = normalizeRootDomain(rootDomain);
  const wildcardHostname = wildcardRootDomain(rootDomain) || "*.orzn.net";

  async function copyIp() {
    try {
      await navigator.clipboard.writeText(publicIp);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-5 border border-fg/15 bg-fg/5/50">
      <div className="border-b border-fg/15 px-4 py-3">
        <h3 className="font-hero text-sm tracking-tight text-fg/80">DNS setup instructions</h3>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-fg/80">
          Add one wildcard A record wherever this domain is managed.
        </p>
      </div>

      <div className="grid border-b border-fg/15 font-mono text-[11px] sm:grid-cols-[110px_minmax(0,1fr)]">
        <div className="border-b border-fg/15 px-4 py-3 uppercase tracking-[0.18em] text-fg/80 sm:border-b-0 sm:border-r">Type</div>
        <div className="px-4 py-3 font-semibold text-fg/80">A</div>
      </div>
      <div className="grid border-b border-fg/15 font-mono text-[11px] sm:grid-cols-[110px_minmax(0,1fr)]">
        <div className="border-b border-fg/15 px-4 py-3 uppercase tracking-[0.18em] text-fg/80 sm:border-b-0 sm:border-r">Host</div>
        <div className="px-4 py-3">
          <div className="font-semibold text-fg">{wildcardHostname}</div>
          <div className="mt-1 text-[10px] text-fg/80">This matches generated service URLs like api.{normalizedDomain || "orzn.net"}.</div>
        </div>
      </div>
      <div className="grid font-mono text-[11px] sm:grid-cols-[110px_minmax(0,1fr)]">
        <div className="border-b border-fg/15 px-4 py-3 uppercase tracking-[0.18em] text-fg/80 sm:border-b-0 sm:border-r">Value</div>
        <div className="flex min-w-0 items-center gap-2 px-4 py-3">
          <span className="truncate font-semibold text-fg/80">{publicIp || "Your server IP"}</span>
          {publicIp ? (
            <button type="button" onClick={() => void copyIp()} className="shrink-0 p-0.5 text-fg/80 transition hover:text-fg/80" title={copied ? "Copied" : "Copy IP"}>
              <AppIcon icon={copied ? CopyCheckIcon : CopyIcon} size={13} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

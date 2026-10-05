import {
  Alert02Icon,
  ArrowDown01Icon,
  CheckmarkBadge01Icon,
  CopyCheckIcon,
  CopyIcon,
  Delete02Icon,
  Globe02Icon,
  PencilEdit02Icon,
  Refresh03Icon
} from "@hugeicons/core-free-icons";
import type { DnsProviderId, DnsProviderStatus, Domain } from "../../api";
import { AppIcon, FormInput, StatusPill, btn } from "../../components/ui/primitives";
import { DomainDnsProviderActions } from "./domain-dns-provider-actions";

type DnsActionNotice = {
  domainId: string;
  tone: "success" | "error";
  text: string;
};

type ServiceDomainRowProps = {
  domain: Domain;
  publicIp?: string;
  expanded: boolean;
  copied: boolean;
  editing: boolean;
  editingHostname: string;
  busy: boolean;
  refreshingDns: boolean;
  owner: boolean;
  providers: DnsProviderStatus[];
  busyProviderId: DnsProviderId | null;
  notice: DnsActionNotice | null;
  onToggle: () => void;
  onCopyIp: (targetIp: string) => void;
  onStartEdit: () => void;
  onEditingHostnameChange: (hostname: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: () => void;
  onRemove: () => void;
  onRefreshDns: () => void;
  onApplyDns: (providerId: DnsProviderId) => void;
};

export function ServiceDomainRow({
  domain,
  publicIp,
  expanded,
  copied,
  editing,
  editingHostname,
  busy,
  refreshingDns,
  owner,
  providers,
  busyProviderId,
  notice,
  onToggle,
  onCopyIp,
  onStartEdit,
  onEditingHostnameChange,
  onCancelEdit,
  onSaveEdit,
  onRemove,
  onRefreshDns,
  onApplyDns
}: ServiceDomainRowProps) {
  const parts = domain.hostname.split(".");
  const hostName = parts.length > 2 ? parts.slice(0, -2).join(".") : "@";
  const targetIp = publicIp ?? "127.0.0.1";
  const local = domain.hostname.endsWith(".localhost") || domain.hostname === "localhost" || domain.hostname === "127.0.0.1";
  const active = domain.status === "active";

  return (
    <article className="border-b border-fg/10 last:border-b-0">
      <div className="flex min-h-16 items-center justify-between gap-4 px-5 py-3">
        {editing ? (
          <form
            className="flex min-w-0 flex-1 flex-wrap items-end gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              onSaveEdit();
            }}
          >
            <label className="min-w-56 flex-1">
              <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-wider text-fg/40">Hostname</span>
              <FormInput
                value={editingHostname}
                onChange={(event) => onEditingHostnameChange(event.target.value)}
                placeholder="app.example.com"
                required
                className="!h-9 font-mono text-xs"
              />
            </label>
            <button
              type="button"
              className={btn("ghost")}
              onClick={onCancelEdit}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={btn("primary")}
              disabled={busy}
            >
              Save
            </button>
          </form>
        ) : (
          <>
            <div className="min-w-0">
              <a
                href={local ? `http://${domain.hostname}` : `https://${domain.hostname}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit max-w-full items-center gap-2 font-mono text-xs text-fg transition hover:text-accent"
              >
                <AppIcon icon={Globe02Icon} size={14} className="shrink-0 text-fg/40" />
                <span className="truncate">{domain.hostname}</span>
              </a>
              <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-fg/40">
                {local ? "Local domain" : "Custom domain"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <StatusPill status={domain.status} />
              <button
                type="button"
                className="grid h-8 w-8 place-items-center border border-fg/20 bg-bg text-fg/60 transition hover:border-fg/40 hover:bg-fg/5 hover:text-fg"
                onClick={onStartEdit}
                title="Edit domain"
                aria-label="Edit domain"
              >
                <AppIcon icon={PencilEdit02Icon} size={13} />
              </button>
              <button
                type="button"
                className="grid h-8 w-8 place-items-center border border-fg/20 bg-bg text-fg/60 transition hover:border-fg hover:bg-fg/5 hover:text-fg"
                onClick={onRemove}
                title="Remove domain"
                aria-label="Remove domain"
              >
                <AppIcon icon={Delete02Icon} size={13} />
              </button>
              {!local ? (
                <button
                  type="button"
                  className="grid h-8 w-8 place-items-center border border-fg/20 bg-bg text-fg/60 transition hover:border-fg/40 hover:bg-fg/5 hover:text-fg"
                  onClick={onToggle}
                  title={expanded ? "Hide DNS details" : "Show DNS details"}
                  aria-label={expanded ? "Hide DNS details" : "Show DNS details"}
                >
                  <AppIcon icon={ArrowDown01Icon} size={13} className={`transition ${expanded ? "rotate-180" : ""}`} />
                </button>
              ) : null}
            </div>
          </>
        )}
      </div>

      {expanded && !local ? (
        <div className="border-t border-fg/10 bg-fg/[0.02] p-5">
          <div className={`flex items-center gap-2 font-mono text-xs ${active ? "text-accent" : "text-fg/60"}`}>
            <AppIcon icon={active ? CheckmarkBadge01Icon : Alert02Icon} size={14} className={active ? "" : "animate-pulse"} />
            {active ? "DNS configured" : "Waiting for DNS"}
          </div>

          <div className="mt-4 overflow-x-auto border border-fg/10">
            <div className="min-w-[560px]">
              <div className="grid grid-cols-[70px_160px_minmax(180px,1fr)_90px] border-b border-fg/10 bg-fg/[0.02] px-3 py-2 font-mono text-[9px] uppercase tracking-wider text-fg/40">
                <span>Type</span>
                <span>Host</span>
                <span>Points to</span>
                <span className="text-right">Status</span>
              </div>
              <div className="grid grid-cols-[70px_160px_minmax(180px,1fr)_90px] items-center px-3 py-3 font-mono text-xs text-fg">
                <span>A</span>
                <span className="truncate">{hostName}</span>
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate select-all">{targetIp}</span>
                  <button
                    type="button"
                    onClick={() => onCopyIp(targetIp)}
                    className={`shrink-0 transition ${copied ? "text-accent" : "text-fg/40 hover:text-fg"}`}
                    title={copied ? "Copied" : "Copy IP address"}
                    aria-label={copied ? "Copied IP address" : "Copy IP address"}
                  >
                    <AppIcon icon={copied ? CopyCheckIcon : CopyIcon} size={13} />
                  </button>
                </span>
                <span className={`text-right font-mono text-[10px] uppercase tracking-wider ${active ? "text-accent" : "text-fg/40"}`}>
                  {active ? "Active" : "Pending"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              {owner ? (
                <DomainDnsProviderActions
                  providers={providers}
                  busyProviderId={busyProviderId}
                  onApply={onApplyDns}
                />
              ) : null}
              {notice?.domainId === domain.id ? (
                <div className={`w-fit border px-3 py-1.5 font-mono text-xs ${
                  notice.tone === "success"
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-fg/20 bg-fg/5 text-fg"
                }`}>
                  {notice.tone === "success" ? "✓ " : "✕ "}{notice.text}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              className={btn("secondary")}
              onClick={onRefreshDns}
              disabled={refreshingDns}
            >
              <AppIcon icon={Refresh03Icon} size={13} className={refreshingDns ? "animate-spin" : ""} />
              Verify DNS
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

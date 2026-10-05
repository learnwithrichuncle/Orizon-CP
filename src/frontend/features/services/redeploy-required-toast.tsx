import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { AppIcon, btn } from "../../components/ui/primitives";

export function RedeployRequiredToast({
  visible,
  busy,
  serviceName,
  onDismiss,
  onRedeploy
}: {
  visible: boolean;
  busy: boolean;
  serviceName: string;
  onDismiss: () => void;
  onRedeploy: () => void;
}) {
  if (!visible) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 w-[min(350px,calc(100vw-2rem))] border border-fg/20 bg-bg"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-4 border-b border-fg/10 px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 bg-accent ${busy ? "animate-pulse" : ""}`} />
            <span className="font-mono text-[9px] uppercase tracking-wider text-accent font-semibold">
              {busy ? "Deploying" : "Redeploy required"}
            </span>
          </div>
          <div className="mt-1 truncate text-sm font-bold text-fg">{serviceName}</div>
        </div>
        <button
          type="button"
          className="text-fg/40 transition hover:text-fg"
          onClick={onDismiss}
          aria-label="Dismiss redeploy reminder"
        >
          <AppIcon icon={Cancel01Icon} size={15} />
        </button>
      </div>

      <div className="px-4 py-3">
        <p className="text-xs leading-5 text-fg/60">
          Redeploy to apply the settings you just saved.
        </p>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            className={btn("ghost")}
            onClick={onDismiss}
            disabled={busy}
          >
            Later
          </button>
          <button
            type="button"
            className={btn("primary")}
            onClick={onRedeploy}
            disabled={busy}
          >
            {busy ? "Starting…" : "Redeploy"}
          </button>
        </div>
      </div>
    </div>
  );
}

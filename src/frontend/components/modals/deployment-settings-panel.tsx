import { useEffect, useState } from "react";
import { api } from "../../api";

const minConcurrency = 1;
const maxConcurrency = 10;

function clampConcurrency(value: number) {
  if (!Number.isFinite(value)) return 3;
  return Math.min(maxConcurrency, Math.max(minConcurrency, Math.round(value)));
}

export function DeploymentSettingsPanel({ open }: { open: boolean }) {
  const [deploymentConcurrency, setDeploymentConcurrency] = useState(3);
  const [savedConcurrency, setSavedConcurrency] = useState(3);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadSettings() {
    setLoading(true);
    setError("");
    try {
      const result = await api.systemSettings();
      const next = clampConcurrency(result.settings.deploymentConcurrency);
      setDeploymentConcurrency(next);
      setSavedConcurrency(next);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not load deployment settings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    void loadSettings();
  }, [open]);

  async function saveConcurrency(value: number) {
    const nextValue = clampConcurrency(value);
    setDeploymentConcurrency(nextValue);
    setSaving(true);
    setError("");
    try {
      const result = await api.updateSystemSettings({ deploymentConcurrency: nextValue });
      const next = clampConcurrency(result.settings.deploymentConcurrency);
      setDeploymentConcurrency(next);
      setSavedConcurrency(next);
    } catch (issue) {
      setDeploymentConcurrency(savedConcurrency);
      setError(issue instanceof Error ? issue.message : "Could not save deployment settings");
    } finally {
      setSaving(false);
    }
  }

  const busy = loading || saving;

  return (
    <section className="mx-auto max-w-3xl overflow-hidden border border-fg/10 bg-bg">
      <header className="border-b border-fg/10 px-5 py-5 sm:px-7">
        <h2 className="text-xl tracking-[-0.03em] text-fg">Concurrent deployments</h2>
        <p className="mt-1.5 text-sm text-fg/60">Set how many deployments can run at once.</p>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-5 px-5 py-5 sm:px-7">
        <div>
          <div className="text-sm text-fg/80">Concurrency limit</div>
          <div className="mt-1 text-xs text-fg/40">Between {minConcurrency} and {maxConcurrency}</div>
        </div>
        {loading ? (
          <div className="h-9 w-[132px] animate-pulse bg-fg/[0.04]" />
        ) : (
          <div className="inline-grid grid-cols-[36px_60px_36px]">
            <button
              type="button"
              className="grid h-9 place-items-center border border-fg/15 text-lg text-fg/80 transition hover:border-fg/40 hover:bg-fg/5 hover:text-fg disabled:cursor-not-allowed disabled:opacity-30"
              onClick={() => void saveConcurrency(deploymentConcurrency - 1)}
              disabled={busy || deploymentConcurrency <= minConcurrency}
              aria-label="Decrease concurrent deployments"
            >
              -
            </button>
            <div className="grid h-9 place-items-center border-y border-fg/15 bg-fg/[0.03] font-mono text-sm text-fg/80">
              {deploymentConcurrency}
            </div>
            <button
              type="button"
              className="grid h-9 place-items-center border border-fg/15 text-lg text-fg/80 transition hover:border-fg/40 hover:bg-fg/5 hover:text-fg disabled:cursor-not-allowed disabled:opacity-30"
              onClick={() => void saveConcurrency(deploymentConcurrency + 1)}
              disabled={busy || deploymentConcurrency >= maxConcurrency}
              aria-label="Increase concurrent deployments"
            >
              +
            </button>
          </div>
        )}
      </div>

      {saving ? <div className="border-t border-fg/10 px-5 py-3 text-xs text-fg/60 sm:px-7">Saving…</div> : null}
      {error ? (
        <div className="border-t border-fg/10 px-5 py-4 sm:px-7">
          <div className="border-l-2 border-fg/20 bg-fg/5 px-4 py-3 text-sm text-accent">{error}</div>
        </div>
      ) : null}
    </section>
  );
}

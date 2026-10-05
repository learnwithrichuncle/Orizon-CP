import { CheckmarkCircle02Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { FormEvent, useState } from "react";
import { api } from "../../api";
import { formatBytes } from "../../lib/format";
import { AppIcon, FormInput } from "../ui/primitives";

export function MigrationSettingsPanel() {
  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [lastExport, setLastExport] = useState<{ fileName: string; sizeBytes: number } | null>(null);

  async function exportBundle(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLastExport(null);
    if (passphrase.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (passphrase !== confirmPassphrase) {
      setError("Passphrases do not match.");
      return;
    }

    setExporting(true);
    try {
      const result = await api.exportMigrationBundle(passphrase);
      setLastExport(result);
      setPassphrase("");
      setConfirmPassphrase("");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not export migration bundle");
    } finally {
      setExporting(false);
    }
  }

  return (
    <section className="mx-auto max-w-3xl overflow-hidden border border-fg/10 bg-bg">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-fg/10 px-5 py-5 sm:px-7">
        <div>
          <h2 className="text-xl tracking-[-0.03em] text-fg">Export instance</h2>
          <p className="mt-1.5 text-sm text-fg/60">Create an encrypted migration bundle.</p>
        </div>
        <span
          className={`inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] ${
            exporting ? "text-accent" : lastExport ? "text-accent" : "text-fg/60"
          }`}
        >
          <span className={`h-1.5 w-1.5 ${exporting ? "animate-pulse bg-accent/10" : lastExport ? "bg-accent/10" : "bg-fg/5"}`} />
          {exporting ? "Exporting" : lastExport ? "Ready" : "Encrypted"}
        </span>
      </header>

      <form onSubmit={exportBundle}>
        <div className="divide-y divide-white/10 px-5 sm:px-7">
          <div className="grid gap-2 py-3.5 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center">
            <label htmlFor="migration-passphrase" className="text-xs text-fg/60">Passphrase</label>
            <FormInput
              id="migration-passphrase"
              type="password"
              value={passphrase}
              onChange={(event) => setPassphrase(event.target.value)}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              variant="monochrome"
              className="!h-9 border-fg/15 bg-fg/[0.03] text-sm"
            />
          </div>
          <div className="grid gap-2 py-3.5 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center">
            <label htmlFor="migration-confirm-passphrase" className="text-xs text-fg/60">Confirm passphrase</label>
            <FormInput
              id="migration-confirm-passphrase"
              type="password"
              value={confirmPassphrase}
              onChange={(event) => setConfirmPassphrase(event.target.value)}
              autoComplete="new-password"
              placeholder="Repeat passphrase"
              variant="monochrome"
              className="!h-9 border-fg/15 bg-fg/[0.03] text-sm"
            />
          </div>
        </div>

        {error ? (
          <div className="border-t border-fg/10 px-5 py-4 sm:px-7">
            <div className="border-l-2 border-fg/20 bg-fg/5 px-4 py-3 text-sm text-accent">{error}</div>
          </div>
        ) : null}

        {lastExport ? (
          <div className="flex items-center gap-2 border-t border-accent/20 bg-accent/10 px-5 py-3 text-xs text-accent sm:px-7">
            <AppIcon icon={CheckmarkCircle02Icon} size={14} />
            <span className="min-w-0 truncate">{lastExport.fileName}</span>
            <span className="ml-auto shrink-0 font-mono text-[10px] text-accent">{formatBytes(lastExport.sizeBytes)}</span>
          </div>
        ) : null}

        <footer className="flex justify-end border-t border-fg/10 px-5 py-4 sm:px-7">
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center gap-2 bg-fg px-4 text-sm text-bg transition hover:bg-fg/5 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={exporting}
          >
            <AppIcon icon={Download01Icon} size={14} className={exporting ? "animate-pulse" : ""} />
            {exporting ? "Creating…" : "Download bundle"}
          </button>
        </footer>
      </form>
    </section>
  );
}

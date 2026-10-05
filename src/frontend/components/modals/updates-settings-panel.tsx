import { CheckmarkCircle02Icon, Refresh03Icon } from "@hugeicons/core-free-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, type SystemUpdateInfo, type SystemUpdateRun } from "../../api";
import { AppIcon } from "../ui/primitives";
import { UpdateConfirmationModal } from "./update-confirmation-modal";

function formatCommitDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function updateStatusTone(status: SystemUpdateInfo["status"]) {
  if (status === "current") return { text: "text-accent", dot: "bg-accent/10" };
  if (status === "available") return { text: "text-accent", dot: "bg-accent/10" };
  if (status === "diverged") return { text: "text-fg", dot: "bg-accent/10" };
  return { text: "text-fg/60", dot: "bg-fg/5" };
}

function updateStatusLabel(info: SystemUpdateInfo | null) {
  if (!info) return "Not checked";
  if (info.installType === "image" && info.status === "unknown") return "Image install";
  if (info.status === "current") return "Up to date";
  if (info.status === "available") return `${info.commits.length} update${info.commits.length === 1 ? "" : "s"}`;
  if (info.status === "diverged") return "Manual update";
  return "Unknown";
}

function runStatusLabel(run: SystemUpdateRun) {
  if (run.status === "running") return "Updating";
  if (run.status === "succeeded") return "Update complete";
  if (run.status === "failed") return "Update failed";
  return "Idle";
}

function handledRestartRunKey() {
  try {
    return window.sessionStorage.getItem("orizoncp:handled-update-restart") ?? "";
  } catch {
    return "";
  }
}

function rememberHandledRestartRun(runKey: string) {
  try {
    window.sessionStorage.setItem("orizoncp:handled-update-restart", runKey);
  } catch {
    // Storage can be unavailable in locked-down browsers; the in-memory guard still handles the current page.
  }
}

export function UpdatesSettingsPanel({ open }: { open: boolean }) {
  const [info, setInfo] = useState<SystemUpdateInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [confirmingUpdate, setConfirmingUpdate] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const handledRunRef = useRef("");

  const loadUpdates = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.systemUpdates();
      setInfo(result);
      if (result.error) {
        setError(result.error);
      }
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not check updates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void loadUpdates();
  }, [loadUpdates, open]);

  useEffect(() => {
    if (!open || info?.updateRun.status !== "running") return;
    const interval = window.setInterval(() => void loadUpdates(), 2500);
    return () => window.clearInterval(interval);
  }, [info?.updateRun.status, loadUpdates, open]);

  useEffect(() => {
    const run = info?.updateRun;
    if (!run || run.status === "idle" || !run.finishedAt) return;

    const runKey = `${run.status}:${run.finishedAt}`;
    if (handledRunRef.current === runKey) return;
    handledRunRef.current = runKey;

    if (run.status === "succeeded") {
      const restartAlreadyHandled = handledRestartRunKey() === runKey;
      setError("");
      setSuccess(
        run.restartQueued
          ? restartAlreadyHandled
            ? "Update applied. OrizonCP is restarting."
            : "Update applied. OrizonCP is restarting, then this page will refresh."
          : "Update built. Restart OrizonCP to load server changes."
      );
      if (run.restartQueued && !restartAlreadyHandled) {
        rememberHandledRestartRun(runKey);
        window.setTimeout(() => window.location.reload(), 5000);
      }
    }

    if (run.status === "failed") {
      setSuccess("");
      setError(run.error || "Update failed");
    }
  }, [info?.updateRun]);

  async function applyUpdate() {
    if (!info || info.status !== "available") return;

    setConfirmingUpdate(false);
    setApplying(true);
    setError("");
    setSuccess("");
    try {
      const result = await api.applySystemUpdate();
      setInfo((current) => (current ? { ...current, updateRun: result.updateRun } : current));
      setSuccess("Update started.");
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not start update");
    } finally {
      setApplying(false);
    }
  }

  const run = info?.updateRun;
  const updateRunning = run?.status === "running";
  const canUpdate = Boolean(info && info.status === "available" && !info.dirty && info.canApplyUpdate && !updateRunning && !applying);
  const statusTone = updateStatusTone(info?.status ?? "unknown");

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <section className="overflow-hidden border border-fg/10 bg-bg">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-fg/10 px-5 py-5 sm:px-7">
          <div>
            <h2 className="text-xl tracking-[-0.03em] text-fg">Release channel</h2>
            <p className="mt-1.5 text-sm text-fg/60">
              {info?.installType === "image" ? "Docker image" : "Git checkout"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] ${statusTone.text}`}>
              <span className={`h-1.5 w-1.5 ${loading ? "animate-pulse" : ""} ${statusTone.dot}`} />
              {loading ? "Checking" : updateStatusLabel(info)}
            </span>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center gap-2 border border-fg/15 px-3.5 text-sm text-fg/80 transition hover:border-fg/35 hover:bg-fg/5 hover:text-fg disabled:opacity-50"
              onClick={() => void loadUpdates()}
              disabled={loading || updateRunning}
            >
              <AppIcon icon={Refresh03Icon} size={13} className={loading ? "animate-spin" : ""} />
              Check
            </button>
          </div>
        </header>

        <dl className="grid divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
          <div className="px-5 py-4 sm:px-7 md:px-5">
            <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-fg/40">Repository</dt>
            <dd className="mt-1.5 truncate font-mono text-xs text-fg/80">{info?.repo ?? "learnwithrichuncle/Orizon-CP"}</dd>
          </div>
          <div className="px-5 py-4">
            <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-fg/40">Installed</dt>
            <dd className="mt-1.5 font-mono text-xs text-fg/80">{info?.currentShortCommit ?? "unknown"}</dd>
          </div>
          <div className="px-5 py-4 sm:px-7 md:px-5">
            <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-fg/40">GitHub</dt>
            <dd className="mt-1.5 font-mono text-xs text-fg/80">
              {info?.remoteShortCommit ?? "unknown"}
              {info?.branch ? <span className="ml-2 text-fg/60">/{info.branch}</span> : null}
            </dd>
          </div>
        </dl>
      </section>

      {info?.dirty ? (
        <div className="border-l-2 border-accent/30 bg-accent/10 px-4 py-3 text-sm leading-relaxed text-accent">
          The OrizonCP checkout has local changes. Commit, deploy, or discard those changes before using the updater.
        </div>
      ) : null}

      {info?.installType === "image" ? (
        <section className="border border-fg/10 bg-bg">
          <header className="border-b border-fg/10 px-5 py-3.5">
            <h3 className="text-sm text-fg/80">{info.canApplyUpdate ? "Docker image updates" : "Update from server"}</h3>
          </header>
          <p className="px-5 py-4 text-sm leading-relaxed text-fg/60">
            {!info.currentCommit
              ? "This image was built without commit metadata, so OrizonCP cannot compare it with GitHub yet. Publish the image with ORIZONCP_COMMIT_SHA to enable one-click updates."
              : info.canApplyUpdate
                ? "OrizonCP will pull the latest GHCR image through a short-lived updater container, then replace the running app container."
                : "This container does not include a git checkout, and one-click image updates are not configured for this install. Publish a new GHCR image, then run this on the server."}
          </p>
          {!info.canApplyUpdate || info.status === "unknown" ? (
            <pre className="overflow-x-auto border-t border-fg/10 bg-fg/[0.02] px-5 py-3 font-mono text-[11px] leading-relaxed text-fg/80">
              {info.updateCommand ?? "cd /opt/orizoncp && sudo docker compose pull orizoncp && sudo docker compose up -d orizoncp"}
            </pre>
          ) : null}
        </section>
      ) : null}

      {info?.status === "current" && !updateRunning ? (
        <section className="flex items-center gap-3 border border-accent/20 bg-accent/10/[0.06] px-5 py-4">
          <AppIcon icon={CheckmarkCircle02Icon} size={18} className="text-accent" />
          <div>
            <h3 className="text-sm text-fg/80">OrizonCP is up to date</h3>
            <p className="mt-0.5 text-xs text-fg/60">Installed commit matches GitHub.</p>
          </div>
        </section>
      ) : null}

      {info?.status === "available" ? (
        <section className="border border-fg/10 bg-bg">
          <header className="flex flex-col gap-3 border-b border-fg/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm text-fg/80">Pending commits</h3>
              <p className="mt-1 text-xs text-fg/40">{info.commits.length} ready to apply</p>
            </div>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center gap-2 bg-fg px-4 text-sm text-bg transition hover:bg-fg/5 disabled:opacity-50"
              onClick={() => setConfirmingUpdate(true)}
              disabled={!canUpdate}
            >
              <AppIcon icon={Refresh03Icon} size={13} className={applying || updateRunning ? "animate-spin" : ""} />
              {updateRunning ? "Updating..." : info.installType === "image" ? "Pull latest image" : "Update OrizonCP"}
            </button>
          </header>

          <div className="max-h-[360px] overflow-y-auto">
            {info.commits.map((commit) => {
              const content = (
                <>
                  <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-fg/60">{commit.shortSha}</div>
                  <div className="mt-1 text-sm text-fg/80">{commit.title}</div>
                  <div className="mt-1 font-mono text-[10px] text-fg/60">
                    {commit.author} · {formatCommitDate(commit.date)}
                  </div>
                </>
              );

              return commit.url ? (
                <a
                  key={commit.sha}
                  href={commit.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block border-b border-fg/10 px-5 py-3.5 transition hover:bg-fg/[0.04]"
                >
                  {content}
                </a>
              ) : (
                <div key={commit.sha} className="border-b border-fg/10 px-5 py-3.5">
                  {content}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {info?.status === "diverged" ? (
        <div className="border-l-2 border-fg/20 bg-fg/5 px-4 py-3 text-sm leading-relaxed text-accent">
          {info.installType === "image"
            ? "The running image commit is not an ancestor of GitHub main, so OrizonCP will not update automatically. Publish a fresh image manually."
            : "This checkout has diverged from GitHub, so OrizonCP will not update automatically. Pull or reconcile the repository manually."}
        </div>
      ) : null}

      {run && run.status !== "idle" ? (
        <section className="border border-fg/10 bg-bg">
          <header className="flex items-center justify-between gap-3 border-b border-fg/10 px-5 py-3.5">
            <h3 className="text-sm text-fg/80">Update activity</h3>
            <span className={`inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] ${
              run.status === "failed" ? "text-fg" : run.status === "running" ? "text-accent" : "text-accent"
            }`}>
              <span className={`h-1.5 w-1.5 ${
                run.status === "failed" ? "bg-accent/10" : run.status === "running" ? "animate-pulse bg-accent/10" : "bg-accent/10"
              }`} />
              {runStatusLabel(run)}
            </span>
          </header>
          <pre className="max-h-56 overflow-y-auto whitespace-pre-wrap px-5 py-4 font-mono text-[11px] leading-relaxed text-fg/60">
            {run.logs.join("\n") || "No update output yet."}
          </pre>
        </section>
      ) : null}

      {error ? <div className="border-l-2 border-fg/20 bg-fg/5 px-4 py-3 text-sm text-accent">{error}</div> : null}

      {success ? (
        <div className="flex items-center gap-2 border-l-2 border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
          <AppIcon icon={CheckmarkCircle02Icon} size={13} />
          {success}
        </div>
      ) : null}

      <UpdateConfirmationModal
        applying={applying}
        installType={info?.installType ?? "git"}
        open={confirmingUpdate}
        onCancel={() => setConfirmingUpdate(false)}
        onConfirm={() => void applyUpdate()}
      />
    </div>
  );
}

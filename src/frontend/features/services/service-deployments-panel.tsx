import { Cancel01Icon, ChatQuestionIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import type { Deployment, DeploymentLog } from "../../api";
import { DeployPlaneIcon } from "../../components/icons/deploy-plane-icon";
import { AppIcon, StatusPill, btn } from "../../components/ui/primitives";
import { displayDeploymentStatus } from "../../lib/deployment-status";
import { formatTime, shortSha } from "../../lib/format";
import { DeploymentFailureExplanationModal } from "./deployment-failure-explanation-modal";
import { DeploymentLogsPanel } from "./service-log-panels";
import { formatBuildDuration } from "./service-format";

export function ServiceDeploymentsPanel({
  deployments,
  activeDeployment,
  activeDeploymentId,
  deploymentLogs,
  activeDeploymentDuration,
  busy,
  nowMs,
  onSelectDeployment,
  onDeploy,
  onAbortActiveDeployment
}: {
  deployments: Deployment[];
  activeDeployment: Deployment | null;
  activeDeploymentId: string | null;
  deploymentLogs: DeploymentLog[];
  activeDeploymentDuration: string | null;
  busy: string;
  nowMs: number;
  onSelectDeployment: (deploymentId: string) => void;
  onDeploy: () => void;
  onAbortActiveDeployment: () => void;
}) {
  const [failureModalOpen, setFailureModalOpen] = useState(false);
  const failedDeploymentSelected = activeDeployment?.status === "failed";

  return (
    <section className="mx-auto flex h-full min-h-0 w-full max-w-[1440px] flex-col overflow-hidden border border-fg/10 bg-bg">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-fg/10 px-5 py-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-fg">Deployments</h2>
          <p className="font-mono text-[9px] uppercase tracking-wider text-fg/40">
            {deployments.length} {deployments.length === 1 ? "deployment" : "deployments"}
          </p>
        </div>
        <button
          type="button"
          className={btn("primary")}
          onClick={onDeploy}
          disabled={busy === "deploy"}
        >
          <DeployPlaneIcon size={14} />
          {busy === "deploy" ? "Deploying…" : "Deploy"}
        </button>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col border-b border-fg/10 lg:border-b-0 lg:border-r">
          <div className="flex h-10 items-center justify-between border-b border-fg/10 px-4 font-mono text-[9px] uppercase tracking-wider text-fg/40">
            <span>History</span>
            <span>{deployments.length}</span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {deployments.map((deployment) => {
              const displayStatus = displayDeploymentStatus(deployment.status);
              const selected = deployment.id === activeDeploymentId;
              const buildDuration = formatBuildDuration(
                deployment.startedAt ?? deployment.createdAt,
                deployment.finishedAt,
                nowMs
              );
              return (
                <button
                  key={deployment.id}
                  type="button"
                  className={
                    selected
                      ? "flex min-h-14 w-full items-center justify-between gap-3 border-b border-fg/10 border-l-2 border-l-accent bg-accent/10 px-4 py-3 text-left text-fg"
                      : "flex min-h-14 w-full items-center justify-between gap-3 border-b border-fg/10 px-4 py-3 text-left text-fg/60 transition hover:bg-fg/5 hover:text-fg"
                  }
                  onClick={() => onSelectDeployment(deployment.id)}
                >
                  <div className="min-w-0">
                    <div className="font-mono text-xs font-semibold">{shortSha(deployment.commitSha)}</div>
                    <div className="mt-0.5 font-mono text-[10px] text-fg/40">
                      {formatTime(deployment.createdAt)}
                      {buildDuration ? ` · ${buildDuration}` : ""}
                    </div>
                  </div>
                  <StatusPill status={displayStatus} />
                </button>
              );
            })}
            {deployments.length === 0 ? (
              <div className="flex min-h-40 items-center justify-center px-4 font-mono text-xs text-fg/40">
                No deployments yet
              </div>
            ) : null}
          </div>
        </aside>

        <div className="min-h-0 min-w-0">
          <DeploymentLogsPanel
            logs={deploymentLogs}
            title="Deploy output"
            meta={
              activeDeploymentDuration
                ? `${activeDeployment?.status === "queued" ? "Queued for" : "Building for"} ${activeDeploymentDuration}`
                : undefined
            }
            actions={
              activeDeployment && (activeDeployment.status === "queued" || activeDeployment.status === "building") ? (
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    className={btn("secondary")}
                    onClick={onAbortActiveDeployment}
                    disabled={busy === "abort"}
                  >
                    <AppIcon icon={Cancel01Icon} size={13} />
                    Abort build
                  </button>
                </div>
              ) : failedDeploymentSelected ? (
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    className={btn("secondary")}
                    onClick={() => setFailureModalOpen(true)}
                  >
                    <AppIcon icon={ChatQuestionIcon} size={13} />
                    What happened?
                  </button>
                </div>
              ) : undefined
            }
            emptyLabel="Choose a deployment to inspect its build and deploy logs."
            embedded
          />
        </div>
      </div>
      <DeploymentFailureExplanationModal
        deployment={activeDeployment}
        open={failureModalOpen && failedDeploymentSelected}
        onClose={() => setFailureModalOpen(false)}
      />
    </section>
  );
}

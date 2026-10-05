import {
  CloudServerIcon,
  DragDropVerticalIcon,
  FolderOpenIcon,
  FunctionIcon,
  GitBranchIcon,
  GithubIcon,
  Globe02Icon,
  PackageIcon
} from "@hugeicons/core-free-icons";
import type { ProjectEnvironment, Service } from "../../api";
import type { DragEvent } from "react";
import { AppIcon, FrameworkMark, StatusPill } from "../../components/ui/primitives";
import { formatTime } from "../../lib/format";
import { dockerImageForService, isDatabaseService, isDockerImageService } from "../../../core/service-source";
import { functionRuntimeLabels, isFunctionService } from "../../../core/service-functions";
import { ServiceCardActions } from "./service-card-actions";

export function ProjectServiceCard({
  service,
  environment,
  isDragging,
  canMoveEnvironment,
  onDragStart,
  onDragEnd,
  onMoveEnvironment,
  onOpen
}: {
  service: Service;
  environment: ProjectEnvironment;
  isDragging: boolean;
  canMoveEnvironment: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
  onMoveEnvironment: () => void;
  onOpen: () => void;
}) {
  const isDatabase = isDatabaseService(service);
  const isDockerImage = isDockerImageService(service);
  const isFunction = isFunctionService(service);
  const visibleUrl = (service.primaryUrl || service.localUrl).replace("127.0.0.1", window.location.hostname);
  const visibleLabel = visibleUrl.replace(/^https?:\/\//, "");
  const sourceLabel = isFunction
    ? `${functionRuntimeLabels[service.functionRuntime ?? "node"]} function`
    : service.dockerImage ||
      (isDockerImage ? dockerImageForService(service) : "") ||
      service.repoFullName ||
      service.repoUrl.replace(/^https?:\/\//, "").replace(/^github\.com\//, "");
  const sourceIcon = isDatabase
    ? CloudServerIcon
    : isFunction
      ? FunctionIcon
      : isDockerImage
        ? PackageIcon
        : GithubIcon;
  const fallbackIcon = isDatabase
    ? CloudServerIcon
    : isFunction
      ? FunctionIcon
      : isDockerImage
        ? PackageIcon
        : Globe02Icon;

  return (
    <article
      role="button"
      tabIndex={0}
      draggable={canMoveEnvironment}
      className={`group relative flex min-h-52 flex-col border p-4 text-left transition ${
        isDragging
          ? "cursor-grabbing border-accent opacity-40 bg-accent/5"
          : "cursor-grab border-fg/10 bg-fg/[0.03] hover:border-fg/30 hover:bg-fg/5 active:cursor-grabbing"
      }`}
      onClick={onOpen}
      onDragStart={(event: DragEvent<HTMLElement>) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", service.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      {canMoveEnvironment ? (
        <span className="pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 text-fg/30 opacity-0 transition group-hover:opacity-100" aria-hidden="true">
          <AppIcon icon={DragDropVerticalIcon} size={14} />
        </span>
      ) : null}
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center border border-fg/15 bg-fg/[0.03] p-2.5">
          <FrameworkMark
            framework={service.framework}
            size={20}
            fallback={<AppIcon icon={fallbackIcon} size={17} className="text-fg/60" />}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="truncate text-base font-bold tracking-tight text-fg">{service.name}</h2>
            <StatusPill status={service.status} />
          </div>

          {isDatabase ? (
            <p className="mt-1 truncate font-mono text-[10px] text-fg/40">
              {window.location.hostname}:{service.hostPort}
            </p>
          ) : visibleUrl ? (
            <a
              href={visibleUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block truncate text-xs text-fg/60 transition hover:text-fg"
              onClick={(event) => event.stopPropagation()}
            >
              {visibleLabel}
            </a>
          ) : (
            <p className="mt-1 text-xs text-fg/40">No public URL</p>
          )}
        </div>
      </div>

      <div className="mt-5 min-w-0">
        <div className="flex min-w-0 items-center gap-2 text-xs text-fg/60">
          <AppIcon icon={sourceIcon} size={14} className="shrink-0 text-fg/40" />
          <span className="truncate">{isDatabase ? "Database service" : sourceLabel}</span>
        </div>

        {!isDatabase && !isDockerImage && !isFunction ? (
          <div className="mt-2 flex min-w-0 items-center gap-2 text-xs text-fg/50">
            <AppIcon icon={FolderOpenIcon} size={14} className="shrink-0 text-fg/40" />
            <span className="truncate">{service.rootDir || "Repository root"}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-auto flex items-end justify-between gap-4 border-t border-fg/10 pt-4">
        <div className="min-w-0">
          {!isDatabase && !isDockerImage && !isFunction ? (
            <span className="inline-flex max-w-full items-center gap-1.5 font-mono text-[9px] text-fg/50">
              <AppIcon icon={GitBranchIcon} size={12} />
              <span className="truncate">{service.branch}</span>
            </span>
          ) : null}
          <p className="mt-0.5 font-mono text-[9px] text-fg/40">
            {formatTime(service.lastDeployedAt ?? service.updatedAt)}
          </p>
        </div>
        <ServiceCardActions
          serviceName={service.name}
          environment={environment}
          canVisit={Boolean(visibleUrl)}
          canMoveEnvironment={canMoveEnvironment}
          onOpen={onOpen}
          onVisit={() => window.open(visibleUrl, "_blank", "noopener,noreferrer")}
          onMoveEnvironment={onMoveEnvironment}
        />
      </div>
    </article>
  );
}

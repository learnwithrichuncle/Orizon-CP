import {
  AlertCircleIcon,
  CloudUploadIcon,
  GithubIcon,
  Globe02Icon,
  Settings01Icon
} from "@hugeicons/core-free-icons";
import type { GitHubStatus, R2SettingsStatus, ToolCheck } from "../../api";
import { AppIcon, btn } from "../../components/ui/primitives";
import type { SystemSettingsTab } from "../settings/settings-pages";

type DomainSettingsSummary = {
  settings: {
    rootDomain: string;
    controlPlaneHostname: string;
  };
  dnsStatus?: "active" | "pending";
  controlPlaneDnsStatus?: "active" | "pending";
};

type SetupTodo = {
  key: string;
  icon: unknown;
  title: string;
  detail: string;
  actionLabel: string;
  onAction: () => void;
};

export function SetupTodoList({
  domainSettings,
  githubStatus,
  r2Status,
  tools,
  onOpenSettings,
  onOpenGitHubInstall
}: {
  domainSettings: DomainSettingsSummary | null;
  githubStatus: GitHubStatus | null;
  r2Status: R2SettingsStatus | null;
  tools: ToolCheck[];
  onOpenSettings: (tab?: SystemSettingsTab) => void;
  onOpenGitHubInstall: () => void;
}) {
  const todos: SetupTodo[] = [];
  const dashboardHostname = domainSettings?.settings.controlPlaneHostname ?? "";
  const rootDomain = domainSettings?.settings.rootDomain ?? "";
  const brokenTools = tools.filter((tool) => !tool.ok);

  if (!dashboardHostname) {
    todos.push({
      key: "dashboard-domain",
      icon: Globe02Icon,
      title: "Add dashboard domain",
      detail: "Serve OrizonCP from a hostname instead of only the server IP.",
      actionLabel: "Set domain",
      onAction: () => onOpenSettings("root-domain")
    });
  } else if (domainSettings?.controlPlaneDnsStatus !== "active") {
    todos.push({
      key: "dashboard-dns",
      icon: Globe02Icon,
      title: "Finish dashboard DNS",
      detail: `${dashboardHostname} is saved, but DNS has not resolved to this server yet.`,
      actionLabel: "View DNS",
      onAction: () => onOpenSettings("root-domain")
    });
  }

  if (!rootDomain) {
    todos.push({
      key: "root-domain",
      icon: Globe02Icon,
      title: "Add wildcard root domain",
      detail: "Generate service hostnames like api.pilot.example.com automatically.",
      actionLabel: "Set wildcard",
      onAction: () => onOpenSettings("root-domain")
    });
  } else if (domainSettings?.dnsStatus !== "active") {
    todos.push({
      key: "root-dns",
      icon: Globe02Icon,
      title: "Finish wildcard DNS",
      detail: `*.${rootDomain} is saved, but the wildcard record is not active yet.`,
      actionLabel: "View DNS",
      onAction: () => onOpenSettings("root-domain")
    });
  }

  if (!githubStatus?.connected && !githubStatus?.installed) {
    todos.push({
      key: "github",
      icon: GithubIcon,
      title: githubStatus?.mode === "app" ? "Install GitHub App" : "Connect GitHub",
      detail: githubStatus?.mode === "app" ? "The app is configured, but it is not installed on any repositories." : "Connect GitHub to browse repos, branches, and directories.",
      actionLabel: githubStatus?.mode === "app" && githubStatus.installUrl ? "Install app" : "Open setup",
      onAction: () => {
        if (githubStatus?.mode === "app" && githubStatus.installUrl) {
          onOpenGitHubInstall();
        } else {
          onOpenSettings("github");
        }
      }
    });
  }

  if (!r2Status?.connected) {
    todos.push({
      key: "r2",
      icon: CloudUploadIcon,
      title: "Connect R2 backups",
      detail: "Store R2 credentials in OrizonCP so database backups can upload.",
      actionLabel: "Set storage",
      onAction: () => onOpenSettings("storage")
    });
  }

  if (brokenTools.length > 0) {
    todos.push({
      key: "tools",
      icon: Settings01Icon,
      title: "Fix host tools",
      detail: brokenTools.map((tool) => tool.name).join(", "),
      actionLabel: "Open settings",
      onAction: () => onOpenSettings()
    });
  }

  if (todos.length === 0) return null;

  return (
    <section className="border border-fg/10 bg-fg/[0.03]">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-fg/40">Setup checklist</div>
          <div className="mt-1 text-sm font-bold text-fg">
            {todos.length} item{todos.length === 1 ? "" : "s"} need attention
          </div>
        </div>
        <div className="inline-flex items-center gap-2 border border-accent/40 bg-accent/10 px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-accent">
          <AppIcon icon={AlertCircleIcon} size={13} />
          Action needed
        </div>
      </div>

      <ul className="border-t border-fg/10">
        {todos.map((todo) => (
          <li key={todo.key} className="border-b border-fg/10 p-4 last:border-b-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center border border-fg/20 bg-fg/[0.03] text-fg/60">
                  <AppIcon icon={todo.icon} size={14} />
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-fg">{todo.title}</div>
                  <p className="mt-0.5 text-xs leading-5 text-fg/60">{todo.detail}</p>
                </div>
              </div>
              <button
                type="button"
                className={btn("secondary")}
                onClick={todo.onAction}
              >
                {todo.actionLabel}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

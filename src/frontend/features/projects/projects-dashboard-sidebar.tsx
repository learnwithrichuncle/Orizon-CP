import {
  FolderCodeIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { Link } from "@tanstack/react-router";
import type { AuthUser, ToolCheck } from "../../api";
import { SignOutButton } from "../../components/auth/sign-out-button";
import { BrandMark } from "../../components/ui/brand-mark";
import { AppIcon } from "../../components/ui/primitives";
import { SystemHealthPill } from "./system-health-pill";

export type DashboardSidebarItem = {
  id: string;
  label: string;
  icon: unknown;
  active: boolean;
  attention?: boolean;
  onSelect: () => void;
};

function userInitials(user: AuthUser | null) {
  const source = user?.name || user?.email || "A";
  return source
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProjectsDashboardSidebar({
  currentUser,
  tools,
  owner,
  contextLabel,
  contextItems = []
}: {
  currentUser: AuthUser | null;
  tools: ToolCheck[];
  owner: boolean;
  contextLabel?: string;
  contextItems?: DashboardSidebarItem[];
}) {
  return (
    <aside className="relative z-20 flex items-center border-b border-fg/10 bg-bg px-5 py-4 lg:sticky lg:top-0 lg:h-dvh lg:flex-col lg:items-stretch lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center border border-accent text-accent">
          <BrandMark className="h-4 w-4" />
        </span>
        <div>
          <div className="text-sm font-bold tracking-tight text-fg">
            OrizonCP
          </div>
          <div className="font-mono text-[9px] uppercase tracking-wider text-fg/40">
            Control Plane
          </div>
        </div>
      </div>

      <nav aria-label="Dashboard" className="mt-8 hidden min-h-0 flex-1 overflow-y-auto lg:block">
        <p className="mb-2 px-3 font-mono text-[9px] uppercase tracking-[0.16em] text-fg/40">
          Workspace
        </p>
        <Link
          to="/"
          aria-current="page"
          className="flex h-10 items-center gap-3 border-l-2 border-accent bg-fg/[0.03] pl-3 pr-3 font-mono text-[11px] uppercase tracking-wider text-fg transition"
        >
          <AppIcon icon={FolderCodeIcon} size={15} />
          <span>Projects</span>
        </Link>
        <Link
          to="/settings/$settingsPage"
          params={{ settingsPage: "domains" }}
          className="mt-1 flex h-10 w-full items-center gap-3 px-3 font-mono text-[11px] uppercase tracking-wider text-fg/40 transition hover:bg-fg/5 hover:text-fg"
        >
          <AppIcon icon={Settings01Icon} size={15} />
          <span>System Settings</span>
        </Link>

        {contextItems.length > 0 ? (
          <div className="mt-6 border-t border-fg/10 pt-5">
            <p className="mb-2 truncate px-3 font-mono text-[9px] uppercase tracking-[0.16em] text-fg/40">
              {contextLabel || "Service"}
            </p>
            <div className="space-y-1">
              {contextItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={
                    item.active
                      ? "flex h-9 w-full items-center gap-3 border-l-2 border-accent bg-fg/[0.03] pl-3 pr-3 text-left font-mono text-[11px] uppercase tracking-wider text-fg"
                      : "flex h-9 w-full items-center gap-3 px-3 text-left font-mono text-[11px] uppercase tracking-wider text-fg/40 transition hover:bg-fg/5 hover:text-fg"
                  }
                  onClick={item.onSelect}
                  aria-current={item.active ? "page" : undefined}
                >
                  <AppIcon icon={item.icon} size={14} />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.attention ? <span className="h-1.5 w-1.5 bg-accent" /> : null}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </nav>

      <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:mt-auto lg:block">
        {owner ? (
          <div className="hidden lg:block">
            <SystemHealthPill tools={tools} />
          </div>
        ) : null}

        <div className="flex items-center gap-3 lg:mt-4 lg:border-t lg:border-fg/10 lg:pt-4">
          <span className="grid h-8 w-8 flex-none place-items-center border border-fg/20 bg-fg/[0.03] font-mono text-xs font-medium text-fg">
            {userInitials(currentUser)}
          </span>
          <span className="hidden min-w-0 flex-1 lg:block">
            <span className="block truncate text-xs font-medium text-fg">
              {currentUser?.name || "OrizonCP user"}
            </span>
            <span className="block truncate font-mono text-[8px] uppercase tracking-wider text-fg/40">
              {currentUser?.role || "Member"}
            </span>
          </span>
          <SignOutButton />
        </div>
      </div>
    </aside>
  );
}

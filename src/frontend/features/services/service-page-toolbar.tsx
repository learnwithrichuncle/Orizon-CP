import { ArrowDown01Icon, ArrowLeft01Icon, CloudServerIcon, FunctionIcon, GithubIcon, PackageIcon } from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";
import type { Service } from "../../api";
import { AppIcon, FrameworkMark, StatusPill } from "../../components/ui/primitives";
import { isDatabaseService, isDockerImageService } from "../../../core/service-source";
import { isFunctionService } from "../../../core/service-functions";

export function ServicePageToolbar({
  services,
  currentService,
  onBack,
  onServiceSelect
}: {
  services: Service[];
  currentService: Service | null;
  onBack: () => void;
  onServiceSelect: (serviceSlug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const otherServices = services.filter((service) => service.id !== currentService?.id);
  const currentIsDatabase = currentService ? isDatabaseService(currentService) : false;
  const currentIsDockerImage = currentService ? isDockerImageService(currentService) : false;
  const currentIsFunction = currentService ? isFunctionService(currentService) : false;

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center border border-fg/20 bg-bg text-fg/60 transition hover:border-fg/40 hover:bg-fg/5 hover:text-fg"
          onClick={onBack}
          aria-label="Back to project"
        >
          <AppIcon icon={ArrowLeft01Icon} size={15} />
        </button>

        <div ref={menuRef} className="relative min-w-0">
          <button
            type="button"
            className="inline-flex h-9 max-w-[340px] items-center justify-center gap-2 border border-fg/20 bg-bg px-3 text-sm text-fg transition hover:border-fg/40 hover:bg-fg/5"
            onClick={() => setOpen((current) => !current)}
          >
            <span className="grid h-5 w-5 flex-none place-items-center overflow-hidden">
              <FrameworkMark framework={currentService?.framework ?? null} size={18} fallback={<AppIcon icon={currentIsDatabase ? CloudServerIcon : currentIsFunction ? FunctionIcon : currentIsDockerImage ? PackageIcon : GithubIcon} size={16} />} />
            </span>
            <span className="min-w-0 truncate font-bold text-fg">{currentService?.name ?? "Select service"}</span>
            <AppIcon icon={ArrowDown01Icon} size={14} className={`text-fg/40 transition ${open ? "rotate-180" : ""}`} />
          </button>

          {open ? (
            <div className="absolute left-0 top-full z-30 mt-1 w-[320px] max-w-[calc(100vw-2rem)] border border-fg/20 bg-bg">
              <div className="border-b border-fg/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-fg/40">Switch service</div>
              <div className="max-h-80 overflow-y-auto p-1">
                {otherServices.length === 0 ? (
                  <div className="px-3 py-4 text-xs font-mono text-fg/40">No other services in this project.</div>
                ) : (
                  otherServices.map((service) => {
                    const isDatabase = isDatabaseService(service);
                    const isDockerImage = isDockerImageService(service);
                    const isFunction = isFunctionService(service);
                    return (
                      <button
                        key={service.id}
                        type="button"
                        className="flex w-full min-w-0 items-center justify-between gap-3 px-3 py-2.5 text-left text-sm text-fg transition hover:bg-fg/5"
                        onClick={() => {
                          setOpen(false);
                          onServiceSelect(service.slug);
                        }}
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="grid h-5 w-5 flex-none place-items-center overflow-hidden">
                            <FrameworkMark framework={service.framework} size={16} fallback={<AppIcon icon={isDatabase ? CloudServerIcon : isFunction ? FunctionIcon : isDockerImage ? PackageIcon : GithubIcon} size={14} />} />
                          </span>
                          <span className="min-w-0 truncate font-medium">{service.name}</span>
                        </div>
                        <StatusPill status={service.status} />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

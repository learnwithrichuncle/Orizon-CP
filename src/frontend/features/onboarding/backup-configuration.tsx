import { LinkSquare02Icon } from "@hugeicons/core-free-icons";
import type { BackupScheduleTrigger } from "../../api";
import { AppIcon } from "../../components/ui/primitives";
import { SquareSwitch } from "../../components/ui/square-switch";
import type { OnboardingForm } from "./onboarding-types";

const accountIdDocsUrl =
  "https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/";
const r2TokenDocsUrl = "https://developers.cloudflare.com/r2/api/tokens/";

const scheduleOptions: Array<{
  trigger: BackupScheduleTrigger;
  label: string;
  retention: string;
}> = [
  { trigger: "daily", label: "Daily", retention: "Keep for 6 days" },
  { trigger: "weekly", label: "Weekly", retention: "Keep for 31 days" },
  { trigger: "monthly", label: "Monthly", retention: "Keep for 90 days" },
];

function BackupField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  docsUrl,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  docsUrl?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-fg/80">
        {label}
        {docsUrl ? (
          <a
            href={docsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-fg/80 transition hover:text-fg"
            aria-label={`Open documentation for ${label}`}
            onClick={(event) => event.stopPropagation()}
          >
            <AppIcon icon={LinkSquare02Icon} size={11} />
          </a>
        ) : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="h-12 w-full bg-fg/5 px-3.5 font-mono text-xs text-fg outline-none transition placeholder:text-fg/80 focus:bg-fg/5"
      />
    </label>
  );
}

export function BackupConfiguration({
  form,
  update,
}: {
  form: OnboardingForm;
  update: (patch: Partial<OnboardingForm>) => void;
}) {
  const hasR2Input = [
    form.r2AccountId,
    form.r2Bucket,
    form.r2AccessKeyId,
    form.r2SecretAccessKey,
  ].some((value) => value.trim());

  function updateSchedule(
    trigger: BackupScheduleTrigger,
    enabled: boolean,
  ) {
    update({
      databaseBackupScheduleDefaults: {
        ...form.databaseBackupScheduleDefaults,
        [trigger]: enabled,
      },
    });
  }

  function skipR2() {
    update({
      r2AccountId: "",
      r2Bucket: "",
      r2AccessKeyId: "",
      r2SecretAccessKey: "",
      r2CreateBucket: false,
    });
  }

  return (
    <div className="space-y-9">
      <section>
        <div className="mb-5 flex items-center gap-3">
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-fg/80">
            Default schedule
          </span>
          <span className="h-px flex-1 bg-fg/10" />
        </div>
        <div className="grid gap-3">
          {scheduleOptions.map((option) => {
            const enabled =
              form.databaseBackupScheduleDefaults[option.trigger];
            return (
              <div
                key={option.trigger}
                className={`flex items-center justify-between gap-4  border px-4 py-3.5 text-left transition ${
                  enabled
                    ? "border-fg/35 bg-fg/10"
                    : "border-fg/10 bg-bg/20 hover:border-fg/20"
                }`}
              >
                <span>
                  <span className="block text-sm font-semibold text-fg">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-xs text-fg/80">
                    {option.retention}
                  </span>
                </span>
                <SquareSwitch
                  checked={enabled}
                  onCheckedChange={(checked) => updateSchedule(option.trigger, checked)}
                  label={`${enabled ? "Disable" : "Enable"} ${option.label.toLowerCase()} backups`}
                />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3">
            <span className="whitespace-nowrap font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-fg/80">
              Cloudflare R2
            </span>
            <span className="h-px flex-1 bg-fg/10" />
          </div>
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-fg/80">
            Optional
          </span>
        </div>

        <p className="mb-5 text-xs leading-5 text-fg/80">
          Store database backups away from this server. Leave every field blank
          to use local storage only.
        </p>

        {hasR2Input ? (
          <div className="mb-5 flex items-center justify-between gap-4 border border-fg/10 bg-fg/5 px-4 py-3">
            <span className="text-xs leading-5 text-fg/80">
              R2 configuration in progress
            </span>
            <button
              type="button"
              onClick={skipR2}
              className="flex-none font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-fg/80 transition hover:text-fg"
            >
              Clear &amp; skip
            </button>
          </div>
        ) : null}

        <div className="grid gap-y-5">
          <BackupField
            label="Account ID"
            value={form.r2AccountId}
            onChange={(r2AccountId) => update({ r2AccountId })}
            placeholder="Cloudflare account ID"
            docsUrl={accountIdDocsUrl}
          />
          <BackupField
            label="Bucket"
            value={form.r2Bucket}
            onChange={(r2Bucket) => update({ r2Bucket })}
            placeholder="orizoncp-backups"
          />
          <BackupField
            label="Access key ID"
            value={form.r2AccessKeyId}
            onChange={(r2AccessKeyId) => update({ r2AccessKeyId })}
            placeholder="Access key from your R2 API token"
            docsUrl={r2TokenDocsUrl}
          />
          <BackupField
            label="Secret access key"
            value={form.r2SecretAccessKey}
            onChange={(r2SecretAccessKey) => update({ r2SecretAccessKey })}
            placeholder="Secret key from your R2 API token"
            type="password"
            docsUrl={r2TokenDocsUrl}
          />
        </div>

        <div
          className="mt-5 flex w-full items-start justify-between gap-5 border-y border-fg/10 py-5 text-left"
        >
          <span>
            <span className="block font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-fg/80">
              Create or verify bucket
            </span>
            <span className="mt-1.5 block text-xs leading-5 text-fg/80">
              Check the R2 connection during setup when credentials are filled.
            </span>
          </span>
          <SquareSwitch
            checked={form.r2CreateBucket}
            onCheckedChange={(checked) => update({ r2CreateBucket: checked })}
            label={`${form.r2CreateBucket ? "Disable" : "Enable"} bucket creation and verification`}
            className="mt-0.5"
          />
        </div>
      </section>
    </div>
  );
}

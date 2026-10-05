import { useEffect, useMemo, useState } from "react";
import { SettingsDialog } from "../settings/settings-dialog";
import { btn } from "../../components/ui/primitives";
import { parseEnvText, type ParsedEnvEntry } from "./env-text-parser";

export function EnvPasteDialog({
  open,
  busy,
  onClose,
  onImport
}: {
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onImport: (entries: ParsedEnvEntry[]) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const entries = useMemo(() => parseEnvText(text), [text]);

  useEffect(() => {
    if (!open) setText("");
  }, [open]);

  return (
    <SettingsDialog
      open={open}
      title="Paste .env"
      width="max-w-xl"
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (entries.length === 0 || busy) return;
          void onImport(entries);
        }}
        className="space-y-4"
      >
        <label htmlFor="env-paste-value" className="block font-mono text-[9px] uppercase tracking-wider text-fg/40">
          Environment variables
        </label>
        <textarea
          id="env-paste-value"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={"DATABASE_URL=postgres://...\nAPI_KEY=...\nNODE_ENV=production"}
          autoFocus
          spellCheck={false}
          disabled={busy}
          className="h-64 w-full resize-none border border-fg/20 bg-bg/30 p-3 font-mono text-xs leading-6 text-fg outline-none transition placeholder:text-fg/30 focus:border-accent disabled:opacity-40"
        />

        <div className="min-h-5 font-mono text-xs text-fg/40">
          {text.trim()
            ? entries.length > 0
              ? `${entries.length} valid ${entries.length === 1 ? "variable" : "variables"} detected`
              : "No valid KEY=value entries detected"
            : "Paste the contents of a .env file"}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-fg/10 pt-4">
          <button
            type="button"
            className={btn("ghost")}
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={btn("primary")}
            disabled={busy || entries.length === 0}
          >
            {busy ? "Importing…" : `Import ${entries.length || ""}`.trim()}
          </button>
        </div>
      </form>
    </SettingsDialog>
  );
}

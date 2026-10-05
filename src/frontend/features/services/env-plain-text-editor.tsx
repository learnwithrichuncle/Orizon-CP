import { useMemo, useState } from "react";
import type { EnvVar } from "../../api";
import { EnvCodeEditor } from "./env-code-editor";
import { formatEnvText, invalidEnvLineNumbers, parseEnvText, type ParsedEnvEntry } from "./env-text-parser";
import { btn } from "../../components/ui/primitives";

export function EnvPlainTextEditor({
  env,
  busy,
  onCancel,
  onSave
}: {
  env: EnvVar[];
  busy: boolean;
  onCancel: () => void;
  onSave: (entries: ParsedEnvEntry[]) => Promise<void>;
}) {
  const [text, setText] = useState(() => formatEnvText(env.map((item) => ({ key: item.key, value: item.value ?? "" }))));
  const entries = useMemo(() => parseEnvText(text), [text]);
  const invalidLines = useMemo(() => invalidEnvLineNumbers(text), [text]);

  return (
    <form
      className="p-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (busy || invalidLines.length > 0) return;
        void onSave(entries);
      }}
    >
      <label htmlFor="plain-environment-variables" className="block font-mono text-[9px] uppercase tracking-wider text-fg/40">
        Environment variables
      </label>
      <div className="mt-2">
        <EnvCodeEditor
          value={text}
          onChange={setText}
          disabled={busy}
        />
      </div>

      <div className="mt-3 flex min-h-5 flex-wrap items-center justify-between gap-2 font-mono text-xs text-fg/40">
        <span>
          {invalidLines.length > 0
            ? `Invalid KEY=value syntax on ${invalidLines.length === 1 ? "line" : "lines"} ${invalidLines.join(", ")}`
            : `${entries.length} ${entries.length === 1 ? "variable" : "variables"}`}
        </span>
        <span>Removing a line deletes that variable on save.</span>
      </div>

      <div className="mt-5 flex items-center justify-end gap-3 border-t border-fg/10 pt-4">
        <button
          type="button"
          className={btn("ghost")}
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={btn("primary")}
          disabled={busy || invalidLines.length > 0}
        >
          {busy ? "Saving…" : "Save Variables"}
        </button>
      </div>
    </form>
  );
}

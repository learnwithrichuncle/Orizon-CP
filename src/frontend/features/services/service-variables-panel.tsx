import { Add01Icon, CopyIcon, PencilEdit02Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import type { ClipboardEvent } from "react";
import { api, type EnvVar } from "../../api";
import { AutocompleteInput } from "../../components/ui/autocomplete-input";
import { AppIcon, FormInput, btn } from "../../components/ui/primitives";
import { EnvVarRow } from "../../components/modals/env-var-row";
import { EnvPasteDialog } from "./env-paste-dialog";
import { EnvPlainTextEditor } from "./env-plain-text-editor";
import { parseEnvText, type ParsedEnvEntry } from "./env-text-parser";

export function ServiceVariablesPanel({
  serviceId,
  env,
  suggestions,
  busy,
  doAction
}: {
  serviceId: string;
  env: EnvVar[];
  suggestions: Array<{ key: string; label: string }>;
  busy: string;
  doAction: (label: string, action: () => Promise<void>) => Promise<void>;
}) {
  const [envForm, setEnvForm] = useState({ key: "", value: "" });
  const [envSearch, setEnvSearch] = useState("");
  const [newEnvOpen, setNewEnvOpen] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [plainTextOpen, setPlainTextOpen] = useState(false);
  const filteredEnv = env.filter((item) => item.key.toLowerCase().includes(envSearch.trim().toLowerCase()));

  async function populateEnvEntries(entries: ParsedEnvEntry[]) {
    await doAction("env", async () => {
      await Promise.all(entries.map((entry) => api.upsertEnv(serviceId, entry)));
      setEnvForm({ key: "", value: "" });
      setNewEnvOpen(false);
      setPasteOpen(false);
    });
  }

  function handleEnvPaste(event: ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData("text");
    const entries = parseEnvText(text);
    if (entries.length === 0) return;

    event.preventDefault();

    if (entries.length === 1) {
      setNewEnvOpen(true);
      setEnvForm(entries[0]);
      return;
    }

    void populateEnvEntries(entries);
  }

  async function savePlainEnv(entries: ParsedEnvEntry[]) {
    const nextKeys = new Set(entries.map((entry) => entry.key));
    const removedEntries = env.filter((item) => !nextKeys.has(item.key));

    await doAction("env", async () => {
      await Promise.all(removedEntries.map((item) => api.deleteEnv(serviceId, item.id)));
      await Promise.all(entries.map((entry) => api.upsertEnv(serviceId, entry)));
      setPlainTextOpen(false);
    });
  }

  return (
    <section className="mx-auto max-w-5xl overflow-hidden border border-fg/10 bg-bg">
      <header className="flex flex-col gap-4 border-b border-fg/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-fg">Variables</h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-fg/40">
            {env.length} {env.length === 1 ? "variable" : "variables"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!plainTextOpen ? (
            <div className="relative min-w-52 flex-1 sm:flex-none">
              <AppIcon icon={Search01Icon} size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg/40" />
              <FormInput
                value={envSearch}
                onChange={(event) => setEnvSearch(event.target.value)}
                placeholder="Search"
                className="!h-9 w-full pl-9 font-mono text-xs sm:w-56"
              />
            </div>
          ) : null}
          <button
            type="button"
            className={btn("secondary")}
            onClick={() => {
              setNewEnvOpen(false);
              setPlainTextOpen((current) => !current);
            }}
            disabled={busy === "env"}
          >
            <AppIcon icon={PencilEdit02Icon} size={14} />
            {plainTextOpen ? "List view" : "Edit plain"}
          </button>
          {!plainTextOpen ? (
            <>
              <button
                type="button"
                className={btn("secondary")}
                onClick={() => setPasteOpen(true)}
              >
                <AppIcon icon={CopyIcon} size={14} />
                Paste .env
              </button>
              <button
                type="button"
                className={btn("primary")}
                onClick={() => setNewEnvOpen((current) => !current)}
              >
                <AppIcon icon={Add01Icon} size={14} />
                New variable
              </button>
            </>
          ) : null}
        </div>
      </header>

      {plainTextOpen ? (
        <EnvPlainTextEditor
          key={serviceId}
          env={env}
          busy={busy === "env"}
          onCancel={() => setPlainTextOpen(false)}
          onSave={savePlainEnv}
        />
      ) : null}

      {!plainTextOpen && newEnvOpen ? (
        <form
          className="border-b border-fg/10 bg-fg/[0.02] p-4 sm:px-5"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            void doAction("env", async () => {
              await api.upsertEnv(serviceId, envForm);
              setEnvForm({ key: "", value: "" });
              setNewEnvOpen(false);
            });
          }}
        >
          <div className="grid gap-3 lg:grid-cols-[minmax(180px,0.8fr)_minmax(260px,1.4fr)_auto] lg:items-end">
            <div className="space-y-1">
              <label htmlFor="new-variable-key" className="block font-mono text-[9px] uppercase tracking-wider text-fg/40">Key</label>
              <FormInput
                id="new-variable-key"
                value={envForm.key}
                onChange={(event) => setEnvForm({ ...envForm, key: event.target.value })}
                onPaste={handleEnvPaste}
                placeholder="KEY"
                autoComplete="off"
                required
                className="!h-9 font-mono text-xs uppercase"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="new-variable-value" className="block font-mono text-[9px] uppercase tracking-wider text-fg/40">Value</label>
              <AutocompleteInput
                id="new-variable-value"
                type="text"
                value={envForm.value}
                onChange={(val) => setEnvForm({ ...envForm, value: val })}
                onPaste={handleEnvPaste}
                suggestions={suggestions}
                placeholder="VALUE"
                autoComplete="off"
                className="!h-9 font-mono text-xs"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className={btn("primary")}
                disabled={busy === "env"}
              >
                Save
              </button>
              <button
                type="button"
                className={btn("ghost")}
                onClick={() => setNewEnvOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : null}

      {!plainTextOpen ? (
        <div>
          {filteredEnv.length > 0 ? (
            <div className="hidden grid-cols-[minmax(180px,0.8fr)_minmax(260px,1.4fr)_104px] gap-4 border-b border-fg/10 bg-fg/[0.02] px-5 py-2.5 font-mono text-[9px] uppercase tracking-wider text-fg/40 lg:grid">
              <span>Key</span>
              <span>Value</span>
              <span className="text-right">Actions</span>
            </div>
          ) : null}
          {filteredEnv.length === 0 ? (
            <div className="px-5 py-12 text-center font-mono text-xs text-fg/40">
              {envSearch ? "No matching variables" : "No variables configured"}
            </div>
          ) : (
            filteredEnv.map((item) => (
              <EnvVarRow
                key={item.id}
                item={item}
                busy={busy === "env"}
                suggestions={suggestions}
                onSave={async (key, value) => {
                  await doAction("env", async () => {
                    if (key !== item.key) {
                      await api.deleteEnv(serviceId, item.id);
                    }
                    await api.upsertEnv(serviceId, { key, value });
                  });
                }}
                onDelete={async () => {
                  await doAction("env", async () => {
                    await api.deleteEnv(serviceId, item.id);
                  });
                }}
              />
            ))
          )}
        </div>
      ) : null}

      <EnvPasteDialog
        open={pasteOpen}
        busy={busy === "env"}
        onClose={() => setPasteOpen(false)}
        onImport={populateEnvEntries}
      />
    </section>
  );
}

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { type FormEvent, useEffect, useState } from "react";
import { AppIcon, FieldLabel, FormInput, btn } from "../../components/ui/primitives";

export function CreateProjectModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (payload: {
    name: string;
    description?: string;
  }) => Promise<void>;
}) {
  const [form, setForm] = useState({ name: "", description: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) return;
    setForm({ name: "", description: "" });
    setBusy(false);
    setError("");
  }, [open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onCreate({
        name: form.name,
        description: form.description || undefined,
      });
      onClose();
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Could not create project",
      );
      setBusy(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg/80 p-4">
      <div className="mx-auto flex min-h-full items-center justify-center">
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-project-title"
          className="w-full max-w-xl border border-fg/20 bg-bg p-6 text-fg sm:p-8"
        >
          <header className="flex items-center justify-between gap-4 border-b border-fg/10 pb-4">
            <h2
              id="create-project-title"
              className="text-lg font-bold tracking-tight text-fg"
            >
              Create New Project
            </h2>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="text-fg/40 transition hover:text-fg disabled:opacity-40"
              aria-label="Close"
            >
              <AppIcon icon={Cancel01Icon} size={18} />
            </button>
          </header>

          <form onSubmit={submit} className="mt-6 space-y-5">
            <div>
              <FieldLabel>Project name</FieldLabel>
              <FormInput
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Acme platform"
                autoComplete="off"
                required
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <FieldLabel>Description</FieldLabel>
                <span className="font-mono text-[9px] uppercase tracking-wider text-fg/30">
                  Optional
                </span>
              </div>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Internal tools and APIs"
                rows={3}
                className="w-full border border-fg/20 bg-transparent px-3 py-2 text-sm text-fg outline-none transition placeholder:text-fg/30 focus:border-accent"
              />
            </div>

            {error ? (
              <div
                role="alert"
                className="border-l-2 border-fg bg-fg/5 px-3 py-2 text-xs font-mono text-fg"
              >
                ✕ {error}
              </div>
            ) : null}

            <div className="flex justify-end gap-3 border-t border-fg/10 pt-4">
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
                disabled={busy}
                className={btn("primary")}
              >
                {busy ? "Creating…" : "Create Project"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

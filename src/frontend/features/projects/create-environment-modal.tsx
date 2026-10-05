import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { SettingsDialog } from "../settings/settings-dialog";
import { FieldLabel, FormInput, btn } from "../../components/ui/primitives";

export function CreateEnvironmentModal({
  open,
  onClose,
  onCreate
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      setName("");
      setError("");
      setSaving(false);
    }
  }, [open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError("");
    try {
      await onCreate(name.trim());
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Could not create environment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SettingsDialog
      open={open}
      title="New environment"
      width="max-w-md"
      onClose={() => {
        if (!saving) onClose();
      }}
    >
      <form onSubmit={(event) => void submit(event)} className="space-y-4">
        <p className="text-sm text-fg/60">
          Create another environment to organize this project's services.
        </p>

        <div>
          <FieldLabel>Environment name</FieldLabel>
          <FormInput
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Staging"
            autoComplete="off"
            autoFocus
            maxLength={50}
            required
          />
        </div>

        {error ? (
          <div role="alert" className="border-l-2 border-fg bg-fg/5 px-3 py-2 text-xs font-mono text-fg">
            ✕ {error}
          </div>
        ) : null}

        <div className="flex justify-end gap-3 border-t border-fg/10 pt-4">
          <button
            type="button"
            className={btn("ghost")}
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={btn("primary")}
            disabled={saving || !name.trim()}
          >
            {saving ? "Creating…" : "Create Environment"}
          </button>
        </div>
      </form>
    </SettingsDialog>
  );
}

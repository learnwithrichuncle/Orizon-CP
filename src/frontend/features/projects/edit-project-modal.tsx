import type { FormEvent } from "react";
import { SettingsDialog } from "../settings/settings-dialog";
import { FieldLabel, FormInput, btn } from "../../components/ui/primitives";

export function EditProjectModal({
  open,
  name,
  description,
  projectSlug,
  saving,
  error,
  onNameChange,
  onDescriptionChange,
  onClose,
  onSave
}: {
  open: boolean;
  name: string;
  description: string;
  projectSlug: string;
  saving: boolean;
  error: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave();
  }

  return (
    <SettingsDialog
      open={open}
      title="Edit project"
      width="max-w-lg"
      onClose={() => {
        if (!saving) onClose();
      }}
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-fg/40">
            {projectSlug}
          </span>
          <p className="mt-1 text-sm text-fg/60">
            Update the name and description shown across this project.
          </p>
        </div>

        <div>
          <FieldLabel>Project name</FieldLabel>
          <FormInput
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            autoComplete="off"
            autoFocus
            required
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
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="What is this project for?"
            rows={3}
            className="w-full border border-fg/20 bg-transparent px-3 py-2 text-sm text-fg outline-none transition placeholder:text-fg/30 focus:border-accent"
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
            {saving ? "Saving…" : "Save Project"}
          </button>
        </div>
      </form>
    </SettingsDialog>
  );
}

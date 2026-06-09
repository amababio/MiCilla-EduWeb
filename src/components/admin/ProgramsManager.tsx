"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createProgramFormAction,
  deleteProgramAction,
  moveProgramAction,
  setProgramActiveAction,
  updateProgramFormAction,
  type ProgramAdminItem,
  type ProgramFormState,
} from "@/lib/actions/programs";

type ProgramsManagerProps = {
  programs: ProgramAdminItem[];
};

const initialFormState: ProgramFormState = { success: false };

export function ProgramsManager({ programs }: ProgramsManagerProps) {
  const router = useRouter();
  const [createState, createAction, isCreating] = useActionState(
    createProgramFormAction,
    initialFormState,
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (createState.message) {
      router.refresh();
    }
  }, [createState.message, router]);

  function refreshPage() {
    router.refresh();
  }

  function runAction(action: () => Promise<{ success: boolean; error?: string }>) {
    setActionError("");
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        setActionError(result.error ?? "Something went wrong.");
        return;
      }
      setEditingId(null);
      refreshPage();
    });
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Add a Program</h2>
        <p className="mt-1 text-sm text-slate-600">
          Add a school level such as Crèche, Nursery, Primary, or JHS.
        </p>

        <form action={createAction} className="mt-6 space-y-5">
          <ProgramFields idPrefix="new" />
          {createState.error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {createState.error}
            </p>
          ) : null}
          {createState.message ? (
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {createState.message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-600 disabled:opacity-60"
          >
            {isCreating ? "Adding..." : "Add Program"}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Your Programs</h2>
          <p className="mt-1 text-sm text-slate-600">
            Active programs appear on your public website. Hidden programs stay saved
            here but are not shown to parents.
          </p>
        </div>

        {actionError ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </p>
        ) : null}

        {programs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-mauve-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-600">
              No programs yet. Add your first program above.
            </p>
          </div>
        ) : (
          programs.map((program, index) => (
            <ProgramCard
              key={program.id}
              program={program}
              isFirst={index === 0}
              isLast={index === programs.length - 1}
              isEditing={editingId === program.id}
              isPending={isPending}
              onEdit={() => setEditingId(program.id)}
              onCancelEdit={() => setEditingId(null)}
              onDelete={() => {
                if (
                  !window.confirm(
                    `Remove "${program.name}" from your programs list?`,
                  )
                ) {
                  return;
                }
                runAction(() => deleteProgramAction(program.id));
              }}
              onToggleActive={() =>
                runAction(() =>
                  setProgramActiveAction(program.id, !program.isActive),
                )
              }
              onMoveUp={() =>
                runAction(() => moveProgramAction(program.id, "up"))
              }
              onMoveDown={() =>
                runAction(() => moveProgramAction(program.id, "down"))
              }
              onSaved={() => {
                setEditingId(null);
                refreshPage();
              }}
            />
          ))
        )}
      </section>
    </div>
  );
}

type ProgramCardProps = {
  program: ProgramAdminItem;
  isFirst: boolean;
  isLast: boolean;
  isEditing: boolean;
  isPending: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSaved: () => void;
};

function ProgramCard({
  program,
  isFirst,
  isLast,
  isEditing,
  isPending,
  onEdit,
  onCancelEdit,
  onDelete,
  onToggleActive,
  onMoveUp,
  onMoveDown,
  onSaved,
}: ProgramCardProps) {
  const [editState, editAction, isSaving] = useActionState(
    updateProgramFormAction,
    initialFormState,
  );

  useEffect(() => {
    if (editState.message) {
      onSaved();
    }
  }, [editState.message, onSaved]);

  if (isEditing) {
    return (
      <article className="rounded-2xl border border-mauve-300 bg-white p-6 shadow-sm">
        <form action={editAction} className="space-y-5">
          <input type="hidden" name="programId" value={program.id} />
          <ProgramFields
            idPrefix={program.id}
            defaultName={program.name}
            defaultDescription={program.description}
            defaultImageUrl={program.imageUrl ?? ""}
          />
          {editState.error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {editState.error}
            </p>
          ) : null}
          {editState.message ? (
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {editState.message}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-full bg-mauve-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-mauve-600 disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-full border border-mauve-300 px-5 py-2.5 text-sm font-semibold text-mauve-700 transition hover:bg-mauve-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{program.name}</h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                program.isActive
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {program.isActive ? "On website" : "Hidden"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {program.description}
          </p>
          {program.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={program.imageUrl}
              alt={`${program.name} photo`}
              className="mt-4 h-28 w-full max-w-xs rounded-xl border border-mauve-200 object-cover"
            />
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 sm:max-w-xs sm:justify-end">
          <ActionButton onClick={onMoveUp} disabled={isPending || isFirst}>
            Move up
          </ActionButton>
          <ActionButton onClick={onMoveDown} disabled={isPending || isLast}>
            Move down
          </ActionButton>
          <ActionButton onClick={onEdit} disabled={isPending}>
            Edit
          </ActionButton>
          <ActionButton onClick={onToggleActive} disabled={isPending}>
            {program.isActive ? "Hide" : "Show"}
          </ActionButton>
          <ActionButton
            onClick={onDelete}
            disabled={isPending}
            variant="danger"
          >
            Remove
          </ActionButton>
        </div>
      </div>
    </article>
  );
}

type ProgramFieldsProps = {
  idPrefix: string;
  defaultName?: string;
  defaultDescription?: string;
  defaultImageUrl?: string;
};

function ProgramFields({
  idPrefix,
  defaultName = "",
  defaultDescription = "",
  defaultImageUrl = "",
}: ProgramFieldsProps) {
  return (
    <>
      <Field
        id={`${idPrefix}-name`}
        label="Program Name"
        name="name"
        defaultValue={defaultName}
        placeholder="e.g. Primary"
        required
      />
      <TextAreaField
        id={`${idPrefix}-description`}
        label="Description"
        name="description"
        defaultValue={defaultDescription}
        required
        rows={4}
      />
      <Field
        id={`${idPrefix}-imageUrl`}
        label="Photo Link"
        name="imageUrl"
        defaultValue={defaultImageUrl}
        placeholder="https://example.com/photo.jpg"
        hint="Optional. Paste a photo link to show on your public website."
      />
    </>
  );
}

type ActionButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
};

function ActionButton({
  children,
  onClick,
  disabled,
  variant = "default",
}: ActionButtonProps) {
  const classes =
    variant === "danger"
      ? "border-red-200 text-red-700 hover:bg-red-50"
      : "border-mauve-300 text-mauve-700 hover:bg-mauve-50";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${classes}`}
    >
      {children}
    </button>
  );
}

type FieldProps = {
  id: string;
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
};

function Field({
  id,
  label,
  name,
  defaultValue,
  placeholder,
  required,
  hint,
}: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-mauve-200 px-4 py-3 text-sm text-slate-900 outline-none ring-mauve-300 focus:ring-2"
      />
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

type TextAreaFieldProps = FieldProps & {
  rows?: number;
};

function TextAreaField({
  id,
  label,
  name,
  defaultValue,
  required,
  rows = 4,
}: TextAreaFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={rows}
        className="mt-2 w-full rounded-xl border border-mauve-200 px-4 py-3 text-sm text-slate-900 outline-none ring-mauve-300 focus:ring-2"
      />
    </div>
  );
}

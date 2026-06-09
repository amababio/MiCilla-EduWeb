"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createDownloadFormAction,
  deleteDownloadAction,
  moveDownloadAction,
  setDownloadPublishedAction,
  updateDownloadFormAction,
  type DownloadAdminItem,
  type DownloadFormState,
} from "@/lib/actions/downloads";
import {
  downloadCategories,
  getDownloadCategoryLabel,
} from "@/lib/downloads";

type DownloadsManagerProps = {
  downloads: DownloadAdminItem[];
};

const initialFormState: DownloadFormState = { success: false };

export function DownloadsManager({ downloads }: DownloadsManagerProps) {
  const router = useRouter();
  const [createState, createAction, isCreating] = useActionState(
    createDownloadFormAction,
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
        <h2 className="text-lg font-semibold text-slate-900">Add a File</h2>
        <p className="mt-1 text-sm text-slate-600">
          Paste a link to admission forms, prospectus files, book lists, fee
          notices, or other school documents. File upload will come in a later
          phase.
        </p>

        <form action={createAction} className="mt-6 space-y-5">
          <DownloadFields idPrefix="new" defaultPublished />
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
            {isCreating ? "Adding..." : "Add File"}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Your Files</h2>
          <p className="mt-1 text-sm text-slate-600">
            Published files appear on your public website. Drafts stay saved here
            until you publish them.
          </p>
        </div>

        {actionError ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </p>
        ) : null}

        {downloads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-mauve-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-600">
              No files yet. Add your first download above.
            </p>
          </div>
        ) : (
          downloads.map((download, index) => (
            <DownloadCard
              key={download.id}
              download={download}
              isFirst={index === 0}
              isLast={index === downloads.length - 1}
              isEditing={editingId === download.id}
              isPending={isPending}
              onEdit={() => setEditingId(download.id)}
              onCancelEdit={() => setEditingId(null)}
              onDelete={() => {
                if (
                  !window.confirm(
                    `Remove "${download.title}" from your files list?`,
                  )
                ) {
                  return;
                }
                runAction(() => deleteDownloadAction(download.id));
              }}
              onTogglePublished={() =>
                runAction(() =>
                  setDownloadPublishedAction(download.id, !download.isPublished),
                )
              }
              onMoveUp={() =>
                runAction(() => moveDownloadAction(download.id, "up"))
              }
              onMoveDown={() =>
                runAction(() => moveDownloadAction(download.id, "down"))
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

type DownloadCardProps = {
  download: DownloadAdminItem;
  isFirst: boolean;
  isLast: boolean;
  isEditing: boolean;
  isPending: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onTogglePublished: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSaved: () => void;
};

function DownloadCard({
  download,
  isFirst,
  isLast,
  isEditing,
  isPending,
  onEdit,
  onCancelEdit,
  onDelete,
  onTogglePublished,
  onMoveUp,
  onMoveDown,
  onSaved,
}: DownloadCardProps) {
  const [editState, editAction, isSaving] = useActionState(
    updateDownloadFormAction,
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
          <input type="hidden" name="downloadId" value={download.id} />
          <DownloadFields
            idPrefix={download.id}
            defaultTitle={download.title}
            defaultDescription={download.description}
            defaultCategory={download.category}
            defaultFileUrl={download.fileUrl ?? ""}
            defaultPublished={download.isPublished}
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
            <h3 className="text-lg font-semibold text-slate-900">
              {download.title}
            </h3>
            <span className="rounded-full bg-mauve-100 px-2.5 py-0.5 text-xs font-semibold text-mauve-800">
              {getDownloadCategoryLabel(download.category)}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                download.isPublished
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {download.isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {download.description}
          </p>
          {download.fileUrl ? (
            <a
              href={download.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm font-medium text-mauve-700 underline-offset-2 hover:underline"
            >
              {download.fileUrl}
            </a>
          ) : (
            <p className="mt-3 text-xs text-slate-500">No file link yet.</p>
          )}
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
          <ActionButton onClick={onTogglePublished} disabled={isPending}>
            {download.isPublished ? "Unpublish" : "Publish"}
          </ActionButton>
          <ActionButton onClick={onDelete} disabled={isPending} variant="danger">
            Remove
          </ActionButton>
        </div>
      </div>
    </article>
  );
}

type DownloadFieldsProps = {
  idPrefix: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultCategory?: string;
  defaultFileUrl?: string;
  defaultPublished?: boolean;
};

function DownloadFields({
  idPrefix,
  defaultTitle = "",
  defaultDescription = "",
  defaultCategory = "general",
  defaultFileUrl = "",
  defaultPublished = false,
}: DownloadFieldsProps) {
  return (
    <>
      <Field
        id={`${idPrefix}-title`}
        label="Title"
        name="title"
        defaultValue={defaultTitle}
        placeholder="e.g. Admission Form"
        required
      />
      <TextAreaField
        id={`${idPrefix}-description`}
        label="Description"
        name="description"
        defaultValue={defaultDescription}
        required
        rows={3}
      />
      <SelectField
        id={`${idPrefix}-category`}
        label="File Type"
        name="category"
        defaultValue={defaultCategory}
        options={downloadCategories.map((category) => ({
          value: category.value,
          label: category.label,
        }))}
      />
      <Field
        id={`${idPrefix}-fileUrl`}
        label="File Link"
        name="fileUrl"
        defaultValue={defaultFileUrl}
        placeholder="https://example.com/admission-form.pdf"
        hint="Optional. Paste a link to the document. Parents can download it from your public website."
      />
      <label className="flex items-center gap-3 text-sm text-slate-700">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={defaultPublished}
          className="h-4 w-4 rounded border-mauve-300 text-mauve-500 focus:ring-mauve-400"
        />
        Publish on public website
      </label>
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
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-mauve-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-mauve-400 focus:ring-2 focus:ring-mauve-200"
      />
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

type TextAreaFieldProps = {
  id: string;
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
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
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={rows}
        className="mt-2 w-full rounded-xl border border-mauve-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-mauve-400 focus:ring-2 focus:ring-mauve-200"
      />
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
};

function SelectField({
  id,
  label,
  name,
  defaultValue,
  options,
}: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border border-mauve-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-mauve-400 focus:ring-2 focus:ring-mauve-200"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

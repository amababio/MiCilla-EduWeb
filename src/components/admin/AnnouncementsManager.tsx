"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createAnnouncementFormAction,
  deleteAnnouncementAction,
  moveAnnouncementAction,
  setAnnouncementPublishedAction,
  updateAnnouncementFormAction,
  type AnnouncementAdminItem,
  type AnnouncementFormState,
} from "@/lib/actions/announcements";
import {
  announcementCategories,
  getAnnouncementCategoryLabel,
} from "@/lib/announcements";

type AnnouncementsManagerProps = {
  announcements: AnnouncementAdminItem[];
};

const initialFormState: AnnouncementFormState = { success: false };

export function AnnouncementsManager({
  announcements,
}: AnnouncementsManagerProps) {
  const router = useRouter();
  const [createState, createAction, isCreating] = useActionState(
    createAnnouncementFormAction,
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
        <h2 className="text-lg font-semibold text-slate-900">
          Add an Announcement
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Share admissions updates, events, holidays, PTA notices, and other
          school messages with parents.
        </p>

        <form action={createAction} className="mt-6 space-y-5">
          <AnnouncementFields idPrefix="new" defaultPublished />
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
            {isCreating ? "Adding..." : "Add Announcement"}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Your Announcements
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Published announcements appear on your public website. Drafts stay
            saved here until you publish them.
          </p>
        </div>

        {actionError ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </p>
        ) : null}

        {announcements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-mauve-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-600">
              No announcements yet. Add your first notice above.
            </p>
          </div>
        ) : (
          announcements.map((announcement, index) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              isFirst={index === 0}
              isLast={index === announcements.length - 1}
              isEditing={editingId === announcement.id}
              isPending={isPending}
              onEdit={() => setEditingId(announcement.id)}
              onCancelEdit={() => setEditingId(null)}
              onDelete={() => {
                if (
                  !window.confirm(
                    `Remove "${announcement.title}" from your announcements?`,
                  )
                ) {
                  return;
                }
                runAction(() => deleteAnnouncementAction(announcement.id));
              }}
              onTogglePublished={() =>
                runAction(() =>
                  setAnnouncementPublishedAction(
                    announcement.id,
                    !announcement.isPublished,
                  ),
                )
              }
              onMoveUp={() =>
                runAction(() => moveAnnouncementAction(announcement.id, "up"))
              }
              onMoveDown={() =>
                runAction(() => moveAnnouncementAction(announcement.id, "down"))
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

type AnnouncementCardProps = {
  announcement: AnnouncementAdminItem;
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

function AnnouncementCard({
  announcement,
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
}: AnnouncementCardProps) {
  const [editState, editAction, isSaving] = useActionState(
    updateAnnouncementFormAction,
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
          <input
            type="hidden"
            name="announcementId"
            value={announcement.id}
          />
          <AnnouncementFields
            idPrefix={announcement.id}
            defaultTitle={announcement.title}
            defaultCategory={announcement.category}
            defaultMessage={announcement.message}
            defaultDisplayDate={announcement.displayDate}
            defaultPublished={announcement.isPublished}
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
              {announcement.title}
            </h3>
            <span className="rounded-full bg-mauve-100 px-2.5 py-0.5 text-xs font-semibold text-mauve-800">
              {getAnnouncementCategoryLabel(announcement.category)}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                announcement.isPublished
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {announcement.isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">{announcement.displayDate}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {announcement.message}
          </p>
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
            {announcement.isPublished ? "Unpublish" : "Publish"}
          </ActionButton>
          <ActionButton onClick={onDelete} disabled={isPending} variant="danger">
            Remove
          </ActionButton>
        </div>
      </div>
    </article>
  );
}

type AnnouncementFieldsProps = {
  idPrefix: string;
  defaultTitle?: string;
  defaultCategory?: string;
  defaultMessage?: string;
  defaultDisplayDate?: string;
  defaultPublished?: boolean;
};

function AnnouncementFields({
  idPrefix,
  defaultTitle = "",
  defaultCategory = "general",
  defaultMessage = "",
  defaultDisplayDate = "",
  defaultPublished = false,
}: AnnouncementFieldsProps) {
  return (
    <>
      <Field
        id={`${idPrefix}-title`}
        label="Title"
        name="title"
        defaultValue={defaultTitle}
        placeholder="e.g. Admissions open for 2026/2027"
        required
      />
      <SelectField
        id={`${idPrefix}-category`}
        label="Category"
        name="category"
        defaultValue={defaultCategory}
        options={announcementCategories.map((category) => ({
          value: category.value,
          label: category.label,
        }))}
      />
      <Field
        id={`${idPrefix}-displayDate`}
        label="Display Date"
        name="displayDate"
        defaultValue={defaultDisplayDate}
        placeholder="e.g. March 2026"
        required
        hint="Shown on the public website as the notice date."
      />
      <TextAreaField
        id={`${idPrefix}-message`}
        label="Message"
        name="message"
        defaultValue={defaultMessage}
        required
        rows={4}
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

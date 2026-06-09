"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createAchievementFormAction,
  deleteAchievementAction,
  moveAchievementAction,
  saveAchievementSectionFormAction,
  setAchievementPublishedAction,
  updateAchievementFormAction,
  type AchievementAdminItem,
  type AchievementFormState,
  type AchievementSectionData,
} from "@/lib/actions/achievements";
import {
  achievementCategories,
  achievementPrivacyOptions,
  getCategoryLabel,
  getPrivacyLabel,
} from "@/lib/achievements";

type AchievementsManagerProps = {
  achievements: AchievementAdminItem[];
  section: AchievementSectionData;
};

const initialFormState: AchievementFormState = { success: false };

export function AchievementsManager({
  achievements,
  section,
}: AchievementsManagerProps) {
  const router = useRouter();
  const [sectionState, sectionAction, isSavingSection] = useActionState(
    saveAchievementSectionFormAction,
    initialFormState,
  );
  const [createState, createAction, isCreating] = useActionState(
    createAchievementFormAction,
    initialFormState,
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (sectionState.message || createState.message) {
      router.refresh();
    }
  }, [sectionState.message, createState.message, router]);

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
        <h2 className="text-lg font-semibold text-slate-900">Section Text</h2>
        <p className="mt-1 text-sm text-slate-600">
          Update the subtitle and privacy note shown above and below your public
          achievements section.
        </p>

        <form action={sectionAction} className="mt-6 space-y-5">
          <Field
            id="section-subtitle"
            label="Section Subtitle"
            name="achievementsSubtitle"
            defaultValue={section.achievementsSubtitle}
            required
          />
          <TextAreaField
            id="section-note"
            label="Privacy Note"
            name="achievementsNote"
            defaultValue={section.achievementsNote}
            required
            rows={3}
            hint="Explain how student names are handled on your public website."
          />
          {sectionState.error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {sectionState.error}
            </p>
          ) : null}
          {sectionState.message ? (
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {sectionState.message}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSavingSection}
            className="rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-600 disabled:opacity-60"
          >
            {isSavingSection ? "Saving..." : "Save Section Text"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Add an Achievement</h2>
        <p className="mt-1 text-sm text-slate-600">
          Add BECE results, competitions, awards, student projects, or teacher
          innovations. Choose privacy options carefully before publishing.
        </p>

        <form action={createAction} className="mt-6 space-y-5">
          <AchievementFields idPrefix="new" defaultPublished />
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
            {isCreating ? "Adding..." : "Add Achievement"}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Your Achievements
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Published achievements appear on your public website. Drafts stay
            saved here until you publish them.
          </p>
        </div>

        {actionError ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </p>
        ) : null}

        {achievements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-mauve-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-600">
              No achievements yet. Add your first entry above.
            </p>
          </div>
        ) : (
          achievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              isFirst={index === 0}
              isLast={index === achievements.length - 1}
              isEditing={editingId === achievement.id}
              isPending={isPending}
              onEdit={() => setEditingId(achievement.id)}
              onCancelEdit={() => setEditingId(null)}
              onDelete={() => {
                if (
                  !window.confirm(
                    `Remove "${achievement.title}" from your achievements list?`,
                  )
                ) {
                  return;
                }
                runAction(() => deleteAchievementAction(achievement.id));
              }}
              onTogglePublished={() =>
                runAction(() =>
                  setAchievementPublishedAction(
                    achievement.id,
                    !achievement.isPublished,
                  ),
                )
              }
              onMoveUp={() =>
                runAction(() => moveAchievementAction(achievement.id, "up"))
              }
              onMoveDown={() =>
                runAction(() => moveAchievementAction(achievement.id, "down"))
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

type AchievementCardProps = {
  achievement: AchievementAdminItem;
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

function AchievementCard({
  achievement,
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
}: AchievementCardProps) {
  const [editState, editAction, isSaving] = useActionState(
    updateAchievementFormAction,
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
          <input type="hidden" name="achievementId" value={achievement.id} />
          <AchievementFields
            idPrefix={achievement.id}
            defaultTitle={achievement.title}
            defaultDescription={achievement.description}
            defaultCategory={achievement.category}
            defaultPrivacyDisplay={achievement.privacyDisplay}
            defaultSubjectName={achievement.subjectName ?? ""}
            defaultSubjectClass={achievement.subjectClass ?? ""}
            defaultPublished={achievement.isPublished}
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
              {achievement.title}
            </h3>
            <span className="rounded-full bg-mauve-100 px-2.5 py-0.5 text-xs font-semibold text-mauve-800">
              {getCategoryLabel(achievement.category)}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                achievement.isPublished
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {achievement.isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {achievement.description}
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Privacy: {getPrivacyLabel(achievement.privacyDisplay)}
            {achievement.subjectClass
              ? ` · Class: ${achievement.subjectClass}`
              : ""}
            {achievement.subjectName
              ? ` · Stored name: ${achievement.subjectName}`
              : ""}
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
            {achievement.isPublished ? "Unpublish" : "Publish"}
          </ActionButton>
          <ActionButton onClick={onDelete} disabled={isPending} variant="danger">
            Remove
          </ActionButton>
        </div>
      </div>
    </article>
  );
}

type AchievementFieldsProps = {
  idPrefix: string;
  defaultTitle?: string;
  defaultDescription?: string;
  defaultCategory?: string;
  defaultPrivacyDisplay?: string;
  defaultSubjectName?: string;
  defaultSubjectClass?: string;
  defaultPublished?: boolean;
};

function AchievementFields({
  idPrefix,
  defaultTitle = "",
  defaultDescription = "",
  defaultCategory = "bece",
  defaultPrivacyDisplay = "hide",
  defaultSubjectName = "",
  defaultSubjectClass = "",
  defaultPublished = false,
}: AchievementFieldsProps) {
  return (
    <>
      <Field
        id={`${idPrefix}-title`}
        label="Title"
        name="title"
        defaultValue={defaultTitle}
        placeholder="e.g. District Quiz Champions"
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
      <SelectField
        id={`${idPrefix}-category`}
        label="Achievement Type"
        name="category"
        defaultValue={defaultCategory}
        options={achievementCategories.map((category) => ({
          value: category.value,
          label: category.label,
        }))}
      />
      <SelectField
        id={`${idPrefix}-privacyDisplay`}
        label="Privacy Display"
        name="privacyDisplay"
        defaultValue={defaultPrivacyDisplay}
        options={achievementPrivacyOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))}
        hint="Student full names are hidden by default unless you choose otherwise."
      />
      <Field
        id={`${idPrefix}-subjectName`}
        label="Student Name"
        name="subjectName"
        defaultValue={defaultSubjectName}
        placeholder="e.g. Ama Mensah"
        hint="Stored securely. Only the selected privacy option is shown publicly."
      />
      <Field
        id={`${idPrefix}-subjectClass`}
        label="Class"
        name="subjectClass"
        defaultValue={defaultSubjectClass}
        placeholder="e.g. JHS 2"
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
  hint?: string;
};

function TextAreaField({
  id,
  label,
  name,
  defaultValue,
  required,
  rows = 4,
  hint,
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
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  hint?: string;
};

function SelectField({
  id,
  label,
  name,
  defaultValue,
  options,
  hint,
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
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

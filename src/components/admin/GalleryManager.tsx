"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createGalleryPhotoFormAction,
  deleteGalleryPhotoAction,
  moveGalleryPhotoAction,
  setGalleryPhotoFeaturedAction,
  updateGalleryPhotoFormAction,
  type GalleryPhotoAdminItem,
  type GalleryFormState,
} from "@/lib/actions/gallery";
import { galleryAccentPresets, getAccentLabel } from "@/lib/gallery";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

type GalleryManagerProps = {
  photos: GalleryPhotoAdminItem[];
};

const initialFormState: GalleryFormState = { success: false };

export function GalleryManager({ photos }: GalleryManagerProps) {
  const router = useRouter();
  const [createState, createAction, isCreating] = useActionState(
    createGalleryPhotoFormAction,
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
        <h2 className="text-lg font-semibold text-slate-900">Add a Photo</h2>
        <p className="mt-1 text-sm text-slate-600">
          Upload a photo from your phone or computer. You can also save a colored
          placeholder until a real photo is ready.
        </p>

        <form action={createAction} className="mt-6 space-y-5">
          <PhotoFields idPrefix="new" defaultFeatured />
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
            {isCreating ? "Adding..." : "Add Photo"}
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Your Photos</h2>
          <p className="mt-1 text-sm text-slate-600">
            Featured photos appear in the homepage gallery preview. Others stay
            saved here for later.
          </p>
        </div>

        {actionError ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </p>
        ) : null}

        {photos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-mauve-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-600">
              No photos yet. Add your first photo above.
            </p>
          </div>
        ) : (
          photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              isFirst={index === 0}
              isLast={index === photos.length - 1}
              isEditing={editingId === photo.id}
              isPending={isPending}
              onEdit={() => setEditingId(photo.id)}
              onCancelEdit={() => setEditingId(null)}
              onDelete={() => {
                if (
                  !window.confirm(`Remove "${photo.title}" from your photos?`)
                ) {
                  return;
                }
                runAction(() => deleteGalleryPhotoAction(photo.id));
              }}
              onToggleFeatured={() =>
                runAction(() =>
                  setGalleryPhotoFeaturedAction(photo.id, !photo.isFeatured),
                )
              }
              onMoveUp={() =>
                runAction(() => moveGalleryPhotoAction(photo.id, "up"))
              }
              onMoveDown={() =>
                runAction(() => moveGalleryPhotoAction(photo.id, "down"))
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

type PhotoCardProps = {
  photo: GalleryPhotoAdminItem;
  isFirst: boolean;
  isLast: boolean;
  isEditing: boolean;
  isPending: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSaved: () => void;
};

function PhotoCard({
  photo,
  isFirst,
  isLast,
  isEditing,
  isPending,
  onEdit,
  onCancelEdit,
  onDelete,
  onToggleFeatured,
  onMoveUp,
  onMoveDown,
  onSaved,
}: PhotoCardProps) {
  const [editState, editAction, isSaving] = useActionState(
    updateGalleryPhotoFormAction,
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
          <input type="hidden" name="photoId" value={photo.id} />
          <PhotoFields
            idPrefix={photo.id}
            defaultTitle={photo.title}
            defaultCategory={photo.category}
            currentImageUrl={photo.imageUrl}
            currentImageAlt={photo.title}
            defaultAccentClass={photo.accentClass}
            defaultFeatured={photo.isFeatured}
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
    <article className="overflow-hidden rounded-2xl border border-mauve-200 bg-white shadow-sm">
      <PhotoPreview photo={photo} />
      <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{photo.title}</h3>
            <span className="rounded-full bg-mauve-100 px-2.5 py-0.5 text-xs font-semibold text-mauve-800">
              {photo.category}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                photo.isFeatured
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {photo.isFeatured ? "On homepage" : "Saved only"}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Placeholder color: {getAccentLabel(photo.accentClass)}
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
          <ActionButton onClick={onToggleFeatured} disabled={isPending}>
            {photo.isFeatured ? "Unfeature" : "Feature"}
          </ActionButton>
          <ActionButton onClick={onDelete} disabled={isPending} variant="danger">
            Remove
          </ActionButton>
        </div>
      </div>
    </article>
  );
}

function PhotoPreview({ photo }: { photo: GalleryPhotoAdminItem }) {
  if (photo.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo.imageUrl}
        alt={photo.title}
        className="aspect-[4/3] w-full object-cover"
      />
    );
  }

  return (
    <div
      className={`flex aspect-[4/3] items-end bg-gradient-to-br ${photo.accentClass} p-5`}
    >
      <div className="rounded-xl bg-black/20 px-3 py-2 backdrop-blur-sm">
        <p className="text-sm font-semibold text-white">{photo.title}</p>
        <p className="text-xs text-white/80">Photo placeholder</p>
      </div>
    </div>
  );
}

type PhotoFieldsProps = {
  idPrefix: string;
  defaultTitle?: string;
  defaultCategory?: string;
  currentImageUrl?: string | null;
  currentImageAlt?: string;
  defaultAccentClass?: string;
  defaultFeatured?: boolean;
};

function PhotoFields({
  idPrefix,
  defaultTitle = "",
  defaultCategory = "",
  currentImageUrl = null,
  currentImageAlt = "Current photo",
  defaultAccentClass = galleryAccentPresets[1].value,
  defaultFeatured = false,
}: PhotoFieldsProps) {
  return (
    <>
      <Field
        id={`${idPrefix}-title`}
        label="Photo Title"
        name="title"
        defaultValue={defaultTitle}
        placeholder="e.g. Sports Day"
        required
      />
      <Field
        id={`${idPrefix}-category`}
        label="Category"
        name="category"
        defaultValue={defaultCategory}
        placeholder="e.g. Sports, Events, Academics"
        required
      />
      <ImageUploadField
        id={`${idPrefix}-photo`}
        currentImageUrl={currentImageUrl}
        currentImageAlt={currentImageAlt}
      />
      <SelectField
        id={`${idPrefix}-accentClass`}
        label="Placeholder Color"
        name="accentClass"
        defaultValue={defaultAccentClass}
        options={galleryAccentPresets.map((preset) => ({
          value: preset.value,
          label: preset.label,
        }))}
        hint="Used when no photo is uploaded."
      />
      <label className="flex items-center gap-3 text-sm text-slate-700">
        <input
          type="checkbox"
          name="isFeatured"
          defaultChecked={defaultFeatured}
          className="h-4 w-4 rounded border-mauve-300 text-mauve-600 focus:ring-mauve-300"
        />
        Show this photo on the public homepage gallery
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
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-xl border border-mauve-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-mauve-300 focus:ring-2"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

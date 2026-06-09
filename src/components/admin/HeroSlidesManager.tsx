"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createHeroSlideFormAction,
  deleteHeroSlideAction,
  moveHeroSlideAction,
  setHeroSlideActiveAction,
  updateHeroSlideFormAction,
  type HeroSlideAdminItem,
  type HeroSlideFormState,
} from "@/lib/actions/hero-slides";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

type HeroSlidesManagerProps = {
  slides: HeroSlideAdminItem[];
};

const initialFormState: HeroSlideFormState = { success: false };

export function HeroSlidesManager({ slides }: HeroSlidesManagerProps) {
  const router = useRouter();
  const [createState, createAction, isCreating] = useActionState(
    createHeroSlideFormAction,
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
    <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Hero Photo Carousel</h2>
      <p className="mt-1 text-sm text-slate-600">
        Upload photos for the homepage hero card. They rotate automatically on the
        public site. Your school logo stays visible on top of the carousel.
      </p>

      <form action={createAction} className="mt-6 space-y-4">
        <Field
          id="new-hero-title"
          label="Caption (optional)"
          name="title"
          placeholder="e.g. Sports Day 2026"
        />
        <ImageUploadField
          id="new-hero-photo"
          label="Upload hero photo"
          optional={false}
          hint="Required. JPG, PNG, WebP, GIF, BMP, or HEIC up to 10 MB."
        />
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
          className="rounded-full bg-mauve-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-mauve-600 disabled:opacity-60"
        >
          {isCreating ? "Uploading..." : "Add Hero Photo"}
        </button>
      </form>

      <div className="mt-8 space-y-4">
        <h3 className="text-sm font-semibold text-slate-900">Carousel photos</h3>

        {actionError ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </p>
        ) : null}

        {slides.length === 0 ? (
          <p className="rounded-xl border border-dashed border-mauve-200 bg-mauve-50/50 px-4 py-6 text-sm text-slate-600">
            No hero photos yet. The homepage will show your school logo until you
            upload carousel photos here.
          </p>
        ) : (
          slides.map((slide, index) => (
            <SlideRow
              key={slide.id}
              slide={slide}
              isFirst={index === 0}
              isLast={index === slides.length - 1}
              isEditing={editingId === slide.id}
              isPending={isPending}
              onEdit={() => setEditingId(slide.id)}
              onCancelEdit={() => setEditingId(null)}
              onDelete={() => {
                if (!window.confirm("Remove this photo from the hero carousel?")) {
                  return;
                }
                runAction(() => deleteHeroSlideAction(slide.id));
              }}
              onToggleActive={() =>
                runAction(() => setHeroSlideActiveAction(slide.id, !slide.isActive))
              }
              onMoveUp={() => runAction(() => moveHeroSlideAction(slide.id, "up"))}
              onMoveDown={() =>
                runAction(() => moveHeroSlideAction(slide.id, "down"))
              }
              onSaved={() => {
                setEditingId(null);
                refreshPage();
              }}
            />
          ))
        )}
      </div>
    </section>
  );
}

type SlideRowProps = {
  slide: HeroSlideAdminItem;
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

function SlideRow({
  slide,
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
}: SlideRowProps) {
  const [editState, editAction, isSaving] = useActionState(
    updateHeroSlideFormAction,
    initialFormState,
  );

  useEffect(() => {
    if (editState.message) {
      onSaved();
    }
  }, [editState.message, onSaved]);

  if (isEditing) {
    return (
      <article className="rounded-2xl border border-mauve-300 bg-mauve-50/40 p-4">
        <form action={editAction} className="space-y-4">
          <input type="hidden" name="slideId" value={slide.id} />
          <Field
            id={`${slide.id}-title`}
            label="Caption (optional)"
            name="title"
            defaultValue={slide.title}
          />
          <ImageUploadField
            id={`${slide.id}-photo`}
            currentImageUrl={slide.imageUrl}
            currentImageAlt={slide.title || "Hero photo"}
          />
          {editState.error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {editState.error}
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
    <article className="flex flex-col gap-4 rounded-2xl border border-mauve-200 bg-white p-4 sm:flex-row sm:items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slide.imageUrl}
        alt={slide.title || "Hero carousel photo"}
        className="h-24 w-full rounded-xl object-cover sm:h-20 sm:w-32"
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-slate-900">
          {slide.title || "Untitled photo"}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {slide.isActive ? "Shown in carousel" : "Hidden from carousel"}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={onMoveUp} disabled={isPending || isFirst}>
          Up
        </ActionButton>
        <ActionButton onClick={onMoveDown} disabled={isPending || isLast}>
          Down
        </ActionButton>
        <ActionButton onClick={onEdit} disabled={isPending}>
          Edit
        </ActionButton>
        <ActionButton onClick={onToggleActive} disabled={isPending}>
          {slide.isActive ? "Hide" : "Show"}
        </ActionButton>
        <ActionButton onClick={onDelete} disabled={isPending} variant="danger">
          Remove
        </ActionButton>
      </div>
    </article>
  );
}

type FieldProps = {
  id: string;
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
};

function Field({ id, label, name, defaultValue, placeholder }: FieldProps) {
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
        className="mt-2 w-full rounded-xl border border-mauve-200 px-4 py-3 text-sm text-slate-900 outline-none ring-mauve-300 focus:ring-2"
      />
    </div>
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
      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 sm:text-sm ${classes}`}
    >
      {children}
    </button>
  );
}

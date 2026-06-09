"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveSchoolProfileFormAction,
  type SchoolProfileData,
  type SchoolProfileFormState,
} from "@/lib/actions/school-profile";
import {
  removeSchoolLogoAction,
  uploadSchoolLogoFormAction,
  type SchoolLogoFormState,
} from "@/lib/actions/school-logo";
import { SchoolLogoMark } from "@/components/public-site/SchoolLogoMark";

type SchoolProfileFormProps = {
  profile: SchoolProfileData;
};

const initialFormState: SchoolProfileFormState = { success: false };
const initialLogoState: SchoolLogoFormState = { success: false };

export function SchoolProfileForm({ profile }: SchoolProfileFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    saveSchoolProfileFormAction,
    initialFormState,
  );
  const [logoState, logoAction, isUploadingLogo] = useActionState(
    uploadSchoolLogoFormAction,
    initialLogoState,
  );
  const [brandColor, setBrandColor] = useState(profile.brandColor);
  const [logoUrl, setLogoUrl] = useState(profile.logoUrl);
  const [logoError, setLogoError] = useState("");
  const [isRemovingLogo, startRemoveTransition] = useTransition();

  useEffect(() => {
    if (logoState.logoUrl !== undefined) {
      setLogoUrl(logoState.logoUrl);
    }
  }, [logoState.logoUrl]);

  useEffect(() => {
    if (logoState.message || state.message) {
      router.refresh();
    }
  }, [logoState.message, router, state.message]);

  function handleRemoveLogo() {
    if (!window.confirm("Remove the uploaded logo and show school initials instead?")) {
      return;
    }

    setLogoError("");
    startRemoveTransition(async () => {
      const result = await removeSchoolLogoAction();
      if (!result.success) {
        setLogoError(result.error ?? "Could not remove the logo.");
        return;
      }
      setLogoUrl(result.logoUrl ?? null);
      router.refresh();
    });
  }

  const previewSchool = {
    initials: profile.initials,
    name: profile.name,
    logoUrl,
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">School Logo</h2>
        <p className="mt-1 text-sm text-slate-600">
          Upload your school logo directly. JPG, PNG, WebP, or GIF up to 2 MB.
        </p>

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex items-center gap-4 rounded-2xl border border-mauve-100 bg-mauve-50/60 p-4">
            <SchoolLogoMark
              school={previewSchool}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-mauve-500 text-lg font-bold text-white shadow-sm"
              imageClassName="h-16 w-16 rounded-2xl object-cover shadow-sm"
            />
            <div>
              <p className="text-sm font-medium text-slate-900">Current logo</p>
              <p className="mt-1 text-xs text-slate-500">
                {logoUrl
                  ? "Shown in the header, hero, and footer."
                  : "No logo uploaded yet. School initials are shown instead."}
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <form action={logoAction} className="space-y-4">
              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-slate-700">
                  Upload logo
                </label>
                <input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="mt-2 block w-full text-sm text-slate-700 file:mr-4 file:rounded-full file:border-0 file:bg-mauve-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-mauve-700 hover:file:bg-mauve-200"
                />
              </div>

              {logoState.error ? (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {logoState.error}
                </p>
              ) : null}
              {logoError ? (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {logoError}
                </p>
              ) : null}
              {logoState.message ? (
                <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  {logoState.message}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isUploadingLogo}
                  className="rounded-full bg-mauve-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-mauve-600 disabled:opacity-60"
                >
                  {isUploadingLogo ? "Uploading..." : "Upload Logo"}
                </button>
                {logoUrl ? (
                  <button
                    type="button"
                    disabled={isRemovingLogo}
                    onClick={handleRemoveLogo}
                    className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    {isRemovingLogo ? "Removing..." : "Remove Logo"}
                  </button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </section>

      <form action={formAction} className="space-y-8">
        <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">School Details</h2>
          <p className="mt-1 text-sm text-slate-600">
            Basic information parents see on your public website.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="School Name" name="name" defaultValue={profile.name} required />
            <Field
              label="School Initials"
              name="initials"
              defaultValue={profile.initials}
              required
              maxLength={4}
            />
            <Field label="Tagline" name="tagline" defaultValue={profile.tagline} className="sm:col-span-2" />
            <Field label="Motto" name="motto" defaultValue={profile.motto} className="sm:col-span-2" />
          </div>
        </section>

        <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Contact Details</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Phone" name="phone" defaultValue={profile.phone} required />
            <Field label="WhatsApp" name="whatsapp" defaultValue={profile.whatsapp} />
            <Field label="Email" name="email" type="email" defaultValue={profile.email} required />
            <Field label="P. O. Box" name="poBox" defaultValue={profile.poBox} />
            <Field label="Location" name="location" defaultValue={profile.location} className="sm:col-span-2" />
            <Field
              label="Office Hours"
              name="officeHours"
              defaultValue={profile.officeHours}
              className="sm:col-span-2"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Branding</h2>
          <p className="mt-1 text-sm text-slate-600">
            Choose your school color for the public website.
          </p>

          <div className="mt-6 max-w-md">
            <label htmlFor="brandColor" className="block text-sm font-medium text-slate-700">
              School Color
            </label>
            <div className="mt-2 flex items-center gap-3">
              <input
                id="brandColorPicker"
                type="color"
                value={brandColor}
                onChange={(event) => setBrandColor(event.target.value)}
                className="h-11 w-16 cursor-pointer rounded-lg border border-mauve-200 bg-white"
              />
              <input
                name="brandColor"
                type="text"
                value={brandColor}
                onChange={(event) => setBrandColor(event.target.value)}
                pattern="#[0-9A-Fa-f]{6}"
                required
                className="w-full rounded-xl border border-mauve-200 px-4 py-3 text-sm text-slate-900 outline-none ring-mauve-300 focus:ring-2"
                aria-label="School color hex value"
              />
            </div>
          </div>
        </section>

        {state.error ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
        ) : null}
        {state.message ? (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-600 disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

type FieldProps = {
  label: string;
  name: string;
  defaultValue: string;
  required?: boolean;
  type?: string;
  maxLength?: number;
  placeholder?: string;
  hint?: string;
  className?: string;
};

function Field({
  label,
  name,
  defaultValue,
  required,
  type = "text",
  maxLength,
  placeholder,
  hint,
  className,
}: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-mauve-200 px-4 py-3 text-sm text-slate-900 outline-none ring-mauve-300 focus:ring-2"
      />
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

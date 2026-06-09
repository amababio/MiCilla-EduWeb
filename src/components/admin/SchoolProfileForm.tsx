"use client";

import { useActionState, useState } from "react";
import {
  saveSchoolProfileFormAction,
  type SchoolProfileData,
  type SchoolProfileFormState,
} from "@/lib/actions/school-profile";

type SchoolProfileFormProps = {
  profile: SchoolProfileData;
};

const initialFormState: SchoolProfileFormState = { success: false };

export function SchoolProfileForm({ profile }: SchoolProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveSchoolProfileFormAction,
    initialFormState,
  );
  const [brandColor, setBrandColor] = useState(profile.brandColor);

  return (
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
          Choose your school color and optional logo link for the public website.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
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

          <Field
            label="School Logo Image Link"
            name="logoUrl"
            defaultValue={profile.logoUrl ?? ""}
            placeholder="https://example.com/logo.png"
            hint="Optional. Paste a logo image link. Leave blank to use initials."
          />
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

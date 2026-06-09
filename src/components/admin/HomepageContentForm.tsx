"use client";

import { useActionState } from "react";
import {
  saveHomepageContentFormAction,
  type HomepageContentData,
  type HomepageContentFormState,
} from "@/lib/actions/homepage-content";

type HomepageContentFormProps = {
  content: HomepageContentData;
};

const initialFormState: HomepageContentFormState = { success: false };

export function HomepageContentForm({ content }: HomepageContentFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveHomepageContentFormAction,
    initialFormState,
  );

  const aboutValues = [
    content.aboutValues[0] ?? { title: "", description: "" },
    content.aboutValues[1] ?? { title: "", description: "" },
    content.aboutValues[2] ?? { title: "", description: "" },
  ];

  return (
    <form action={formAction} className="space-y-8">
      <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Hero Section</h2>
        <p className="mt-1 text-sm text-slate-600">
          The main school name and tagline come from School Profile. Edit the
          welcome message and button labels here.
        </p>

        <div className="mt-6 space-y-5">
          <TextAreaField
            label="Welcome Message"
            name="heroDescription"
            defaultValue={content.heroDescription}
            required
            rows={4}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Primary Button Label"
              name="heroCtaPrimary"
              defaultValue={content.heroCtaPrimary}
              required
            />
            <Field
              label="WhatsApp Button Label"
              name="heroCtaSecondary"
              defaultValue={content.heroCtaSecondary}
              required
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Admissions</h2>
        <div className="mt-6 space-y-5">
          <Field
            label="Section Heading"
            name="admissionsHeadline"
            defaultValue={content.admissionsHeadline}
            required
          />
          <TextAreaField
            label="Admissions Message"
            name="admissionsDescription"
            defaultValue={content.admissionsDescription}
            required
            rows={4}
          />
          <TextAreaField
            label="Available Levels"
            name="admissionLevels"
            defaultValue={content.admissionLevelsText}
            required
            rows={5}
            hint="Enter one level per line, for example: Crèche, Nursery, KG"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">About Our School</h2>
        <div className="mt-6 space-y-5">
          <TextAreaField
            label="About Text"
            name="aboutDescription"
            defaultValue={content.aboutDescription}
            required
            rows={4}
          />

          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-700">Highlights</p>
            {aboutValues.map((value, index) => (
              <div
                key={index}
                className="rounded-xl border border-mauve-100 bg-mauve-50/50 p-4"
              >
                <Field
                  label={`Highlight ${index + 1} Title`}
                  name={`aboutValue${index + 1}Title`}
                  defaultValue={value.title}
                />
                <TextAreaField
                  label={`Highlight ${index + 1} Description`}
                  name={`aboutValue${index + 1}Description`}
                  defaultValue={value.description}
                  rows={3}
                  className="mt-4"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Why Choose Us</h2>
        <div className="mt-6 space-y-5">
          <TextAreaField
            label="Introduction"
            name="whyChooseUsIntro"
            defaultValue={content.whyChooseUsIntro}
            required
            rows={3}
          />
          <TextAreaField
            label="Reasons"
            name="whyChooseUs"
            defaultValue={content.whyChooseUsText}
            required
            rows={6}
            hint="Enter one reason per line"
          />
        </div>
      </section>

      <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Contact Section</h2>
        <div className="mt-6 space-y-5">
          <Field
            label="Section Heading"
            name="contactHeadline"
            defaultValue={content.contactHeadline}
            required
          />
          <TextAreaField
            label="Section Message"
            name="contactDescription"
            defaultValue={content.contactDescription}
            required
            rows={3}
          />
          <Field
            label="WhatsApp Box Heading"
            name="contactCtaHeadline"
            defaultValue={content.contactCtaHeadline}
            required
          />
          <TextAreaField
            label="WhatsApp Box Message"
            name="contactCtaDescription"
            defaultValue={content.contactCtaDescription}
            required
            rows={3}
          />
        </div>
      </section>

      {state.error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
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
  className?: string;
};

function Field({
  label,
  name,
  defaultValue,
  required,
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
        type="text"
        defaultValue={defaultValue}
        required={required}
        className="mt-2 w-full rounded-xl border border-mauve-200 px-4 py-3 text-sm text-slate-900 outline-none ring-mauve-300 focus:ring-2"
      />
    </div>
  );
}

type TextAreaFieldProps = FieldProps & {
  rows?: number;
  hint?: string;
};

function TextAreaField({
  label,
  name,
  defaultValue,
  required,
  rows = 4,
  hint,
  className,
}: TextAreaFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        required={required}
        rows={rows}
        className="mt-2 w-full rounded-xl border border-mauve-200 px-4 py-3 text-sm text-slate-900 outline-none ring-mauve-300 focus:ring-2"
      />
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

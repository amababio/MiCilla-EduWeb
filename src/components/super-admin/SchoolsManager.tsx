"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createSchoolAdminFormAction,
  createSchoolFormAction,
  resetSchoolAdminPasswordFormAction,
  setSchoolActiveAction,
  type SuperAdminFormState,
  type SuperAdminSchoolItem,
} from "@/lib/actions/super-admin";

type SchoolsManagerProps = {
  schools: SuperAdminSchoolItem[];
};

const initialFormState: SuperAdminFormState = { success: false };

export function SchoolsManager({ schools }: SchoolsManagerProps) {
  const router = useRouter();
  const [createState, createAction, isCreating] = useActionState(
    createSchoolFormAction,
    initialFormState,
  );
  const [actionError, setActionError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (createState.message) {
      router.refresh();
    }
  }, [createState.message, router]);

  function runAction(action: () => Promise<{ success: boolean; error?: string }>) {
    setActionError("");
    startTransition(async () => {
      const result = await action();
      if (!result.success) {
        setActionError(result.error ?? "Something went wrong.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Create a School</h2>
        <p className="mt-1 text-sm text-slate-600">
          Add a new school website with default homepage content. Optionally create
          the first school admin account in the same step.
        </p>

        <form action={createAction} className="mt-6 grid gap-5 lg:grid-cols-2">
          <Field label="School Name" name="name" placeholder="Example Basic School" required />
          <Field
            label="Slug"
            name="slug"
            placeholder="example-basic-school"
            hint="Used in the public URL: /schools/your-slug"
            required
          />
          <Field label="Initials" name="initials" placeholder="EBS" required />
          <Field
            label="Brand Color"
            name="brandColor"
            defaultValue="#cf85ef"
            placeholder="#cf85ef"
            required
          />
          <Field label="Tagline" name="tagline" placeholder="Quality education..." required />
          <Field label="Motto" name="motto" placeholder="Excellence and character" required />
          <Field label="Location" name="location" placeholder="Kumasi" required />
          <Field label="P.O. Box" name="poBox" placeholder="P. O. BOX 10" />
          <Field label="Phone" name="phone" placeholder="024 000 0000" required />
          <Field label="WhatsApp" name="whatsapp" placeholder="0240000000" />
          <Field
            label="School Email"
            name="email"
            placeholder="info@school.edu.gh"
            required
          />
          <Field
            label="Office Hours"
            name="officeHours"
            defaultValue="Monday – Friday, 8:00 AM – 4:00 PM"
          />

          <div className="lg:col-span-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5">
            <h3 className="text-sm font-semibold text-slate-900">
              First School Admin (optional)
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Field label="Admin Name" name="adminName" placeholder="School Admin" />
              <Field
                label="Admin Email"
                name="adminEmail"
                placeholder="admin@school.edu.gh"
              />
              <Field
                label="Admin Password"
                name="adminPassword"
                type="password"
                placeholder="At least 8 characters"
              />
            </div>
          </div>

          {createState.error ? (
            <p className="lg:col-span-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {createState.error}
            </p>
          ) : null}
          {createState.message ? (
            <p className="lg:col-span-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {createState.message}
            </p>
          ) : null}

          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {isCreating ? "Creating..." : "Create School"}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">All Schools</h2>
          <p className="mt-1 text-sm text-slate-600">
            Activate or deactivate public websites, manage school admins, and open
            live previews.
          </p>
        </div>

        {actionError ? (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </p>
        ) : null}

        {schools.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <p className="text-sm text-slate-600">No schools yet.</p>
          </div>
        ) : (
          schools.map((school) => (
            <SchoolCard
              key={school.id}
              school={school}
              isPending={isPending}
              onToggleActive={() =>
                runAction(() =>
                  setSchoolActiveAction(school.id, !school.isActive),
                )
              }
              onUpdated={() => router.refresh()}
            />
          ))
        )}
      </section>
    </div>
  );
}

type SchoolCardProps = {
  school: SuperAdminSchoolItem;
  isPending: boolean;
  onToggleActive: () => void;
  onUpdated: () => void;
};

function SchoolCard({
  school,
  isPending,
  onToggleActive,
  onUpdated,
}: SchoolCardProps) {
  const [adminState, adminAction, isCreatingAdmin] = useActionState(
    createSchoolAdminFormAction,
    initialFormState,
  );
  const [resetState, resetAction, isResetting] = useActionState(
    resetSchoolAdminPasswordFormAction,
    initialFormState,
  );
  const [selectedAdminId, setSelectedAdminId] = useState(
    school.admins[0]?.id ?? "",
  );

  useEffect(() => {
    if (adminState.message || resetState.message) {
      onUpdated();
    }
  }, [adminState.message, resetState.message, onUpdated]);

  useEffect(() => {
    if (!school.admins.some((admin) => admin.id === selectedAdminId)) {
      setSelectedAdminId(school.admins[0]?.id ?? "");
    }
  }, [school.admins, selectedAdminId]);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-900">{school.name}</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
              {school.initials}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                school.isActive
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              {school.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{school.location}</p>
          <p className="mt-1 text-xs text-slate-500">Slug: {school.slug}</p>
          <Link
            href={school.publicPath}
            target="_blank"
            className="mt-3 inline-block text-sm font-medium text-slate-700 underline-offset-2 hover:underline"
          >
            Open public website
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          <ActionButton onClick={onToggleActive} disabled={isPending}>
            {school.isActive ? "Deactivate" : "Activate"}
          </ActionButton>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <h4 className="text-sm font-semibold text-slate-900">School Admins</h4>
          {school.admins.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">No admin accounts yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {school.admins.map((admin) => (
                <li
                  key={admin.id}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  <span className="font-medium">{admin.name}</span> · {admin.email}
                </li>
              ))}
            </ul>
          )}

          <form action={adminAction} className="mt-4 space-y-3">
            <input type="hidden" name="schoolId" value={school.id} />
            <Field label="Admin Name" name="name" placeholder="School Admin" required />
            <Field
              label="Admin Email"
              name="email"
              placeholder="admin@school.edu.gh"
              required
            />
            <Field
              label="Password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              required
            />
            {adminState.error ? (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                {adminState.error}
              </p>
            ) : null}
            {adminState.message ? (
              <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {adminState.message}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={isCreatingAdmin}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white disabled:opacity-60"
            >
              {isCreatingAdmin ? "Adding..." : "Add Admin"}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <h4 className="text-sm font-semibold text-slate-900">
            Reset Admin Password
          </h4>
          {school.admins.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">
              Add an admin account before resetting a password.
            </p>
          ) : (
            <form action={resetAction} className="mt-4 space-y-3">
              <div>
                <label
                  htmlFor={`admin-${school.id}`}
                  className="block text-sm font-medium text-slate-800"
                >
                  Admin Account
                </label>
                <select
                  id={`admin-${school.id}`}
                  name="adminId"
                  value={selectedAdminId}
                  onChange={(event) => setSelectedAdminId(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
                >
                  {school.admins.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name} ({admin.email})
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label="New Password"
                name="password"
                type="password"
                placeholder="At least 8 characters"
                required
              />
              {resetState.error ? (
                <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                  {resetState.error}
                </p>
              ) : null}
              {resetState.message ? (
                <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                  {resetState.message}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={isResetting}
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white disabled:opacity-60"
              >
                {isResetting ? "Saving..." : "Reset Password"}
              </button>
            </form>
          )}
        </section>
      </div>
    </article>
  );
}

type FieldProps = {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  hint?: string;
  required?: boolean;
  type?: string;
};

function Field({
  label,
  name,
  placeholder,
  defaultValue,
  hint,
  required,
  type = "text",
}: FieldProps) {
  return (
    <div>
      <label htmlFor={`${name}-field`} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      <input
        id={`${name}-field`}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-300"
      />
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

type ActionButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

function ActionButton({ children, onClick, disabled }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
    >
      {children}
    </button>
  );
}

"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createActivityFormAction,
  createClassFormAction,
  createClassTimetableFormAction,
  createDailyRoutineFormAction,
  createExamTimetableFormAction,
  createTermCalendarFormAction,
  deleteActivityAction,
  deleteClassAction,
  deleteClassTimetableAction,
  deleteDailyRoutineAction,
  deleteExamTimetableAction,
  deleteTermCalendarAction,
  setActivityActiveAction,
  setClassActiveAction,
  setClassTimetablePublishedAction,
  setDailyRoutinePublishedAction,
  setExamTimetablePublishedAction,
  setTermCalendarPublishedAction,
  type ClassTimetableAdminItem,
  type DailyRoutineAdminItem,
  type ExamTimetableAdminItem,
  type ScheduleActivityAdminItem,
  type ScheduleAdminData,
  type ScheduleFormState,
  type SchoolClassAdminItem,
  type TermCalendarAdminItem,
} from "@/lib/actions/schedule";
import {
  activityCategories,
  getActivityCategoryLabel,
  getRoutineLevelLabel,
  getWeekDayLabel,
  routineLevels,
  weekDays,
} from "@/lib/schedule";

type ScheduleManagerProps = ScheduleAdminData;

const initialFormState: ScheduleFormState = { success: false };

const inputClassName =
  "mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-mauve-400 focus:ring-2 focus:ring-mauve-100";
const labelClassName = "block text-sm font-medium text-slate-700";

export function ScheduleManager({
  classes,
  activities,
  classTimetable,
  examTimetable,
  termCalendar,
  dailyRoutine,
}: ScheduleManagerProps) {
  const router = useRouter();
  const [actionError, setActionError] = useState("");
  const [isPending, startTransition] = useTransition();

  const [classState, classAction, isCreatingClass] = useActionState(
    createClassFormAction,
    initialFormState,
  );
  const [activityState, activityAction, isCreatingActivity] = useActionState(
    createActivityFormAction,
    initialFormState,
  );
  const [timetableState, timetableAction, isCreatingTimetable] = useActionState(
    createClassTimetableFormAction,
    initialFormState,
  );
  const [examState, examAction, isCreatingExam] = useActionState(
    createExamTimetableFormAction,
    initialFormState,
  );
  const [termState, termAction, isCreatingTerm] = useActionState(
    createTermCalendarFormAction,
    initialFormState,
  );
  const [routineState, routineAction, isCreatingRoutine] = useActionState(
    createDailyRoutineFormAction,
    initialFormState,
  );

  useEffect(() => {
    if (
      classState.message ||
      activityState.message ||
      timetableState.message ||
      examState.message ||
      termState.message ||
      routineState.message
    ) {
      router.refresh();
    }
  }, [
    activityState.message,
    classState.message,
    examState.message,
    routineState.message,
    router,
    termState.message,
    timetableState.message,
  ]);

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

  const activeClasses = classes.filter((item) => item.isActive);

  return (
    <div className="space-y-8">
      {actionError ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </p>
      ) : null}

      <ClassesSection
        classes={classes}
        isPending={isPending}
        isCreating={isCreatingClass}
        formState={classState}
        formAction={classAction}
        onToggleActive={(id, isActive) =>
          runAction(() => setClassActiveAction(id, isActive))
        }
        onDelete={(id, name) => {
          if (!window.confirm(`Remove class "${name}" and its timetable links?`)) {
            return;
          }
          runAction(() => deleteClassAction(id));
        }}
      />

      <ActivitiesSection
        activities={activities}
        isPending={isPending}
        isCreating={isCreatingActivity}
        formState={activityState}
        formAction={activityAction}
        onToggleActive={(id, isActive) =>
          runAction(() => setActivityActiveAction(id, isActive))
        }
        onDelete={(id, name) => {
          if (!window.confirm(`Remove "${name}" from subjects and activities?`)) {
            return;
          }
          runAction(() => deleteActivityAction(id));
        }}
      />

      <ClassTimetableSection
        entries={classTimetable}
        classes={activeClasses}
        isPending={isPending}
        isCreating={isCreatingTimetable}
        formState={timetableState}
        formAction={timetableAction}
        onTogglePublished={(id, isPublished) =>
          runAction(() => setClassTimetablePublishedAction(id, isPublished))
        }
        onDelete={(id) => {
          if (!window.confirm("Remove this timetable entry?")) {
            return;
          }
          runAction(() => deleteClassTimetableAction(id));
        }}
      />

      <ExamTimetableSection
        entries={examTimetable}
        classes={activeClasses}
        isPending={isPending}
        isCreating={isCreatingExam}
        formState={examState}
        formAction={examAction}
        onTogglePublished={(id, isPublished) =>
          runAction(() => setExamTimetablePublishedAction(id, isPublished))
        }
        onDelete={(id) => {
          if (!window.confirm("Remove this exam entry?")) {
            return;
          }
          runAction(() => deleteExamTimetableAction(id));
        }}
      />

      <TermCalendarSection
        entries={termCalendar}
        isPending={isPending}
        isCreating={isCreatingTerm}
        formState={termState}
        formAction={termAction}
        onTogglePublished={(id, isPublished) =>
          runAction(() => setTermCalendarPublishedAction(id, isPublished))
        }
        onDelete={(id) => {
          if (!window.confirm("Remove this calendar event?")) {
            return;
          }
          runAction(() => deleteTermCalendarAction(id));
        }}
      />

      <DailyRoutineSection
        entries={dailyRoutine}
        isPending={isPending}
        isCreating={isCreatingRoutine}
        formState={routineState}
        formAction={routineAction}
        onTogglePublished={(id, isPublished) =>
          runAction(() => setDailyRoutinePublishedAction(id, isPublished))
        }
        onDelete={(id) => {
          if (!window.confirm("Remove this routine entry?")) {
            return;
          }
          runAction(() => deleteDailyRoutineAction(id));
        }}
      />
    </div>
  );
}

function FormFeedback({ formState }: { formState: ScheduleFormState }) {
  return (
    <>
      {formState.error ? (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {formState.error}
        </p>
      ) : null}
      {formState.message ? (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {formState.message}
        </p>
      ) : null}
    </>
  );
}

function PublishCheckbox({ id, defaultChecked }: { id: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input
        id={id}
        name="isPublished"
        type="checkbox"
        defaultChecked={defaultChecked ?? true}
        className="rounded border-slate-300 text-mauve-600 focus:ring-mauve-500"
      />
      Publish on public website
    </label>
  );
}

function ClassesSection({
  classes,
  isPending,
  isCreating,
  formState,
  formAction,
  onToggleActive,
  onDelete,
}: {
  classes: SchoolClassAdminItem[];
  isPending: boolean;
  isCreating: boolean;
  formState: ScheduleFormState;
  formAction: (payload: FormData) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete: (id: string, name: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Classes</h2>
      <p className="mt-1 text-sm text-slate-600">
        Add the class names used in timetables, such as Primary 4 or JHS 1.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="class-name" className={labelClassName}>
            Class name
          </label>
          <input
            id="class-name"
            name="name"
            required
            placeholder="Primary 4"
            className={inputClassName}
          />
        </div>
        <FormFeedback formState={formState} />
        <button
          type="submit"
          disabled={isCreating}
          className="rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-600 disabled:opacity-60"
        >
          {isCreating ? "Adding..." : "Add Class"}
        </button>
      </form>

      <ul className="mt-6 space-y-3">
        {classes.length === 0 ? (
          <li className="rounded-xl border border-dashed border-mauve-200 p-4 text-sm text-slate-600">
            No classes yet.
          </li>
        ) : (
          classes.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">
                  {item.isActive ? "Active" : "Hidden"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => onToggleActive(item.id, !item.isActive)}
                  className="rounded-full border border-mauve-200 px-4 py-1.5 text-xs font-semibold text-mauve-700 hover:bg-mauve-50 disabled:opacity-60"
                >
                  {item.isActive ? "Hide" : "Activate"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => onDelete(item.id, item.name)}
                  className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  Remove
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

function ActivitiesSection({
  activities,
  isPending,
  isCreating,
  formState,
  formAction,
  onToggleActive,
  onDelete,
}: {
  activities: ScheduleActivityAdminItem[];
  isPending: boolean;
  isCreating: boolean;
  formState: ScheduleFormState;
  formAction: (payload: FormData) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete: (id: string, name: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Subjects & Activities</h2>
      <p className="mt-1 text-sm text-slate-600">
        Keep a reference list of subjects, breaks, and other activities for your
        team.
      </p>

      <form action={formAction} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="activity-name" className={labelClassName}>
            Name
          </label>
          <input
            id="activity-name"
            name="name"
            required
            placeholder="Mathematics"
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="activity-category" className={labelClassName}>
            Type
          </label>
          <select id="activity-category" name="category" className={inputClassName}>
            {activityCategories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <FormFeedback formState={formState} />
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-600 disabled:opacity-60"
          >
            {isCreating ? "Adding..." : "Add Activity"}
          </button>
        </div>
      </form>

      <ul className="mt-6 space-y-3">
        {activities.length === 0 ? (
          <li className="rounded-xl border border-dashed border-mauve-200 p-4 text-sm text-slate-600">
            No subjects or activities yet.
          </li>
        ) : (
          activities.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">
                  {getActivityCategoryLabel(item.category)} ·{" "}
                  {item.isActive ? "Active" : "Hidden"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => onToggleActive(item.id, !item.isActive)}
                  className="rounded-full border border-mauve-200 px-4 py-1.5 text-xs font-semibold text-mauve-700 hover:bg-mauve-50 disabled:opacity-60"
                >
                  {item.isActive ? "Hide" : "Activate"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => onDelete(item.id, item.name)}
                  className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  Remove
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}

function ClassTimetableSection({
  entries,
  classes,
  isPending,
  isCreating,
  formState,
  formAction,
  onTogglePublished,
  onDelete,
}: {
  entries: ClassTimetableAdminItem[];
  classes: SchoolClassAdminItem[];
  isPending: boolean;
  isCreating: boolean;
  formState: ScheduleFormState;
  formAction: (payload: FormData) => void;
  onTogglePublished: (id: string, isPublished: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Class Timetable</h2>
      <p className="mt-1 text-sm text-slate-600">
        Add weekly periods for each class. Published entries appear on your public
        website.
      </p>

      <form action={formAction} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tt-class" className={labelClassName}>
            Class
          </label>
          <select
            id="tt-class"
            name="schoolClassId"
            required
            className={inputClassName}
            disabled={classes.length === 0}
          >
            <option value="">Choose a class</option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tt-day" className={labelClassName}>
            Day
          </label>
          <select id="tt-day" name="dayOfWeek" className={inputClassName}>
            {weekDays.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tt-period" className={labelClassName}>
            Period label
          </label>
          <input
            id="tt-period"
            name="periodLabel"
            required
            placeholder="Period 1"
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="tt-activity" className={labelClassName}>
            Activity
          </label>
          <input
            id="tt-activity"
            name="activityName"
            required
            placeholder="Mathematics"
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="tt-start" className={labelClassName}>
            Start time
          </label>
          <input
            id="tt-start"
            name="startTime"
            required
            placeholder="8:00 AM"
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="tt-end" className={labelClassName}>
            End time
          </label>
          <input
            id="tt-end"
            name="endTime"
            required
            placeholder="8:45 AM"
            className={inputClassName}
          />
        </div>
        <div className="sm:col-span-2">
          <PublishCheckbox id="tt-published" />
        </div>
        <div className="sm:col-span-2">
          <FormFeedback formState={formState} />
          <button
            type="submit"
            disabled={isCreating || classes.length === 0}
            className="rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-600 disabled:opacity-60"
          >
            {isCreating ? "Adding..." : "Add Timetable Entry"}
          </button>
        </div>
      </form>

      <TimetableEntryList
        entries={entries}
        isPending={isPending}
        onTogglePublished={onTogglePublished}
        onDelete={onDelete}
        renderMeta={(entry) =>
          `${entry.className} · ${getWeekDayLabel(entry.dayOfWeek)} · ${entry.periodLabel}`
        }
        renderDetail={(entry) =>
          `${entry.startTime} – ${entry.endTime} · ${entry.activityName}`
        }
      />
    </section>
  );
}

function ExamTimetableSection({
  entries,
  classes,
  isPending,
  isCreating,
  formState,
  formAction,
  onTogglePublished,
  onDelete,
}: {
  entries: ExamTimetableAdminItem[];
  classes: SchoolClassAdminItem[];
  isPending: boolean;
  isCreating: boolean;
  formState: ScheduleFormState;
  formAction: (payload: FormData) => void;
  onTogglePublished: (id: string, isPublished: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Exam Timetable</h2>
      <p className="mt-1 text-sm text-slate-600">
        Share assessment dates and times with parents.
      </p>

      <form action={formAction} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="exam-class" className={labelClassName}>
            Class (optional)
          </label>
          <select id="exam-class" name="schoolClassId" className={inputClassName}>
            <option value="">All classes / general</option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="exam-subject" className={labelClassName}>
            Subject
          </label>
          <input
            id="exam-subject"
            name="subjectName"
            required
            placeholder="Mathematics"
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="exam-date" className={labelClassName}>
            Exam date
          </label>
          <input
            id="exam-date"
            name="examDate"
            required
            placeholder="Monday, 12 May 2026"
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="exam-start" className={labelClassName}>
            Start time
          </label>
          <input
            id="exam-start"
            name="startTime"
            required
            placeholder="9:00 AM"
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="exam-end" className={labelClassName}>
            End time
          </label>
          <input
            id="exam-end"
            name="endTime"
            required
            placeholder="11:00 AM"
            className={inputClassName}
          />
        </div>
        <div className="flex items-end">
          <PublishCheckbox id="exam-published" />
        </div>
        <div className="sm:col-span-2">
          <FormFeedback formState={formState} />
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-600 disabled:opacity-60"
          >
            {isCreating ? "Adding..." : "Add Exam Entry"}
          </button>
        </div>
      </form>

      <TimetableEntryList
        entries={entries}
        isPending={isPending}
        onTogglePublished={onTogglePublished}
        onDelete={onDelete}
        renderMeta={(entry) =>
          `${entry.subjectName}${entry.className ? ` · ${entry.className}` : ""}`
        }
        renderDetail={(entry) =>
          `${entry.examDate} · ${entry.startTime} – ${entry.endTime}`
        }
      />
    </section>
  );
}

function TermCalendarSection({
  entries,
  isPending,
  isCreating,
  formState,
  formAction,
  onTogglePublished,
  onDelete,
}: {
  entries: TermCalendarAdminItem[];
  isPending: boolean;
  isCreating: boolean;
  formState: ScheduleFormState;
  formAction: (payload: FormData) => void;
  onTogglePublished: (id: string, isPublished: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Term Calendar</h2>
      <p className="mt-1 text-sm text-slate-600">
        Highlight resumption, holidays, PTA days, and other term dates.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="term-title" className={labelClassName}>
            Event title
          </label>
          <input
            id="term-title"
            name="title"
            required
            placeholder="Mid-term break"
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="term-date" className={labelClassName}>
            Display date
          </label>
          <input
            id="term-date"
            name="displayDate"
            required
            placeholder="April 2026"
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="term-description" className={labelClassName}>
            Description
          </label>
          <textarea
            id="term-description"
            name="description"
            required
            rows={3}
            placeholder="School closes for mid-term break."
            className={inputClassName}
          />
        </div>
        <PublishCheckbox id="term-published" />
        <FormFeedback formState={formState} />
        <button
          type="submit"
          disabled={isCreating}
          className="rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-600 disabled:opacity-60"
        >
          {isCreating ? "Adding..." : "Add Calendar Event"}
        </button>
      </form>

      <TimetableEntryList
        entries={entries}
        isPending={isPending}
        onTogglePublished={onTogglePublished}
        onDelete={onDelete}
        renderMeta={(entry) => entry.title}
        renderDetail={(entry) => `${entry.displayDate} · ${entry.description}`}
      />
    </section>
  );
}

function DailyRoutineSection({
  entries,
  isPending,
  isCreating,
  formState,
  formAction,
  onTogglePublished,
  onDelete,
}: {
  entries: DailyRoutineAdminItem[];
  isPending: boolean;
  isCreating: boolean;
  formState: ScheduleFormState;
  formAction: (payload: FormData) => void;
  onTogglePublished: (id: string, isPublished: boolean) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Daily Routine (Crèche / KG)</h2>
      <p className="mt-1 text-sm text-slate-600">
        Share a simple daily flow for early years parents.
      </p>

      <form action={formAction} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="routine-time" className={labelClassName}>
            Time
          </label>
          <input
            id="routine-time"
            name="timeLabel"
            required
            placeholder="8:00 AM"
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="routine-level" className={labelClassName}>
            Level
          </label>
          <select id="routine-level" name="level" className={inputClassName}>
            {routineLevels.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="routine-title" className={labelClassName}>
            Activity
          </label>
          <input
            id="routine-title"
            name="title"
            required
            placeholder="Morning circle and songs"
            className={inputClassName}
          />
        </div>
        <div className="sm:col-span-2">
          <PublishCheckbox id="routine-published" />
        </div>
        <div className="sm:col-span-2">
          <FormFeedback formState={formState} />
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mauve-600 disabled:opacity-60"
          >
            {isCreating ? "Adding..." : "Add Routine Entry"}
          </button>
        </div>
      </form>

      <TimetableEntryList
        entries={entries}
        isPending={isPending}
        onTogglePublished={onTogglePublished}
        onDelete={onDelete}
        renderMeta={(entry) => `${entry.timeLabel} · ${entry.title}`}
        renderDetail={(entry) => getRoutineLevelLabel(entry.level)}
      />
    </section>
  );
}

function TimetableEntryList<T extends { id: string; isPublished: boolean }>({
  entries,
  isPending,
  onTogglePublished,
  onDelete,
  renderMeta,
  renderDetail,
}: {
  entries: T[];
  isPending: boolean;
  onTogglePublished: (id: string, isPublished: boolean) => void;
  onDelete: (id: string) => void;
  renderMeta: (entry: T) => string;
  renderDetail: (entry: T) => string;
}) {
  return (
    <ul className="mt-6 space-y-3">
      {entries.length === 0 ? (
        <li className="rounded-xl border border-dashed border-mauve-200 p-4 text-sm text-slate-600">
          No entries yet.
        </li>
      ) : (
        entries.map((entry) => (
          <li
            key={entry.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3"
          >
            <div>
              <p className="font-medium text-slate-900">{renderMeta(entry)}</p>
              <p className="text-xs text-slate-500">{renderDetail(entry)}</p>
              <p className="mt-1 text-xs text-slate-500">
                {entry.isPublished ? "Published" : "Draft"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => onTogglePublished(entry.id, !entry.isPublished)}
                className="rounded-full border border-mauve-200 px-4 py-1.5 text-xs font-semibold text-mauve-700 hover:bg-mauve-50 disabled:opacity-60"
              >
                {entry.isPublished ? "Unpublish" : "Publish"}
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => onDelete(entry.id)}
                className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
              >
                Remove
              </button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}

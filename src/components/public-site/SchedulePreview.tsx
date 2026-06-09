import type { PublicSchoolData } from "@/types/public-site";
import { SectionHeading } from "@/components/shared/SectionHeading";

type SchedulePreviewProps = {
  school: PublicSchoolData;
};

export function SchedulePreview({ school }: SchedulePreviewProps) {
  const { schedule } = school;
  const hasContent =
    schedule.classes.length > 0 ||
    schedule.classTimetable.length > 0 ||
    schedule.examTimetable.length > 0 ||
    schedule.termCalendar.length > 0 ||
    schedule.dailyRoutine.length > 0;

  if (!hasContent) {
    return null;
  }

  const timetableByClass = schedule.classTimetable.reduce<
    Record<string, typeof schedule.classTimetable>
  >((groups, entry) => {
    const key = entry.className;
    groups[key] = groups[key] ?? [];
    groups[key].push(entry);
    return groups;
  }, {});

  return (
    <section id="schedule" className="bg-mauve-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="School Schedule"
          subtitle="Class timetables, exam dates, term calendar, and early-years routines."
        />

        {schedule.classes.length > 0 ? (
          <div className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-mauve-700">
              Classes
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {schedule.classes.map((className) => (
                <span
                  key={className}
                  className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-mauve-200"
                >
                  {className}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {schedule.classTimetable.length > 0 ? (
          <div className="mb-10 space-y-6">
            <h3 className="text-lg font-semibold text-slate-900">Class Timetable</h3>
            <div className="grid gap-6 lg:grid-cols-2">
              {Object.entries(timetableByClass).map(([className, entries]) => (
                <article
                  key={className}
                  className="overflow-hidden rounded-2xl border border-mauve-200 bg-white shadow-sm"
                >
                  <div className="border-b border-mauve-100 bg-mauve-100/60 px-5 py-3">
                    <h4 className="font-semibold text-slate-900">{className}</h4>
                  </div>
                  <ul className="divide-y divide-slate-100">
                    {entries.map((entry) => (
                      <li
                        key={`${entry.dayOfWeek}-${entry.periodLabel}-${entry.startTime}`}
                        className="flex flex-wrap items-start justify-between gap-3 px-5 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {entry.activityName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {entry.dayLabel} · {entry.periodLabel}
                          </p>
                        </div>
                        <p className="text-xs font-medium text-mauve-700">
                          {entry.startTime} – {entry.endTime}
                        </p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {schedule.examTimetable.length > 0 ? (
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-slate-900">Exam Timetable</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {schedule.examTimetable.map((entry) => (
                <article
                  key={`${entry.subjectName}-${entry.examDate}-${entry.startTime}`}
                  className="rounded-2xl border border-mauve-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-base font-semibold text-slate-900">
                    {entry.subjectName}
                  </p>
                  {entry.className ? (
                    <p className="mt-1 text-xs font-medium text-mauve-700">
                      {entry.className}
                    </p>
                  ) : null}
                  <p className="mt-2 text-sm text-slate-600">{entry.examDate}</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {entry.startTime} – {entry.endTime}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {schedule.termCalendar.length > 0 ? (
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-slate-900">Term Calendar</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {schedule.termCalendar.map((entry) => (
                <article
                  key={`${entry.title}-${entry.displayDate}`}
                  className="rounded-2xl border border-mauve-200 bg-white p-5 shadow-sm"
                >
                  <time className="text-xs font-semibold uppercase tracking-wide text-mauve-700">
                    {entry.displayDate}
                  </time>
                  <h4 className="mt-2 text-base font-semibold text-slate-900">
                    {entry.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {entry.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {schedule.dailyRoutine.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Daily Routine (Crèche / KG)
            </h3>
            <ul className="mt-4 space-y-3">
              {schedule.dailyRoutine.map((entry) => (
                <li
                  key={`${entry.timeLabel}-${entry.title}`}
                  className="flex flex-wrap items-center gap-4 rounded-2xl border border-mauve-200 bg-white px-5 py-4 shadow-sm"
                >
                  <span className="min-w-20 text-sm font-semibold text-mauve-700">
                    {entry.timeLabel}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{entry.title}</p>
                    <p className="text-xs text-slate-500">{entry.levelLabel}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

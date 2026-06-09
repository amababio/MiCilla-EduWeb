import type { PublicSchoolData } from "@/types/public-site";
import { SectionHeading } from "@/components/shared/SectionHeading";

type AnnouncementsPreviewProps = {
  school: PublicSchoolData;
};

export function AnnouncementsPreview({ school }: AnnouncementsPreviewProps) {
  return (
    <section className="bg-mauve-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="School Announcements"
          subtitle="Stay updated with important notices from the school office."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {school.announcements.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-mauve-200 px-3 py-1 text-xs font-semibold text-mauve-700">
                  {item.category}
                </span>
                <time className="text-xs text-slate-400">{item.date}</time>
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.message}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

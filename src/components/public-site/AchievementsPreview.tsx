import type { PublicSchoolData } from "@/types/public-site";
import { SectionHeading } from "@/components/shared/SectionHeading";

type AchievementsPreviewProps = {
  school: PublicSchoolData;
};

export function AchievementsPreview({ school }: AchievementsPreviewProps) {
  return (
    <section id="achievements" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="Excellence & Achievements"
          subtitle={school.achievements.subtitle}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {school.achievements.cards.map((card) => (
            <article
              key={`${card.title}-${card.category}`}
              className="rounded-2xl border border-mauve-200 bg-gradient-to-b from-mauve-100 to-white p-6 shadow-sm"
            >
              <div className="mb-4 inline-flex rounded-full bg-mauve-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-mauve-800">
                {card.categoryLabel}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {card.title}
              </h3>
              {card.displayLabel ? (
                <p className="mt-2 text-sm font-medium text-mauve-700">
                  {card.displayLabel}
                </p>
              ) : null}
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {card.description}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-8 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm text-slate-500">
          {school.achievements.note}
        </p>
      </div>
    </section>
  );
}

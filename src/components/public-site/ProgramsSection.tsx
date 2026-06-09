import type { PublicSchoolData } from "@/types/public-site";
import { SectionHeading } from "@/components/shared/SectionHeading";

type ProgramsSectionProps = {
  school: PublicSchoolData;
};

export function ProgramsSection({ school }: ProgramsSectionProps) {
  return (
    <section id="programs" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="Programs & Levels"
          subtitle="From early childhood to JHS, we provide structured learning at every stage."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {school.programs.map((program) => (
            <article
              key={program.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-mauve-100 bg-gradient-to-b from-white to-mauve-50 shadow-sm transition hover:border-mauve-300 hover:shadow-md"
            >
              {program.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={program.imageUrl}
                  alt={`${program.name} program`}
                  className="h-40 w-full object-cover"
                />
              ) : null}
              <div className="flex flex-1 flex-col p-6">
                <span className="inline-flex w-fit rounded-full bg-mauve-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-mauve-700">
                  Level
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  {program.name}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                  {program.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

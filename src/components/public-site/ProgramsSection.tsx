import { demoSchool } from "@/data/demoSchool";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function ProgramsSection() {
  return (
    <section id="programs" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="Programs & Levels"
          subtitle="From early childhood to JHS, we provide structured learning at every stage."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demoSchool.programs.map((program) => (
            <article
              key={program.name}
              className="flex flex-col rounded-2xl border border-mauve-100 bg-gradient-to-b from-white to-mauve-50 p-6 shadow-sm transition hover:border-mauve-300 hover:shadow-md"
            >
              <span className="inline-flex w-fit rounded-full bg-mauve-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-mauve-700">
                Level
              </span>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                {program.name}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                {program.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

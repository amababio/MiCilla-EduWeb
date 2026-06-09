import type { PublicSchoolData } from "@/types/public-site";
import { SectionHeading } from "@/components/shared/SectionHeading";

type AboutSectionProps = {
  school: PublicSchoolData;
};

export function AboutSection({ school }: AboutSectionProps) {
  return (
    <section id="about" className="bg-mauve-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title="About Our School"
          subtitle={school.about.description}
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {school.about.values.map((value) => (
            <article
              key={value.title}
              className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-mauve-200 text-mauve-700">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

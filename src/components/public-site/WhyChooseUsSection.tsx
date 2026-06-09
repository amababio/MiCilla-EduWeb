import type { PublicSchoolData } from "@/types/public-site";

type WhyChooseUsSectionProps = {
  school: PublicSchoolData;
};

export function WhyChooseUsSection({ school }: WhyChooseUsSectionProps) {
  return (
    <section className="bg-gradient-to-br from-mauve-400 via-mauve-500 to-mauve-600 py-16 text-white sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Why Choose {school.name}?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/90 sm:text-lg">
            Parents trust us for quality teaching, strong values, and a welcoming
            school community.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {school.whyChooseUs.map((point) => (
            <div
              key={point}
              className="flex items-start gap-3 rounded-2xl border border-white/30 bg-white/15 p-5 backdrop-blur-sm"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-mauve-600">
                ✓
              </span>
              <p className="text-sm font-medium leading-relaxed text-white sm:text-base">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { phoneToWhatsApp } from "@/lib/phone";
import { SchoolImage } from "@/components/shared/SchoolImage";
import type { PublicSchoolData } from "@/types/public-site";

type HeroSectionProps = {
  school: PublicSchoolData;
};

export function HeroSection({ school }: HeroSectionProps) {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-mauve-100 via-white to-mauve-50"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-mauve-600">
            Welcome to
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {school.name}
          </h1>
          <p className="mt-4 text-lg font-medium text-mauve-700 sm:text-xl">
            {school.tagline}
          </p>
          <p className="mt-3 inline-flex rounded-full bg-mauve-100 px-4 py-1.5 text-sm font-medium text-mauve-800 lg:hidden">
            {school.motto}
          </p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {school.heroDescription}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#admissions"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-mauve-600"
            >
              {school.heroCtaPrimary}
            </a>
            <a
              href={phoneToWhatsApp(school.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full border-2 border-mauve-300 bg-white px-6 py-3 text-sm font-semibold text-mauve-700 transition hover:bg-mauve-50"
            >
              {school.heroCtaSecondary}
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/3] overflow-hidden rounded-3xl border border-mauve-200 bg-gradient-to-br from-mauve-300 via-mauve-400 to-mauve-500 shadow-lg">
            <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
              {school.logoUrl ? (
                <SchoolImage
                  src={school.logoUrl}
                  alt={`${school.name} logo`}
                  className="mb-4 max-h-32 max-w-[80%] rounded-2xl bg-white/10 object-contain p-3"
                  priority
                  fallback={
                    <span className="text-5xl font-bold opacity-90 sm:text-6xl">
                      {school.initials}
                    </span>
                  }
                />
              ) : (
                <span className="text-5xl font-bold opacity-90 sm:text-6xl">
                  {school.initials}
                </span>
              )}
              <p className="mt-4 text-lg font-semibold sm:text-xl">{school.name}</p>
              <p className="mt-2 max-w-xs text-sm text-mauve-50 sm:text-base">
                School photo placeholder — bright classrooms, happy learners,
                and active school life.
              </p>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-mauve-200 bg-white px-4 py-3 shadow-md sm:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-mauve-600">
              Our Motto
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800">{school.motto}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

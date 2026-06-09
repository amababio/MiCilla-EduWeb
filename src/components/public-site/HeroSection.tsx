import { phoneToWhatsApp } from "@/lib/phone";
import { SchoolImage } from "@/components/shared/SchoolImage";
import { HeroBackgroundShapes } from "@/components/public-site/HeroBackgroundShapes";
import { HeroCarousel } from "@/components/public-site/HeroCarousel";
import { SchoolLogoMark } from "@/components/public-site/SchoolLogoMark";
import type { PublicSchoolData } from "@/types/public-site";

type HeroSectionProps = {
  school: PublicSchoolData;
};

export function HeroSection({ school }: HeroSectionProps) {
  const heroSlides = school.heroSlides;
  const hasCarousel = heroSlides.length > 0;

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-mauve-100 via-white to-mauve-50"
    >
      <HeroBackgroundShapes />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="order-2 lg:order-1">
          <p className="motion-hero-enter text-sm font-semibold uppercase tracking-wide text-mauve-600">
            Welcome to
          </p>
          <h1 className="motion-hero-enter motion-hero-enter-delay-1 mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {school.name}
          </h1>
          <p className="motion-hero-enter motion-hero-enter-delay-2 mt-4 text-lg font-medium text-mauve-700 sm:text-xl">
            {school.tagline}
          </p>
          <p className="motion-hero-enter motion-hero-enter-delay-2 mt-3 inline-flex rounded-full bg-mauve-100 px-4 py-1.5 text-sm font-medium text-mauve-800 lg:hidden">
            {school.motto}
          </p>
          <p className="motion-hero-enter motion-hero-enter-delay-3 mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {school.heroDescription}
          </p>
          <div className="motion-hero-enter motion-hero-enter-delay-4 mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#admissions"
              className="motion-btn motion-btn-primary inline-flex min-h-11 items-center justify-center rounded-full bg-mauve-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-mauve-600"
            >
              {school.heroCtaPrimary}
            </a>
            <a
              href={phoneToWhatsApp(school.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="motion-btn inline-flex min-h-11 items-center justify-center rounded-full border-2 border-mauve-300 bg-white px-6 py-3 text-sm font-semibold text-mauve-700 hover:bg-mauve-50"
            >
              {school.heroCtaSecondary}
            </a>
          </div>
        </div>

        <div className="motion-hero-enter motion-hero-enter-delay-2 relative order-1 lg:order-2">
          <HeroVisualCard school={school} hasCarousel={hasCarousel} heroSlides={heroSlides} />
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

type HeroVisualCardProps = {
  school: PublicSchoolData;
  hasCarousel: boolean;
  heroSlides: PublicSchoolData["heroSlides"];
};

function HeroVisualCard({ school, hasCarousel, heroSlides }: HeroVisualCardProps) {
  if (hasCarousel) {
    return (
      <div className="motion-card relative aspect-[4/3] overflow-hidden rounded-3xl border border-mauve-200 bg-mauve-200 shadow-lg">
        <HeroCarousel slides={heroSlides} priority />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/20" />
        <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-3 rounded-2xl border border-white/30 bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
          <SchoolLogoMark
            school={school}
            imageClassName="h-10 w-10 shrink-0 rounded-xl object-cover"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mauve-500 text-sm font-bold text-white"
            priority
          />
          <div>
            <p className="text-sm font-semibold text-slate-900">{school.name}</p>
            {heroSlides[0]?.title ? (
              <p className="text-xs text-slate-600">{heroSlides[0].title}</p>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="motion-card aspect-[4/3] overflow-hidden rounded-3xl border border-mauve-200 bg-gradient-to-br from-mauve-300 via-mauve-400 to-mauve-500 shadow-lg">
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
          Upload hero photos in admin to show a rotating carousel here.
        </p>
      </div>
    </div>
  );
}

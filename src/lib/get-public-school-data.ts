import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  defaultNavLinks,
  type AboutValue,
  type PublicSchoolData,
} from "@/types/public-site";

function parseJsonArray<T>(value: unknown, fallback: T[] = []): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

export async function getPublicSchoolData(
  slug?: string,
): Promise<PublicSchoolData | null> {
  const schoolSlug =
    slug ??
    process.env.DEFAULT_SCHOOL_SLUG ??
    "redemption-international-school";

  const school = await prisma.school.findUnique({
    where: { slug: schoolSlug },
    include: {
      websiteSettings: true,
      programs: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
      galleryImages: {
        where: { isFeatured: true },
        orderBy: { sortOrder: "asc" },
      },
      achievements: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
      },
      announcements: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
      },
      downloads: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!school?.websiteSettings) {
    return null;
  }

  const settings = school.websiteSettings;

  return {
    name: school.name,
    initials: school.initials,
    tagline: school.tagline,
    motto: school.motto,
    poBox: school.poBox,
    location: school.location,
    phone: school.phone,
    whatsapp: school.whatsapp,
    email: school.email,
    officeHours: school.officeHours,
    heroDescription: settings.heroDescription,
    admissions: {
      headline: settings.admissionsHeadline,
      description: settings.admissionsDescription,
      levels: parseJsonArray<string>(settings.admissionLevels),
    },
    about: {
      description: settings.aboutDescription,
      values: parseJsonArray<AboutValue>(settings.aboutValues),
    },
    programs: school.programs.map((program) => ({
      name: program.name,
      description: program.description,
    })),
    whyChooseUs: parseJsonArray<string>(settings.whyChooseUs),
    gallery: school.galleryImages.map((image) => ({
      title: image.title,
      accent: image.accentClass,
    })),
    achievements: {
      subtitle: settings.achievementsSubtitle,
      note: settings.achievementsNote,
      cards: school.achievements.map((item) => ({
        title: item.title,
        description: item.description,
      })),
    },
    announcements: school.announcements.map((item) => ({
      title: item.title,
      category: item.category,
      message: item.message,
      date: item.displayDate,
    })),
    downloads: school.downloads.map((item) => ({
      title: item.title,
      description: item.description,
    })),
    contact: {
      headline: settings.contactHeadline,
      description: settings.contactDescription,
    },
    footer: {
      poweredBy: settings.poweredByFooter,
    },
    navLinks: defaultNavLinks,
  };
}

/** Cached homepage data — avoids hitting the database on every request. */
export async function getCachedPublicSchoolData(
  slug?: string,
): Promise<PublicSchoolData | null> {
  const schoolSlug =
    slug ??
    process.env.DEFAULT_SCHOOL_SLUG ??
    "redemption-international-school";

  return unstable_cache(
    () => getPublicSchoolData(schoolSlug),
    ["public-school-data", schoolSlug],
    {
      revalidate: 300,
      tags: [`school-public-${schoolSlug}`],
    },
  )();
}

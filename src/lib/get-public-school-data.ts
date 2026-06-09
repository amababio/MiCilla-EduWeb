import { unstable_noStore as noStore } from "next/cache";
import { getDefaultSchoolSlug } from "@/lib/school-slug";
import { prisma } from "@/lib/prisma";
import {
  getAchievementDisplayLabel,
  getCategoryLabel,
} from "@/lib/achievements";
import { getAnnouncementCategoryLabel } from "@/lib/announcements";
import { getDownloadCategoryLabel } from "@/lib/downloads";
import { getRoutineLevelLabel, getWeekDayLabel } from "@/lib/schedule";
import {
  getCarouselPhotos,
  getHomepageGalleryCategories,
} from "@/lib/gallery-categories";
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
  noStore();
  const schoolSlug = slug ?? getDefaultSchoolSlug();

  const school = await prisma.school.findFirst({
    where: { slug: schoolSlug, isActive: true },
    include: {
      websiteSettings: true,
      programs: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
      galleryImages: {
        orderBy: { sortOrder: "asc" },
      },
      heroSlides: {
        where: { isActive: true },
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
      schoolClasses: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      },
      classTimetableEntries: {
        where: { isPublished: true },
        orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }],
        include: { schoolClass: { select: { name: true } } },
      },
      examTimetableEntries: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
        include: { schoolClass: { select: { name: true } } },
      },
      termCalendarEvents: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
      },
      dailyRoutineEntries: {
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!school?.websiteSettings) {
    return null;
  }

  const settings = school.websiteSettings;

  const schedule = {
    classes: school.schoolClasses.map((item) => item.name),
    classTimetable: school.classTimetableEntries.map((entry) => ({
      className: entry.schoolClass.name,
      dayOfWeek: entry.dayOfWeek,
      dayLabel: getWeekDayLabel(entry.dayOfWeek),
      periodLabel: entry.periodLabel,
      startTime: entry.startTime,
      endTime: entry.endTime,
      activityName: entry.activityName,
    })),
    examTimetable: school.examTimetableEntries.map((entry) => ({
      className: entry.schoolClass?.name ?? null,
      subjectName: entry.subjectName,
      examDate: entry.examDate,
      startTime: entry.startTime,
      endTime: entry.endTime,
    })),
    termCalendar: school.termCalendarEvents.map((entry) => ({
      title: entry.title,
      displayDate: entry.displayDate,
      description: entry.description,
    })),
    dailyRoutine: school.dailyRoutineEntries.map((entry) => ({
      timeLabel: entry.timeLabel,
      title: entry.title,
      level: entry.level,
      levelLabel: getRoutineLevelLabel(entry.level),
    })),
  };

  const hasScheduleContent =
    schedule.classes.length > 0 ||
    schedule.classTimetable.length > 0 ||
    schedule.examTimetable.length > 0 ||
    schedule.termCalendar.length > 0 ||
    schedule.dailyRoutine.length > 0;

  const navLinks = hasScheduleContent
    ? defaultNavLinks
    : defaultNavLinks.filter((link) => link.href !== "#schedule");

  const galleryCategories = getHomepageGalleryCategories(
    school.galleryImages,
  ).map((group) => ({
    category: group.category,
    slug: group.slug,
    accent: group.accentClass,
    photoCount: group.publishedPhotos.length,
    photos: getCarouselPhotos(group),
  }));

  return {
    slug: school.slug,
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
    logoUrl: school.logoUrl,
    brandColor: school.brandColor,
    heroDescription: settings.heroDescription,
    heroCtaPrimary: settings.heroCtaPrimary,
    heroCtaSecondary: settings.heroCtaSecondary,
    heroSlides: school.heroSlides.map((slide) => ({
      imageUrl: slide.imageUrl,
      title: slide.title,
    })),
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
      imageUrl: program.imageUrl,
    })),
    whyChooseUs: parseJsonArray<string>(settings.whyChooseUs),
    whyChooseUsIntro: settings.whyChooseUsIntro,
    galleryCategories,
    achievements: {
      subtitle: settings.achievementsSubtitle,
      note: settings.achievementsNote,
      cards: school.achievements.map((item) => ({
        title: item.title,
        description: item.description,
        category: item.category,
        categoryLabel: getCategoryLabel(item.category),
        displayLabel: getAchievementDisplayLabel(
          item.privacyDisplay,
          item.subjectName,
          item.subjectClass,
        ),
      })),
    },
    announcements: school.announcements.map((item) => ({
      title: item.title,
      category: item.category,
      categoryLabel: getAnnouncementCategoryLabel(item.category),
      message: item.message,
      date: item.displayDate,
    })),
    downloads: school.downloads.map((item) => ({
      title: item.title,
      description: item.description,
      category: item.category,
      categoryLabel: getDownloadCategoryLabel(item.category),
      fileUrl: item.fileUrl,
    })),
    schedule,
    contact: {
      headline: settings.contactHeadline,
      description: settings.contactDescription,
      ctaHeadline: settings.contactCtaHeadline,
      ctaDescription: settings.contactCtaDescription,
    },
    footer: {
      poweredBy: settings.poweredByFooter,
    },
    navLinks,
  };
}

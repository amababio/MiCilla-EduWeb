import { PrismaClient } from "@prisma/client";
import {
  demoSchoolSeeds,
  type SchoolSeed,
} from "../src/data/seed-content";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

const demoAdminAccounts: Record<string, string> = {
  "redemption-international-school":
    (process.env.SEED_ADMIN_EMAIL ?? "admin@example.com").toLowerCase(),
  "grace-basic-school": "grace-admin@example.com",
};

async function seedSchool(seed: SchoolSeed) {
  const school = await prisma.school.upsert({
    where: { slug: seed.slug },
    update: {
      name: seed.name,
      initials: seed.initials,
      tagline: seed.tagline,
      motto: seed.motto,
      poBox: seed.poBox,
      location: seed.location,
      phone: seed.phone,
      whatsapp: seed.whatsapp,
      email: seed.email,
      officeHours: seed.officeHours,
    },
    create: {
      slug: seed.slug,
      name: seed.name,
      initials: seed.initials,
      tagline: seed.tagline,
      motto: seed.motto,
      poBox: seed.poBox,
      location: seed.location,
      phone: seed.phone,
      whatsapp: seed.whatsapp,
      email: seed.email,
      officeHours: seed.officeHours,
      brandColor: seed.brandColor,
    },
  });

  await prisma.websiteSettings.upsert({
    where: { schoolId: school.id },
    update: {
      heroDescription: seed.websiteSettings.heroDescription,
      heroCtaPrimary: seed.websiteSettings.heroCtaPrimary,
      heroCtaSecondary: seed.websiteSettings.heroCtaSecondary,
      admissionsHeadline: seed.websiteSettings.admissionsHeadline,
      admissionsDescription: seed.websiteSettings.admissionsDescription,
      admissionLevels: [...seed.websiteSettings.admissionLevels],
      aboutDescription: seed.websiteSettings.aboutDescription,
      aboutValues: [...seed.websiteSettings.aboutValues],
      whyChooseUsIntro: seed.websiteSettings.whyChooseUsIntro,
      whyChooseUs: [...seed.websiteSettings.whyChooseUs],
      achievementsSubtitle: seed.websiteSettings.achievementsSubtitle,
      achievementsNote: seed.websiteSettings.achievementsNote,
      contactHeadline: seed.websiteSettings.contactHeadline,
      contactDescription: seed.websiteSettings.contactDescription,
      contactCtaHeadline: seed.websiteSettings.contactCtaHeadline,
      contactCtaDescription: seed.websiteSettings.contactCtaDescription,
      poweredByFooter: seed.websiteSettings.poweredByFooter,
    },
    create: {
      schoolId: school.id,
      heroDescription: seed.websiteSettings.heroDescription,
      heroCtaPrimary: seed.websiteSettings.heroCtaPrimary,
      heroCtaSecondary: seed.websiteSettings.heroCtaSecondary,
      admissionsHeadline: seed.websiteSettings.admissionsHeadline,
      admissionsDescription: seed.websiteSettings.admissionsDescription,
      admissionLevels: [...seed.websiteSettings.admissionLevels],
      aboutDescription: seed.websiteSettings.aboutDescription,
      aboutValues: [...seed.websiteSettings.aboutValues],
      whyChooseUsIntro: seed.websiteSettings.whyChooseUsIntro,
      whyChooseUs: [...seed.websiteSettings.whyChooseUs],
      achievementsSubtitle: seed.websiteSettings.achievementsSubtitle,
      achievementsNote: seed.websiteSettings.achievementsNote,
      contactHeadline: seed.websiteSettings.contactHeadline,
      contactDescription: seed.websiteSettings.contactDescription,
      contactCtaHeadline: seed.websiteSettings.contactCtaHeadline,
      contactCtaDescription: seed.websiteSettings.contactCtaDescription,
      poweredByFooter: seed.websiteSettings.poweredByFooter,
    },
  });

  await prisma.program.deleteMany({ where: { schoolId: school.id } });
  await prisma.program.createMany({
    data: seed.programs.map((program, index) => ({
      schoolId: school.id,
      name: program.name,
      description: program.description,
      sortOrder: index,
    })),
  });

  await prisma.galleryImage.deleteMany({ where: { schoolId: school.id } });
  await prisma.galleryImage.createMany({
    data: seed.gallery.map((item, index) => ({
      schoolId: school.id,
      title: item.title,
      category: item.category,
      accentClass: item.accentClass,
      sortOrder: index,
      isFeatured: true,
    })),
  });

  await prisma.achievement.deleteMany({ where: { schoolId: school.id } });
  await prisma.achievement.createMany({
    data: seed.achievements.map((item, index) => ({
      schoolId: school.id,
      title: item.title,
      description: item.description,
      category: item.category,
      privacyDisplay: item.privacyDisplay,
      subjectName: item.subjectName ?? null,
      subjectClass: item.subjectClass ?? null,
      sortOrder: index,
      isPublished: true,
    })),
  });

  await prisma.announcement.deleteMany({ where: { schoolId: school.id } });
  await prisma.announcement.createMany({
    data: seed.announcements.map((item, index) => ({
      schoolId: school.id,
      title: item.title,
      category: item.category,
      message: item.message,
      displayDate: item.displayDate,
      sortOrder: index,
      isPublished: true,
    })),
  });

  await prisma.download.deleteMany({ where: { schoolId: school.id } });
  await prisma.download.createMany({
    data: seed.downloads.map((item, index) => ({
      schoolId: school.id,
      title: item.title,
      description: item.description,
      category: item.category,
      fileUrl: item.fileUrl ?? null,
      sortOrder: index,
      isPublished: true,
    })),
  });

  await prisma.classTimetableEntry.deleteMany({ where: { schoolId: school.id } });
  await prisma.examTimetableEntry.deleteMany({ where: { schoolId: school.id } });
  await prisma.termCalendarEvent.deleteMany({ where: { schoolId: school.id } });
  await prisma.dailyRoutineEntry.deleteMany({ where: { schoolId: school.id } });
  await prisma.scheduleActivity.deleteMany({ where: { schoolId: school.id } });
  await prisma.schoolClass.deleteMany({ where: { schoolId: school.id } });

  const classIdByName = new Map<string, string>();

  for (const [index, name] of seed.schedule.classes.entries()) {
    const created = await prisma.schoolClass.create({
      data: {
        schoolId: school.id,
        name,
        sortOrder: index,
        isActive: true,
      },
    });
    classIdByName.set(name, created.id);
  }

  await prisma.scheduleActivity.createMany({
    data: seed.schedule.activities.map((item, index) => ({
      schoolId: school.id,
      name: item.name,
      category: item.category,
      sortOrder: index,
      isActive: true,
    })),
  });

  if (seed.schedule.classTimetable.length > 0) {
    await prisma.classTimetableEntry.createMany({
      data: seed.schedule.classTimetable.map((item, index) => ({
        schoolId: school.id,
        schoolClassId: classIdByName.get(item.className)!,
        dayOfWeek: item.dayOfWeek,
        periodLabel: item.periodLabel,
        startTime: item.startTime,
        endTime: item.endTime,
        activityName: item.activityName,
        sortOrder: index,
        isPublished: true,
      })),
    });
  }

  if (seed.schedule.examTimetable.length > 0) {
    await prisma.examTimetableEntry.createMany({
      data: seed.schedule.examTimetable.map((item, index) => ({
        schoolId: school.id,
        schoolClassId: item.className
          ? (classIdByName.get(item.className) ?? null)
          : null,
        subjectName: item.subjectName,
        examDate: item.examDate,
        startTime: item.startTime,
        endTime: item.endTime,
        sortOrder: index,
        isPublished: true,
      })),
    });
  }

  await prisma.termCalendarEvent.createMany({
    data: seed.schedule.termCalendar.map((item, index) => ({
      schoolId: school.id,
      title: item.title,
      displayDate: item.displayDate,
      description: item.description,
      sortOrder: index,
      isPublished: true,
    })),
  });

  await prisma.dailyRoutineEntry.createMany({
    data: seed.schedule.dailyRoutine.map((item, index) => ({
      schoolId: school.id,
      timeLabel: item.timeLabel,
      title: item.title,
      level: item.level,
      sortOrder: index,
      isPublished: true,
    })),
  });

  const adminEmail =
    demoAdminAccounts[seed.slug] ??
    (process.env.SEED_ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin123!";
  const passwordHash = await hashPassword(adminPassword);

  await prisma.admin.deleteMany({ where: { schoolId: school.id } });

  await prisma.admin.create({
    data: {
      schoolId: school.id,
      email: adminEmail,
      name: "School Admin",
      passwordHash,
      isActive: true,
    },
  });

  console.log(`Seeded school: ${school.name} (${school.slug})`);
  console.log(`Seeded admin: ${adminEmail}`);
}

async function main() {
  for (const seed of demoSchoolSeeds) {
    await seedSchool(seed);
  }

  const superAdminEmail = (
    process.env.SEED_SUPER_ADMIN_EMAIL ?? "super@micilla.com"
  ).toLowerCase();
  const superAdminPassword = process.env.SEED_SUPER_ADMIN_PASSWORD ?? "super123!";
  const superAdminPasswordHash = await hashPassword(superAdminPassword);

  await prisma.superAdmin.upsert({
    where: { email: superAdminEmail },
    update: {
      name: "MiCilla Super Admin",
      passwordHash: superAdminPasswordHash,
      isActive: true,
    },
    create: {
      email: superAdminEmail,
      name: "MiCilla Super Admin",
      passwordHash: superAdminPasswordHash,
      isActive: true,
    },
  });

  console.log(`Seeded super admin: ${superAdminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";
import { redemptionSchoolSeed } from "../src/data/seed-content";
import { hashPassword } from "../src/lib/password";

const prisma = new PrismaClient();

async function main() {
  const seed = redemptionSchoolSeed;

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
    },
  });

  await prisma.websiteSettings.upsert({
    where: { schoolId: school.id },
    update: {
      heroDescription: seed.websiteSettings.heroDescription,
      admissionsHeadline: seed.websiteSettings.admissionsHeadline,
      admissionsDescription: seed.websiteSettings.admissionsDescription,
      admissionLevels: [...seed.websiteSettings.admissionLevels],
      aboutDescription: seed.websiteSettings.aboutDescription,
      aboutValues: [...seed.websiteSettings.aboutValues],
      whyChooseUs: [...seed.websiteSettings.whyChooseUs],
      achievementsSubtitle: seed.websiteSettings.achievementsSubtitle,
      achievementsNote: seed.websiteSettings.achievementsNote,
      contactHeadline: seed.websiteSettings.contactHeadline,
      contactDescription: seed.websiteSettings.contactDescription,
      poweredByFooter: seed.websiteSettings.poweredByFooter,
    },
    create: {
      schoolId: school.id,
      heroDescription: seed.websiteSettings.heroDescription,
      admissionsHeadline: seed.websiteSettings.admissionsHeadline,
      admissionsDescription: seed.websiteSettings.admissionsDescription,
      admissionLevels: [...seed.websiteSettings.admissionLevels],
      aboutDescription: seed.websiteSettings.aboutDescription,
      aboutValues: [...seed.websiteSettings.aboutValues],
      whyChooseUs: [...seed.websiteSettings.whyChooseUs],
      achievementsSubtitle: seed.websiteSettings.achievementsSubtitle,
      achievementsNote: seed.websiteSettings.achievementsNote,
      contactHeadline: seed.websiteSettings.contactHeadline,
      contactDescription: seed.websiteSettings.contactDescription,
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
      category: "preview",
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
      sortOrder: index,
      isPublished: true,
    })),
  });

  const adminEmail = (
    process.env.SEED_ADMIN_EMAIL ?? "admin@redemptioninternationalschool.edu.gh"
  ).toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";
  const adminName = "School Admin";
  const passwordHash = await hashPassword(adminPassword);

  await prisma.admin.upsert({
    where: {
      schoolId_email: {
        schoolId: school.id,
        email: adminEmail,
      },
    },
    update: {
      name: adminName,
      passwordHash,
      isActive: true,
    },
    create: {
      schoolId: school.id,
      email: adminEmail,
      name: adminName,
      passwordHash,
      isActive: true,
    },
  });

  console.log(`Seeded school: ${school.name} (${school.slug})`);
  console.log(`Seeded admin: ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

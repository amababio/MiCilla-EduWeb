import { prisma } from "@/lib/prisma";

export type AdminDashboardStats = {
  programs: number;
  photos: number;
  notices: number;
  achievements: number;
  files: number;
  schedule: number;
};

export async function getAdminDashboardStats(
  schoolId: string,
): Promise<AdminDashboardStats> {
  const [programs, photos, notices, achievements, files, scheduleClasses] =
    await Promise.all([
    prisma.program.count({ where: { schoolId, isActive: true } }),
    prisma.galleryImage.count({ where: { schoolId, isFeatured: true } }),
    prisma.announcement.count({ where: { schoolId, isPublished: true } }),
    prisma.achievement.count({ where: { schoolId, isPublished: true } }),
    prisma.download.count({ where: { schoolId, isPublished: true } }),
    prisma.schoolClass.count({ where: { schoolId, isActive: true } }),
  ]);

  return { programs, photos, notices, achievements, files, schedule: scheduleClasses };
}

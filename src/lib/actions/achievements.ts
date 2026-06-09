"use server";

import { revalidatePath, refresh } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import {
  parseAchievementInput,
  parseAchievementSectionInput,
} from "@/lib/achievements";
import { prisma } from "@/lib/prisma";

export type AchievementAdminItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  privacyDisplay: string;
  subjectName: string | null;
  subjectClass: string | null;
  isPublished: boolean;
  sortOrder: number;
};

export type AchievementSectionData = {
  achievementsSubtitle: string;
  achievementsNote: string;
};

export async function getAchievementsForAdmin(
  schoolId: string,
): Promise<AchievementAdminItem[]> {
  return prisma.achievement.findMany({
    where: { schoolId },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      privacyDisplay: true,
      subjectName: true,
      subjectClass: true,
      isPublished: true,
      sortOrder: true,
    },
  });
}

export async function getAchievementSectionForAdmin(
  schoolId: string,
): Promise<AchievementSectionData | null> {
  const settings = await prisma.websiteSettings.findUnique({
    where: { schoolId },
    select: {
      achievementsSubtitle: true,
      achievementsNote: true,
    },
  });

  return settings;
}

async function revalidatePublicSite() {
  revalidatePath("/", "page");
  refresh();
}

async function getSessionSchoolId(): Promise<string | null> {
  const session = await getAdminSession();
  return session?.schoolId ?? null;
}

async function findOwnedAchievement(achievementId: string, schoolId: string) {
  return prisma.achievement.findFirst({
    where: { id: achievementId, schoolId },
  });
}

export type AchievementFormState = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function saveAchievementSectionFormAction(
  _prevState: AchievementFormState,
  formData: FormData,
): Promise<AchievementFormState> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseAchievementSectionInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    await prisma.websiteSettings.update({
      where: { schoolId },
      data: {
        achievementsSubtitle: parsed.data.achievementsSubtitle,
        achievementsNote: parsed.data.achievementsNote,
      },
    });

    await revalidatePublicSite();

    return { success: true, message: "Section text updated." };
  } catch (error) {
    console.error("saveAchievementSectionFormAction failed:", error);
    return {
      success: false,
      error: "Could not save section text. Please try again.",
    };
  }
}

export async function createAchievementFormAction(
  _prevState: AchievementFormState,
  formData: FormData,
): Promise<AchievementFormState> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseAchievementInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const lastAchievement = await prisma.achievement.findFirst({
      where: { schoolId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    await prisma.achievement.create({
      data: {
        schoolId,
        title: parsed.data.title,
        description: parsed.data.description,
        category: parsed.data.category,
        privacyDisplay: parsed.data.privacyDisplay,
        subjectName: parsed.data.subjectName,
        subjectClass: parsed.data.subjectClass,
        isPublished: parsed.data.isPublished,
        sortOrder: (lastAchievement?.sortOrder ?? -1) + 1,
      },
    });

    await revalidatePublicSite();

    return {
      success: true,
      message: parsed.data.isPublished
        ? "Achievement added and shown on your public homepage."
        : "Achievement saved as a draft. Publish it when you are ready.",
    };
  } catch (error) {
    console.error("createAchievementFormAction failed:", error);
    return {
      success: false,
      error: "Could not add the achievement. Please try again.",
    };
  }
}

export async function updateAchievementFormAction(
  _prevState: AchievementFormState,
  formData: FormData,
): Promise<AchievementFormState> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const achievementId = String(formData.get("achievementId") ?? "").trim();
  if (!achievementId) {
    return { success: false, error: "Achievement not found." };
  }

  const parsed = parseAchievementInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const achievement = await findOwnedAchievement(achievementId, schoolId);
    if (!achievement) {
      return { success: false, error: "Achievement not found." };
    }

    await prisma.achievement.update({
      where: { id: achievementId },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        category: parsed.data.category,
        privacyDisplay: parsed.data.privacyDisplay,
        subjectName: parsed.data.subjectName,
        subjectClass: parsed.data.subjectClass,
        isPublished: parsed.data.isPublished,
      },
    });

    await revalidatePublicSite();

    return { success: true, message: "Achievement updated." };
  } catch (error) {
    console.error("updateAchievementFormAction failed:", error);
    return {
      success: false,
      error: "Could not save changes. Please try again.",
    };
  }
}

export async function deleteAchievementAction(achievementId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const achievement = await findOwnedAchievement(achievementId, schoolId);
    if (!achievement) {
      return { success: false, error: "Achievement not found." };
    }

    await prisma.achievement.delete({ where: { id: achievementId } });

    await revalidatePublicSite();

    return { success: true };
  } catch (error) {
    console.error("deleteAchievementAction failed:", error);
    return { success: false, error: "Could not remove the achievement." };
  }
}

export async function setAchievementPublishedAction(
  achievementId: string,
  isPublished: boolean,
): Promise<{ success: boolean; error?: string }> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const achievement = await findOwnedAchievement(achievementId, schoolId);
    if (!achievement) {
      return { success: false, error: "Achievement not found." };
    }

    await prisma.achievement.update({
      where: { id: achievementId },
      data: { isPublished },
    });

    await revalidatePublicSite();

    return { success: true };
  } catch (error) {
    console.error("setAchievementPublishedAction failed:", error);
    return { success: false, error: "Could not update the achievement." };
  }
}

export async function moveAchievementAction(
  achievementId: string,
  direction: "up" | "down",
): Promise<{ success: boolean; error?: string }> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const achievements = await prisma.achievement.findMany({
      where: { schoolId },
      orderBy: { sortOrder: "asc" },
      select: { id: true, sortOrder: true },
    });

    const index = achievements.findIndex((item) => item.id === achievementId);
    if (index === -1) {
      return { success: false, error: "Achievement not found." };
    }

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= achievements.length) {
      return { success: true };
    }

    const current = achievements[index];
    const neighbor = achievements[swapIndex];

    await prisma.$transaction([
      prisma.achievement.update({
        where: { id: current.id },
        data: { sortOrder: neighbor.sortOrder },
      }),
      prisma.achievement.update({
        where: { id: neighbor.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);

    await revalidatePublicSite();

    return { success: true };
  } catch (error) {
    console.error("moveAchievementAction failed:", error);
    return { success: false, error: "Could not change the order." };
  }
}

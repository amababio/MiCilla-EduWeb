"use server";

import { revalidatePath, refresh } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { parseAnnouncementInput } from "@/lib/announcements";
import { prisma } from "@/lib/prisma";

export type AnnouncementAdminItem = {
  id: string;
  title: string;
  category: string;
  message: string;
  displayDate: string;
  isPublished: boolean;
  sortOrder: number;
};

export async function getAnnouncementsForAdmin(
  schoolId: string,
): Promise<AnnouncementAdminItem[]> {
  return prisma.announcement.findMany({
    where: { schoolId },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      category: true,
      message: true,
      displayDate: true,
      isPublished: true,
      sortOrder: true,
    },
  });
}

async function revalidatePublicSite() {
  revalidatePath("/", "page");
  refresh();
}

async function getSessionSchoolId(): Promise<string | null> {
  const session = await getAdminSession();
  return session?.schoolId ?? null;
}

async function findOwnedAnnouncement(
  announcementId: string,
  schoolId: string,
) {
  return prisma.announcement.findFirst({
    where: { id: announcementId, schoolId },
  });
}

export type AnnouncementFormState = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function createAnnouncementFormAction(
  _prevState: AnnouncementFormState,
  formData: FormData,
): Promise<AnnouncementFormState> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseAnnouncementInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const lastAnnouncement = await prisma.announcement.findFirst({
      where: { schoolId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    await prisma.announcement.create({
      data: {
        schoolId,
        title: parsed.data.title,
        category: parsed.data.category,
        message: parsed.data.message,
        displayDate: parsed.data.displayDate,
        isPublished: parsed.data.isPublished,
        sortOrder: (lastAnnouncement?.sortOrder ?? -1) + 1,
      },
    });

    await revalidatePublicSite();

    return {
      success: true,
      message: parsed.data.isPublished
        ? "Announcement published on your public website."
        : "Announcement saved as a draft.",
    };
  } catch (error) {
    console.error("createAnnouncementFormAction failed:", error);
    return {
      success: false,
      error: "Could not add the announcement. Please try again.",
    };
  }
}

export async function updateAnnouncementFormAction(
  _prevState: AnnouncementFormState,
  formData: FormData,
): Promise<AnnouncementFormState> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const announcementId = String(formData.get("announcementId") ?? "").trim();
  if (!announcementId) {
    return { success: false, error: "Announcement not found." };
  }

  const parsed = parseAnnouncementInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const announcement = await findOwnedAnnouncement(announcementId, schoolId);
    if (!announcement) {
      return { success: false, error: "Announcement not found." };
    }

    await prisma.announcement.update({
      where: { id: announcementId },
      data: {
        title: parsed.data.title,
        category: parsed.data.category,
        message: parsed.data.message,
        displayDate: parsed.data.displayDate,
        isPublished: parsed.data.isPublished,
      },
    });

    await revalidatePublicSite();

    return { success: true, message: "Announcement updated." };
  } catch (error) {
    console.error("updateAnnouncementFormAction failed:", error);
    return {
      success: false,
      error: "Could not save changes. Please try again.",
    };
  }
}

export async function deleteAnnouncementAction(announcementId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const announcement = await findOwnedAnnouncement(announcementId, schoolId);
    if (!announcement) {
      return { success: false, error: "Announcement not found." };
    }

    await prisma.announcement.delete({ where: { id: announcementId } });

    await revalidatePublicSite();

    return { success: true };
  } catch (error) {
    console.error("deleteAnnouncementAction failed:", error);
    return { success: false, error: "Could not remove the announcement." };
  }
}

export async function setAnnouncementPublishedAction(
  announcementId: string,
  isPublished: boolean,
): Promise<{ success: boolean; error?: string }> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const announcement = await findOwnedAnnouncement(announcementId, schoolId);
    if (!announcement) {
      return { success: false, error: "Announcement not found." };
    }

    await prisma.announcement.update({
      where: { id: announcementId },
      data: { isPublished },
    });

    await revalidatePublicSite();

    return { success: true };
  } catch (error) {
    console.error("setAnnouncementPublishedAction failed:", error);
    return { success: false, error: "Could not update the announcement." };
  }
}

export async function moveAnnouncementAction(
  announcementId: string,
  direction: "up" | "down",
): Promise<{ success: boolean; error?: string }> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const announcements = await prisma.announcement.findMany({
      where: { schoolId },
      orderBy: { sortOrder: "asc" },
      select: { id: true, sortOrder: true },
    });

    const index = announcements.findIndex((item) => item.id === announcementId);
    if (index === -1) {
      return { success: false, error: "Announcement not found." };
    }

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= announcements.length) {
      return { success: true };
    }

    const current = announcements[index];
    const neighbor = announcements[swapIndex];

    await prisma.$transaction([
      prisma.announcement.update({
        where: { id: current.id },
        data: { sortOrder: neighbor.sortOrder },
      }),
      prisma.announcement.update({
        where: { id: neighbor.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);

    await revalidatePublicSite();

    return { success: true };
  } catch (error) {
    console.error("moveAnnouncementAction failed:", error);
    return { success: false, error: "Could not change the order." };
  }
}

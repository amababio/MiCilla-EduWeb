"use server";

import { revalidatePath, refresh } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { parseDownloadInput } from "@/lib/downloads";
import { prisma } from "@/lib/prisma";

export type DownloadAdminItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
};

export async function getDownloadsForAdmin(
  schoolId: string,
): Promise<DownloadAdminItem[]> {
  return prisma.download.findMany({
    where: { schoolId },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      fileUrl: true,
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

async function findOwnedDownload(downloadId: string, schoolId: string) {
  return prisma.download.findFirst({
    where: { id: downloadId, schoolId },
  });
}

export type DownloadFormState = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function createDownloadFormAction(
  _prevState: DownloadFormState,
  formData: FormData,
): Promise<DownloadFormState> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseDownloadInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const lastDownload = await prisma.download.findFirst({
      where: { schoolId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    await prisma.download.create({
      data: {
        schoolId,
        title: parsed.data.title,
        description: parsed.data.description,
        category: parsed.data.category,
        fileUrl: parsed.data.fileUrl,
        isPublished: parsed.data.isPublished,
        sortOrder: (lastDownload?.sortOrder ?? -1) + 1,
      },
    });

    await revalidatePublicSite();

    return {
      success: true,
      message: parsed.data.isPublished
        ? "File added and shown on your public website."
        : "File saved as a draft.",
    };
  } catch (error) {
    console.error("createDownloadFormAction failed:", error);
    return { success: false, error: "Could not add the file. Please try again." };
  }
}

export async function updateDownloadFormAction(
  _prevState: DownloadFormState,
  formData: FormData,
): Promise<DownloadFormState> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const downloadId = String(formData.get("downloadId") ?? "").trim();
  if (!downloadId) {
    return { success: false, error: "File not found." };
  }

  const parsed = parseDownloadInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const download = await findOwnedDownload(downloadId, schoolId);
    if (!download) {
      return { success: false, error: "File not found." };
    }

    await prisma.download.update({
      where: { id: downloadId },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        category: parsed.data.category,
        fileUrl: parsed.data.fileUrl,
        isPublished: parsed.data.isPublished,
      },
    });

    await revalidatePublicSite();

    return { success: true, message: "File updated." };
  } catch (error) {
    console.error("updateDownloadFormAction failed:", error);
    return {
      success: false,
      error: "Could not save changes. Please try again.",
    };
  }
}

export async function deleteDownloadAction(downloadId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const download = await findOwnedDownload(downloadId, schoolId);
    if (!download) {
      return { success: false, error: "File not found." };
    }

    await prisma.download.delete({ where: { id: downloadId } });

    await revalidatePublicSite();

    return { success: true };
  } catch (error) {
    console.error("deleteDownloadAction failed:", error);
    return { success: false, error: "Could not remove the file." };
  }
}

export async function setDownloadPublishedAction(
  downloadId: string,
  isPublished: boolean,
): Promise<{ success: boolean; error?: string }> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const download = await findOwnedDownload(downloadId, schoolId);
    if (!download) {
      return { success: false, error: "File not found." };
    }

    await prisma.download.update({
      where: { id: downloadId },
      data: { isPublished },
    });

    await revalidatePublicSite();

    return { success: true };
  } catch (error) {
    console.error("setDownloadPublishedAction failed:", error);
    return { success: false, error: "Could not update the file." };
  }
}

export async function moveDownloadAction(
  downloadId: string,
  direction: "up" | "down",
): Promise<{ success: boolean; error?: string }> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const downloads = await prisma.download.findMany({
      where: { schoolId },
      orderBy: { sortOrder: "asc" },
      select: { id: true, sortOrder: true },
    });

    const index = downloads.findIndex((item) => item.id === downloadId);
    if (index === -1) {
      return { success: false, error: "File not found." };
    }

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= downloads.length) {
      return { success: true };
    }

    const current = downloads[index];
    const neighbor = downloads[swapIndex];

    await prisma.$transaction([
      prisma.download.update({
        where: { id: current.id },
        data: { sortOrder: neighbor.sortOrder },
      }),
      prisma.download.update({
        where: { id: neighbor.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);

    await revalidatePublicSite();

    return { success: true };
  } catch (error) {
    console.error("moveDownloadAction failed:", error);
    return { success: false, error: "Could not change the order." };
  }
}

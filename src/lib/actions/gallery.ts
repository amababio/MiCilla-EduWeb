"use server";

import { revalidatePath, refresh } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { parseGalleryInput } from "@/lib/gallery";
import { prisma } from "@/lib/prisma";

export type GalleryPhotoAdminItem = {
  id: string;
  title: string;
  category: string;
  imageUrl: string | null;
  accentClass: string;
  isFeatured: boolean;
  sortOrder: number;
};

export async function getGalleryPhotosForAdmin(
  schoolId: string,
): Promise<GalleryPhotoAdminItem[]> {
  return prisma.galleryImage.findMany({
    where: { schoolId },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      category: true,
      imageUrl: true,
      accentClass: true,
      isFeatured: true,
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

async function findOwnedPhoto(photoId: string, schoolId: string) {
  return prisma.galleryImage.findFirst({
    where: { id: photoId, schoolId },
  });
}

export type GalleryFormState = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function createGalleryPhotoFormAction(
  _prevState: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseGalleryInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const lastPhoto = await prisma.galleryImage.findFirst({
      where: { schoolId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    await prisma.galleryImage.create({
      data: {
        schoolId,
        title: parsed.data.title,
        category: parsed.data.category,
        imageUrl: parsed.data.imageUrl,
        accentClass: parsed.data.accentClass,
        isFeatured: parsed.data.isFeatured,
        sortOrder: (lastPhoto?.sortOrder ?? -1) + 1,
      },
    });

    await revalidatePublicSite();

    return {
      success: true,
      message: parsed.data.isFeatured
        ? "Photo added and shown on your public homepage."
        : "Photo added. It is saved but not shown on the homepage yet.",
    };
  } catch (error) {
    console.error("createGalleryPhotoFormAction failed:", error);
    return { success: false, error: "Could not add the photo. Please try again." };
  }
}

export async function updateGalleryPhotoFormAction(
  _prevState: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const photoId = String(formData.get("photoId") ?? "").trim();
  if (!photoId) {
    return { success: false, error: "Photo not found." };
  }

  const parsed = parseGalleryInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const photo = await findOwnedPhoto(photoId, schoolId);
    if (!photo) {
      return { success: false, error: "Photo not found." };
    }

    await prisma.galleryImage.update({
      where: { id: photoId },
      data: {
        title: parsed.data.title,
        category: parsed.data.category,
        imageUrl: parsed.data.imageUrl,
        accentClass: parsed.data.accentClass,
        isFeatured: parsed.data.isFeatured,
      },
    });

    await revalidatePublicSite();

    return { success: true, message: "Photo updated." };
  } catch (error) {
    console.error("updateGalleryPhotoFormAction failed:", error);
    return {
      success: false,
      error: "Could not save changes. Please try again.",
    };
  }
}

export async function deleteGalleryPhotoAction(photoId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const photo = await findOwnedPhoto(photoId, schoolId);
    if (!photo) {
      return { success: false, error: "Photo not found." };
    }

    await prisma.galleryImage.delete({ where: { id: photoId } });

    await revalidatePublicSite();

    return { success: true };
  } catch (error) {
    console.error("deleteGalleryPhotoAction failed:", error);
    return { success: false, error: "Could not remove the photo." };
  }
}

export async function setGalleryPhotoFeaturedAction(
  photoId: string,
  isFeatured: boolean,
): Promise<{ success: boolean; error?: string }> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const photo = await findOwnedPhoto(photoId, schoolId);
    if (!photo) {
      return { success: false, error: "Photo not found." };
    }

    await prisma.galleryImage.update({
      where: { id: photoId },
      data: { isFeatured },
    });

    await revalidatePublicSite();

    return { success: true };
  } catch (error) {
    console.error("setGalleryPhotoFeaturedAction failed:", error);
    return { success: false, error: "Could not update the photo." };
  }
}

export async function moveGalleryPhotoAction(
  photoId: string,
  direction: "up" | "down",
): Promise<{ success: boolean; error?: string }> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const photos = await prisma.galleryImage.findMany({
      where: { schoolId },
      orderBy: { sortOrder: "asc" },
      select: { id: true, sortOrder: true },
    });

    const index = photos.findIndex((photo) => photo.id === photoId);
    if (index === -1) {
      return { success: false, error: "Photo not found." };
    }

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= photos.length) {
      return { success: true };
    }

    const current = photos[index];
    const neighbor = photos[swapIndex];

    await prisma.$transaction([
      prisma.galleryImage.update({
        where: { id: current.id },
        data: { sortOrder: neighbor.sortOrder },
      }),
      prisma.galleryImage.update({
        where: { id: neighbor.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);

    await revalidatePublicSite();

    return { success: true };
  } catch (error) {
    console.error("moveGalleryPhotoAction failed:", error);
    return { success: false, error: "Could not change the order." };
  }
}

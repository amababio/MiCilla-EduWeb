"use server";

import { getAdminSession } from "@/lib/auth";
import { galleryAccentPresets, parseGalleryInput } from "@/lib/gallery";
import {
  deleteUploadedImage,
  getUploadedImageFromForm,
  saveSchoolImageFile,
} from "@/lib/image-upload";
import { prisma } from "@/lib/prisma";
import { revalidatePublicSchoolPages } from "@/lib/revalidate-public-site";

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

async function getSession() {
  return getAdminSession();
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

const BULK_UPLOAD_LIMIT = 50;

const presetValues: Set<string> = new Set(
  galleryAccentPresets.map((preset) => preset.value),
);

function titleFromUploadFile(
  file: File,
  index: number,
  category: string,
): string {
  const base = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();

  if (base) {
    return base;
  }

  return `${category} Photo ${index + 1}`;
}

function getUploadFiles(formData: FormData): File[] {
  return formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

export async function bulkCreateGalleryPhotosFormAction(
  _prevState: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  const category = String(formData.get("category") ?? "").trim();
  if (!category) {
    return { success: false, error: "Please enter a category." };
  }

  const accentClass = String(formData.get("accentClass") ?? "").trim();
  if (!presetValues.has(accentClass)) {
    return { success: false, error: "Please choose a placeholder color." };
  }

  const files = getUploadFiles(formData);
  if (files.length === 0) {
    return { success: false, error: "Please choose one or more photos to upload." };
  }

  if (files.length > BULK_UPLOAD_LIMIT) {
    return {
      success: false,
      error: `Please upload up to ${BULK_UPLOAD_LIMIT} photos at a time.`,
    };
  }

  const isFeatured = formData.get("isFeatured") === "on";

  try {
    const lastPhoto = await prisma.galleryImage.findFirst({
      where: { schoolId: session.schoolId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    let nextSortOrder = (lastPhoto?.sortOrder ?? -1) + 1;
    let uploadedCount = 0;

    for (const [index, file] of files.entries()) {
      const photo = await prisma.galleryImage.create({
        data: {
          schoolId: session.schoolId,
          title: titleFromUploadFile(file, index, category),
          category,
          imageUrl: null,
          accentClass,
          isFeatured,
          sortOrder: nextSortOrder,
        },
      });

      nextSortOrder += 1;

      const saved = await saveSchoolImageFile(
        session.schoolId,
        "gallery",
        photo.id,
        file,
      );

      if ("error" in saved) {
        await prisma.galleryImage.delete({ where: { id: photo.id } });
        return {
          success: false,
          error:
            uploadedCount > 0
              ? `${saved.error} ${uploadedCount} photo(s) were uploaded before this error.`
              : saved.error,
        };
      }

      await prisma.galleryImage.update({
        where: { id: photo.id },
        data: { imageUrl: saved.publicPath },
      });

      uploadedCount += 1;
    }

    revalidatePublicSchoolPages(session.schoolSlug);

    return {
      success: true,
      message: `${uploadedCount} photo${uploadedCount === 1 ? "" : "s"} added to ${category}.`,
    };
  } catch (error) {
    console.error("bulkCreateGalleryPhotosFormAction failed:", error);
    return {
      success: false,
      error: "Could not upload the photos. Please try again.",
    };
  }
}

export async function createGalleryPhotoFormAction(
  _prevState: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseGalleryInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  const uploadFile = getUploadedImageFromForm(formData);

  try {
    const lastPhoto = await prisma.galleryImage.findFirst({
      where: { schoolId: session.schoolId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const photo = await prisma.galleryImage.create({
      data: {
        schoolId: session.schoolId,
        title: parsed.data.title,
        category: parsed.data.category,
        imageUrl: null,
        accentClass: parsed.data.accentClass,
        isFeatured: parsed.data.isFeatured,
        sortOrder: (lastPhoto?.sortOrder ?? -1) + 1,
      },
    });

    if (uploadFile) {
      const saved = await saveSchoolImageFile(
        session.schoolId,
        "gallery",
        photo.id,
        uploadFile,
      );

      if ("error" in saved) {
        await prisma.galleryImage.delete({ where: { id: photo.id } });
        return { success: false, error: saved.error };
      }

      await prisma.galleryImage.update({
        where: { id: photo.id },
        data: { imageUrl: saved.publicPath },
      });
    }

    revalidatePublicSchoolPages(session.schoolSlug);

    return {
      success: true,
      message: parsed.data.isFeatured
        ? "Photo added. Its category can appear on the homepage gallery."
        : "Photo added to your library.",
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
  const session = await getSession();
  if (!session) {
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
    const photo = await findOwnedPhoto(photoId, session.schoolId);
    if (!photo) {
      return { success: false, error: "Photo not found." };
    }

    let imageUrl = photo.imageUrl;
    const uploadFile = getUploadedImageFromForm(formData);

    if (uploadFile) {
      await deleteUploadedImage(session.schoolId, "gallery", photo.imageUrl);
      const saved = await saveSchoolImageFile(
        session.schoolId,
        "gallery",
        photoId,
        uploadFile,
      );

      if ("error" in saved) {
        return { success: false, error: saved.error };
      }

      imageUrl = saved.publicPath;
    }

    await prisma.galleryImage.update({
      where: { id: photoId },
      data: {
        title: parsed.data.title,
        category: parsed.data.category,
        imageUrl,
        accentClass: parsed.data.accentClass,
        isFeatured: parsed.data.isFeatured,
      },
    });

    revalidatePublicSchoolPages(session.schoolSlug);

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
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const photo = await findOwnedPhoto(photoId, session.schoolId);
    if (!photo) {
      return { success: false, error: "Photo not found." };
    }

    await deleteUploadedImage(session.schoolId, "gallery", photo.imageUrl);
    await prisma.galleryImage.delete({ where: { id: photoId } });

    revalidatePublicSchoolPages(session.schoolSlug);

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
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const photo = await findOwnedPhoto(photoId, session.schoolId);
    if (!photo) {
      return { success: false, error: "Photo not found." };
    }

    await prisma.galleryImage.update({
      where: { id: photoId },
      data: { isFeatured },
    });

    revalidatePublicSchoolPages(session.schoolSlug);

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
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const photos = await prisma.galleryImage.findMany({
      where: { schoolId: session.schoolId },
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

    revalidatePublicSchoolPages(session.schoolSlug);

    return { success: true };
  } catch (error) {
    console.error("moveGalleryPhotoAction failed:", error);
    return { success: false, error: "Could not change the order." };
  }
}

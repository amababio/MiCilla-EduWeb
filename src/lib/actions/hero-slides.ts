"use server";

import { getAdminSession } from "@/lib/auth";
import {
  deleteUploadedImage,
  getUploadedImageFromForm,
  saveSchoolImageFile,
} from "@/lib/image-upload";
import { prisma } from "@/lib/prisma";
import { revalidatePublicSchoolPages } from "@/lib/revalidate-public-site";

export type HeroSlideAdminItem = {
  id: string;
  title: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
};

export type HeroSlideFormState = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function getHeroSlidesForAdmin(
  schoolId: string,
): Promise<HeroSlideAdminItem[]> {
  return prisma.heroSlide.findMany({
    where: { schoolId },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      title: true,
      imageUrl: true,
      sortOrder: true,
      isActive: true,
    },
  });
}

async function getSession() {
  return getAdminSession();
}

async function findOwnedSlide(slideId: string, schoolId: string) {
  return prisma.heroSlide.findFirst({
    where: { id: slideId, schoolId },
  });
}

export async function createHeroSlideFormAction(
  _prevState: HeroSlideFormState,
  formData: FormData,
): Promise<HeroSlideFormState> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  const uploadFile = getUploadedImageFromForm(formData, "photo");
  if (!uploadFile) {
    return { success: false, error: "Please choose a photo to upload." };
  }

  const title = String(formData.get("title") ?? "").trim();

  try {
    const lastSlide = await prisma.heroSlide.findFirst({
      where: { schoolId: session.schoolId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const slide = await prisma.heroSlide.create({
      data: {
        schoolId: session.schoolId,
        title,
        imageUrl: "",
        sortOrder: (lastSlide?.sortOrder ?? -1) + 1,
        isActive: true,
      },
    });

    const saved = await saveSchoolImageFile(
      session.schoolId,
      "hero",
      slide.id,
      uploadFile,
    );

    if ("error" in saved) {
      await prisma.heroSlide.delete({ where: { id: slide.id } });
      return { success: false, error: saved.error };
    }

    await prisma.heroSlide.update({
      where: { id: slide.id },
      data: { imageUrl: saved.publicPath },
    });

    revalidatePublicSchoolPages(session.schoolSlug);

    return {
      success: true,
      message: "Hero photo added. It will appear in the homepage carousel.",
    };
  } catch (error) {
    console.error("createHeroSlideFormAction failed:", error);
    return { success: false, error: "Could not add the hero photo." };
  }
}

export async function updateHeroSlideFormAction(
  _prevState: HeroSlideFormState,
  formData: FormData,
): Promise<HeroSlideFormState> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  const slideId = String(formData.get("slideId") ?? "").trim();
  if (!slideId) {
    return { success: false, error: "Slide not found." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const uploadFile = getUploadedImageFromForm(formData, "photo");

  try {
    const slide = await findOwnedSlide(slideId, session.schoolId);
    if (!slide) {
      return { success: false, error: "Slide not found." };
    }

    let imageUrl = slide.imageUrl;

    if (uploadFile) {
      await deleteUploadedImage(session.schoolId, "hero", slide.imageUrl);
      const saved = await saveSchoolImageFile(
        session.schoolId,
        "hero",
        slideId,
        uploadFile,
      );

      if ("error" in saved) {
        return { success: false, error: saved.error };
      }

      imageUrl = saved.publicPath;
    }

    await prisma.heroSlide.update({
      where: { id: slideId },
      data: { title, imageUrl },
    });

    revalidatePublicSchoolPages(session.schoolSlug);

    return { success: true, message: "Hero photo updated." };
  } catch (error) {
    console.error("updateHeroSlideFormAction failed:", error);
    return { success: false, error: "Could not save changes." };
  }
}

export async function deleteHeroSlideAction(slideId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const slide = await findOwnedSlide(slideId, session.schoolId);
    if (!slide) {
      return { success: false, error: "Slide not found." };
    }

    await deleteUploadedImage(session.schoolId, "hero", slide.imageUrl);
    await prisma.heroSlide.delete({ where: { id: slideId } });

    revalidatePublicSchoolPages(session.schoolSlug);

    return { success: true };
  } catch (error) {
    console.error("deleteHeroSlideAction failed:", error);
    return { success: false, error: "Could not remove the hero photo." };
  }
}

export async function setHeroSlideActiveAction(
  slideId: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const slide = await findOwnedSlide(slideId, session.schoolId);
    if (!slide) {
      return { success: false, error: "Slide not found." };
    }

    await prisma.heroSlide.update({
      where: { id: slideId },
      data: { isActive },
    });

    revalidatePublicSchoolPages(session.schoolSlug);

    return { success: true };
  } catch (error) {
    console.error("setHeroSlideActiveAction failed:", error);
    return { success: false, error: "Could not update the slide." };
  }
}

export async function moveHeroSlideAction(
  slideId: string,
  direction: "up" | "down",
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const slides = await prisma.heroSlide.findMany({
      where: { schoolId: session.schoolId },
      orderBy: { sortOrder: "asc" },
      select: { id: true, sortOrder: true },
    });

    const index = slides.findIndex((slide) => slide.id === slideId);
    if (index === -1) {
      return { success: false, error: "Slide not found." };
    }

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= slides.length) {
      return { success: true };
    }

    const current = slides[index];
    const neighbor = slides[swapIndex];

    await prisma.$transaction([
      prisma.heroSlide.update({
        where: { id: current.id },
        data: { sortOrder: neighbor.sortOrder },
      }),
      prisma.heroSlide.update({
        where: { id: neighbor.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);

    revalidatePublicSchoolPages(session.schoolSlug);

    return { success: true };
  } catch (error) {
    console.error("moveHeroSlideAction failed:", error);
    return { success: false, error: "Could not change the order." };
  }
}

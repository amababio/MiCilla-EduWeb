"use server";

import { getAdminSession } from "@/lib/auth";
import {
  clearSchoolLogoFiles,
  isUploadedSchoolLogoUrl,
  saveSchoolLogoFile,
} from "@/lib/school-logo";
import { prisma } from "@/lib/prisma";
import { revalidatePublicSchoolPages } from "@/lib/revalidate-public-site";

export type SchoolLogoFormState = {
  success: boolean;
  error?: string;
  message?: string;
  logoUrl?: string | null;
};

async function revalidatePublicSite(schoolSlug: string) {
  revalidatePublicSchoolPages(schoolSlug);
}

export async function uploadSchoolLogoFormAction(
  _prevState: SchoolLogoFormState,
  formData: FormData,
): Promise<SchoolLogoFormState> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "Please choose a logo image to upload." };
  }

  try {
    const saved = await saveSchoolLogoFile(session.schoolId, file);
    if ("error" in saved) {
      return { success: false, error: saved.error };
    }

    await prisma.school.update({
      where: { id: session.schoolId },
      data: { logoUrl: saved.publicPath },
    });

    await revalidatePublicSite(session.schoolSlug);

    return {
      success: true,
      message: "Logo uploaded. Your public website has been updated.",
      logoUrl: saved.publicPath,
    };
  } catch (error) {
    console.error("uploadSchoolLogoFormAction failed:", error);
    return { success: false, error: "Could not upload the logo." };
  }
}

export async function removeSchoolLogoAction(): Promise<SchoolLogoFormState> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const school = await prisma.school.findUnique({
      where: { id: session.schoolId },
      select: { logoUrl: true },
    });

    if (school?.logoUrl && isUploadedSchoolLogoUrl(school.logoUrl)) {
      await clearSchoolLogoFiles(session.schoolId);
    }

    await prisma.school.update({
      where: { id: session.schoolId },
      data: { logoUrl: null },
    });

    await revalidatePublicSite(session.schoolSlug);

    return {
      success: true,
      message: "Logo removed. Your public website now shows school initials.",
      logoUrl: null,
    };
  } catch (error) {
    console.error("removeSchoolLogoAction failed:", error);
    return { success: false, error: "Could not remove the logo." };
  }
}

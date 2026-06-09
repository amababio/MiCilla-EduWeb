"use server";

import { revalidatePath, refresh } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseSchoolProfileInput } from "@/lib/school-profile";

export type SchoolProfileData = {
  name: string;
  initials: string;
  tagline: string;
  motto: string;
  poBox: string;
  location: string;
  phone: string;
  whatsapp: string;
  email: string;
  officeHours: string;
  logoUrl: string | null;
  brandColor: string;
};

export async function getSchoolProfileForAdmin(
  schoolId: string,
): Promise<SchoolProfileData | null> {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    select: {
      name: true,
      initials: true,
      tagline: true,
      motto: true,
      poBox: true,
      location: true,
      phone: true,
      whatsapp: true,
      email: true,
      officeHours: true,
      logoUrl: true,
      brandColor: true,
    },
  });

  return school;
}

export type SchoolProfileFormState = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function saveSchoolProfileFormAction(
  _prevState: SchoolProfileFormState,
  formData: FormData,
): Promise<SchoolProfileFormState> {
  const result = await updateSchoolProfile(formData);

  if (!result.success) {
    return { success: false, error: result.error ?? "Could not save changes." };
  }

  return {
    success: true,
    message: "Changes saved. Your public website has been updated.",
  };
}

export async function updateSchoolProfile(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseSchoolProfileInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  const data = parsed.data;

  try {
    await prisma.school.update({
      where: { id: session.schoolId },
      data: {
        name: data.name,
        initials: data.initials,
        tagline: data.tagline,
        motto: data.motto,
        poBox: data.poBox,
        location: data.location,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email,
        officeHours: data.officeHours,
        brandColor: data.brandColor,
      },
    });

    revalidatePath("/", "page");
    refresh();

    return { success: true };
  } catch (error) {
    console.error("updateSchoolProfile failed:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Could not save changes. Please try again.",
    };
  }
}

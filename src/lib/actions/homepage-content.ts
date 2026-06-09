"use server";

import { getAdminSession } from "@/lib/auth";
import { parseHomepageContentInput } from "@/lib/homepage-content";
import { prisma } from "@/lib/prisma";
import { revalidatePublicSchoolPages } from "@/lib/revalidate-public-site";
import type { AboutValue } from "@/types/public-site";

export type HomepageContentData = {
  heroDescription: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  admissionsHeadline: string;
  admissionsDescription: string;
  admissionLevelsText: string;
  aboutDescription: string;
  aboutValues: AboutValue[];
  whyChooseUsIntro: string;
  whyChooseUsText: string;
  contactHeadline: string;
  contactDescription: string;
  contactCtaHeadline: string;
  contactCtaDescription: string;
};

export async function getHomepageContentForAdmin(
  schoolId: string,
): Promise<HomepageContentData | null> {
  const settings = await prisma.websiteSettings.findUnique({
    where: { schoolId },
  });

  if (!settings) {
    return null;
  }

  const admissionLevels = Array.isArray(settings.admissionLevels)
    ? (settings.admissionLevels as string[])
    : [];
  const aboutValues = Array.isArray(settings.aboutValues)
    ? (settings.aboutValues as AboutValue[])
    : [];
  const whyChooseUs = Array.isArray(settings.whyChooseUs)
    ? (settings.whyChooseUs as string[])
    : [];

  return {
    heroDescription: settings.heroDescription,
    heroCtaPrimary: settings.heroCtaPrimary,
    heroCtaSecondary: settings.heroCtaSecondary,
    admissionsHeadline: settings.admissionsHeadline,
    admissionsDescription: settings.admissionsDescription,
    admissionLevelsText: admissionLevels.join("\n"),
    aboutDescription: settings.aboutDescription,
    aboutValues,
    whyChooseUsIntro: settings.whyChooseUsIntro,
    whyChooseUsText: whyChooseUs.join("\n"),
    contactHeadline: settings.contactHeadline,
    contactDescription: settings.contactDescription,
    contactCtaHeadline: settings.contactCtaHeadline,
    contactCtaDescription: settings.contactCtaDescription,
  };
}

export type HomepageContentFormState = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function saveHomepageContentFormAction(
  _prevState: HomepageContentFormState,
  formData: FormData,
): Promise<HomepageContentFormState> {
  const result = await updateHomepageContent(formData);

  if (!result.success) {
    return { success: false, error: result.error ?? "Could not save changes." };
  }

  return {
    success: true,
    message: "Changes saved. Your public website has been updated.",
  };
}

export async function updateHomepageContent(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getAdminSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseHomepageContentInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  const data = parsed.data;

  try {
    await prisma.websiteSettings.update({
      where: { schoolId: session.schoolId },
      data: {
        heroDescription: data.heroDescription,
        heroCtaPrimary: data.heroCtaPrimary,
        heroCtaSecondary: data.heroCtaSecondary,
        admissionsHeadline: data.admissionsHeadline,
        admissionsDescription: data.admissionsDescription,
        admissionLevels: data.admissionLevels,
        aboutDescription: data.aboutDescription,
        aboutValues: data.aboutValues,
        whyChooseUsIntro: data.whyChooseUsIntro,
        whyChooseUs: data.whyChooseUs,
        contactHeadline: data.contactHeadline,
        contactDescription: data.contactDescription,
        contactCtaHeadline: data.contactCtaHeadline,
        contactCtaDescription: data.contactCtaDescription,
      },
    });

    revalidatePublicSchoolPages(session.schoolSlug);

    return { success: true };
  } catch (error) {
    console.error("updateHomepageContent failed:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Could not save changes. Please try again.",
    };
  }
}

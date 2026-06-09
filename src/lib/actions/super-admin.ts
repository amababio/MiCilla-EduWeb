"use server";

import { revalidatePath } from "next/cache";
import { getSuperAdminSession } from "@/lib/super-admin-auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { getSchoolPublicPath } from "@/lib/school-slug";
import {
  buildDefaultWebsiteSettings,
  parseCreateSchoolAdminInput,
  parseCreateSchoolInput,
  parseResetSchoolAdminPasswordInput,
} from "@/lib/super-admin-schools";

export type SuperAdminSchoolAdminItem = {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
};

export type SuperAdminSchoolItem = {
  id: string;
  slug: string;
  name: string;
  initials: string;
  location: string;
  isActive: boolean;
  publicPath: string;
  admins: SuperAdminSchoolAdminItem[];
};

export type SuperAdminFormState = {
  success: boolean;
  error?: string;
  message?: string;
};

async function requireSuperAdminSession() {
  const session = await getSuperAdminSession();
  if (!session) {
    return null;
  }
  return session;
}

function revalidateSchoolPublicPages(slug: string) {
  revalidatePath("/", "page");
  revalidatePath(getSchoolPublicPath(slug), "page");
}

export async function getSchoolsForSuperAdmin(): Promise<SuperAdminSchoolItem[]> {
  const session = await requireSuperAdminSession();
  if (!session) {
    return [];
  }

  const schools = await prisma.school.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      initials: true,
      location: true,
      isActive: true,
      admins: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          email: true,
          name: true,
          isActive: true,
        },
      },
    },
  });

  return schools.map((school) => ({
    id: school.id,
    slug: school.slug,
    name: school.name,
    initials: school.initials,
    location: school.location,
    isActive: school.isActive,
    publicPath: getSchoolPublicPath(school.slug),
    admins: school.admins,
  }));
}

export async function createSchoolFormAction(
  _prevState: SuperAdminFormState,
  formData: FormData,
): Promise<SuperAdminFormState> {
  const session = await requireSuperAdminSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseCreateSchoolInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const existingSchool = await prisma.school.findUnique({
      where: { slug: parsed.data.slug },
      select: { id: true },
    });

    if (existingSchool) {
      return { success: false, error: "That school slug is already in use." };
    }

    const websiteSettings = buildDefaultWebsiteSettings(parsed.data.name);

    const school = await prisma.$transaction(async (tx) => {
      const createdSchool = await tx.school.create({
        data: {
          slug: parsed.data!.slug,
          name: parsed.data!.name,
          initials: parsed.data!.initials,
          tagline: parsed.data!.tagline,
          motto: parsed.data!.motto,
          poBox: parsed.data!.poBox,
          location: parsed.data!.location,
          phone: parsed.data!.phone,
          whatsapp: parsed.data!.whatsapp,
          email: parsed.data!.email,
          officeHours: parsed.data!.officeHours,
          brandColor: parsed.data!.brandColor,
          isActive: true,
        },
      });

      await tx.websiteSettings.create({
        data: {
          schoolId: createdSchool.id,
          ...websiteSettings,
        },
      });

      if (
        parsed.data!.adminEmail &&
        parsed.data!.adminName &&
        parsed.data!.adminPassword
      ) {
        const passwordHash = await hashPassword(parsed.data!.adminPassword);
        await tx.admin.create({
          data: {
            schoolId: createdSchool.id,
            email: parsed.data!.adminEmail,
            name: parsed.data!.adminName,
            passwordHash,
            isActive: true,
          },
        });
      }

      return createdSchool;
    });

    revalidateSchoolPublicPages(school.slug);

    return {
      success: true,
      message: parsed.data.adminEmail
        ? `School created with admin ${parsed.data.adminEmail}.`
        : "School created. Add a school admin when ready.",
    };
  } catch (error) {
    console.error("createSchoolFormAction failed:", error);
    return { success: false, error: "Could not create the school." };
  }
}

export async function createSchoolAdminFormAction(
  _prevState: SuperAdminFormState,
  formData: FormData,
): Promise<SuperAdminFormState> {
  const session = await requireSuperAdminSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseCreateSchoolAdminInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const school = await prisma.school.findUnique({
      where: { id: parsed.data.schoolId },
      select: { id: true, slug: true },
    });

    if (!school) {
      return { success: false, error: "School not found." };
    }

    const passwordHash = await hashPassword(parsed.data.password);

    await prisma.admin.create({
      data: {
        schoolId: parsed.data.schoolId,
        email: parsed.data.email,
        name: parsed.data.name,
        passwordHash,
        isActive: true,
      },
    });

    return {
      success: true,
      message: `Admin ${parsed.data.email} created for this school.`,
    };
  } catch (error) {
    console.error("createSchoolAdminFormAction failed:", error);
    return {
      success: false,
      error: "Could not create the admin. The email may already exist for this school.",
    };
  }
}

export async function resetSchoolAdminPasswordFormAction(
  _prevState: SuperAdminFormState,
  formData: FormData,
): Promise<SuperAdminFormState> {
  const session = await requireSuperAdminSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseResetSchoolAdminPasswordInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: parsed.data.adminId },
      select: { id: true, email: true },
    });

    if (!admin) {
      return { success: false, error: "Admin account not found." };
    }

    const passwordHash = await hashPassword(parsed.data.password);

    await prisma.admin.update({
      where: { id: admin.id },
      data: { passwordHash, isActive: true },
    });

    return {
      success: true,
      message: `Password reset for ${admin.email}.`,
    };
  } catch (error) {
    console.error("resetSchoolAdminPasswordFormAction failed:", error);
    return { success: false, error: "Could not reset the password." };
  }
}

export async function setSchoolActiveAction(
  schoolId: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  const session = await requireSuperAdminSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const school = await prisma.school.update({
      where: { id: schoolId },
      data: { isActive },
      select: { slug: true },
    });

    revalidateSchoolPublicPages(school.slug);

    return { success: true };
  } catch (error) {
    console.error("setSchoolActiveAction failed:", error);
    return { success: false, error: "Could not update the school." };
  }
}

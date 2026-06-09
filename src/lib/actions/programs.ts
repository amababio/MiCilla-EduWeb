"use server";

import { getAdminSession } from "@/lib/auth";
import {
  deleteUploadedImage,
  getUploadedImageFromForm,
  saveSchoolImageFile,
} from "@/lib/image-upload";
import { parseProgramInput } from "@/lib/programs";
import { prisma } from "@/lib/prisma";
import { revalidatePublicSchoolPages } from "@/lib/revalidate-public-site";

export type ProgramAdminItem = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
};

export async function getProgramsForAdmin(
  schoolId: string,
): Promise<ProgramAdminItem[]> {
  const programs = await prisma.program.findMany({
    where: { schoolId },
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      isActive: true,
      sortOrder: true,
    },
  });

  return programs;
}

async function getSession() {
  return getAdminSession();
}

async function findOwnedProgram(programId: string, schoolId: string) {
  return prisma.program.findFirst({
    where: { id: programId, schoolId },
  });
}

export type ProgramFormState = {
  success: boolean;
  error?: string;
  message?: string;
};

export async function createProgramFormAction(
  _prevState: ProgramFormState,
  formData: FormData,
): Promise<ProgramFormState> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseProgramInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  const uploadFile = getUploadedImageFromForm(formData);

  try {
    const lastProgram = await prisma.program.findFirst({
      where: { schoolId: session.schoolId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const program = await prisma.program.create({
      data: {
        schoolId: session.schoolId,
        name: parsed.data.name,
        description: parsed.data.description,
        imageUrl: null,
        sortOrder: (lastProgram?.sortOrder ?? -1) + 1,
        isActive: true,
      },
    });

    if (uploadFile) {
      const saved = await saveSchoolImageFile(
        session.schoolId,
        "programs",
        program.id,
        uploadFile,
      );

      if ("error" in saved) {
        await prisma.program.delete({ where: { id: program.id } });
        return { success: false, error: saved.error };
      }

      await prisma.program.update({
        where: { id: program.id },
        data: { imageUrl: saved.publicPath },
      });
    }

    revalidatePublicSchoolPages(session.schoolSlug);

    return {
      success: true,
      message: "Program added. It is now visible on your public website.",
    };
  } catch (error) {
    console.error("createProgramFormAction failed:", error);
    return {
      success: false,
      error: "Could not add the program. Please try again.",
    };
  }
}

export async function updateProgramFormAction(
  _prevState: ProgramFormState,
  formData: FormData,
): Promise<ProgramFormState> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  const programId = String(formData.get("programId") ?? "").trim();
  if (!programId) {
    return { success: false, error: "Program not found." };
  }

  const parsed = parseProgramInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const program = await findOwnedProgram(programId, session.schoolId);
    if (!program) {
      return { success: false, error: "Program not found." };
    }

    let imageUrl = program.imageUrl;
    const uploadFile = getUploadedImageFromForm(formData);

    if (uploadFile) {
      await deleteUploadedImage(session.schoolId, "programs", program.imageUrl);
      const saved = await saveSchoolImageFile(
        session.schoolId,
        "programs",
        programId,
        uploadFile,
      );

      if ("error" in saved) {
        return { success: false, error: saved.error };
      }

      imageUrl = saved.publicPath;
    }

    await prisma.program.update({
      where: { id: programId },
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        imageUrl,
      },
    });

    revalidatePublicSchoolPages(session.schoolSlug);

    return { success: true, message: "Program updated." };
  } catch (error) {
    console.error("updateProgramFormAction failed:", error);
    return {
      success: false,
      error: "Could not save changes. Please try again.",
    };
  }
}

export async function deleteProgramAction(programId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const program = await findOwnedProgram(programId, session.schoolId);
    if (!program) {
      return { success: false, error: "Program not found." };
    }

    await deleteUploadedImage(session.schoolId, "programs", program.imageUrl);
    await prisma.program.delete({ where: { id: programId } });

    revalidatePublicSchoolPages(session.schoolSlug);

    return { success: true };
  } catch (error) {
    console.error("deleteProgramAction failed:", error);
    return { success: false, error: "Could not remove the program." };
  }
}

export async function setProgramActiveAction(
  programId: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const program = await findOwnedProgram(programId, session.schoolId);
    if (!program) {
      return { success: false, error: "Program not found." };
    }

    await prisma.program.update({
      where: { id: programId },
      data: { isActive },
    });

    revalidatePublicSchoolPages(session.schoolSlug);

    return { success: true };
  } catch (error) {
    console.error("setProgramActiveAction failed:", error);
    return { success: false, error: "Could not update the program." };
  }
}

export async function moveProgramAction(
  programId: string,
  direction: "up" | "down",
): Promise<{ success: boolean; error?: string }> {
  const session = await getSession();
  if (!session) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const programs = await prisma.program.findMany({
      where: { schoolId: session.schoolId },
      orderBy: { sortOrder: "asc" },
      select: { id: true, sortOrder: true },
    });

    const index = programs.findIndex((program) => program.id === programId);
    if (index === -1) {
      return { success: false, error: "Program not found." };
    }

    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= programs.length) {
      return { success: true };
    }

    const current = programs[index];
    const neighbor = programs[swapIndex];

    await prisma.$transaction([
      prisma.program.update({
        where: { id: current.id },
        data: { sortOrder: neighbor.sortOrder },
      }),
      prisma.program.update({
        where: { id: neighbor.id },
        data: { sortOrder: current.sortOrder },
      }),
    ]);

    revalidatePublicSchoolPages(session.schoolSlug);

    return { success: true };
  } catch (error) {
    console.error("moveProgramAction failed:", error);
    return { success: false, error: "Could not change the order." };
  }
}

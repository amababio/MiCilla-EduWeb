"use server";

import { revalidatePath, refresh } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import { parseProgramInput } from "@/lib/programs";
import { prisma } from "@/lib/prisma";

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

async function revalidatePublicSite() {
  revalidatePath("/", "page");
  refresh();
}

async function getSessionSchoolId(): Promise<string | null> {
  const session = await getAdminSession();
  return session?.schoolId ?? null;
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
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseProgramInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const lastProgram = await prisma.program.findFirst({
      where: { schoolId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    await prisma.program.create({
      data: {
        schoolId,
        name: parsed.data.name,
        description: parsed.data.description,
        imageUrl: parsed.data.imageUrl,
        sortOrder: (lastProgram?.sortOrder ?? -1) + 1,
        isActive: true,
      },
    });

    await revalidatePublicSite();

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
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
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
    const program = await findOwnedProgram(programId, schoolId);
    if (!program) {
      return { success: false, error: "Program not found." };
    }

    await prisma.program.update({
      where: { id: programId },
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        imageUrl: parsed.data.imageUrl,
      },
    });

    await revalidatePublicSite();

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
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const program = await findOwnedProgram(programId, schoolId);
    if (!program) {
      return { success: false, error: "Program not found." };
    }

    await prisma.program.delete({ where: { id: programId } });

    await revalidatePublicSite();

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
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const program = await findOwnedProgram(programId, schoolId);
    if (!program) {
      return { success: false, error: "Program not found." };
    }

    await prisma.program.update({
      where: { id: programId },
      data: { isActive },
    });

    await revalidatePublicSite();

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
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const programs = await prisma.program.findMany({
      where: { schoolId },
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

    await revalidatePublicSite();

    return { success: true };
  } catch (error) {
    console.error("moveProgramAction failed:", error);
    return { success: false, error: "Could not change the order." };
  }
}

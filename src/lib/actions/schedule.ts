"use server";

import { revalidatePath, refresh } from "next/cache";
import { getAdminSession } from "@/lib/auth";
import {
  parseActivityInput,
  parseClassInput,
  parseClassTimetableInput,
  parseDailyRoutineInput,
  parseExamTimetableInput,
  parseTermCalendarInput,
} from "@/lib/schedule";
import { prisma } from "@/lib/prisma";

export type SchoolClassAdminItem = {
  id: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
};

export type ScheduleActivityAdminItem = {
  id: string;
  name: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
};

export type ClassTimetableAdminItem = {
  id: string;
  schoolClassId: string;
  className: string;
  dayOfWeek: string;
  periodLabel: string;
  startTime: string;
  endTime: string;
  activityName: string;
  isPublished: boolean;
};

export type ExamTimetableAdminItem = {
  id: string;
  schoolClassId: string | null;
  className: string | null;
  subjectName: string;
  examDate: string;
  startTime: string;
  endTime: string;
  isPublished: boolean;
};

export type TermCalendarAdminItem = {
  id: string;
  title: string;
  displayDate: string;
  description: string;
  isPublished: boolean;
};

export type DailyRoutineAdminItem = {
  id: string;
  timeLabel: string;
  title: string;
  level: string;
  isPublished: boolean;
};

export type ScheduleAdminData = {
  classes: SchoolClassAdminItem[];
  activities: ScheduleActivityAdminItem[];
  classTimetable: ClassTimetableAdminItem[];
  examTimetable: ExamTimetableAdminItem[];
  termCalendar: TermCalendarAdminItem[];
  dailyRoutine: DailyRoutineAdminItem[];
};

export type ScheduleFormState = {
  success: boolean;
  error?: string;
  message?: string;
};

async function revalidatePublicSite() {
  revalidatePath("/", "page");
  refresh();
}

async function getSessionSchoolId(): Promise<string | null> {
  const session = await getAdminSession();
  return session?.schoolId ?? null;
}

export async function getScheduleForAdmin(
  schoolId: string,
): Promise<ScheduleAdminData> {
  const [classes, activities, classTimetable, examTimetable, termCalendar, dailyRoutine] =
    await Promise.all([
      prisma.schoolClass.findMany({
        where: { schoolId },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.scheduleActivity.findMany({
        where: { schoolId },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.classTimetableEntry.findMany({
        where: { schoolId },
        orderBy: [{ dayOfWeek: "asc" }, { sortOrder: "asc" }],
        include: { schoolClass: { select: { name: true } } },
      }),
      prisma.examTimetableEntry.findMany({
        where: { schoolId },
        orderBy: { sortOrder: "asc" },
        include: { schoolClass: { select: { name: true } } },
      }),
      prisma.termCalendarEvent.findMany({
        where: { schoolId },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.dailyRoutineEntry.findMany({
        where: { schoolId },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

  return {
    classes,
    activities,
    classTimetable: classTimetable.map((entry) => ({
      id: entry.id,
      schoolClassId: entry.schoolClassId,
      className: entry.schoolClass.name,
      dayOfWeek: entry.dayOfWeek,
      periodLabel: entry.periodLabel,
      startTime: entry.startTime,
      endTime: entry.endTime,
      activityName: entry.activityName,
      isPublished: entry.isPublished,
    })),
    examTimetable: examTimetable.map((entry) => ({
      id: entry.id,
      schoolClassId: entry.schoolClassId,
      className: entry.schoolClass?.name ?? null,
      subjectName: entry.subjectName,
      examDate: entry.examDate,
      startTime: entry.startTime,
      endTime: entry.endTime,
      isPublished: entry.isPublished,
    })),
    termCalendar,
    dailyRoutine,
  };
}

export async function createClassFormAction(
  _prevState: ScheduleFormState,
  formData: FormData,
): Promise<ScheduleFormState> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseClassInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const last = await prisma.schoolClass.findFirst({
      where: { schoolId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    await prisma.schoolClass.create({
      data: {
        schoolId,
        name: parsed.data.name,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });

    await revalidatePublicSite();
    return { success: true, message: "Class added." };
  } catch (error) {
    console.error("createClassFormAction failed:", error);
    return { success: false, error: "Could not add the class." };
  }
}

export async function createActivityFormAction(
  _prevState: ScheduleFormState,
  formData: FormData,
): Promise<ScheduleFormState> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseActivityInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const last = await prisma.scheduleActivity.findFirst({
      where: { schoolId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    await prisma.scheduleActivity.create({
      data: {
        schoolId,
        name: parsed.data.name,
        category: parsed.data.category,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });

    await revalidatePublicSite();
    return { success: true, message: "Subject or activity added." };
  } catch (error) {
    console.error("createActivityFormAction failed:", error);
    return { success: false, error: "Could not add the activity." };
  }
}

export async function createClassTimetableFormAction(
  _prevState: ScheduleFormState,
  formData: FormData,
): Promise<ScheduleFormState> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseClassTimetableInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const schoolClass = await prisma.schoolClass.findFirst({
      where: { id: parsed.data.schoolClassId, schoolId },
    });
    if (!schoolClass) {
      return { success: false, error: "Class not found." };
    }

    const last = await prisma.classTimetableEntry.findFirst({
      where: { schoolId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    await prisma.classTimetableEntry.create({
      data: {
        schoolId,
        ...parsed.data,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });

    await revalidatePublicSite();
    return { success: true, message: "Class timetable entry added." };
  } catch (error) {
    console.error("createClassTimetableFormAction failed:", error);
    return { success: false, error: "Could not add the timetable entry." };
  }
}

export async function createExamTimetableFormAction(
  _prevState: ScheduleFormState,
  formData: FormData,
): Promise<ScheduleFormState> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseExamTimetableInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    if (parsed.data.schoolClassId) {
      const schoolClass = await prisma.schoolClass.findFirst({
        where: { id: parsed.data.schoolClassId, schoolId },
      });
      if (!schoolClass) {
        return { success: false, error: "Class not found." };
      }
    }

    const last = await prisma.examTimetableEntry.findFirst({
      where: { schoolId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    await prisma.examTimetableEntry.create({
      data: {
        schoolId,
        schoolClassId: parsed.data.schoolClassId,
        subjectName: parsed.data.subjectName,
        examDate: parsed.data.examDate,
        startTime: parsed.data.startTime,
        endTime: parsed.data.endTime,
        isPublished: parsed.data.isPublished,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });

    await revalidatePublicSite();
    return { success: true, message: "Exam timetable entry added." };
  } catch (error) {
    console.error("createExamTimetableFormAction failed:", error);
    return { success: false, error: "Could not add the exam entry." };
  }
}

export async function createTermCalendarFormAction(
  _prevState: ScheduleFormState,
  formData: FormData,
): Promise<ScheduleFormState> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseTermCalendarInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const last = await prisma.termCalendarEvent.findFirst({
      where: { schoolId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    await prisma.termCalendarEvent.create({
      data: {
        schoolId,
        ...parsed.data,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });

    await revalidatePublicSite();
    return { success: true, message: "Term calendar event added." };
  } catch (error) {
    console.error("createTermCalendarFormAction failed:", error);
    return { success: false, error: "Could not add the calendar event." };
  }
}

export async function createDailyRoutineFormAction(
  _prevState: ScheduleFormState,
  formData: FormData,
): Promise<ScheduleFormState> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  const parsed = parseDailyRoutineInput(formData);
  if (!parsed.data) {
    return { success: false, error: parsed.error };
  }

  try {
    const last = await prisma.dailyRoutineEntry.findFirst({
      where: { schoolId },
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    await prisma.dailyRoutineEntry.create({
      data: {
        schoolId,
        ...parsed.data,
        sortOrder: (last?.sortOrder ?? -1) + 1,
      },
    });

    await revalidatePublicSite();
    return { success: true, message: "Daily routine entry added." };
  } catch (error) {
    console.error("createDailyRoutineFormAction failed:", error);
    return { success: false, error: "Could not add the routine entry." };
  }
}

export async function setClassActiveAction(
  classId: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const record = await prisma.schoolClass.findFirst({
      where: { id: classId, schoolId },
    });
    if (!record) {
      return { success: false, error: "Class not found." };
    }

    await prisma.schoolClass.update({
      where: { id: classId },
      data: { isActive },
    });

    await revalidatePublicSite();
    return { success: true };
  } catch (error) {
    console.error("setClassActiveAction failed:", error);
    return { success: false, error: "Could not update the class." };
  }
}

export async function setActivityActiveAction(
  activityId: string,
  isActive: boolean,
): Promise<{ success: boolean; error?: string }> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    const record = await prisma.scheduleActivity.findFirst({
      where: { id: activityId, schoolId },
    });
    if (!record) {
      return { success: false, error: "Activity not found." };
    }

    await prisma.scheduleActivity.update({
      where: { id: activityId },
      data: { isActive },
    });

    await revalidatePublicSite();
    return { success: true };
  } catch (error) {
    console.error("setActivityActiveAction failed:", error);
    return { success: false, error: "Could not update the activity." };
  }
}

export async function deleteClassAction(classId: string) {
  return deleteOwned("class", classId);
}

export async function deleteActivityAction(activityId: string) {
  return deleteOwned("activity", activityId);
}

export async function deleteClassTimetableAction(entryId: string) {
  return deleteOwned("classTimetable", entryId);
}

export async function deleteExamTimetableAction(entryId: string) {
  return deleteOwned("examTimetable", entryId);
}

export async function deleteTermCalendarAction(entryId: string) {
  return deleteOwned("termCalendar", entryId);
}

export async function deleteDailyRoutineAction(entryId: string) {
  return deleteOwned("dailyRoutine", entryId);
}

export async function setClassTimetablePublishedAction(
  entryId: string,
  isPublished: boolean,
) {
  return setPublished("classTimetable", entryId, isPublished);
}

export async function setExamTimetablePublishedAction(
  entryId: string,
  isPublished: boolean,
) {
  return setPublished("examTimetable", entryId, isPublished);
}

export async function setTermCalendarPublishedAction(
  entryId: string,
  isPublished: boolean,
) {
  return setPublished("termCalendar", entryId, isPublished);
}

export async function setDailyRoutinePublishedAction(
  entryId: string,
  isPublished: boolean,
) {
  return setPublished("dailyRoutine", entryId, isPublished);
}

async function deleteOwned(
  type:
    | "class"
    | "activity"
    | "classTimetable"
    | "examTimetable"
    | "termCalendar"
    | "dailyRoutine",
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    switch (type) {
      case "class": {
        const record = await prisma.schoolClass.findFirst({
          where: { id, schoolId },
        });
        if (!record) return { success: false, error: "Class not found." };
        await prisma.schoolClass.delete({ where: { id } });
        break;
      }
      case "activity": {
        const record = await prisma.scheduleActivity.findFirst({
          where: { id, schoolId },
        });
        if (!record) return { success: false, error: "Activity not found." };
        await prisma.scheduleActivity.delete({ where: { id } });
        break;
      }
      case "classTimetable": {
        const record = await prisma.classTimetableEntry.findFirst({
          where: { id, schoolId },
        });
        if (!record) return { success: false, error: "Entry not found." };
        await prisma.classTimetableEntry.delete({ where: { id } });
        break;
      }
      case "examTimetable": {
        const record = await prisma.examTimetableEntry.findFirst({
          where: { id, schoolId },
        });
        if (!record) return { success: false, error: "Entry not found." };
        await prisma.examTimetableEntry.delete({ where: { id } });
        break;
      }
      case "termCalendar": {
        const record = await prisma.termCalendarEvent.findFirst({
          where: { id, schoolId },
        });
        if (!record) return { success: false, error: "Entry not found." };
        await prisma.termCalendarEvent.delete({ where: { id } });
        break;
      }
      case "dailyRoutine": {
        const record = await prisma.dailyRoutineEntry.findFirst({
          where: { id, schoolId },
        });
        if (!record) return { success: false, error: "Entry not found." };
        await prisma.dailyRoutineEntry.delete({ where: { id } });
        break;
      }
    }

    await revalidatePublicSite();
    return { success: true };
  } catch (error) {
    console.error("deleteOwned failed:", error);
    return { success: false, error: "Could not remove the item." };
  }
}

async function setPublished(
  type: "classTimetable" | "examTimetable" | "termCalendar" | "dailyRoutine",
  id: string,
  isPublished: boolean,
): Promise<{ success: boolean; error?: string }> {
  const schoolId = await getSessionSchoolId();
  if (!schoolId) {
    return { success: false, error: "Please sign in again." };
  }

  try {
    switch (type) {
      case "classTimetable": {
        const record = await prisma.classTimetableEntry.findFirst({
          where: { id, schoolId },
        });
        if (!record) return { success: false, error: "Entry not found." };
        await prisma.classTimetableEntry.update({
          where: { id },
          data: { isPublished },
        });
        break;
      }
      case "examTimetable": {
        const record = await prisma.examTimetableEntry.findFirst({
          where: { id, schoolId },
        });
        if (!record) return { success: false, error: "Entry not found." };
        await prisma.examTimetableEntry.update({
          where: { id },
          data: { isPublished },
        });
        break;
      }
      case "termCalendar": {
        const record = await prisma.termCalendarEvent.findFirst({
          where: { id, schoolId },
        });
        if (!record) return { success: false, error: "Entry not found." };
        await prisma.termCalendarEvent.update({
          where: { id },
          data: { isPublished },
        });
        break;
      }
      case "dailyRoutine": {
        const record = await prisma.dailyRoutineEntry.findFirst({
          where: { id, schoolId },
        });
        if (!record) return { success: false, error: "Entry not found." };
        await prisma.dailyRoutineEntry.update({
          where: { id },
          data: { isPublished },
        });
        break;
      }
    }

    await revalidatePublicSite();
    return { success: true };
  } catch (error) {
    console.error("setPublished failed:", error);
    return { success: false, error: "Could not update the item." };
  }
}

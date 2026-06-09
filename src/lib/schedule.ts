export const weekDays = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
] as const;

export const activityCategories = [
  { value: "subject", label: "Subject" },
  { value: "activity", label: "Activity" },
  { value: "break", label: "Break" },
  { value: "assembly", label: "Assembly" },
  { value: "other", label: "Other" },
] as const;

export const routineLevels = [
  { value: "creche", label: "Crèche" },
  { value: "kg", label: "Kindergarten" },
  { value: "all", label: "All early years" },
] as const;

const weekDayValues: Set<string> = new Set(weekDays.map((day) => day.value));
const activityCategoryValues: Set<string> = new Set(
  activityCategories.map((item) => item.value),
);
const routineLevelValues: Set<string> = new Set(routineLevels.map((item) => item.value));

export function getWeekDayLabel(dayOfWeek: string): string {
  return weekDays.find((day) => day.value === dayOfWeek)?.label ?? dayOfWeek;
}

export function getActivityCategoryLabel(category: string): string {
  return (
    activityCategories.find((item) => item.value === category)?.label ??
    category
  );
}

export function getRoutineLevelLabel(level: string): string {
  return (
    routineLevels.find((item) => item.value === level)?.label ?? level
  );
}

export function parseClassInput(
  formData: FormData,
): { data: { name: string } | null; error?: string } {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return { data: null, error: "Please enter a class name." };
  }
  return { data: { name } };
}

export function parseActivityInput(
  formData: FormData,
): { data: { name: string; category: string } | null; error?: string } {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();

  if (!name) {
    return { data: null, error: "Please enter an activity name." };
  }

  if (!activityCategoryValues.has(category)) {
    return { data: null, error: "Please choose an activity type." };
  }

  return { data: { name, category } };
}

export function parseClassTimetableInput(
  formData: FormData,
): {
  data: {
    schoolClassId: string;
    dayOfWeek: string;
    periodLabel: string;
    startTime: string;
    endTime: string;
    activityName: string;
    isPublished: boolean;
  } | null;
  error?: string;
} {
  const schoolClassId = String(formData.get("schoolClassId") ?? "").trim();
  const dayOfWeek = String(formData.get("dayOfWeek") ?? "").trim();
  const periodLabel = String(formData.get("periodLabel") ?? "").trim();
  const startTime = String(formData.get("startTime") ?? "").trim();
  const endTime = String(formData.get("endTime") ?? "").trim();
  const activityName = String(formData.get("activityName") ?? "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!schoolClassId) {
    return { data: null, error: "Please choose a class." };
  }

  if (!weekDayValues.has(dayOfWeek)) {
    return { data: null, error: "Please choose a day." };
  }

  if (!periodLabel || !startTime || !endTime || !activityName) {
    return { data: null, error: "Please complete all timetable fields." };
  }

  return {
    data: {
      schoolClassId,
      dayOfWeek,
      periodLabel,
      startTime,
      endTime,
      activityName,
      isPublished,
    },
  };
}

export function parseExamTimetableInput(
  formData: FormData,
): {
  data: {
    schoolClassId: string | null;
    subjectName: string;
    examDate: string;
    startTime: string;
    endTime: string;
    isPublished: boolean;
  } | null;
  error?: string;
} {
  const schoolClassIdRaw = String(formData.get("schoolClassId") ?? "").trim();
  const subjectName = String(formData.get("subjectName") ?? "").trim();
  const examDate = String(formData.get("examDate") ?? "").trim();
  const startTime = String(formData.get("startTime") ?? "").trim();
  const endTime = String(formData.get("endTime") ?? "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!subjectName || !examDate || !startTime || !endTime) {
    return { data: null, error: "Please complete all exam timetable fields." };
  }

  return {
    data: {
      schoolClassId: schoolClassIdRaw || null,
      subjectName,
      examDate,
      startTime,
      endTime,
      isPublished,
    },
  };
}

export function parseTermCalendarInput(
  formData: FormData,
): {
  data: {
    title: string;
    displayDate: string;
    description: string;
    isPublished: boolean;
  } | null;
  error?: string;
} {
  const title = String(formData.get("title") ?? "").trim();
  const displayDate = String(formData.get("displayDate") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!title || !displayDate || !description) {
    return { data: null, error: "Please complete all term calendar fields." };
  }

  return { data: { title, displayDate, description, isPublished } };
}

export function parseDailyRoutineInput(
  formData: FormData,
): {
  data: {
    timeLabel: string;
    title: string;
    level: string;
    isPublished: boolean;
  } | null;
  error?: string;
} {
  const timeLabel = String(formData.get("timeLabel") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const level = String(formData.get("level") ?? "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!timeLabel || !title) {
    return { data: null, error: "Please enter a time and activity." };
  }

  if (!routineLevelValues.has(level)) {
    return { data: null, error: "Please choose a level." };
  }

  return { data: { timeLabel, title, level, isPublished } };
}

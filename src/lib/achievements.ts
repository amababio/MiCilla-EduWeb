export const achievementCategories = [
  { value: "bece", label: "BECE / Results" },
  { value: "mock_exam", label: "Mock Exam" },
  { value: "competition", label: "Competition" },
  { value: "award", label: "Award" },
  { value: "student_innovation", label: "Student Innovation" },
  { value: "teacher_innovation", label: "Teacher Innovation" },
  { value: "science", label: "Science Project" },
  { value: "ict", label: "ICT Project" },
  { value: "sports", label: "Sports" },
  { value: "cultural", label: "Cultural" },
  { value: "creative_arts", label: "Creative Arts" },
  { value: "school_project", label: "School Project" },
] as const;

export const achievementPrivacyOptions = [
  { value: "hide", label: "Hide student name (safest)" },
  { value: "class_only", label: "Show class only" },
  { value: "first_name", label: "Show first name only" },
  { value: "full_name", label: "Show full name" },
] as const;

const categoryValues: Set<string> = new Set(
  achievementCategories.map((category) => category.value),
);

const privacyValues: Set<string> = new Set(
  achievementPrivacyOptions.map((option) => option.value),
);

export type AchievementInput = {
  title: string;
  description: string;
  category: string;
  privacyDisplay: string;
  subjectName: string | null;
  subjectClass: string | null;
  isPublished: boolean;
};

export type AchievementSectionInput = {
  achievementsSubtitle: string;
  achievementsNote: string;
};

export function parseAchievementInput(
  formData: FormData,
): { data: AchievementInput | null; error?: string } {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const privacyDisplay = String(formData.get("privacyDisplay") ?? "").trim();
  const subjectNameRaw = String(formData.get("subjectName") ?? "").trim();
  const subjectClassRaw = String(formData.get("subjectClass") ?? "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!title) {
    return { data: null, error: "Please enter a title." };
  }

  if (!description) {
    return { data: null, error: "Please enter a description." };
  }

  if (!categoryValues.has(category)) {
    return { data: null, error: "Please choose an achievement type." };
  }

  if (!privacyValues.has(privacyDisplay)) {
    return { data: null, error: "Please choose a privacy display option." };
  }

  if (privacyDisplay === "class_only" && !subjectClassRaw) {
    return {
      data: null,
      error: "Please enter a class when showing class only.",
    };
  }

  if (
    (privacyDisplay === "first_name" || privacyDisplay === "full_name") &&
    !subjectNameRaw
  ) {
    return {
      data: null,
      error: "Please enter a student name for the selected privacy option.",
    };
  }

  return {
    data: {
      title,
      description,
      category,
      privacyDisplay,
      subjectName: subjectNameRaw || null,
      subjectClass: subjectClassRaw || null,
      isPublished,
    },
  };
}

export function parseAchievementSectionInput(
  formData: FormData,
): { data: AchievementSectionInput | null; error?: string } {
  const achievementsSubtitle = String(
    formData.get("achievementsSubtitle") ?? "",
  ).trim();
  const achievementsNote = String(formData.get("achievementsNote") ?? "").trim();

  if (!achievementsSubtitle) {
    return { data: null, error: "Please enter a section subtitle." };
  }

  if (!achievementsNote) {
    return { data: null, error: "Please enter a section note." };
  }

  return {
    data: {
      achievementsSubtitle,
      achievementsNote,
    },
  };
}

export function getCategoryLabel(category: string): string {
  return (
    achievementCategories.find((item) => item.value === category)?.label ??
    "Achievement"
  );
}

export function getPrivacyLabel(privacyDisplay: string): string {
  return (
    achievementPrivacyOptions.find((option) => option.value === privacyDisplay)
      ?.label ?? "Hide student name"
  );
}

export function getAchievementDisplayLabel(
  privacyDisplay: string,
  subjectName: string | null,
  subjectClass: string | null,
): string | null {
  switch (privacyDisplay) {
    case "class_only":
      return subjectClass?.trim() || null;
    case "first_name": {
      const name = subjectName?.trim();
      if (!name) {
        return null;
      }
      return name.split(/\s+/)[0] ?? null;
    }
    case "full_name":
      return subjectName?.trim() || null;
    default:
      return null;
  }
}

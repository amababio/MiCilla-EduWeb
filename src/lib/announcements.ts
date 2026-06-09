export const announcementCategories = [
  { value: "admissions", label: "Admissions" },
  { value: "notice", label: "Notice" },
  { value: "event", label: "Event" },
  { value: "academics", label: "Academics" },
  { value: "holiday", label: "Holiday" },
  { value: "pta", label: "PTA" },
  { value: "sports", label: "Sports" },
  { value: "general", label: "General" },
] as const;

const categoryValues: Set<string> = new Set(
  announcementCategories.map((category) => category.value),
);

export type AnnouncementInput = {
  title: string;
  category: string;
  message: string;
  displayDate: string;
  isPublished: boolean;
};

export function parseAnnouncementInput(
  formData: FormData,
): { data: AnnouncementInput | null; error?: string } {
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const displayDate = String(formData.get("displayDate") ?? "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!title) {
    return { data: null, error: "Please enter a title." };
  }

  if (!categoryValues.has(category)) {
    return { data: null, error: "Please choose a category." };
  }

  if (!message) {
    return { data: null, error: "Please enter the announcement message." };
  }

  if (!displayDate) {
    return { data: null, error: "Please enter a display date." };
  }

  return {
    data: {
      title,
      category,
      message,
      displayDate,
      isPublished,
    },
  };
}

export function getAnnouncementCategoryLabel(category: string): string {
  return (
    announcementCategories.find((item) => item.value === category)?.label ??
    category
  );
}

export function getAnnouncementCategoryValue(label: string): string {
  const match = announcementCategories.find(
    (item) => item.label.toLowerCase() === label.toLowerCase(),
  );
  return match?.value ?? "general";
}

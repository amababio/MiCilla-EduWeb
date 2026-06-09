import { normalizeOptionalUrl } from "@/lib/school-profile";

export const downloadCategories = [
  { value: "admission_form", label: "Admission Form" },
  { value: "prospectus", label: "Prospectus" },
  { value: "book_list", label: "Book List" },
  { value: "fees", label: "Fees Notice" },
  { value: "calendar", label: "Term Calendar" },
  { value: "general", label: "General" },
] as const;

const categoryValues: Set<string> = new Set(
  downloadCategories.map((category) => category.value),
);

export type DownloadInput = {
  title: string;
  description: string;
  category: string;
  fileUrl: string | null;
  isPublished: boolean;
};

export function parseDownloadInput(
  formData: FormData,
): { data: DownloadInput | null; error?: string } {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const fileUrlRaw = String(formData.get("fileUrl") ?? "").trim();
  const isPublished = formData.get("isPublished") === "on";

  if (!title) {
    return { data: null, error: "Please enter a title." };
  }

  if (!description) {
    return { data: null, error: "Please enter a description." };
  }

  if (!categoryValues.has(category)) {
    return { data: null, error: "Please choose a file type." };
  }

  let fileUrl: string | null = null;
  if (fileUrlRaw) {
    fileUrl = normalizeOptionalUrl(fileUrlRaw);
    if (!fileUrl) {
      return {
        data: null,
        error: "File link must be a valid http or https URL.",
      };
    }
  }

  return {
    data: {
      title,
      description,
      category,
      fileUrl,
      isPublished,
    },
  };
}

export function getDownloadCategoryLabel(category: string): string {
  return (
    downloadCategories.find((item) => item.value === category)?.label ?? "File"
  );
}

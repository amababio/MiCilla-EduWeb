import { normalizeOptionalUrl } from "@/lib/school-profile";

export const galleryAccentPresets = [
  { value: "from-mauve-100 to-mauve-400", label: "Soft lilac" },
  { value: "from-mauve-200 to-mauve-400", label: "Light lilac" },
  { value: "from-mauve-200 to-mauve-500", label: "Bright lilac" },
  { value: "from-mauve-300 to-mauve-500", label: "Medium lilac" },
  { value: "from-mauve-300 to-mauve-600", label: "Rich lilac" },
  { value: "from-mauve-400 to-mauve-600", label: "Deep lilac" },
] as const;

const presetValues: Set<string> = new Set(
  galleryAccentPresets.map((preset) => preset.value),
);

export type GalleryInput = {
  title: string;
  category: string;
  imageUrl: string | null;
  accentClass: string;
  isFeatured: boolean;
};

export function parseGalleryInput(
  formData: FormData,
): { data: GalleryInput | null; error?: string } {
  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const imageUrlRaw = String(formData.get("imageUrl") ?? "").trim();
  const accentClass = String(formData.get("accentClass") ?? "").trim();
  const isFeatured = formData.get("isFeatured") === "on";

  if (!title) {
    return { data: null, error: "Please enter a photo title." };
  }

  if (!category) {
    return { data: null, error: "Please enter a category." };
  }

  if (!presetValues.has(accentClass)) {
    return { data: null, error: "Please choose a placeholder color." };
  }

  let imageUrl: string | null = null;
  if (imageUrlRaw) {
    imageUrl = normalizeOptionalUrl(imageUrlRaw);
    if (!imageUrl) {
      return {
        data: null,
        error: "Photo link must be a valid http or https URL.",
      };
    }
  }

  return {
    data: {
      title,
      category,
      imageUrl,
      accentClass,
      isFeatured,
    },
  };
}

export function getAccentLabel(accentClass: string): string {
  return (
    galleryAccentPresets.find((preset) => preset.value === accentClass)?.label ??
    "Custom"
  );
}

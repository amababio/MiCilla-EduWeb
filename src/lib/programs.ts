import { normalizeOptionalUrl } from "@/lib/school-profile";

export type ProgramInput = {
  name: string;
  description: string;
  imageUrl: string | null;
};

export function parseProgramInput(
  formData: FormData,
): { data: ProgramInput | null; error?: string } {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrlRaw = String(formData.get("imageUrl") ?? "").trim();

  if (!name) {
    return { data: null, error: "Please enter a program name." };
  }

  if (!description) {
    return { data: null, error: "Please enter a program description." };
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
      name,
      description,
      imageUrl,
    },
  };
}

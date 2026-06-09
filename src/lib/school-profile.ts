const HEX_COLOR_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export function normalizeBrandColor(value: string): string | null {
  const trimmed = value.trim();
  if (!HEX_COLOR_PATTERN.test(trimmed)) {
    return null;
  }
  return trimmed.toLowerCase();
}

export function normalizeOptionalUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

/** Build CSS variable overrides for the public site brand color. */
export function buildBrandStyleBlock(brandColor: string): string {
  const safeColor = normalizeBrandColor(brandColor) ?? "#cf85ef";

  return `:root {
  --color-mauve-50: color-mix(in srgb, ${safeColor} 8%, white);
  --color-mauve-100: color-mix(in srgb, ${safeColor} 16%, white);
  --color-mauve-200: color-mix(in srgb, ${safeColor} 28%, white);
  --color-mauve-300: color-mix(in srgb, ${safeColor} 42%, white);
  --color-mauve-400: color-mix(in srgb, ${safeColor} 62%, white);
  --color-mauve-500: ${safeColor};
  --color-mauve-600: color-mix(in srgb, ${safeColor} 82%, black);
  --color-mauve-700: color-mix(in srgb, ${safeColor} 68%, black);
  --color-mauve-800: color-mix(in srgb, ${safeColor} 52%, black);
  --color-mauve-900: color-mix(in srgb, ${safeColor} 38%, black);
}`;
}

export type SchoolProfileInput = {
  name: string;
  initials: string;
  tagline: string;
  motto: string;
  poBox: string;
  location: string;
  phone: string;
  whatsapp: string;
  email: string;
  officeHours: string;
  brandColor: string;
};

export function parseSchoolProfileInput(
  formData: FormData,
): { data: SchoolProfileInput | null; error?: string } {
  const data: SchoolProfileInput = {
    name: String(formData.get("name") ?? "").trim(),
    initials: String(formData.get("initials") ?? "").trim().toUpperCase(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    motto: String(formData.get("motto") ?? "").trim(),
    poBox: String(formData.get("poBox") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    officeHours: String(formData.get("officeHours") ?? "").trim(),
    brandColor: String(formData.get("brandColor") ?? "").trim(),
  };

  if (!data.name || !data.initials || !data.email || !data.phone) {
    return {
      data: null,
      error: "Please fill in school name, initials, email, and phone.",
    };
  }

  if (data.initials.length > 4) {
    return { data: null, error: "School initials should be 4 characters or less." };
  }

  const brandColor = normalizeBrandColor(data.brandColor);
  if (!brandColor) {
    return { data: null, error: "Please choose a valid brand color." };
  }

  data.brandColor = brandColor;

  return { data };
}

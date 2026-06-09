export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;

export const IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/gif,image/bmp,image/heic,image/heif";

export const IMAGE_ACCEPT_LABEL = "JPG, PNG, WebP, GIF, BMP, or HEIC";

export type ImageUploadCategory = "logo" | "gallery" | "programs";

export const ALLOWED_IMAGE_MIME_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/bmp", "bmp"],
  ["image/heic", "heic"],
  ["image/heif", "heif"],
]);

export function getImageExtension(mimeType: string): string | null {
  return ALLOWED_IMAGE_MIME_TYPES.get(mimeType) ?? null;
}

export function isAllowedImageMimeType(mimeType: string): boolean {
  return ALLOWED_IMAGE_MIME_TYPES.has(mimeType);
}

export function validateImageFile(file: File): { ok: true } | { error: string } {
  if (!isAllowedImageMimeType(file.type)) {
    return {
      error: `Please upload a supported image (${IMAGE_ACCEPT_LABEL}).`,
    };
  }

  if (file.size > IMAGE_MAX_BYTES) {
    return {
      error: "Image must be 10 MB or smaller.",
    };
  }

  return { ok: true };
}

export function isUploadedSchoolAssetUrl(
  url: string | null | undefined,
  category?: ImageUploadCategory,
): boolean {
  if (!url?.startsWith("/uploads/schools/")) {
    return false;
  }

  if (!category) {
    return true;
  }

  return url.includes(`/uploads/schools/`) && url.includes(`/${category}/`);
}

export function parseUploadedAssetPath(
  url: string,
): { schoolId: string; category: ImageUploadCategory; basename: string } | null {
  const pathname = url.split("?")[0];
  const match = pathname.match(
    /^\/uploads\/schools\/([^/]+)\/(logo|gallery|programs)\/(.+)$/,
  );

  if (!match) {
    return null;
  }

  const [, schoolId, category, filename] = match;
  const basename = filename.replace(/\.[^.]+$/, "");

  return {
    schoolId,
    category: category as ImageUploadCategory,
    basename,
  };
}

export function getUploadedImageFromForm(
  formData: FormData,
  fieldName = "photo",
): File | null {
  const file = formData.get(fieldName);
  if (file instanceof File && file.size > 0) {
    return file;
  }
  return null;
}

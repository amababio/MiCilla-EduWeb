import { mkdir, readdir, unlink, writeFile } from "fs/promises";
import path from "path";

export const LOGO_MAX_BYTES = 2 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export function getLogoExtension(mimeType: string): string | null {
  return ALLOWED_MIME_TYPES.get(mimeType) ?? null;
}

export function isAllowedLogoMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.has(mimeType);
}

export function getSchoolLogoDir(schoolId: string): string {
  return path.join(process.cwd(), "public", "uploads", "schools", schoolId);
}

export function getSchoolLogoPublicPath(schoolId: string, extension: string): string {
  return `/uploads/schools/${schoolId}/logo.${extension}`;
}

export async function clearSchoolLogoFiles(schoolId: string): Promise<void> {
  const dir = getSchoolLogoDir(schoolId);

  try {
    const entries = await readdir(dir);
    await Promise.all(
      entries
        .filter((name) => name.startsWith("logo."))
        .map((name) => unlink(path.join(dir, name))),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

export async function saveSchoolLogoFile(
  schoolId: string,
  file: File,
): Promise<{ publicPath: string } | { error: string }> {
  if (!isAllowedLogoMimeType(file.type)) {
    return {
      error: "Please upload a JPG, PNG, WebP, or GIF logo.",
    };
  }

  if (file.size > LOGO_MAX_BYTES) {
    return {
      error: "Logo must be 2 MB or smaller.",
    };
  }

  const extension = getLogoExtension(file.type);
  if (!extension) {
    return { error: "Please upload a valid image file." };
  }

  const dir = getSchoolLogoDir(schoolId);
  await mkdir(dir, { recursive: true });
  await clearSchoolLogoFiles(schoolId);

  const filename = `logo.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), bytes);

  const version = Date.now();
  return {
    publicPath: `${getSchoolLogoPublicPath(schoolId, extension)}?v=${version}`,
  };
}

export function isUploadedSchoolLogoUrl(logoUrl: string | null | undefined): boolean {
  return Boolean(logoUrl?.startsWith("/uploads/schools/"));
}

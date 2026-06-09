import {
  clearAssetFiles,
  IMAGE_MAX_BYTES,
  isUploadedSchoolAssetUrl,
  saveSchoolImageFile,
} from "@/lib/image-upload";

export { IMAGE_MAX_BYTES as LOGO_MAX_BYTES };

export async function saveSchoolLogoFile(
  schoolId: string,
  file: File,
): Promise<{ publicPath: string } | { error: string }> {
  return saveSchoolImageFile(schoolId, "logo", "logo", file);
}

export async function clearSchoolLogoFiles(schoolId: string): Promise<void> {
  return clearAssetFiles(schoolId, "logo", "logo");
}

export function isUploadedSchoolLogoUrl(logoUrl: string | null | undefined): boolean {
  return isUploadedSchoolAssetUrl(logoUrl, "logo");
}

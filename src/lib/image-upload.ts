import "server-only";

import { mkdir, readdir, unlink, writeFile } from "fs/promises";
import path from "path";
import {
  getImageExtension,
  isUploadedSchoolAssetUrl,
  parseUploadedAssetPath,
  validateImageFile,
  type ImageUploadCategory,
} from "@/lib/image-upload-shared";

export {
  IMAGE_ACCEPT,
  IMAGE_ACCEPT_LABEL,
  IMAGE_MAX_BYTES,
  getUploadedImageFromForm,
  isUploadedSchoolAssetUrl,
  type ImageUploadCategory,
} from "@/lib/image-upload-shared";

export function getSchoolUploadDir(
  schoolId: string,
  category: ImageUploadCategory,
): string {
  return path.join(process.cwd(), "public", "uploads", "schools", schoolId, category);
}

export function getSchoolUploadPublicPath(
  schoolId: string,
  category: ImageUploadCategory,
  filename: string,
): string {
  return `/uploads/schools/${schoolId}/${category}/${filename}`;
}

export async function clearAssetFiles(
  schoolId: string,
  category: ImageUploadCategory,
  assetBasename: string,
): Promise<void> {
  const dir = getSchoolUploadDir(schoolId, category);

  try {
    const entries = await readdir(dir);
    await Promise.all(
      entries
        .filter((name) => name.startsWith(`${assetBasename}.`))
        .map((name) => unlink(path.join(dir, name))),
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}

export async function saveSchoolImageFile(
  schoolId: string,
  category: ImageUploadCategory,
  assetBasename: string,
  file: File,
): Promise<{ publicPath: string } | { error: string }> {
  const validation = validateImageFile(file);
  if ("error" in validation) {
    return validation;
  }

  const extension = getImageExtension(file.type);
  if (!extension) {
    return { error: "Please upload a valid image file." };
  }

  const dir = getSchoolUploadDir(schoolId, category);
  await mkdir(dir, { recursive: true });
  await clearAssetFiles(schoolId, category, assetBasename);

  const filename = `${assetBasename}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), bytes);

  const version = Date.now();
  return {
    publicPath: `${getSchoolUploadPublicPath(schoolId, category, filename)}?v=${version}`,
  };
}

export async function deleteUploadedImage(
  schoolId: string,
  category: ImageUploadCategory,
  imageUrl: string | null | undefined,
): Promise<void> {
  if (!imageUrl || !isUploadedSchoolAssetUrl(imageUrl, category)) {
    return;
  }

  const parsed = parseUploadedAssetPath(imageUrl);
  if (!parsed || parsed.schoolId !== schoolId || parsed.category !== category) {
    return;
  }

  await clearAssetFiles(schoolId, category, parsed.basename);
}

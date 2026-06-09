-- AlterTable
ALTER TABLE "Achievement" ADD COLUMN     "privacyDisplay" TEXT NOT NULL DEFAULT 'hide',
ADD COLUMN     "subjectClass" TEXT,
ADD COLUMN     "subjectName" TEXT;

-- Update existing rows to use the new default category
UPDATE "Achievement" SET "category" = 'school_project' WHERE "category" = 'preview';

ALTER TABLE "Achievement" ALTER COLUMN "category" SET DEFAULT 'school_project';

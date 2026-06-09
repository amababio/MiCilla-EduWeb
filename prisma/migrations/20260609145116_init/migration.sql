-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "motto" TEXT NOT NULL,
    "poBox" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "officeHours" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteSettings" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "admissionsHeadline" TEXT NOT NULL,
    "admissionsDescription" TEXT NOT NULL,
    "admissionLevels" JSONB NOT NULL,
    "aboutDescription" TEXT NOT NULL,
    "aboutValues" JSONB NOT NULL,
    "whyChooseUs" JSONB NOT NULL,
    "achievementsSubtitle" TEXT NOT NULL,
    "achievementsNote" TEXT NOT NULL,
    "contactHeadline" TEXT NOT NULL,
    "contactDescription" TEXT NOT NULL,
    "poweredByFooter" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryImage" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "accentClass" TEXT NOT NULL,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'preview',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "displayDate" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Download" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Download_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteSettings_schoolId_key" ON "WebsiteSettings"("schoolId");

-- CreateIndex
CREATE INDEX "Program_schoolId_sortOrder_idx" ON "Program"("schoolId", "sortOrder");

-- CreateIndex
CREATE INDEX "GalleryImage_schoolId_sortOrder_idx" ON "GalleryImage"("schoolId", "sortOrder");

-- CreateIndex
CREATE INDEX "Achievement_schoolId_sortOrder_idx" ON "Achievement"("schoolId", "sortOrder");

-- CreateIndex
CREATE INDEX "Announcement_schoolId_sortOrder_idx" ON "Announcement"("schoolId", "sortOrder");

-- CreateIndex
CREATE INDEX "Download_schoolId_sortOrder_idx" ON "Download"("schoolId", "sortOrder");

-- AddForeignKey
ALTER TABLE "WebsiteSettings" ADD CONSTRAINT "WebsiteSettings_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryImage" ADD CONSTRAINT "GalleryImage_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Download" ADD CONSTRAINT "Download_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

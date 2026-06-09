-- AlterTable
ALTER TABLE "WebsiteSettings" ADD COLUMN     "contactCtaDescription" TEXT NOT NULL DEFAULT 'The fastest way to ask about admissions, school visits, and placement availability.',
ADD COLUMN     "contactCtaHeadline" TEXT NOT NULL DEFAULT 'Chat with us on WhatsApp',
ADD COLUMN     "heroCtaPrimary" TEXT NOT NULL DEFAULT 'Apply for Admission',
ADD COLUMN     "heroCtaSecondary" TEXT NOT NULL DEFAULT 'Chat on WhatsApp',
ADD COLUMN     "whyChooseUsIntro" TEXT NOT NULL DEFAULT 'Parents trust us for quality teaching, strong values, and a welcoming school community.';

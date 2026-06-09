import type { PublicSchoolData } from "@/types/public-site";
import { Header } from "@/components/public-site/Header";
import { HeroSection } from "@/components/public-site/HeroSection";
import { AdmissionsSection } from "@/components/public-site/AdmissionsSection";
import { AboutSection } from "@/components/public-site/AboutSection";
import { ProgramsSection } from "@/components/public-site/ProgramsSection";
import { WhyChooseUsSection } from "@/components/public-site/WhyChooseUsSection";
import { GalleryPreview } from "@/components/public-site/GalleryPreview";
import { AchievementsPreview } from "@/components/public-site/AchievementsPreview";
import { AnnouncementsPreview } from "@/components/public-site/AnnouncementsPreview";
import { DownloadsPreview } from "@/components/public-site/DownloadsPreview";
import { SchedulePreview } from "@/components/public-site/SchedulePreview";
import { ContactSection } from "@/components/public-site/ContactSection";
import { Footer } from "@/components/public-site/Footer";
import { SchoolBrandStyles } from "@/components/public-site/SchoolBrandStyles";

type SchoolHomePageProps = {
  school: PublicSchoolData;
};

export function SchoolHomePage({ school }: SchoolHomePageProps) {
  return (
    <>
      <SchoolBrandStyles brandColor={school.brandColor} />
      <Header school={school} />
      <main>
        <HeroSection school={school} />
        <AdmissionsSection school={school} />
        <AboutSection school={school} />
        <ProgramsSection school={school} />
        <WhyChooseUsSection school={school} />
        <GalleryPreview school={school} />
        <AchievementsPreview school={school} />
        <AnnouncementsPreview school={school} />
        <DownloadsPreview school={school} />
        <SchedulePreview school={school} />
        <ContactSection school={school} />
      </main>
      <Footer school={school} />
    </>
  );
}

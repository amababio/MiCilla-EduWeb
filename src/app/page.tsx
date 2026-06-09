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
import { ContactSection } from "@/components/public-site/ContactSection";
import { Footer } from "@/components/public-site/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AdmissionsSection />
        <AboutSection />
        <ProgramsSection />
        <WhyChooseUsSection />
        <GalleryPreview />
        <AchievementsPreview />
        <AnnouncementsPreview />
        <DownloadsPreview />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

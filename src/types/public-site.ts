export type AboutValue = {
  title: string;
  description: string;
};

export type GalleryItem = {
  title: string;
  category: string;
  accent: string;
  imageUrl: string | null;
};

export type AchievementCard = {
  title: string;
  description: string;
};

export type AnnouncementItem = {
  title: string;
  category: string;
  message: string;
  date: string;
};

export type DownloadItem = {
  title: string;
  description: string;
};

export type ProgramItem = {
  name: string;
  description: string;
  imageUrl: string | null;
};

export type NavLink = {
  label: string;
  href: string;
};

export type PublicSchoolData = {
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
  logoUrl: string | null;
  brandColor: string;
  heroDescription: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  admissions: {
    headline: string;
    description: string;
    levels: string[];
  };
  about: {
    description: string;
    values: AboutValue[];
  };
  programs: ProgramItem[];
  whyChooseUs: string[];
  whyChooseUsIntro: string;
  gallery: GalleryItem[];
  achievements: {
    subtitle: string;
    cards: AchievementCard[];
    note: string;
  };
  announcements: AnnouncementItem[];
  downloads: DownloadItem[];
  contact: {
    headline: string;
    description: string;
    ctaHeadline: string;
    ctaDescription: string;
  };
  footer: {
    poweredBy: string;
  };
  navLinks: NavLink[];
};

export const defaultNavLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "Admissions", href: "#admissions" },
  { label: "Programs", href: "#programs" },
  { label: "Gallery", href: "#gallery" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

export type AboutValue = {
  title: string;
  description: string;
};

export type GalleryItem = {
  title: string;
  accent: string;
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
  heroDescription: string;
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

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
  category: string;
  categoryLabel: string;
  displayLabel: string | null;
};

export type AnnouncementItem = {
  title: string;
  category: string;
  categoryLabel: string;
  message: string;
  date: string;
};

export type DownloadItem = {
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  fileUrl: string | null;
};

export type ClassTimetableItem = {
  className: string;
  dayOfWeek: string;
  dayLabel: string;
  periodLabel: string;
  startTime: string;
  endTime: string;
  activityName: string;
};

export type ExamTimetableItem = {
  className: string | null;
  subjectName: string;
  examDate: string;
  startTime: string;
  endTime: string;
};

export type TermCalendarItem = {
  title: string;
  displayDate: string;
  description: string;
};

export type DailyRoutineItem = {
  timeLabel: string;
  title: string;
  level: string;
  levelLabel: string;
};

export type ScheduleData = {
  classes: string[];
  classTimetable: ClassTimetableItem[];
  examTimetable: ExamTimetableItem[];
  termCalendar: TermCalendarItem[];
  dailyRoutine: DailyRoutineItem[];
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
  schedule: ScheduleData;
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
  { label: "Schedule", href: "#schedule" },
  { label: "Contact", href: "#contact" },
];

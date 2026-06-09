export const demoSchool = {
  name: "Redemption International School",
  initials: "RIS",
  tagline: "Quality education from Crèche to JHS",
  motto: "Discipline, Excellence, and Character",
  poBox: "P. O. BOX SE 98",
  location: "New Suame, Kumasi",
  phone: "054 823 4585",
  whatsapp: "0548234585",
  email: "info@redemptioninternationalschool.edu.gh",
  officeHours: "Monday – Friday, 7:30 AM – 4:00 PM",
  heroDescription:
    "A safe, disciplined, and child-friendly school environment focused on academic excellence, moral training, and strong foundational learning.",
  admissions: {
    headline: "Admissions Open for 2026/2027 Academic Year",
    description:
      "We are currently accepting learners into Crèche, Nursery, KG, Primary, and JHS. Contact our admissions office for enquiries, school visit arrangements, and admission requirements.",
    levels: ["Crèche", "Nursery", "KG", "Primary", "JHS"],
  },
  about: {
    description:
      "Redemption International School provides a caring and disciplined learning environment where children are supported to grow academically, socially, and morally. Our school combines strong classroom teaching with practical activities, creativity, and character development.",
    values: [
      {
        title: "Academic Excellence",
        description:
          "Strong teaching and learning focused on literacy, numeracy, and BECE readiness.",
      },
      {
        title: "Discipline & Moral Training",
        description:
          "We nurture respect, honesty, responsibility, and good character every day.",
      },
      {
        title: "Safe Child-Friendly Environment",
        description:
          "A welcoming campus where every child feels cared for, supported, and secure.",
      },
    ],
  },
  programs: [
    {
      name: "Crèche",
      description:
        "A caring environment for early social, emotional, and language development.",
    },
    {
      name: "Nursery",
      description:
        "Play-based learning with phonics, numeracy, storytelling, music, and creative activities.",
    },
    {
      name: "Kindergarten",
      description:
        "Strong preparation for primary school through literacy, numeracy, confidence, and social development.",
    },
    {
      name: "Primary",
      description:
        "A solid foundation in English, Mathematics, Science, ICT, Creative Arts, and character formation.",
    },
    {
      name: "JHS",
      description:
        "Focused academic preparation, discipline, BECE readiness, and personal development.",
    },
  ],
  whyChooseUs: [
    "Qualified and caring teachers",
    "Safe learning environment",
    "Strong academic foundation",
    "Discipline and moral training",
    "Active parent communication",
    "Child-friendly classrooms",
  ],
  gallery: [
    { title: "Classroom Learning", accent: "from-mauve-200 to-mauve-400" },
    { title: "Cultural Day", accent: "from-mauve-300 to-mauve-500" },
    { title: "Sports Day", accent: "from-mauve-400 to-mauve-600" },
    { title: "Graduation", accent: "from-mauve-300 to-mauve-600" },
    { title: "ICT Lessons", accent: "from-mauve-200 to-mauve-500" },
    { title: "Reading Time", accent: "from-mauve-100 to-mauve-400" },
  ],
  achievements: {
    subtitle:
      "Celebrating academic performance, competitions, student creativity, and teacher innovation.",
    cards: [
      {
        title: "Academic Performance",
        description:
          "Strong preparation for internal assessments, mock examinations, and BECE success.",
      },
      {
        title: "Competitions & Awards",
        description:
          "Our learners are encouraged to participate in quizzes, debates, sports, cultural activities, and academic competitions.",
      },
      {
        title: "Innovation Showcase",
        description:
          "We celebrate student projects, creative work, practical learning activities, and teacher-led classroom innovations.",
      },
    ],
    note: "Full achievements will be managed from the school dashboard in a later phase.",
  },
  announcements: [
    {
      title: "Admissions open for 2026/2027 academic year",
      category: "Admissions",
      message:
        "New and returning families are welcome to visit the school office for admission enquiries and placement information.",
      date: "March 2026",
    },
    {
      title: "PTA meeting scheduled for Friday",
      category: "Notice",
      message:
        "All parents and guardians are invited to attend the PTA meeting at 4:00 PM in the school hall.",
      date: "March 2026",
    },
    {
      title: "End-of-term assessment timetable coming soon",
      category: "Academics",
      message:
        "Assessment dates for all levels will be shared with parents through class teachers and the school office.",
      date: "April 2026",
    },
  ],
  downloads: [
    { title: "Admission Form", description: "Download the school admission form." },
    { title: "School Prospectus", description: "Learn about our programs and values." },
    { title: "Book List", description: "Required textbooks and materials by level." },
    { title: "Term Calendar", description: "Important dates for the academic year." },
  ],
  contact: {
    headline: "Have questions about admissions?",
    description:
      "Contact the school office or chat with us on WhatsApp. We are happy to help with enquiries, visits, and placement information.",
  },
  footer: {
    poweredBy: "Powered by MiCilla Technologies",
  },
  navLinks: [
    { label: "Home", href: "#home" },
    { label: "Admissions", href: "#admissions" },
    { label: "Programs", href: "#programs" },
    { label: "Gallery", href: "#gallery" },
    { label: "Achievements", href: "#achievements" },
    { label: "Contact", href: "#contact" },
  ],
} as const;

/** Ghana local number (e.g. 054 823 4585) → tel: link */
export function phoneToTel(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `233${digits.slice(1)}` : digits;
  return `tel:+${normalized}`;
}

/** Ghana local number → WhatsApp wa.me link */
export function phoneToWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `233${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

/** Formatted display for WhatsApp number */
export function formatWhatsAppDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone;
}

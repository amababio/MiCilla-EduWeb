/** Seed content for Redemption International School (Phase 2 demo). */
export const redemptionSchoolSeed = {
  slug: "redemption-international-school",
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
  brandColor: "#cf85ef",
  websiteSettings: {
    heroDescription:
      "A safe, disciplined, and child-friendly school environment focused on academic excellence, moral training, and strong foundational learning.",
    heroCtaPrimary: "Apply for Admission",
    heroCtaSecondary: "Chat on WhatsApp",
    admissionsHeadline: "Admissions Open for 2026/2027 Academic Year",
    admissionsDescription:
      "We are currently accepting learners into Crèche, Nursery, KG, Primary, and JHS. Contact our admissions office for enquiries, school visit arrangements, and admission requirements.",
    admissionLevels: ["Crèche", "Nursery", "KG", "Primary", "JHS"],
    aboutDescription:
      "Redemption International School provides a caring and disciplined learning environment where children are supported to grow academically, socially, and morally. Our school combines strong classroom teaching with practical activities, creativity, and character development.",
    aboutValues: [
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
    whyChooseUs: [
      "Qualified and caring teachers",
      "Safe learning environment",
      "Strong academic foundation",
      "Discipline and moral training",
      "Active parent communication",
      "Child-friendly classrooms",
    ],
    whyChooseUsIntro:
      "Parents trust us for quality teaching, strong values, and a welcoming school community.",
    achievementsSubtitle:
      "Celebrating academic performance, competitions, student creativity, and teacher innovation.",
    achievementsNote:
      "Individual student names are shown only when approved by the school. Contact the office for full records.",
    contactHeadline: "Have questions about admissions?",
    contactDescription:
      "Contact the school office or chat with us on WhatsApp. We are happy to help with enquiries, visits, and placement information.",
    contactCtaHeadline: "Chat with us on WhatsApp",
    contactCtaDescription:
      "The fastest way to ask about admissions, school visits, and placement availability.",
    poweredByFooter: "Powered by MiCilla Technologies",
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
  gallery: [
    { title: "Classroom Learning", category: "Academics", accentClass: "from-mauve-200 to-mauve-400" },
    { title: "Cultural Day", category: "Events", accentClass: "from-mauve-300 to-mauve-500" },
    { title: "Sports Day", category: "Sports", accentClass: "from-mauve-400 to-mauve-600" },
    { title: "Graduation", category: "Events", accentClass: "from-mauve-300 to-mauve-600" },
    { title: "ICT Lessons", category: "Academics", accentClass: "from-mauve-200 to-mauve-500" },
    { title: "Reading Time", category: "Academics", accentClass: "from-mauve-100 to-mauve-400" },
  ],
  achievements: [
    {
      title: "Strong BECE Preparation",
      description:
        "Our learners receive focused revision, mock examinations, and guidance to perform confidently in BECE.",
      category: "bece",
      privacyDisplay: "hide",
      subjectName: null,
      subjectClass: null,
    },
    {
      title: "Inter-School Quiz Champions",
      description:
        "Our upper primary team placed first in a district quiz competition after weeks of practice and teamwork.",
      category: "competition",
      privacyDisplay: "class_only",
      subjectName: null,
      subjectClass: "Primary 6",
    },
    {
      title: "Student Science Project",
      description:
        "A practical water filtration project was showcased during our school science fair.",
      category: "student_innovation",
      privacyDisplay: "first_name",
      subjectName: "Ama Mensah",
      subjectClass: "JHS 2",
    },
  ],
  announcements: [
    {
      title: "Admissions open for 2026/2027 academic year",
      category: "admissions",
      message:
        "New and returning families are welcome to visit the school office for admission enquiries and placement information.",
      displayDate: "March 2026",
    },
    {
      title: "PTA meeting scheduled for Friday",
      category: "pta",
      message:
        "All parents and guardians are invited to attend the PTA meeting at 4:00 PM in the school hall.",
      displayDate: "March 2026",
    },
    {
      title: "End-of-term assessment timetable coming soon",
      category: "academics",
      message:
        "Assessment dates for all levels will be shared with parents through class teachers and the school office.",
      displayDate: "April 2026",
    },
  ],
  downloads: [
    {
      title: "Admission Form",
      description: "Download the school admission form.",
      category: "admission_form",
      fileUrl: null,
    },
    {
      title: "School Prospectus",
      description: "Learn about our programs and values.",
      category: "prospectus",
      fileUrl: null,
    },
    {
      title: "Book List",
      description: "Required textbooks and materials by level.",
      category: "book_list",
      fileUrl: null,
    },
    {
      title: "Term Calendar",
      description: "Important dates for the academic year.",
      category: "calendar",
      fileUrl: null,
    },
  ],
} as const;

export type RedemptionSchoolSeed = typeof redemptionSchoolSeed;

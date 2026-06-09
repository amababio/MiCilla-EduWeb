const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type CreateSchoolInput = {
  name: string;
  slug: string;
  initials: string;
  tagline: string;
  motto: string;
  poBox: string;
  location: string;
  phone: string;
  whatsapp: string;
  email: string;
  officeHours: string;
  brandColor: string;
  adminEmail: string | null;
  adminName: string | null;
  adminPassword: string | null;
};

export type CreateSchoolAdminInput = {
  schoolId: string;
  email: string;
  name: string;
  password: string;
};

export type ResetSchoolAdminPasswordInput = {
  adminId: string;
  password: string;
};

export function normalizeSchoolSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidSchoolSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export function buildDefaultWebsiteSettings(schoolName: string) {
  return {
    heroDescription: `Welcome to ${schoolName}. Update this welcome message from the school admin dashboard.`,
    heroCtaPrimary: "Apply for Admission",
    heroCtaSecondary: "Chat on WhatsApp",
    admissionsHeadline: "Admissions Enquiries Welcome",
    admissionsDescription:
      "Contact the school office for admission information, visits, and placement details.",
    admissionLevels: ["Nursery", "Primary"],
    aboutDescription: `${schoolName} provides quality basic education in a caring and disciplined environment.`,
    aboutValues: [
      {
        title: "Care",
        description: "Every learner is supported to grow with confidence.",
      },
      {
        title: "Excellence",
        description: "We promote strong teaching, learning, and good values.",
      },
    ],
    whyChooseUsIntro:
      "Families choose us for caring teachers, structured learning, and open communication.",
    whyChooseUs: [
      "Qualified teachers",
      "Safe learning environment",
      "Strong academic foundation",
      "Parent communication",
    ],
    achievementsSubtitle: "School highlights and achievements.",
    achievementsNote:
      "Contact the school office for full achievement records.",
    contactHeadline: "Have questions about admissions?",
    contactDescription:
      "Reach the school office by phone or WhatsApp for admissions support.",
    contactCtaHeadline: "Chat with us on WhatsApp",
    contactCtaDescription:
      "The fastest way to ask about admissions and school visits.",
    poweredByFooter: "Powered by MiCilla Technologies",
  };
}

function normalizeBrandColor(value: string): string | null {
  const trimmed = value.trim();
  if (!/^#[0-9A-Fa-f]{6}$/.test(trimmed)) {
    return null;
  }
  return trimmed.toLowerCase();
}

export function parseCreateSchoolInput(
  formData: FormData,
): { data: CreateSchoolInput | null; error?: string } {
  const name = String(formData.get("name") ?? "").trim();
  const slug = normalizeSchoolSlug(String(formData.get("slug") ?? ""));
  const initials = String(formData.get("initials") ?? "").trim().toUpperCase();
  const tagline = String(formData.get("tagline") ?? "").trim();
  const motto = String(formData.get("motto") ?? "").trim();
  const poBox = String(formData.get("poBox") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const officeHours = String(formData.get("officeHours") ?? "").trim();
  const brandColorRaw = String(formData.get("brandColor") ?? "").trim();
  const adminEmailRaw = String(formData.get("adminEmail") ?? "").trim();
  const adminNameRaw = String(formData.get("adminName") ?? "").trim();
  const adminPasswordRaw = String(formData.get("adminPassword") ?? "").trim();

  if (!name) {
    return { data: null, error: "Please enter a school name." };
  }

  if (!slug || !isValidSchoolSlug(slug)) {
    return {
      data: null,
      error: "Please enter a valid slug using lowercase letters, numbers, and hyphens.",
    };
  }

  if (!initials) {
    return { data: null, error: "Please enter school initials." };
  }

  if (!tagline || !motto || !location || !phone || !email) {
    return {
      data: null,
      error: "Please complete the required school profile fields.",
    };
  }

  const brandColor = normalizeBrandColor(brandColorRaw || "#cf85ef");
  if (!brandColor) {
    return { data: null, error: "Brand color must be a valid hex code." };
  }

  let adminEmail: string | null = null;
  let adminName: string | null = null;
  let adminPassword: string | null = null;

  if (adminEmailRaw || adminNameRaw || adminPasswordRaw) {
    if (!adminEmailRaw || !adminNameRaw || !adminPasswordRaw) {
      return {
        data: null,
        error: "Please complete all first admin fields or leave them all blank.",
      };
    }

    if (adminPasswordRaw.length < 8) {
      return {
        data: null,
        error: "Admin password must be at least 8 characters.",
      };
    }

    adminEmail = adminEmailRaw.toLowerCase();
    adminName = adminNameRaw;
    adminPassword = adminPasswordRaw;
  }

  return {
    data: {
      name,
      slug,
      initials,
      tagline,
      motto,
      poBox: poBox || "P. O. BOX —",
      location,
      phone,
      whatsapp: whatsapp || phone.replace(/\D/g, ""),
      email,
      officeHours: officeHours || "Monday – Friday, 8:00 AM – 4:00 PM",
      brandColor,
      adminEmail,
      adminName,
      adminPassword,
    },
  };
}

export function parseCreateSchoolAdminInput(
  formData: FormData,
): { data: CreateSchoolAdminInput | null; error?: string } {
  const schoolId = String(formData.get("schoolId") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!schoolId) {
    return { data: null, error: "School not found." };
  }

  if (!email || !name) {
    return { data: null, error: "Please enter the admin email and name." };
  }

  if (password.length < 8) {
    return { data: null, error: "Password must be at least 8 characters." };
  }

  return { data: { schoolId, email, name, password } };
}

export function parseResetSchoolAdminPasswordInput(
  formData: FormData,
): { data: ResetSchoolAdminPasswordInput | null; error?: string } {
  const adminId = String(formData.get("adminId") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!adminId) {
    return { data: null, error: "Admin account not found." };
  }

  if (password.length < 8) {
    return { data: null, error: "Password must be at least 8 characters." };
  }

  return { data: { adminId, password } };
}

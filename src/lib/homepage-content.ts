import type { AboutValue } from "@/types/public-site";

export type HomepageContentInput = {
  heroDescription: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  admissionsHeadline: string;
  admissionsDescription: string;
  admissionLevels: string[];
  aboutDescription: string;
  aboutValues: AboutValue[];
  whyChooseUsIntro: string;
  whyChooseUs: string[];
  contactHeadline: string;
  contactDescription: string;
  contactCtaHeadline: string;
  contactCtaDescription: string;
};

export type HomepageContentData = HomepageContentInput;

function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function readAboutValue(
  formData: FormData,
  index: number,
): AboutValue | null {
  const title = String(formData.get(`aboutValue${index}Title`) ?? "").trim();
  const description = String(
    formData.get(`aboutValue${index}Description`) ?? "",
  ).trim();

  if (!title && !description) {
    return null;
  }

  if (!title || !description) {
    return null;
  }

  return { title, description };
}

export function parseHomepageContentInput(
  formData: FormData,
): { data: HomepageContentInput | null; error?: string } {
  const aboutValues: AboutValue[] = [];

  for (let index = 1; index <= 3; index += 1) {
    const value = readAboutValue(formData, index);
    if (value) {
      aboutValues.push(value);
    }
  }

  const data: HomepageContentInput = {
    heroDescription: String(formData.get("heroDescription") ?? "").trim(),
    heroCtaPrimary: String(formData.get("heroCtaPrimary") ?? "").trim(),
    heroCtaSecondary: String(formData.get("heroCtaSecondary") ?? "").trim(),
    admissionsHeadline: String(formData.get("admissionsHeadline") ?? "").trim(),
    admissionsDescription: String(
      formData.get("admissionsDescription") ?? "",
    ).trim(),
    admissionLevels: parseLines(
      String(formData.get("admissionLevels") ?? ""),
    ),
    aboutDescription: String(formData.get("aboutDescription") ?? "").trim(),
    aboutValues,
    whyChooseUsIntro: String(formData.get("whyChooseUsIntro") ?? "").trim(),
    whyChooseUs: parseLines(String(formData.get("whyChooseUs") ?? "")),
    contactHeadline: String(formData.get("contactHeadline") ?? "").trim(),
    contactDescription: String(formData.get("contactDescription") ?? "").trim(),
    contactCtaHeadline: String(formData.get("contactCtaHeadline") ?? "").trim(),
    contactCtaDescription: String(
      formData.get("contactCtaDescription") ?? "",
    ).trim(),
  };

  if (!data.heroDescription) {
    return { data: null, error: "Please add a hero description." };
  }

  if (!data.heroCtaPrimary || !data.heroCtaSecondary) {
    return { data: null, error: "Please fill in both hero button labels." };
  }

  if (!data.admissionsHeadline || !data.admissionsDescription) {
    return {
      data: null,
      error: "Please fill in the admissions heading and message.",
    };
  }

  if (data.admissionLevels.length === 0) {
    return {
      data: null,
      error: "Please add at least one admission level (one per line).",
    };
  }

  if (!data.aboutDescription) {
    return { data: null, error: "Please add the about section text." };
  }

  if (data.aboutValues.length === 0) {
    return {
      data: null,
      error: "Please add at least one about highlight with a title and description.",
    };
  }

  if (!data.whyChooseUsIntro) {
    return { data: null, error: "Please add the Why Choose Us introduction." };
  }

  if (data.whyChooseUs.length === 0) {
    return {
      data: null,
      error: "Please add at least one Why Choose Us point (one per line).",
    };
  }

  if (!data.contactHeadline || !data.contactDescription) {
    return {
      data: null,
      error: "Please fill in the contact section heading and message.",
    };
  }

  if (!data.contactCtaHeadline || !data.contactCtaDescription) {
    return {
      data: null,
      error: "Please fill in the contact button heading and message.",
    };
  }

  return { data };
}

export function linesFromList(items: string[]): string {
  return items.join("\n");
}

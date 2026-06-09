import {
  formatWhatsAppDisplay,
  phoneToTel,
  phoneToWhatsApp,
} from "@/lib/phone";
import { SchoolLogoMark } from "@/components/public-site/SchoolLogoMark";
import type { PublicSchoolData } from "@/types/public-site";

type FooterProps = {
  school: PublicSchoolData;
};

export function Footer({ school }: FooterProps) {
  return (
    <footer className="border-t border-mauve-300 bg-gradient-to-r from-mauve-500 to-mauve-600 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:pb-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <SchoolLogoMark
                school={school}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-mauve-600"
                imageClassName="h-10 w-10 rounded-xl object-cover"
              />
              <div>
                <p className="font-semibold text-white">{school.name}</p>
                <p className="text-sm text-white/80">{school.motto}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/90">
              {school.tagline}
            </p>
            <p className="mt-2 text-sm text-white/80">
              {school.poBox}, {school.location}
            </p>
            <p className="mt-2 text-sm text-white/80">{school.officeHours}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/90">
              {school.navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#home" className="transition hover:text-white">
                  Back to top
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/90">
              <li>
                <a href={phoneToTel(school.phone)} className="hover:text-white">
                  {school.phone}
                </a>
              </li>
              <li>
                <a
                  href={phoneToWhatsApp(school.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  WhatsApp: {formatWhatsAppDisplay(school.whatsapp)}
                </a>
              </li>
              <li>
                <a href={`mailto:${school.email}`} className="hover:text-white">
                  {school.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col justify-start">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Get in touch
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/90">
              Call or WhatsApp the school office for admissions and enquiries.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col">
              <a
                href={phoneToWhatsApp(school.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-mauve-700 transition hover:bg-mauve-50"
              >
                Chat on WhatsApp
              </a>
              <a
                href={phoneToTel(school.phone)}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Call school
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/25 pt-6 text-center text-sm text-white/80">
          <p>
            © {new Date().getFullYear()} {school.name}. All rights reserved.
          </p>
          <p className="mt-2 font-medium text-white/90">{school.footer.poweredBy}</p>
        </div>
      </div>
    </footer>
  );
}

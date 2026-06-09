import {
  formatWhatsAppDisplay,
  phoneToTel,
  phoneToWhatsApp,
} from "@/lib/phone";
import type { PublicSchoolData } from "@/types/public-site";

type FooterProps = {
  school: PublicSchoolData;
};

export function Footer({ school }: FooterProps) {
  return (
    <footer className="border-t border-mauve-300 bg-gradient-to-r from-mauve-500 to-mauve-600 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-bold text-mauve-600">
                {school.initials}
              </span>
              <div>
                <p className="font-semibold text-white">{school.name}</p>
                <p className="text-sm text-white/80">{school.motto}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/90">
              {school.tagline}. {school.poBox}, {school.location}.
            </p>
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
              <li>{school.poBox}</li>
              <li>{school.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/25 pt-6 text-center text-sm text-white/80">
          <p>
            © {new Date().getFullYear()} {school.name}. All rights reserved.
          </p>
          <p className="mt-2 font-medium text-white/90">
            {school.footer.poweredBy}
          </p>
        </div>
      </div>
    </footer>
  );
}

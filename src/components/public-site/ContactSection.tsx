import {
  formatWhatsAppDisplay,
  phoneToTel,
  phoneToWhatsApp,
} from "@/lib/phone";
import type { PublicSchoolData } from "@/types/public-site";
import { SectionHeading } from "@/components/shared/SectionHeading";

type ContactSectionProps = {
  school: PublicSchoolData;
};

export function ContactSection({ school }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="bg-gradient-to-b from-mauve-100 via-mauve-50 to-white py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          title={school.contact.headline}
          subtitle={school.contact.description}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-mauve-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-lg font-semibold text-slate-900">
              Contact Details
            </h3>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-semibold text-mauve-700">Phone</dt>
                <dd className="mt-1">
                  <a
                    href={phoneToTel(school.phone)}
                    className="text-mauve-600 hover:underline"
                  >
                    {school.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-mauve-700">WhatsApp</dt>
                <dd className="mt-1">
                  <a
                    href={phoneToWhatsApp(school.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mauve-600 hover:underline"
                  >
                    {formatWhatsAppDisplay(school.whatsapp)}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-mauve-700">P. O. Box</dt>
                <dd className="mt-1 text-slate-600">{school.poBox}</dd>
              </div>
              <div>
                <dt className="font-semibold text-mauve-700">Email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${school.email}`}
                    className="text-mauve-600 hover:underline"
                  >
                    {school.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-mauve-700">Location</dt>
                <dd className="mt-1 text-slate-600">{school.location}</dd>
              </div>
              <div>
                <dt className="font-semibold text-mauve-700">Office Hours</dt>
                <dd className="mt-1 text-slate-600">{school.officeHours}</dd>
              </div>
            </dl>

            <button
              type="button"
              className="mt-6 w-full rounded-full border border-mauve-200 bg-mauve-50 px-6 py-3 text-sm font-semibold text-mauve-700 sm:w-auto"
              title="Demo placeholder — Google Maps link comes in a later phase"
            >
              View on Google Maps (Demo)
            </button>
          </div>

          <div className="flex flex-col justify-center rounded-2xl bg-gradient-to-br from-mauve-400 to-mauve-600 p-6 text-white shadow-lg sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/80">
              Quick Contact
            </p>
            <h3 className="mt-2 text-2xl font-bold">
              {school.contact.ctaHeadline}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/90">
              {school.contact.ctaDescription}
            </p>
            <a
              href={phoneToWhatsApp(school.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-mauve-700 transition hover:bg-mauve-50"
            >
              Start WhatsApp Chat
            </a>
            <a
              href={phoneToTel(school.phone)}
              className="mt-3 inline-flex items-center justify-center rounded-full border-2 border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Call {school.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

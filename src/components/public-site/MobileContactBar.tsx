import { phoneToTel, phoneToWhatsApp } from "@/lib/phone";
import type { PublicSchoolData } from "@/types/public-site";

type MobileContactBarProps = {
  school: PublicSchoolData;
};

export function MobileContactBar({ school }: MobileContactBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-mauve-200 bg-white/95 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex max-w-lg gap-2">
        <a
          href={phoneToTel(school.phone)}
          className="motion-btn flex flex-1 items-center justify-center rounded-full border border-mauve-300 px-4 py-2.5 text-sm font-semibold text-mauve-700"
        >
          Call
        </a>
        <a
          href={phoneToWhatsApp(school.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="motion-btn motion-btn-primary flex flex-1 items-center justify-center rounded-full bg-mauve-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { phoneToTel, phoneToWhatsApp } from "@/lib/phone";
import { SchoolLogoMark } from "@/components/public-site/SchoolLogoMark";
import type { PublicSchoolData } from "@/types/public-site";

type HeaderProps = {
  school: PublicSchoolData;
};

export function Header({ school }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-mauve-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href="#home"
          className="flex min-w-0 items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <SchoolLogoMark school={school} priority />
          <span className="truncate text-sm font-semibold text-slate-900 sm:text-base">
            {school.name}
          </span>
        </a>

        <nav className="hidden items-center gap-5 xl:flex">
          {school.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-mauve-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={phoneToTel(school.phone)}
            className="motion-btn inline-flex min-h-10 items-center rounded-full border border-mauve-300 px-3 py-1.5 text-xs font-semibold text-mauve-700 hover:bg-mauve-50 sm:px-4 sm:text-sm"
          >
            Call
          </a>
          <a
            href={phoneToWhatsApp(school.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="motion-btn motion-btn-primary inline-flex min-h-10 items-center rounded-full bg-mauve-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-mauve-600 sm:px-4 sm:text-sm"
          >
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 xl:hidden"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="sr-only">Menu</span>
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen ? (
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-mauve-100 bg-white px-4 py-4 xl:hidden">
          <nav className="flex flex-col gap-1">
            {school.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-mauve-50"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <a
              href={phoneToTel(school.phone)}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-mauve-300 px-4 py-2 text-sm font-semibold text-mauve-700"
              onClick={() => setMenuOpen(false)}
            >
              Call {school.phone}
            </a>
            <a
              href={phoneToWhatsApp(school.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="motion-btn motion-btn-primary inline-flex min-h-11 items-center justify-center rounded-full bg-mauve-500 px-4 py-2 text-sm font-semibold text-white shadow-sm"
              onClick={() => setMenuOpen(false)}
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

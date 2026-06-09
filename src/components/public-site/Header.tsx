"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { phoneToTel, phoneToWhatsApp } from "@/lib/phone";
import { getDefaultSchoolSlug, getSchoolPublicPath } from "@/lib/school-slug";
import { SchoolLogoMark } from "@/components/public-site/SchoolLogoMark";
import type { PublicSchoolData } from "@/types/public-site";

/** Matches the fixed header bar height (`h-14`) for main content offset. */
export const PUBLIC_SITE_HEADER_OFFSET_CLASS = "pt-14";

type HeaderProps = {
  school: PublicSchoolData;
};

export function Header({ school }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((open) => !open);
  }

  function navHref(href: string): string {
    if (!href.startsWith("#")) {
      return href;
    }

    const homePath =
      school.slug === getDefaultSchoolSlug()
        ? "/"
        : getSchoolPublicPath(school.slug);

    return `${homePath}${href}`;
  }

  const mobileMenu =
    mounted && menuOpen
      ? createPortal(
          <>
            <button
              type="button"
              className="fixed inset-0 z-[100] bg-black/30 lg:hidden"
              aria-label="Close menu"
              onClick={closeMenu}
            />
            <div
              id="mobile-site-menu"
              className="fixed inset-x-0 top-14 z-[110] max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-mauve-100 bg-white px-4 py-4 shadow-lg lg:hidden"
            >
              <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                {school.navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={navHref(link.href)}
                    className="rounded-lg px-3 py-3 text-base font-medium text-slate-800 hover:bg-mauve-50 active:bg-mauve-100"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-4 flex flex-col gap-2 border-t border-mauve-100 pt-4">
                <a
                  href={phoneToTel(school.phone)}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-mauve-300 px-4 py-2 text-sm font-semibold text-mauve-700"
                  onClick={closeMenu}
                >
                  Call {school.phone}
                </a>
                <a
                  href={phoneToWhatsApp(school.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="motion-btn motion-btn-primary inline-flex min-h-11 items-center justify-center rounded-full bg-mauve-500 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                  onClick={closeMenu}
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </>,
          document.body,
        )
      : null;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[90] border-b border-mauve-200 bg-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-3 sm:px-6">
          <a
            href={navHref("#home")}
            className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden sm:gap-3 lg:flex-none"
            onClick={closeMenu}
          >
            <SchoolLogoMark school={school} priority />
            <span className="truncate text-sm font-semibold text-slate-900 sm:text-base">
              {school.name}
            </span>
          </a>

          <nav className="hidden flex-1 items-center justify-center gap-4 lg:flex xl:gap-5">
            {school.navLinks.map((link) => (
              <a
                key={link.href}
                href={navHref(link.href)}
                className="text-sm font-medium text-slate-600 transition hover:text-mauve-600"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
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
            className="inline-flex h-10 w-10 shrink-0 touch-manipulation items-center justify-center rounded-lg border border-mauve-300 bg-mauve-50 text-slate-800 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-site-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={toggleMenu}
          >
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
      </header>

      {mobileMenu}
    </>
  );
}

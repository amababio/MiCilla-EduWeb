"use client";

import { useState } from "react";
import { demoSchool, phoneToTel, phoneToWhatsApp } from "@/data/demoSchool";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-mauve-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href="#home"
          className="flex min-w-0 items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mauve-500 text-sm font-bold text-white shadow-sm">
            {demoSchool.initials}
          </span>
          <span className="truncate text-sm font-semibold text-slate-900 sm:text-base">
            {demoSchool.name}
          </span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {demoSchool.navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition hover:text-mauve-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <a
            href={phoneToTel(demoSchool.phone)}
            className="rounded-full border border-mauve-300 px-3 py-1.5 text-xs font-semibold text-mauve-700 transition hover:bg-mauve-50 sm:px-4 sm:text-sm"
          >
            Call
          </a>
          <a
            href={phoneToWhatsApp(demoSchool.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-mauve-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-mauve-600 sm:px-4 sm:text-sm"
          >
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 lg:hidden"
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
        <div className="border-t border-mauve-100 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {demoSchool.navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-mauve-50"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <a
              href={phoneToTel(demoSchool.phone)}
              className="rounded-full border border-mauve-300 px-4 py-2 text-center text-sm font-semibold text-mauve-700"
            >
              Call {demoSchool.phone}
            </a>
            <a
              href={phoneToWhatsApp(demoSchool.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-mauve-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

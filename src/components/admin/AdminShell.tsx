"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminSession } from "@/lib/auth-session";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { getNavItemsForPath } from "@/components/admin/admin-nav";
import { getSchoolPublicPath } from "@/lib/school-slug";

type AdminShellProps = {
  session: AdminSession;
  children: React.ReactNode;
};

export function AdminShell({ session, children }: AdminShellProps) {
  const pathname = usePathname();
  const navItems = getNavItemsForPath(pathname);

  return (
    <div className="min-h-full bg-mauve-50">
      <div className="mx-auto flex min-h-full max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-mauve-200 bg-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="px-4 py-5 lg:px-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-mauve-600">
              MiCilla EduWeb
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {session.schoolName}
            </p>
            <p className="mt-1 text-xs text-slate-500">School Admin</p>
          </div>

          <nav className="px-3 pb-4 lg:pb-6">
            <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
              {navItems.map((item) => (
                <li key={item.label} className="shrink-0 lg:shrink">
                  {item.soon ? (
                    <span className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-400 lg:w-full">
                      {item.label}
                      <span className="rounded-full bg-mauve-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-mauve-700">
                        Soon
                      </span>
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block rounded-xl px-3 py-2 text-sm font-medium transition lg:w-full ${
                        item.active
                          ? "bg-mauve-100 text-mauve-800"
                          : "text-slate-600 hover:bg-mauve-50 hover:text-mauve-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex flex-col gap-3 border-b border-mauve-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-sm text-slate-500">Signed in as</p>
              <p className="text-sm font-semibold text-slate-900">
                {session.name} · {session.email}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={getSchoolPublicPath(session.schoolSlug)}
                target="_blank"
                className="inline-flex items-center justify-center rounded-full bg-mauve-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-mauve-600"
              >
                Preview Website
              </Link>
              <AdminLogoutButton />
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

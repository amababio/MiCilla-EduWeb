import type { SuperAdminSession } from "@/lib/super-admin-auth";
import { SuperAdminLogoutButton } from "@/components/super-admin/SuperAdminLogoutButton";

type SuperAdminShellProps = {
  session: SuperAdminSession;
  children: React.ReactNode;
};

export function SuperAdminShell({ session, children }: SuperAdminShellProps) {
  return (
    <div className="min-h-full bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              MiCilla Super Admin
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900">
              {session.name} · {session.email}
            </p>
          </div>
          <SuperAdminLogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

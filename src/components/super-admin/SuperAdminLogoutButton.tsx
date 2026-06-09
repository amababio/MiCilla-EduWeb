"use client";

import { useRouter } from "next/navigation";

export function SuperAdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/super-admin/logout", { method: "POST" });
    router.push("/super-admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
    >
      Sign Out
    </button>
  );
}

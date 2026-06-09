"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-full border border-mauve-300 bg-white px-5 py-2 text-sm font-semibold text-mauve-700 transition hover:bg-mauve-50"
    >
      Sign Out
    </button>
  );
}

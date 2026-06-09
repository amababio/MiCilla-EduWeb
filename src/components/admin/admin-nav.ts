export type AdminNavItem = {
  label: string;
  href: string;
  active?: boolean;
  soon?: boolean;
};

export const adminNavItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", active: true },
  { label: "School Profile", href: "/admin/school-profile" },
  { label: "Homepage Content", href: "/admin/homepage-content" },
  { label: "Programs", href: "/admin/programs" },
  { label: "Photos", href: "/admin/photos" },
  { label: "Achievements", href: "/admin/achievements" },
  { label: "Notices", href: "/admin/notices" },
  { label: "Files", href: "#", soon: true },
];

export function getNavItemsForPath(currentPath: string): AdminNavItem[] {
  return adminNavItems.map((item) => ({
    ...item,
    active: item.href === currentPath,
  }));
}

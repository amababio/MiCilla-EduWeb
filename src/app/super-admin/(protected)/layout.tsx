import { redirect } from "next/navigation";
import { SuperAdminShell } from "@/components/super-admin/SuperAdminShell";
import { getSuperAdminSession } from "@/lib/super-admin-auth";

export default async function SuperAdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSuperAdminSession();

  if (!session) {
    redirect("/super-admin/login");
  }

  return <SuperAdminShell session={session}>{children}</SuperAdminShell>;
}

import { redirect } from "next/navigation";
import { getSuperAdminSession } from "@/lib/super-admin-auth";

export default async function SuperAdminRootPage() {
  const session = await getSuperAdminSession();
  redirect(session ? "/super-admin/dashboard" : "/super-admin/login");
}

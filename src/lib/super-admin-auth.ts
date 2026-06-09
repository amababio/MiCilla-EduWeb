import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import {
  createSuperAdminSessionToken,
  SUPER_ADMIN_SESSION_COOKIE_NAME,
  verifySuperAdminSessionToken,
  type SuperAdminSession,
} from "@/lib/super-admin-auth-session";

export {
  createSuperAdminSessionToken,
  SUPER_ADMIN_SESSION_COOKIE_NAME,
  type SuperAdminSession,
} from "@/lib/super-admin-auth-session";

export async function getSuperAdminSession(): Promise<SuperAdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SUPER_ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return verifySuperAdminSessionToken(token);
}

export async function authenticateSuperAdmin(
  email: string,
  password: string,
): Promise<SuperAdminSession | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  const superAdmin = await prisma.superAdmin.findUnique({
    where: { email: normalizedEmail },
  });

  if (!superAdmin || !superAdmin.isActive) {
    return null;
  }

  const isValid = await verifyPassword(
    normalizedPassword,
    superAdmin.passwordHash,
  );
  if (!isValid) {
    return null;
  }

  return {
    superAdminId: superAdmin.id,
    email: superAdmin.email,
    name: superAdmin.name,
  };
}

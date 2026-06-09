import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  type AdminSession,
  verifySessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/auth-session";
import { verifyPassword } from "@/lib/password";

export {
  createSessionToken,
  verifySessionToken,
  SESSION_COOKIE_NAME,
  type AdminSession,
} from "@/lib/auth-session";

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return verifySessionToken(token);
}

export async function authenticateAdmin(
  email: string,
  password: string,
): Promise<AdminSession | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();
  const schoolSlug =
    process.env.DEFAULT_SCHOOL_SLUG ?? "redemption-international-school";

  const admin = await prisma.admin.findFirst({
    where: {
      email: normalizedEmail,
      isActive: true,
      school: { slug: schoolSlug },
    },
    include: { school: true },
  });

  if (!admin) {
    return null;
  }

  const isValid = await verifyPassword(normalizedPassword, admin.passwordHash);
  if (!isValid) {
    return null;
  }

  return {
    adminId: admin.id,
    schoolId: admin.schoolId,
    schoolName: admin.school.name,
    email: admin.email,
    name: admin.name,
  };
}

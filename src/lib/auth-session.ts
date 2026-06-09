import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "micilla_admin_session";

export type AdminSession = {
  adminId: string;
  schoolId: string;
  schoolName: string;
  email: string;
  name: string;
};

function getSessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(
  payload: AdminSession,
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSessionSecret());
}

export async function verifySessionToken(
  token: string,
): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    if (
      typeof payload.adminId !== "string" ||
      typeof payload.schoolId !== "string" ||
      typeof payload.schoolName !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }
    return {
      adminId: payload.adminId,
      schoolId: payload.schoolId,
      schoolName: payload.schoolName,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

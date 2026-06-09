import { SignJWT, jwtVerify } from "jose";

export const SUPER_ADMIN_SESSION_COOKIE_NAME = "micilla_super_admin_session";

export type SuperAdminSession = {
  superAdminId: string;
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

export async function createSuperAdminSessionToken(
  payload: SuperAdminSession,
): Promise<string> {
  return new SignJWT({ ...payload, role: "super_admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSessionSecret());
}

export async function verifySuperAdminSessionToken(
  token: string,
): Promise<SuperAdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    if (
      payload.role !== "super_admin" ||
      typeof payload.superAdminId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string"
    ) {
      return null;
    }

    return {
      superAdminId: payload.superAdminId,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

import { NextResponse } from "next/server";
import {
  authenticateSuperAdmin,
  createSuperAdminSessionToken,
  SUPER_ADMIN_SESSION_COOKIE_NAME,
} from "@/lib/super-admin-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim() ?? "";
    const password = body.password?.trim() ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter your email and password." },
        { status: 400 },
      );
    }

    const session = await authenticateSuperAdmin(email, password);
    if (!session) {
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 },
      );
    }

    const token = await createSuperAdminSessionToken(session);
    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: SUPER_ADMIN_SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

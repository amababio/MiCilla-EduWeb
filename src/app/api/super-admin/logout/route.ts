import { NextResponse } from "next/server";
import { SUPER_ADMIN_SESSION_COOKIE_NAME } from "@/lib/super-admin-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: SUPER_ADMIN_SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

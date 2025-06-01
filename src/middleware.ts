import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const searchParams = new URL(request.url).searchParams;
  const jwtToken = searchParams.get("jwt_token");

  if (jwtToken) {
    // Create response with redirect
    const response = NextResponse.redirect(new URL(`/afel-id`, request.url));

    // Set cookie with string value
    response.cookies.set("jwt", String(jwtToken), {
      path: "/",
      maxAge: 60 * 60 * 12, // 12 hours
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/afel-id/:path*",
};

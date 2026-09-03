import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { COURSES_ENABLED } from "@/lib/features";

// Edge middleware:
//  • guards every /admin route (via the `authorized` callback in auth.config), and
//  • redirects the public /courses section to the marketplace while it's hidden
//    (set NEXT_PUBLIC_COURSES_ENABLED="true" to re-enable).
export default NextAuth(authConfig).auth((req) => {
  const p = req.nextUrl.pathname;
  if (!COURSES_ENABLED && (p === "/courses" || p.startsWith("/courses/"))) {
    return NextResponse.redirect(new URL("/nbnmarket", req.nextUrl.origin));
  }
  return undefined;
});

export const config = {
  matcher: ["/admin/:path*", "/courses", "/courses/:path*"],
};

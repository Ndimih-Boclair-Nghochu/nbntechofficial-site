import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Edge middleware guards every /admin route server-side via the `authorized`
// callback in auth.config. Uses the DB-free config so it stays edge-compatible.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*"],
};

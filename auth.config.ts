import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config. Contains NO database or bcrypt imports, so it can run
 * inside middleware (edge runtime). The Credentials provider that touches
 * Prisma lives in auth.ts, which only runs in the Node runtime.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8, // 8h admin session
  },
  callbacks: {
    // Server-side route protection. Runs in middleware for every matched path.
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isLoggedIn = !!auth?.user;
      const isLoginPage = pathname === "/admin/login";
      const isAdminArea = pathname.startsWith("/admin");

      if (isLoginPage) {
        // Already signed in? Bounce to the dashboard.
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", request.nextUrl));
        }
        return true;
      }
      if (isAdminArea) return isLoggedIn;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  providers: [], // real providers added in auth.ts
} satisfies NextAuthConfig;

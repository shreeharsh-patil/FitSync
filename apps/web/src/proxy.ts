import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";
import db from "@/lib/db";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/", "/features", "/pricing", "/blog"].includes(nextUrl.pathname) || nextUrl.pathname.startsWith("/blog/");
  const isAuthRoute = ["/login", "/signup"].includes(nextUrl.pathname);
  const isVerify2FA = nextUrl.pathname === "/verify-2fa";

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isVerify2FA) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && req.auth?.user?.id) {
    try {
      const user = await db.user.findUnique({
        where: { id: req.auth.user.id },
        select: { twoFactorEnabled: true },
      });
      if (user?.twoFactorEnabled && !isVerify2FA) {
        return NextResponse.redirect(new URL("/verify-2fa", nextUrl));
      }
    } catch {
      // If DB query fails, allow through
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

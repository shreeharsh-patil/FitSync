import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard") || 
                           req.nextUrl.pathname.startsWith("/workout") ||
                           req.nextUrl.pathname.startsWith("/nutrition") ||
                           req.nextUrl.pathname.startsWith("/progress") ||
                           req.nextUrl.pathname.startsWith("/community") ||
                           req.nextUrl.pathname.startsWith("/ai-coach") ||
                           req.nextUrl.pathname.startsWith("/settings")

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

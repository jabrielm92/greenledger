import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/pricing", "/about", "/contact"];
const authRoutes = ["/login", "/register", "/verify-email", "/forgot-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public/marketing routes — always accessible
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Static assets & API routes (except auth check routes) — skip
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Auth routes (login, register, etc.)
  if (authRoutes.includes(pathname)) {
    if (token) {
      // Already logged in — redirect to dashboard or onboarding
      if (!token.organizationId) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes — require authentication
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Onboarding routes
  if (pathname.startsWith("/onboarding")) {
    // If user already has a completed org, redirect to dashboard
    if (token.organizationId) {
      // Check if onboarding is complete by looking up org
      // For simplicity, allow access to onboarding even with org (they may not have finished)
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // Dashboard routes — require organization
  if (pathname.startsWith("/dashboard")) {
    if (!token.organizationId) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|images/).*)",
  ],
};

import { auth } from "@/lib/auth-options";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/pricing", "/about", "/contact", "/privacy", "/terms"];
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Public/marketing routes — always accessible
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Static assets & API routes — skip
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const session = req.auth;

  // Auth routes (login, register, etc.)
  if (authRoutes.includes(pathname)) {
    if (session?.user) {
      const user = session.user as { organizationId?: string; emailVerified?: boolean };
      if (!user.emailVerified) {
        return NextResponse.redirect(new URL(`/verify-email?email=${encodeURIComponent(session.user.email || "")}`, req.url));
      }
      if (!user.organizationId) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Verify-email page — accessible when logged in but unverified, or not logged in
  if (pathname === "/verify-email") {
    return NextResponse.next();
  }

  // Invite accept page — always accessible for signed-in users
  if (pathname.startsWith("/invite/")) {
    return NextResponse.next();
  }

  // Protected routes — require authentication
  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const user = session.user as {
    organizationId?: string;
    emailVerified?: boolean;
    plan?: string;
    trialEndsAt?: string | null;
  };

  // Gate: unverified email → redirect to verify-email
  if (!user.emailVerified) {
    return NextResponse.redirect(new URL(`/verify-email?email=${encodeURIComponent(session.user.email || "")}`, req.url));
  }

  // Onboarding routes — allow access
  if (pathname.startsWith("/onboarding")) {
    return NextResponse.next();
  }

  // Dashboard routes — require organization
  if (pathname.startsWith("/dashboard")) {
    if (!user.organizationId) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Trial grace period expired → force upgrade page
    // (allow access to upgrade, billing, and settings pages)
    if (
      user.plan === "FREE_TRIAL" &&
      user.trialEndsAt &&
      !pathname.startsWith("/dashboard/upgrade") &&
      !pathname.startsWith("/dashboard/settings")
    ) {
      const trialEnd = new Date(user.trialEndsAt);
      const gracePeriodMs = 7 * 24 * 60 * 60 * 1000; // 7 days
      const graceExpired = Date.now() > trialEnd.getTime() + gracePeriodMs;

      if (graceExpired) {
        return NextResponse.redirect(new URL("/dashboard/upgrade", req.url));
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logo.svg|images/).*)",
  ],
};

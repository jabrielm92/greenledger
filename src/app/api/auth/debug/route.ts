import { NextResponse } from "next/server";
import { auth } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    // Test DB connection
    let dbStatus = "unknown";
    let userCount = 0;
    try {
      userCount = await prisma.user.count();
      dbStatus = "connected";
    } catch (e) {
      dbStatus = `error: ${e instanceof Error ? e.message : String(e)}`;
    }

    return NextResponse.json({
      session: session ? { user: { id: session.user?.id, email: session.user?.email } } : null,
      env: {
        hasAuthSecret: !!process.env.AUTH_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        authUrl: process.env.AUTH_URL || process.env.NEXTAUTH_URL || "not set",
        hasDbUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV,
      },
      db: {
        status: dbStatus,
        userCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

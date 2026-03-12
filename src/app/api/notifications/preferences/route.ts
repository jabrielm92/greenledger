import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULT_PREFS = {
  extractionComplete: true,
  extractionFailed: true,
  emissionAutoCreated: true,
  supplierDetected: true,
  complianceMilestone: true,
  reportStale: true,
  deadlineReminder: true,
  emailExtractionFailed: true,
  emailDeadlineReminder: true,
  emailSupplierHighRisk: true,
};

// Store preferences using VerificationToken as a key-value store
const PREFS_PREFIX = "notification-prefs:";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stored = await prisma.verificationToken.findFirst({
      where: {
        identifier: `${PREFS_PREFIX}${session.user.id}`,
      },
    });

    if (!stored) {
      return NextResponse.json(DEFAULT_PREFS);
    }

    try {
      const prefs = JSON.parse(stored.token);
      return NextResponse.json({ ...DEFAULT_PREFS, ...prefs });
    } catch {
      return NextResponse.json(DEFAULT_PREFS);
    }
  } catch (error) {
    console.error("[NOTIFICATION_PREFS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate that only known keys are present
    const validKeys = Object.keys(DEFAULT_PREFS);
    const prefs: Record<string, boolean> = {};
    for (const key of validKeys) {
      if (typeof body[key] === "boolean") {
        prefs[key] = body[key];
      }
    }

    const identifier = `${PREFS_PREFIX}${session.user.id}`;

    // Upsert: delete existing, then create new
    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });

    await prisma.verificationToken.create({
      data: {
        identifier,
        token: JSON.stringify(prefs),
        expires: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
      },
    });

    return NextResponse.json({ ...DEFAULT_PREFS, ...prefs });
  } catch (error) {
    console.error("[NOTIFICATION_PREFS_PUT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

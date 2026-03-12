import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logAudit } from "@/lib/audit/logger";

export async function POST() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id || !session.user.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a new API key
    const rawKey = `gl_${crypto.randomBytes(32).toString("hex")}`;
    const hashedKey = await bcrypt.hash(rawKey, 10);

    // Store only the hash — delete any previous key for this user
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: `api-key:${session.user.id}`,
      },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: `api-key:${session.user.id}`,
        token: hashedKey,
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      },
    });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "field_changed",
      entityType: "User",
      entityId: session.user.id,
      metadata: { field: "api_key", action: "regenerated" },
    });

    // Return the raw key — this is the only time it's visible
    return NextResponse.json({ apiKey: rawKey });
  } catch (error) {
    console.error("[API_KEY_GENERATE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

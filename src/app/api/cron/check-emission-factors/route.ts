import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find factors that are about to expire or outdated
    const outdatedFactors = await prisma.emissionFactor.findMany({
      where: {
        isActive: true,
        year: { lt: new Date().getFullYear() - 1 },
      },
    });

    if (outdatedFactors.length > 0) {
      logger.warn("Outdated emission factors detected", {
        count: outdatedFactors.length,
        categories: Array.from(new Set(outdatedFactors.map((f) => f.category))),
      });
    }

    return NextResponse.json({
      success: true,
      outdatedCount: outdatedFactors.length,
      message: "Emission factor check complete",
    });
  } catch (error) {
    logger.error("Emission factor check failed", { error: String(error) });
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}

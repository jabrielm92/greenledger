import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if ((session?.user as { role?: string })?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total costs by model
    const modelCosts = await prisma.aIUsageLog.groupBy({
      by: ["model"],
      where: { createdAt: { gte: startDate } },
      _sum: { estimatedCost: true },
      _count: true,
    });

    // Total costs by organization
    const orgCosts = await prisma.aIUsageLog.groupBy({
      by: ["organizationId"],
      where: { createdAt: { gte: startDate } },
      _sum: { estimatedCost: true, inputTokens: true, outputTokens: true },
      _count: true,
    });

    const totalCost = orgCosts.reduce(
      (sum, org) => sum + (org._sum.estimatedCost || 0),
      0
    );
    const totalOps = orgCosts.reduce((sum, org) => sum + org._count, 0);

    // Calculate savings from using mini model
    const miniUsage = modelCosts.find((m) => m.model === "gpt-4o-mini");
    const hypotheticalFullCost = (miniUsage?._count || 0) * 0.4;
    const actualMiniCost = miniUsage?._sum.estimatedCost || 0;
    const savings = hypotheticalFullCost - actualMiniCost;

    return NextResponse.json({
      summary: {
        totalCost: Math.round(totalCost * 100) / 100,
        totalOperations: totalOps,
        avgCostPerOperation:
          totalOps > 0 ? Math.round((totalCost / totalOps) * 10000) / 10000 : 0,
        savings: Math.round(savings * 100) / 100,
      },
      byModel: modelCosts,
      topOrganizations: orgCosts
        .sort((a, b) => (b._sum.estimatedCost || 0) - (a._sum.estimatedCost || 0))
        .slice(0, 10),
    });
  } catch (error) {
    console.error("AI usage stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

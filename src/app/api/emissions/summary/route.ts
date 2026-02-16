import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId;
    const { searchParams } = new URL(req.url);
    const year = parseInt(
      searchParams.get("year") || String(new Date().getFullYear())
    );

    const periodStart = new Date(`${year}-01-01`);
    const periodEnd = new Date(`${year}-12-31`);

    const entries = await prisma.emissionEntry.findMany({
      where: {
        organizationId: orgId,
        startDate: { gte: periodStart },
        endDate: { lte: periodEnd },
      },
      select: {
        scope: true,
        category: true,
        co2e: true,
        startDate: true,
      },
    });

    // Scope totals
    let totalScope1 = 0;
    let totalScope2 = 0;

    // Category breakdown
    const categoryMap = new Map<
      string,
      { scope: string; totalCo2e: number; entryCount: number }
    >();

    // Monthly breakdown
    const monthlyMap = new Map<
      string,
      { scope1: number; scope2: number }
    >();

    for (const entry of entries) {
      if (entry.scope === "SCOPE_1") totalScope1 += entry.co2e;
      if (entry.scope === "SCOPE_2") totalScope2 += entry.co2e;

      // Category
      const catKey = `${entry.scope}:${entry.category}`;
      const existing = categoryMap.get(catKey) || {
        scope: entry.scope,
        totalCo2e: 0,
        entryCount: 0,
      };
      existing.totalCo2e += entry.co2e;
      existing.entryCount += 1;
      categoryMap.set(catKey, existing);

      // Monthly
      const month = entry.startDate.toISOString().slice(0, 7);
      const monthData = monthlyMap.get(month) || { scope1: 0, scope2: 0 };
      if (entry.scope === "SCOPE_1") monthData.scope1 += entry.co2e;
      if (entry.scope === "SCOPE_2") monthData.scope2 += entry.co2e;
      monthlyMap.set(month, monthData);
    }

    const totalEmissions = totalScope1 + totalScope2;

    const byCategory = Array.from(categoryMap.entries()).map(
      ([key, val]) => ({
        category: key.split(":")[1],
        scope: val.scope as "SCOPE_1" | "SCOPE_2",
        totalCo2e: val.totalCo2e,
        percentage: totalEmissions > 0 ? (val.totalCo2e / totalEmissions) * 100 : 0,
        entryCount: val.entryCount,
      })
    );

    const byMonth = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        scope1: data.scope1,
        scope2: data.scope2,
        scope3: 0,
        total: data.scope1 + data.scope2,
      }));

    return NextResponse.json({
      totalScope1,
      totalScope2,
      totalScope3: 0,
      totalEmissions,
      byCategory,
      byMonth,
      periodStart,
      periodEnd,
      entryCount: entries.length,
    });
  } catch (error) {
    console.error("[EMISSIONS_SUMMARY]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

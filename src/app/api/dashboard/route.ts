import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleUpdateCompliance } from "@/lib/events/handlers/update-compliance";
import { calculateComplianceScore } from "@/lib/compliance-score";

// Default due dates for frameworks that have none set
function getDefaultDueDate(frameworkName: string, targetYear: number): Date {
  switch (frameworkName) {
    case "CSRD":
      return new Date(targetYear, 5, 30); // June 30
    case "SB253":
      return new Date(targetYear, 2, 31); // March 31
    default:
      return new Date(targetYear, 11, 31); // December 31
  }
}

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId;

    const [
      emissionEntries,
      documentsCount,
      pendingReviews,
      reportsCount,
      suppliersCount,
      _frameworks,
      recentActivity,
    ] = await Promise.all([
      prisma.emissionEntry.groupBy({
        by: ["scope"],
        where: { organizationId: orgId },
        _sum: { co2e: true },
      }),
      prisma.document.count({
        where: {
          organizationId: orgId,
          status: { in: ["EXTRACTED", "REVIEWED"] },
        },
      }),
      prisma.document.count({
        where: { organizationId: orgId, status: "EXTRACTED" },
      }),
      prisma.report.count({ where: { organizationId: orgId } }),
      prisma.supplier.count({ where: { organizationId: orgId } }),
      prisma.orgFramework.findMany({
        where: { organizationId: orgId },
        include: {
          framework: { select: { displayName: true, name: true } },
        },
      }),
      prisma.auditLog.findMany({
        where: { organizationId: orgId },
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

    // Calculate scope totals
    let totalScope1 = 0;
    let totalScope2 = 0;
    let totalScope3 = 0;
    for (const entry of emissionEntries) {
      if (entry.scope === "SCOPE_1") totalScope1 = entry._sum.co2e ?? 0;
      if (entry.scope === "SCOPE_2") totalScope2 = entry._sum.co2e ?? 0;
      if (entry.scope === "SCOPE_3") totalScope3 = entry._sum.co2e ?? 0;
    }

    // Recalculate compliance in case events were missed
    await handleUpdateCompliance({ organizationId: orgId });

    // Backfill dueDate for any frameworks missing it
    for (const fw of _frameworks) {
      if (!fw.dueDate) {
        const defaultDate = getDefaultDueDate(fw.framework.name, fw.targetYear);
        await prisma.orgFramework.update({
          where: { id: fw.id },
          data: { dueDate: defaultDate },
        });
      }
    }

    // Re-fetch frameworks after compliance recalculation + dueDate backfill
    const updatedFrameworks = await prisma.orgFramework.findMany({
      where: { organizationId: orgId },
      include: {
        framework: { select: { displayName: true, name: true } },
      },
    });

    // Calculate compliance score (weighted blend of framework completion + data readiness)
    const { overallPercentage: complianceScore } = await calculateComplianceScore(orgId);

    // Find nearest future deadline
    const now = Date.now();
    const futureDeadlines = updatedFrameworks
      .filter((fw) => fw.dueDate && new Date(fw.dueDate).getTime() > now);
    const nextDeadline = futureDeadlines.sort(
      (a, b) =>
        new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    )[0];

    const daysUntilDeadline = nextDeadline?.dueDate
      ? Math.ceil(
          (new Date(nextDeadline.dueDate).getTime() - now) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    return NextResponse.json({
      stats: {
        totalScope1,
        totalScope2,
        totalScope3,
        totalEmissions: totalScope1 + totalScope2 + totalScope3,
        complianceScore,
        documentsCount,
        reportsCount,
        suppliersCount,
        pendingReviews,
      },
      daysUntilDeadline,
      nextDeadlineFramework: nextDeadline?.framework.displayName ?? null,
      frameworks: updatedFrameworks.map((fw) => ({
        id: fw.id,
        name: fw.framework.displayName,
        completionPct: fw.completionPct,
        coveredDataPoints: fw.coveredDataPoints,
        totalDataPoints: fw.totalDataPoints,
        status: fw.status,
        targetYear: fw.targetYear,
        dueDate: fw.dueDate?.toISOString() ?? null,
      })),
      recentActivity: recentActivity.map((log) => ({
        id: log.id,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        userName: log.user?.name,
        userEmail: log.user?.email,
        metadata: log.metadata as Record<string, unknown> | undefined,
        createdAt: log.createdAt,
      })),
    });
  } catch (error) {
    console.error("[DASHBOARD_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

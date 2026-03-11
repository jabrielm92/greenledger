import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleUpdateCompliance } from "@/lib/events/handlers/update-compliance";

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
      // Emissions summary
      prisma.emissionEntry.groupBy({
        by: ["scope"],
        where: { organizationId: orgId },
        _sum: { co2e: true },
      }),
      // Total documents (extracted or reviewed)
      prisma.document.count({
        where: {
          organizationId: orgId,
          status: { in: ["EXTRACTED", "REVIEWED"] },
        },
      }),
      // Pending review documents
      prisma.document.count({
        where: { organizationId: orgId, status: "EXTRACTED" },
      }),
      // Reports count
      prisma.report.count({ where: { organizationId: orgId } }),
      // Suppliers count
      prisma.supplier.count({ where: { organizationId: orgId } }),
      // Active frameworks
      prisma.orgFramework.findMany({
        where: { organizationId: orgId },
        include: {
          framework: { select: { displayName: true } },
        },
      }),
      // Recent audit log
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

    // Re-fetch frameworks after compliance recalculation
    const updatedFrameworks = await prisma.orgFramework.findMany({
      where: { organizationId: orgId },
      include: {
        framework: { select: { displayName: true } },
      },
    });

    // Calculate compliance score based on updated framework completion
    const complianceScore =
      updatedFrameworks.length > 0
        ? updatedFrameworks.reduce((sum, fw) => sum + fw.completionPct, 0) /
          updatedFrameworks.length
        : 0;

    // Find nearest deadline
    const nextDeadline = updatedFrameworks
      .filter((fw) => fw.dueDate)
      .sort(
        (a, b) =>
          new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      )[0];

    const daysUntilDeadline = nextDeadline?.dueDate
      ? Math.ceil(
          (new Date(nextDeadline.dueDate).getTime() - Date.now()) /
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
      frameworks: updatedFrameworks.map((fw) => ({
        id: fw.id,
        name: fw.framework.displayName,
        completionPct: fw.completionPct,
        status: fw.status,
        targetYear: fw.targetYear,
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

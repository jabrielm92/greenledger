import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find all org frameworks with upcoming due dates
    const orgFrameworks = await prisma.orgFramework.findMany({
      where: {
        organizationId: session.user.organizationId,
        dueDate: { not: null },
        status: { notIn: ["COMPLETED", "SUBMITTED"] },
      },
      include: {
        framework: { select: { displayName: true, name: true } },
      },
      orderBy: { dueDate: "asc" },
    });

    const now = new Date();
    const alerts = orgFrameworks
      .filter((of) => of.dueDate)
      .map((of) => {
        const dueDate = of.dueDate!;
        const daysRemaining = Math.ceil(
          (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        const urgency =
          daysRemaining <= 7
            ? "critical"
            : daysRemaining <= 14
            ? "warning"
            : daysRemaining <= 30
            ? "upcoming"
            : "on_track";

        return {
          id: of.id,
          frameworkName: of.framework.displayName,
          frameworkType: of.framework.name,
          dueDate: dueDate.toISOString(),
          daysRemaining,
          completionPercentage: Math.round(of.completionPct),
          status: of.status,
          urgency,
          targetYear: of.targetYear,
        };
      })
      .filter((a) => a.daysRemaining > -30); // include recently passed deadlines up to 30 days

    return NextResponse.json({ items: alerts });
  } catch (error) {
    console.error("[COMPLIANCE_ALERTS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

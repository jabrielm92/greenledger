import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import { z } from "zod";

// GET /api/organization/frameworks — list available frameworks and which are active
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId;

    const [allFrameworks, orgFrameworks] = await Promise.all([
      prisma.complianceFramework.findMany({
        where: { isActive: true },
        select: { id: true, name: true, displayName: true, description: true, regions: true },
        orderBy: { name: "asc" },
      }),
      prisma.orgFramework.findMany({
        where: { organizationId: orgId },
        include: { framework: { select: { name: true, displayName: true } } },
      }),
    ]);

    return NextResponse.json({
      available: allFrameworks,
      active: orgFrameworks.map((of) => ({
        id: of.id,
        frameworkId: of.frameworkId,
        name: of.framework.name,
        displayName: of.framework.displayName,
        status: of.status,
        completionPct: of.completionPct,
        targetYear: of.targetYear,
      })),
    });
  } catch (error) {
    console.error("[ORG_FRAMEWORKS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const updateFrameworksSchema = z.object({
  frameworks: z.array(z.string()).min(1, "Select at least one framework"),
});

// Default reporting deadlines (month index 0-11, day) for each framework per target year
// These represent typical regulatory or reporting cycle deadlines
function getDefaultDueDate(frameworkName: string, targetYear: number): Date {
  switch (frameworkName) {
    case "CSRD":
      // CSRD reports due by end of fiscal year following the reporting year
      return new Date(targetYear, 5, 30); // June 30
    case "SB253":
      // California SB-253 annual reporting deadline
      return new Date(targetYear, 2, 31); // March 31
    default:
      // Most frameworks: year-end deadline for annual reporting
      return new Date(targetYear, 11, 31); // December 31
  }
}

// PUT /api/organization/frameworks — replace active frameworks
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId;
    const body = await req.json();
    const { frameworks: frameworkNames } = updateFrameworksSchema.parse(body);

    const currentYear = new Date().getFullYear();

    // Look up framework records by name
    const frameworkRecords = await prisma.complianceFramework.findMany({
      where: { name: { in: frameworkNames } },
    });

    const foundNames = new Set(frameworkRecords.map((f) => f.name));
    const missing = frameworkNames.filter((n) => !foundNames.has(n));
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Unknown frameworks: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Remove frameworks that are no longer selected (for current year)
    const selectedIds = new Set(frameworkRecords.map((f) => f.id));
    await prisma.orgFramework.deleteMany({
      where: {
        organizationId: orgId,
        targetYear: currentYear,
        frameworkId: { notIn: Array.from(selectedIds) },
      },
    });

    // Upsert selected frameworks with default due dates
    const orgFrameworks = await Promise.all(
      frameworkRecords.map((fw) =>
        prisma.orgFramework.upsert({
          where: {
            organizationId_frameworkId_targetYear: {
              organizationId: orgId,
              frameworkId: fw.id,
              targetYear: currentYear,
            },
          },
          update: {
            // Backfill dueDate if it was previously null
            dueDate: getDefaultDueDate(fw.name, currentYear),
          },
          create: {
            organizationId: orgId,
            frameworkId: fw.id,
            targetYear: currentYear,
            dueDate: getDefaultDueDate(fw.name, currentYear),
          },
          include: { framework: { select: { name: true, displayName: true } } },
        })
      )
    );

    await logAudit({
      organizationId: orgId,
      userId: session.user.id,
      action: "field_changed",
      entityType: "OrgFramework",
      entityId: orgId,
      newValue: { frameworks: frameworkNames },
    });

    return NextResponse.json({
      active: orgFrameworks.map((of) => ({
        id: of.id,
        frameworkId: of.frameworkId,
        name: of.framework.name,
        displayName: of.framework.displayName,
        status: of.status,
        completionPct: of.completionPct,
        targetYear: of.targetYear,
      })),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[ORG_FRAMEWORKS_PUT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

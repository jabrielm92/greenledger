import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId;

    const [organization, activeFrameworks] = await Promise.all([
      prisma.organization.findUnique({
        where: { id: orgId },
        select: {
          country: true,
          industry: true,
          employeeCount: true,
          name: true,
        },
      }),
      prisma.orgFramework.findMany({
        where: { organizationId: orgId },
        include: {
          framework: { select: { name: true, displayName: true } },
        },
      }),
    ]);

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json({
      country: organization.country,
      industry: organization.industry,
      employeeCount: organization.employeeCount,
      companyName: organization.name,
      activeFrameworks: activeFrameworks.map((af) => ({
        id: af.id,
        frameworkName: af.framework.name,
        displayName: af.framework.displayName,
        status: af.status,
        completionPct: af.completionPct,
        targetYear: af.targetYear,
      })),
    });
  } catch (error) {
    console.error("[FRAMEWORKS_GUIDE_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

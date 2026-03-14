import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireSuperAdmin();

    const [
      totalOrgs,
      totalUsers,
      totalDocuments,
      totalEmissions,
      orgsByPlan,
      recentOrgs,
      recentUsers,
      activeTrials,
      expiredTrials,
    ] = await Promise.all([
      prisma.organization.count(),
      prisma.user.count(),
      prisma.document.count(),
      prisma.emissionEntry.count(),
      prisma.organization.groupBy({
        by: ["plan"],
        _count: { id: true },
      }),
      prisma.organization.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, slug: true, plan: true, createdAt: true },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          organization: { select: { name: true } },
        },
      }),
      prisma.organization.count({
        where: {
          plan: "FREE_TRIAL",
          trialEndsAt: { gt: new Date() },
        },
      }),
      prisma.organization.count({
        where: {
          plan: "FREE_TRIAL",
          trialEndsAt: { lte: new Date() },
        },
      }),
    ]);

    const planCounts = Object.fromEntries(
      orgsByPlan.map((p) => [p.plan, p._count.id])
    );

    return NextResponse.json({
      overview: {
        totalOrgs,
        totalUsers,
        totalDocuments,
        totalEmissions,
        activeTrials,
        expiredTrials,
      },
      planCounts,
      recentOrgs,
      recentUsers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    if (message === "Unauthorized" || message === "Forbidden") {
      return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 403 });
    }
    console.error("[ADMIN STATS]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

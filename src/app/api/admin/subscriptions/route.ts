import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin();

    const { searchParams } = new URL(req.url);
    const plan = searchParams.get("plan") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (plan) {
      where.plan = plan;
    }

    const [subscriptions, total, planSummary] = await Promise.all([
      prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          slug: true,
          plan: true,
          trialEndsAt: true,
          stripeCustomerId: true,
          stripeSubscriptionId: true,
          stripePriceId: true,
          stripeCurrentPeriodEnd: true,
          createdAt: true,
          _count: { select: { users: true } },
        },
      }),
      prisma.organization.count({ where }),
      prisma.organization.groupBy({
        by: ["plan"],
        _count: { id: true },
      }),
    ]);

    const summary = Object.fromEntries(
      planSummary.map((p) => [p.plan, p._count.id])
    );

    return NextResponse.json({
      subscriptions,
      summary,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    if (message === "Unauthorized" || message === "Forbidden") {
      return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 403 });
    }
    console.error("[ADMIN SUBSCRIPTIONS]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

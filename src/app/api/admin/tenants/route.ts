import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const plan = searchParams.get("plan") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }
    if (plan) {
      where.plan = plan;
    }

    const [tenants, total] = await Promise.all([
      prisma.organization.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { users: true, documents: true, emissionEntries: true },
          },
        },
      }),
      prisma.organization.count({ where }),
    ]);

    return NextResponse.json({
      tenants,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    if (message === "Unauthorized" || message === "Forbidden") {
      return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 403 });
    }
    console.error("[ADMIN TENANTS]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

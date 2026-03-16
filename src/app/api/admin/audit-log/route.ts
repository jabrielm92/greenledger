import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    await requireSuperAdmin();

    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId") || "";
    const action = searchParams.get("action") || "";
    const entityType = searchParams.get("entityType") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (orgId) where.organizationId = orgId;
    if (action) where.action = { contains: action, mode: "insensitive" };
    if (entityType) where.entityType = { contains: entityType, mode: "insensitive" };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true } },
          organization: { select: { id: true, name: true } },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Server error";
    if (message === "Unauthorized" || message === "Forbidden") {
      return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 403 });
    }
    console.error("[ADMIN AUDIT LOG]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

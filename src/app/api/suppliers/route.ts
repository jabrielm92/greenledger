import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import { z } from "zod";

const createSupplierSchema = z.object({
  name: z.string().min(1),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  industry: z
    .enum([
      "MANUFACTURING",
      "LOGISTICS",
      "PROFESSIONAL_SERVICES",
      "CONSTRUCTION",
      "TECHNOLOGY",
      "RETAIL",
      "FOOD_BEVERAGE",
      "HEALTHCARE",
      "ENERGY",
      "AGRICULTURE",
      "OTHER",
    ])
    .optional(),
  country: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  esgRiskLevel: z
    .enum(["LOW", "MEDIUM", "HIGH", "CRITICAL", "UNKNOWN"])
    .default("UNKNOWN"),
  esgScore: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = createSupplierSchema.parse(body);

    const supplier = await prisma.supplier.create({
      data: {
        organizationId: session.user.organizationId,
        name: validated.name,
        contactName: validated.contactName,
        contactEmail: validated.contactEmail || null,
        industry: validated.industry,
        country: validated.country,
        website: validated.website || null,
        esgRiskLevel: validated.esgRiskLevel,
        esgScore: validated.esgScore,
        notes: validated.notes,
      },
    });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "entity_created",
      entityType: "Supplier",
      entityId: supplier.id,
      newValue: { name: supplier.name, esgRiskLevel: supplier.esgRiskLevel },
    });

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[SUPPLIERS_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");
    const riskLevel = searchParams.get("riskLevel");
    const search = searchParams.get("search");

    const where = {
      organizationId: session.user.organizationId,
      ...(riskLevel && riskLevel !== "all"
        ? { esgRiskLevel: riskLevel as never }
        : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" as const } },
              { contactName: { contains: search, mode: "insensitive" as const } },
              { country: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [suppliers, total] = await Promise.all([
      prisma.supplier.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.supplier.count({ where }),
    ]);

    return NextResponse.json({
      items: suppliers,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("[SUPPLIERS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

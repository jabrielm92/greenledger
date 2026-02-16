import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import { z } from "zod";

const updateSupplierSchema = z.object({
  name: z.string().min(1).optional(),
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
    .optional(),
  esgScore: z.number().min(0).max(100).nullable().optional(),
  lastAssessment: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const supplier = await prisma.supplier.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
    });

    if (!supplier) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(supplier);
  } catch (error) {
    console.error("[SUPPLIER_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validated = updateSupplierSchema.parse(body);

    const existing = await prisma.supplier.findFirst({
      where: { id, organizationId: session.user.organizationId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.supplier.update({
      where: { id },
      data: {
        ...validated,
        contactEmail: validated.contactEmail || null,
        website: validated.website || null,
        ...(validated.lastAssessment
          ? { lastAssessment: new Date(validated.lastAssessment) }
          : {}),
      },
    });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "field_changed",
      entityType: "Supplier",
      entityId: id,
      previousValue: { esgRiskLevel: existing.esgRiskLevel },
      newValue: {
        esgRiskLevel: updated.esgRiskLevel,
        esgScore: updated.esgScore,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[SUPPLIER_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.supplier.findFirst({
      where: { id, organizationId: session.user.organizationId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Supplier not found" },
        { status: 404 }
      );
    }

    await prisma.supplier.delete({ where: { id } });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "entity_deleted",
      entityType: "Supplier",
      entityId: id,
      previousValue: { name: existing.name },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SUPPLIER_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

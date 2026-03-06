import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import { z } from "zod";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const org = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      select: {
        id: true,
        name: true,
        slug: true,
        industry: true,
        employeeCount: true,
        country: true,
        city: true,
        website: true,
        fiscalYearStart: true,
        plan: true,
        onboardingComplete: true,
      },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...org,
      fiscalYearStartMonth: org.fiscalYearStart,
    });
  } catch (error) {
    console.error("[ORG_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const updateOrgSchema = z.object({
  name: z.string().min(1).optional(),
  industry: z.string().optional(),
  employeeCount: z.number().int().positive().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  website: z.string().optional(),
  fiscalYearStartMonth: z.number().int().min(0).max(11).optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = updateOrgSchema.parse(body);

    const data: Record<string, unknown> = {};
    if (validated.name !== undefined) data.name = validated.name;
    if (validated.industry !== undefined) data.industry = validated.industry;
    if (validated.employeeCount !== undefined) data.employeeCount = validated.employeeCount;
    if (validated.country !== undefined) data.country = validated.country;
    if (validated.city !== undefined) data.city = validated.city;
    if (validated.website !== undefined) data.website = validated.website;
    if (validated.fiscalYearStartMonth !== undefined) data.fiscalYearStart = validated.fiscalYearStartMonth;

    const updated = await prisma.organization.update({
      where: { id: session.user.organizationId },
      data,
    });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "field_changed",
      entityType: "Organization",
      entityId: session.user.organizationId,
      newValue: data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[ORG_PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only OWNER can delete
    if (session.user.role !== "OWNER") {
      return NextResponse.json({ error: "Only the organization owner can delete it" }, { status: 403 });
    }

    const orgId = session.user.organizationId;

    // Log before deletion
    await logAudit({
      organizationId: orgId,
      userId: session.user.id,
      action: "organization_deleted",
      entityType: "Organization",
      entityId: orgId,
    });

    // Cascading delete in order (respecting foreign keys)
    // 1. Delete audit logs
    await prisma.auditLog.deleteMany({ where: { organizationId: orgId } });

    // 2. Delete report-related data
    await prisma.reportExport.deleteMany({
      where: { report: { organizationId: orgId } },
    });
    await prisma.reportDataPoint.deleteMany({
      where: { report: { organizationId: orgId } },
    });
    await prisma.report.deleteMany({ where: { organizationId: orgId } });

    // 3. Delete emission entries
    await prisma.emissionEntry.deleteMany({ where: { organizationId: orgId } });

    // 4. Delete documents
    await prisma.document.deleteMany({ where: { organizationId: orgId } });

    // 5. Delete suppliers
    await prisma.supplier.deleteMany({ where: { organizationId: orgId } });

    // 6. Remove users from org (don't delete user accounts)
    await prisma.user.updateMany({
      where: { organizationId: orgId },
      data: { organizationId: null },
    });

    // 7. Delete organization
    await prisma.organization.delete({ where: { id: orgId } });

    return NextResponse.json({ message: "Organization deleted" });
  } catch (error) {
    console.error("[ORG_DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

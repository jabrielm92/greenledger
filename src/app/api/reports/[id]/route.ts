import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import { z } from "zod";

const updateReportSchema = z.object({
  title: z.string().optional(),
  status: z.enum(["DRAFT", "REVIEW", "APPROVED", "PUBLISHED"]).optional(),
  manualEdits: z.record(z.string()).optional(),
  finalContent: z.record(z.unknown()).optional(),
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

    const report = await prisma.report.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
      include: {
        reportingPeriod: true,
        dataPoints: {
          include: { dataPoint: true },
        },
        exports: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("[REPORT_GET]", error);
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
    const validated = updateReportSchema.parse(body);

    const existing = await prisma.report.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const updated = await prisma.report.update({
      where: { id },
      data: {
        ...(validated.title ? { title: validated.title } : {}),
        ...(validated.status ? { status: validated.status } : {}),
        ...(validated.manualEdits
          ? { manualEdits: validated.manualEdits as never }
          : {}),
        ...(validated.finalContent
          ? { finalContent: validated.finalContent as never }
          : {}),
        ...(validated.status === "PUBLISHED"
          ? { publishedAt: new Date() }
          : {}),
        version: { increment: 1 },
      },
    });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "field_changed",
      entityType: "Report",
      entityId: id,
      previousValue: { status: existing.status },
      newValue: { status: updated.status },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[REPORT_PATCH]", error);
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

    const existing = await prisma.report.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    await prisma.report.delete({ where: { id } });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "entity_deleted",
      entityType: "Report",
      entityId: id,
      previousValue: { title: existing.title },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[REPORT_DELETE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

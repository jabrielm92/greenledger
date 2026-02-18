import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";

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

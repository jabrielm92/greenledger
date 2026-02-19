import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const orgId = session.user.organizationId;

    // Fetch all user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Fetch organization data if member
    let organization = null;
    let documents: unknown[] = [];
    let emissions: unknown[] = [];
    let suppliers: unknown[] = [];
    let reports: unknown[] = [];
    let auditLogs: unknown[] = [];

    if (orgId) {
      organization = await prisma.organization.findUnique({
        where: { id: orgId },
        select: {
          id: true,
          name: true,
          slug: true,
          industry: true,
          country: true,
          employeeCount: true,
          plan: true,
          createdAt: true,
        },
      });

      [documents, emissions, suppliers, reports, auditLogs] = await Promise.all([
        prisma.document.findMany({
          where: { organizationId: orgId },
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            documentType: true,
            status: true,
            extractedData: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.emissionEntry.findMany({
          where: { organizationId: orgId },
          select: {
            id: true,
            scope: true,
            category: true,
            source: true,
            activityValue: true,
            activityUnit: true,
            co2e: true,
            co2: true,
            ch4: true,
            n2o: true,
            startDate: true,
            endDate: true,
            calculationMethod: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.supplier.findMany({
          where: { organizationId: orgId },
          select: {
            id: true,
            name: true,
            contactEmail: true,
            industry: true,
            esgRiskLevel: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.report.findMany({
          where: { organizationId: orgId },
          select: {
            id: true,
            title: true,
            frameworkType: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.auditLog.findMany({
          where: { organizationId: orgId, userId },
          select: {
            id: true,
            action: true,
            entityType: true,
            entityId: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1000,
        }),
      ]);
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      user,
      organization,
      documents,
      emissions,
      suppliers,
      reports,
      auditLogs,
    };

    await logAudit({
      organizationId: orgId || "none",
      userId,
      action: "data_exported",
      entityType: "User",
      entityId: userId,
    });

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="greenledger-data-export-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error) {
    console.error("[DATA_EXPORT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

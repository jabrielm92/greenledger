import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";

function toCsv(data: Record<string, unknown>[]): string {
  if (data.length === 0) return "";
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((h) => {
      const val = row[h];
      const str = val === null || val === undefined ? "" : String(val);
      return str.includes(",") || str.includes('"') || str.includes("\n")
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    }).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgId = session.user.organizationId;
    if (!orgId) {
      return NextResponse.json({ error: "No organization" }, { status: 403 });
    }

    const format = req.nextUrl.searchParams.get("format") || "csv";

    const entries = await prisma.emissionEntry.findMany({
      where: { organizationId: orgId },
      select: {
        id: true,
        scope: true,
        category: true,
        source: true,
        activityValue: true,
        activityUnit: true,
        co2e: true,
        calculationMethod: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const rows = entries.map((e) => ({
      id: e.id,
      scope: e.scope,
      category: e.category,
      source: e.source,
      activityValue: e.activityValue,
      activityUnit: e.activityUnit,
      co2eKg: e.co2e,
      calculationMethod: e.calculationMethod ?? "",
      createdAt: e.createdAt.toISOString(),
    }));

    await logAudit({
      organizationId: orgId,
      userId: session.user.id,
      action: "data_exported",
      entityType: "EmissionEntry",
      entityId: orgId,
      metadata: { format, count: rows.length },
    });

    if (format === "json") {
      return new NextResponse(JSON.stringify(rows, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="greenledger-emissions-${new Date().toISOString().slice(0, 10)}.json"`,
        },
      });
    }

    const csv = toCsv(rows);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="greenledger-emissions-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("[EMISSIONS_EXPORT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

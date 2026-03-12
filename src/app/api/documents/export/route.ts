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

    const documents = await prisma.document.findMany({
      where: { organizationId: orgId },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        documentType: true,
        status: true,
        extractionConfidence: true,
        fileSize: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const rows = documents.map((d) => ({
      id: d.id,
      fileName: d.fileName,
      fileType: d.fileType,
      documentType: d.documentType ?? "",
      status: d.status,
      confidence: d.extractionConfidence ?? "",
      fileSize: d.fileSize,
      createdAt: d.createdAt.toISOString(),
    }));

    await logAudit({
      organizationId: orgId,
      userId: session.user.id,
      action: "data_exported",
      entityType: "Document",
      entityId: orgId,
      metadata: { format, count: rows.length },
    });

    if (format === "json") {
      return new NextResponse(JSON.stringify(rows, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="greenledger-documents-${new Date().toISOString().slice(0, 10)}.json"`,
        },
      });
    }

    const csv = toCsv(rows);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="greenledger-documents-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("[DOCUMENTS_EXPORT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

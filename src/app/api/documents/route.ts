import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max 25MB." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // Create upload directory
    const orgDir = path.join(UPLOAD_DIR, session.user.organizationId);
    await mkdir(orgDir, { recursive: true });

    // Save file
    const ext = path.extname(file.name);
    const uuid = randomUUID();
    const filePath = path.join(orgDir, `${uuid}${ext}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Create document record
    const document = await prisma.document.create({
      data: {
        organizationId: session.user.organizationId,
        uploadedById: session.user.id,
        fileName: file.name,
        fileType: file.type,
        filePath,
        fileSize: file.size,
        status: "UPLOADED",
      },
    });

    // Audit log
    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "document_uploaded",
      entityType: "Document",
      entityId: document.id,
      documentId: document.id,
      newValue: {
        fileName: document.fileName,
        fileType: document.fileType,
        fileSize: document.fileSize,
      },
    });

    // Trigger extraction asynchronously
    const baseUrl = req.nextUrl.origin;
    fetch(`${baseUrl}/api/documents/extract`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify({ documentId: document.id }),
    }).catch((err) =>
      console.error("[EXTRACTION_TRIGGER_ERROR]", err)
    );

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error("[DOCUMENTS_POST]", error);
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
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const documentType = searchParams.get("documentType");
    const status = searchParams.get("status");

    const where = {
      organizationId: session.user.organizationId,
      ...(documentType ? { documentType: documentType as never } : {}),
      ...(status ? { status: status as never } : {}),
    };

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          uploadedBy: { select: { name: true, email: true } },
        },
      }),
      prisma.document.count({ where }),
    ]);

    return NextResponse.json({
      items: documents,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("[DOCUMENTS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

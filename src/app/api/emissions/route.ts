import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import { z } from "zod";

const createEmissionSchema = z.object({
  scope: z.enum(["SCOPE_1", "SCOPE_2"]),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  source: z.string().min(1),
  description: z.string().optional(),
  activityValue: z.number().positive(),
  activityUnit: z.string().min(1),
  emissionFactor: z.number().positive(),
  emissionFactorSource: z.string().optional(),
  co2e: z.number(),
  co2: z.number().optional(),
  ch4: z.number().optional(),
  n2o: z.number().optional(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string().optional(),
  notes: z.string().optional(),
  documentId: z.string().optional(),
  calculationMethod: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = createEmissionSchema.parse(body);

    const entry = await prisma.emissionEntry.create({
      data: {
        organizationId: session.user.organizationId,
        scope: validated.scope,
        category: validated.category,
        subcategory: validated.subcategory,
        source: validated.source,
        description: validated.description,
        activityValue: validated.activityValue,
        activityUnit: validated.activityUnit,
        emissionFactor: validated.emissionFactor,
        emissionFactorSource: validated.emissionFactorSource,
        co2e: validated.co2e,
        co2: validated.co2,
        ch4: validated.ch4,
        n2o: validated.n2o,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
        location: validated.location,
        notes: validated.notes,
        documentId: validated.documentId,
        calculationMethod: validated.calculationMethod,
      },
    });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "entity_created",
      entityType: "EmissionEntry",
      entityId: entry.id,
      newValue: {
        scope: entry.scope,
        category: entry.category,
        co2e: entry.co2e,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[EMISSIONS_POST]", error);
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
    const scope = searchParams.get("scope");
    const category = searchParams.get("category");

    const where = {
      organizationId: session.user.organizationId,
      ...(scope ? { scope: scope as never } : {}),
      ...(category ? { category } : {}),
    };

    const [entries, total] = await Promise.all([
      prisma.emissionEntry.findMany({
        where,
        orderBy: { startDate: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          document: { select: { id: true, fileName: true } },
        },
      }),
      prisma.emissionEntry.count({ where }),
    ]);

    return NextResponse.json({
      items: entries,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("[EMISSIONS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

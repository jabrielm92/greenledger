import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if ((session?.user as { role?: string })?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const region = searchParams.get("region");
    const scope = searchParams.get("scope");

    const factors = await prisma.emissionFactor.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(region ? { region } : {}),
        ...(scope ? { scope } : {}),
      },
      orderBy: [{ isActive: "desc" }, { validFrom: "desc" }],
      take: 100,
    });

    return NextResponse.json({ factors });
  } catch (error) {
    console.error("Fetch factors error:", error);
    return NextResponse.json({ error: "Failed to fetch factors" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if ((session?.user as { role?: string })?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();

    const required = ["category", "region", "co2ePerUnit", "source", "unit"];
    for (const field of required) {
      if (body[field] === undefined || body[field] === null || body[field] === "") {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Expire previous factors for same category/region
    await prisma.emissionFactor.updateMany({
      where: {
        category: body.category,
        region: body.region,
        subcategory: body.subcategory || null,
        isActive: true,
      },
      data: {
        validTo: new Date(),
        isActive: false,
      },
    });

    const factor = await prisma.emissionFactor.create({
      data: {
        category: body.category,
        subcategory: body.subcategory || null,
        scope: body.scope || null,
        region: body.region,
        unit: body.unit,
        co2ePerUnit: parseFloat(body.co2ePerUnit),
        co2PerUnit: body.co2PerUnit ? parseFloat(body.co2PerUnit) : null,
        ch4PerUnit: body.ch4PerUnit ? parseFloat(body.ch4PerUnit) : null,
        n2oPerUnit: body.n2oPerUnit ? parseFloat(body.n2oPerUnit) : null,
        source: body.source,
        year: body.year || new Date().getFullYear(),
        version: body.version || `v${new Date().getFullYear()}.1`,
        validFrom: new Date(body.validFrom || new Date()),
        sourceUrl: body.sourceUrl || null,
        notes: body.notes || null,
        isActive: true,
      },
    });

    return NextResponse.json({ factor }, { status: 201 });
  } catch (error) {
    console.error("Create factor error:", error);
    return NextResponse.json({ error: "Failed to create factor" }, { status: 500 });
  }
}

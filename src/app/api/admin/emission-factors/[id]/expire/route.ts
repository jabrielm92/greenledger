import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if ((session?.user as { role?: string })?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    const factor = await prisma.emissionFactor.update({
      where: { id },
      data: {
        validTo: new Date(),
        isActive: false,
      },
    });

    return NextResponse.json({ factor });
  } catch (error) {
    console.error("Expire factor error:", error);
    return NextResponse.json({ error: "Failed to expire factor" }, { status: 500 });
  }
}

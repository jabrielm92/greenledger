import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { calculateEmissions } from "@/lib/emissions/calculator";
import { z } from "zod";

const calculateSchema = z.object({
  activityValue: z.number().positive(),
  activityUnit: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  region: z.string().min(1),
  year: z.number().int().min(2000).max(2100),
  customFactorId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = calculateSchema.parse(body);

    const result = await calculateEmissions(
      validated,
      session.user.organizationId
    );

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    if (error instanceof Error && error.message.includes("No emission factor")) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[EMISSIONS_CALCULATE]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

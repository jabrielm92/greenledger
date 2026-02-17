import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { syncQuickBooksData } from "@/lib/quickbooks/sync";
import { z } from "zod";

const syncSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const validated = syncSchema.parse(body);

    const result = await syncQuickBooksData(
      session.user.organizationId,
      session.user.id,
      {
        startDate: validated.startDate,
        endDate: validated.endDate,
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("not connected")
    ) {
      return NextResponse.json(
        { error: "QuickBooks is not connected" },
        { status: 400 }
      );
    }
    console.error("[QB_SYNC]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

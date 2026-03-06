import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const notification = await prisma.notification.findFirst({
      where: {
        id,
        organizationId: session.user.organizationId,
        OR: [
          { userId: session.user.id },
          { userId: null },
        ],
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const updated = await prisma.notification.update({
      where: { id },
      data: {
        isRead: body.isRead ?? true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[NOTIFICATION_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get("pageSize") || "20") || 20));
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const where = {
      organizationId: session.user.organizationId,
      OR: [
        { userId: session.user.id },
        { userId: null }, // org-wide notifications
      ],
      ...(unreadOnly ? { isRead: false } : {}),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          organizationId: session.user.organizationId,
          OR: [
            { userId: session.user.id },
            { userId: null },
          ],
          isRead: false,
        },
      }),
    ]);

    return NextResponse.json({
      items: notifications,
      total,
      unreadCount,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("[NOTIFICATIONS_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === "mark_all_read") {
      await prisma.notification.updateMany({
        where: {
          organizationId: session.user.organizationId,
          OR: [
            { userId: session.user.id },
            { userId: null },
          ],
          isRead: false,
        },
        data: { isRead: true },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("[NOTIFICATIONS_PATCH]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import { z } from "zod";

const updateRoleSchema = z.object({
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["OWNER", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId } = await params;
    const body = await req.json();
    const { role } = updateRoleSchema.parse(body);

    // Can't change owner role
    const target = await prisma.user.findFirst({
      where: { id: userId, organizationId: session.user.organizationId },
    });

    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (target.role === "OWNER") {
      return NextResponse.json({ error: "Cannot change owner role" }, { status: 403 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: role as never },
      select: { id: true, name: true, email: true, role: true },
    });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "team_role_updated",
      entityType: "User",
      entityId: userId,
      metadata: { previousRole: target.role, newRole: role },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    console.error("[TEAM_PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!["OWNER", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId } = await params;

    const target = await prisma.user.findFirst({
      where: { id: userId, organizationId: session.user.organizationId },
    });

    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (target.role === "OWNER") {
      return NextResponse.json({ error: "Cannot remove organization owner" }, { status: 403 });
    }

    // Can't remove yourself
    if (userId === session.user.id) {
      return NextResponse.json({ error: "Cannot remove yourself" }, { status: 400 });
    }

    // Remove from org (don't delete the user account)
    await prisma.user.update({
      where: { id: userId },
      data: { organizationId: null, role: "MEMBER" },
    });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "team_member_removed",
      entityType: "User",
      entityId: userId,
      metadata: { removedEmail: target.email },
    });

    return NextResponse.json({ message: "Member removed" });
  } catch (error) {
    console.error("[TEAM_DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

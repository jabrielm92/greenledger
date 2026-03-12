import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { logAudit } from "@/lib/audit/logger";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = changePasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, hashedPassword: true, organizationId: true },
    });

    if (!user || !user.hashedPassword) {
      return NextResponse.json(
        { error: "Password change not available for OAuth accounts" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword },
    });

    if (user.organizationId) {
      await logAudit({
        organizationId: user.organizationId,
        userId: user.id,
        action: "field_changed",
        entityType: "User",
        entityId: user.id,
        metadata: { field: "password" },
      });
    }

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error("[CHANGE_PASSWORD]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import InviteTeamEmail from "@/emails/invite-team";
import { logAudit } from "@/lib/audit/logger";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only OWNER and ADMIN can invite
    if (!["OWNER", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { email, role } = inviteSchema.parse(body);

    // Check if user already in org
    const existing = await prisma.user.findFirst({
      where: { email: email.toLowerCase(), organizationId: session.user.organizationId },
    });
    if (existing) {
      return NextResponse.json({ error: "User is already a team member" }, { status: 409 });
    }

    // Get org info
    const org = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      select: { name: true },
    });

    // Generate invite token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await prisma.verificationToken.create({
      data: {
        identifier: `invite:${session.user.organizationId}:${email.toLowerCase()}`,
        token,
        expires,
      },
    });

    // Store invited role in a simple way - encode in identifier
    // We'll use a separate token for role: `invite-role:{orgId}:{email}`
    await prisma.verificationToken.create({
      data: {
        identifier: `invite-role:${token}`,
        token: role,
        expires,
      },
    });

    // Send invite email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    await sendEmail({
      to: email.toLowerCase(),
      subject: `You've been invited to ${org?.name || "a team"} on GreenLedger`,
      react: InviteTeamEmail({
        inviterName: session.user.name || "A team member",
        companyName: org?.name || "an organization",
        role,
        inviteToken: token,
        appUrl,
      }),
    });

    await logAudit({
      organizationId: session.user.organizationId,
      userId: session.user.id,
      action: "team_invite_sent",
      entityType: "User",
      entityId: email.toLowerCase(),
      metadata: { email: email.toLowerCase(), role },
    });

    return NextResponse.json({ message: "Invitation sent" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    console.error("[TEAM_INVITE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

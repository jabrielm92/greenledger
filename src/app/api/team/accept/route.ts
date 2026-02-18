import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import { z } from "zod";

// GET: Validate invite token and return info
export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    // Find the invite token
    const inviteTokens = await prisma.verificationToken.findMany({
      where: {
        identifier: { startsWith: "invite:" },
        expires: { gt: new Date() },
      },
    });

    // Find matching token
    const _inviteRecord = inviteTokens.find((t) => {
      const parts = t.identifier.split(":");
      // identifier format: invite:{orgId}:{email}
      return parts.length >= 3;
    });

    // Actually we need to find by checking against all invite tokens
    // Better approach: look for the role token which has the token as identifier
    const roleRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: `invite-role:${token}`,
        expires: { gt: new Date() },
      },
    });

    if (!roleRecord) {
      return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 404 });
    }

    // Find the matching invite to get the org ID
    const allInvites = await prisma.verificationToken.findMany({
      where: {
        identifier: { startsWith: "invite:" },
        token,
        expires: { gt: new Date() },
      },
    });

    if (allInvites.length === 0) {
      return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 404 });
    }

    const invite = allInvites[0];
    const parts = invite.identifier.split(":");
    const orgId = parts[1];

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { name: true },
    });

    return NextResponse.json({
      companyName: org?.name || "Unknown",
      role: roleRecord.token,
      email: parts.slice(2).join(":"),
    });
  } catch (error) {
    console.error("[INVITE_VALIDATE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Accept invite and create account
const acceptSchema = z.object({
  token: z.string().min(1),
  name: z.string().min(1),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, name, password } = acceptSchema.parse(body);

    // Validate token
    const roleRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: `invite-role:${token}`,
        expires: { gt: new Date() },
      },
    });

    if (!roleRecord) {
      return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 400 });
    }

    const role = roleRecord.token;

    const allInvites = await prisma.verificationToken.findMany({
      where: {
        identifier: { startsWith: "invite:" },
        token,
        expires: { gt: new Date() },
      },
    });

    if (allInvites.length === 0) {
      return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 400 });
    }

    const invite = allInvites[0];
    const parts = invite.identifier.split(":");
    const orgId = parts[1];
    const email = parts.slice(2).join(":");

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    if (user) {
      // User exists, just add to org
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: user.name || name,
          organizationId: orgId,
          role: role as never,
          hashedPassword: user.hashedPassword || hashedPassword,
        },
      });
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          name,
          email,
          hashedPassword,
          organizationId: orgId,
          role: role as never,
          emailVerified: new Date(), // Verified via invite
        },
      });
    }

    // Clean up tokens
    await prisma.verificationToken.deleteMany({
      where: { identifier: invite.identifier },
    });
    await prisma.verificationToken.deleteMany({
      where: { identifier: `invite-role:${token}` },
    });

    await logAudit({
      organizationId: orgId,
      userId: user.id,
      action: "team_invite_accepted",
      entityType: "User",
      entityId: user.id,
      metadata: { email, role },
    });

    return NextResponse.json({ message: "Account created successfully" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    console.error("[INVITE_ACCEPT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

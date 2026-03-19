import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteOrganizationFiles } from "@/lib/storage";
import bcrypt from "bcryptjs";
import { logger } from "@/lib/logger";

/**
 * GDPR Article 17: Right to Erasure
 * Complete deletion of all user data.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { password, confirmEmail } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organization: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify email confirmation
    if (confirmEmail !== user.email) {
      return NextResponse.json(
        { error: "Email confirmation does not match" },
        { status: 400 }
      );
    }

    // Verify password
    if (!user.hashedPassword) {
      return NextResponse.json(
        { error: "Account uses social login — contact support for deletion" },
        { status: 400 }
      );
    }
    const validPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const isOwner = user.role === "OWNER";
    const orgId = user.organizationId;

    // If owner, check for other members
    if (isOwner && orgId) {
      const memberCount = await prisma.user.count({
        where: {
          organizationId: orgId,
          id: { not: user.id },
        },
      });

      if (memberCount > 0) {
        return NextResponse.json({
          error: "Cannot delete account while organization has other members",
          message: "Please transfer ownership or remove all members first",
        }, { status: 400 });
      }
    }

    // Begin deletion transaction
    await prisma.$transaction(async (tx) => {
      // Delete user-level data
      await tx.notification.deleteMany({ where: { userId: user.id } });
      await tx.auditLog.deleteMany({ where: { userId: user.id } });
      await tx.session.deleteMany({ where: { userId: user.id } });
      await tx.account.deleteMany({ where: { userId: user.id } });

      // If owner, delete entire organization cascade
      if (isOwner && orgId) {
        // Delete org data in dependency order
        await tx.aIUsageLog.deleteMany({ where: { organizationId: orgId } });
        await tx.reportDataPoint.deleteMany({
          where: { report: { organizationId: orgId } },
        });
        await tx.reportExport.deleteMany({
          where: { report: { organizationId: orgId } },
        });
        await tx.report.deleteMany({ where: { organizationId: orgId } });
        await tx.emissionEntry.deleteMany({ where: { organizationId: orgId } });
        await tx.document.deleteMany({ where: { organizationId: orgId } });
        await tx.supplier.deleteMany({ where: { organizationId: orgId } });
        await tx.customEmissionFactor.deleteMany({ where: { organizationId: orgId } });
        await tx.orgFramework.deleteMany({ where: { organizationId: orgId } });
        await tx.reportingPeriod.deleteMany({ where: { organizationId: orgId } });
        await tx.notification.deleteMany({ where: { organizationId: orgId } });
        await tx.auditLog.deleteMany({ where: { organizationId: orgId } });
      }

      // Delete user
      await tx.user.delete({ where: { id: user.id } });

      // Delete organization if owner
      if (isOwner && orgId) {
        await tx.organization.delete({ where: { id: orgId } });
      }
    });

    // Delete files from S3 (async, don't block response)
    if (isOwner && orgId) {
      deleteOrganizationFiles(orgId).catch((error) => {
        logger.error("S3 deletion failed during GDPR delete", { error: String(error), orgId });
      });
    }

    // Cancel Stripe subscription if exists
    if (isOwner && user.organization?.stripeSubscriptionId) {
      try {
        const { stripe } = await import("@/lib/stripe");
        await stripe.subscriptions.cancel(user.organization.stripeSubscriptionId);
      } catch (error) {
        logger.error("Stripe cancellation failed during GDPR delete", {
          error: String(error),
        });
      }
    }

    logger.info("GDPR account deletion completed", {
      userId: user.id,
      email: user.email,
      isOwner,
      organizationId: orgId,
    });

    return NextResponse.json({
      success: true,
      message: "Account and all associated data deleted successfully",
    });
  } catch (error) {
    logger.error("GDPR deletion failed", { error: String(error) });
    return NextResponse.json(
      { error: "Deletion failed. Please contact support@greenledger.com for assistance." },
      { status: 500 }
    );
  }
}

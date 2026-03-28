import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import TrialExpiringEmail from "@/emails/trial-expiring";
import { logger } from "@/lib/logger";

/**
 * Cron job: Send trial expiring reminder emails.
 * Should be scheduled to run daily.
 *
 * Notifies organization owners when their trial has 2 days, 1 day, or 0 days remaining.
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    // Find organizations on FREE_TRIAL where trialEndsAt is within the next 3 days
    const expiringOrgs = await prisma.organization.findMany({
      where: {
        plan: "FREE_TRIAL",
        trialEndsAt: {
          gte: now,
          lte: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // next 3 days
        },
      },
      include: {
        users: {
          where: { role: { in: ["OWNER", "ADMIN"] } },
          select: { name: true, email: true },
        },
      },
    });

    let emailsSent = 0;

    for (const org of expiringOrgs) {
      const daysRemaining = Math.max(
        0,
        Math.ceil((org.trialEndsAt!.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))
      );

      for (const user of org.users) {
        try {
          await sendEmail({
            to: user.email,
            subject: daysRemaining <= 1
              ? `Your GreenLedger trial ends today`
              : `Your GreenLedger trial ends in ${daysRemaining} days`,
            react: TrialExpiringEmail({
              userName: user.name ?? user.email,
              organizationName: org.name,
              daysRemaining,
              trialEndsAt: org.trialEndsAt!.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
            }),
          });
          emailsSent++;
        } catch (err) {
          logger.error("Failed to send trial expiring email", {
            email: user.email,
            orgId: org.id,
            error: String(err),
          });
        }
      }
    }

    logger.info("Trial expiring cron completed", {
      orgsFound: expiringOrgs.length,
      emailsSent,
    });

    return NextResponse.json({
      success: true,
      orgsFound: expiringOrgs.length,
      emailsSent,
    });
  } catch (error) {
    logger.error("Trial expiring cron failed", { error: String(error) });
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}

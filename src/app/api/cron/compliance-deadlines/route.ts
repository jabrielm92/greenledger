import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import ComplianceAlertEmail from "@/emails/compliance-alert";
import { logger } from "@/lib/logger";

/**
 * Cron job: Send compliance deadline reminder emails.
 * Should be scheduled to run daily.
 *
 * Sends alerts at 30, 14, and 7 days before OrgFramework due dates.
 */
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const alertThresholds = [30, 14, 7]; // days before deadline

    // Find org frameworks with due dates approaching any threshold
    const upcomingDeadlines = await prisma.orgFramework.findMany({
      where: {
        dueDate: { not: null },
        status: { notIn: ["COMPLETED", "SUBMITTED"] },
      },
      include: {
        framework: { select: { displayName: true } },
        organization: {
          include: {
            users: {
              where: { role: { in: ["OWNER", "ADMIN"] } },
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    let emailsSent = 0;

    for (const orgFw of upcomingDeadlines) {
      if (!orgFw.dueDate) continue;

      const daysRemaining = Math.ceil(
        (orgFw.dueDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
      );

      // Only send for matching thresholds (exact day match to avoid spam)
      if (!alertThresholds.includes(daysRemaining)) continue;

      const completionPercentage = Math.round(orgFw.completionPct);
      const missingDataPoints = orgFw.totalDataPoints - orgFw.coveredDataPoints;

      for (const user of orgFw.organization.users) {
        try {
          await sendEmail({
            to: user.email,
            subject: `${daysRemaining} days until your ${orgFw.framework.displayName} deadline`,
            react: ComplianceAlertEmail({
              userName: user.name ?? user.email,
              frameworkType: orgFw.framework.displayName,
              deadlineDate: orgFw.dueDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
              daysRemaining,
              completionPercentage,
              missingDataPoints,
            }),
          });
          emailsSent++;
        } catch (err) {
          logger.error("Failed to send compliance deadline email", {
            email: user.email,
            orgFrameworkId: orgFw.id,
            error: String(err),
          });
        }
      }
    }

    logger.info("Compliance deadlines cron completed", {
      frameworksChecked: upcomingDeadlines.length,
      emailsSent,
    });

    return NextResponse.json({
      success: true,
      frameworksChecked: upcomingDeadlines.length,
      emailsSent,
    });
  } catch (error) {
    logger.error("Compliance deadlines cron failed", { error: String(error) });
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}

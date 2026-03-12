import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import ComplianceAlertEmail from "@/emails/compliance-alert";
import React from "react";

/**
 * POST /api/compliance-alerts/send
 * Sends compliance deadline alert emails for all orgs with upcoming deadlines.
 * Intended to be called by a cron job or manually by admins.
 * Accepts an optional `secret` query param for unauthenticated cron access.
 */
export async function POST(req: NextRequest) {
  try {
    // Simple secret-based auth for cron jobs
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && secret !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const thirtyDaysFromNow = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    // Find all org frameworks with deadlines in the next 30 days
    const upcomingDeadlines = await prisma.orgFramework.findMany({
      where: {
        dueDate: {
          gte: now,
          lte: thirtyDaysFromNow,
        },
        status: { notIn: ["COMPLETED", "SUBMITTED"] },
      },
      include: {
        framework: { select: { displayName: true, name: true } },
        organization: {
          select: {
            id: true,
            name: true,
            users: {
              where: { role: { in: ["OWNER", "ADMIN"] } },
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    let emailsSent = 0;
    const errors: string[] = [];

    for (const deadline of upcomingDeadlines) {
      const dueDate = deadline.dueDate!;
      const daysRemaining = Math.ceil(
        (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Only send alerts at specific intervals: 30, 14, 7, 3, 1 days
      const alertDays = [30, 14, 7, 3, 1];
      if (!alertDays.includes(daysRemaining)) continue;

      // Count missing data points (framework sections without reports)
      const totalSections = await prisma.frameworkSection.count({
        where: { frameworkId: deadline.frameworkId },
      });
      const missingDataPoints = Math.round(
        totalSections * (1 - deadline.completionPct / 100)
      );

      for (const user of deadline.organization.users) {
        try {
          await sendEmail({
            to: user.email,
            subject: `${daysRemaining <= 7 ? "Urgent: " : ""}${deadline.framework.displayName} deadline in ${daysRemaining} day${daysRemaining === 1 ? "" : "s"}`,
            react: React.createElement(ComplianceAlertEmail, {
              userName: user.name || "there",
              frameworkType: deadline.framework.displayName,
              deadlineDate: dueDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              daysRemaining,
              completionPercentage: Math.round(deadline.completionPct),
              missingDataPoints,
            }),
          });
          emailsSent++;
        } catch (err) {
          errors.push(
            `Failed to send to ${user.email}: ${err instanceof Error ? err.message : "Unknown"}`
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      deadlinesChecked: upcomingDeadlines.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("[COMPLIANCE_ALERTS_SEND]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

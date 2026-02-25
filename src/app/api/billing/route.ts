import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { stripe, getUsageSummary } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const org = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      select: {
        plan: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripeCurrentPeriodEnd: true,
      },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Get usage data
    const usage = await getUsageSummary(session.user.organizationId);

    // Get invoices from Stripe if customer exists
    let invoices: Array<{
      id: string;
      date: string;
      amount: number;
      currency: string;
      status: string;
      pdfUrl?: string;
    }> = [];

    if (org.stripeCustomerId) {
      try {
        const stripeInvoices = await stripe.invoices.list({
          customer: org.stripeCustomerId,
          limit: 12,
        });

        invoices = stripeInvoices.data.map((inv) => ({
          id: inv.id,
          date: new Date(inv.created * 1000).toISOString(),
          amount: (inv.amount_paid ?? inv.total) / 100,
          currency: inv.currency,
          status: inv.status ?? "unknown",
          pdfUrl: inv.invoice_pdf ?? undefined,
        }));
      } catch (err) {
        console.error("[BILLING] Failed to fetch invoices:", err);
      }
    }

    return NextResponse.json({
      plan: org.plan,
      periodEnd: org.stripeCurrentPeriodEnd,
      usage,
      invoices,
    });
  } catch (error) {
    console.error("[BILLING]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

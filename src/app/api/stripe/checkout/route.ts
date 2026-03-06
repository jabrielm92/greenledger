import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { stripe, getStripePriceId, type PaidPlanTier } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const checkoutSchema = z.object({
  plan: z.enum(["BASE", "PROFESSIONAL", "ENTERPRISE"]),
  returnTo: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { plan, returnTo } = checkoutSchema.parse(body);

    // Auto-provision product/price in Stripe if it doesn't exist yet
    const stripePriceId = await getStripePriceId(plan as PaidPlanTier);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = returnTo === "onboarding"
      ? `${appUrl}/onboarding/plan?upgraded=true`
      : `${appUrl}/dashboard/settings/billing?success=true`;
    const cancelUrl = returnTo === "onboarding"
      ? `${appUrl}/onboarding/plan`
      : `${appUrl}/dashboard/settings/billing`;

    // Check if org already has a Stripe customer
    const org = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      select: { stripeCustomerId: true },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: org?.stripeCustomerId ? undefined : session.user.email,
      customer: org?.stripeCustomerId || undefined,
      metadata: {
        organizationId: session.user.organizationId,
        plan,
      },
      subscription_data: {
        metadata: {
          organizationId: session.user.organizationId,
          plan,
        },
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("[STRIPE_CHECKOUT]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

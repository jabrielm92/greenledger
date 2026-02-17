import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { exchangeCodeForTokens } from "@/lib/quickbooks/oauth";
import { logAudit } from "@/lib/audit/logger";
import { getServerSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const realmId = searchParams.get("realmId");
    const error = searchParams.get("error");

    // Handle user denial
    if (error) {
      return NextResponse.redirect(
        new URL("/dashboard/settings/integrations?error=denied", req.url)
      );
    }

    if (!code || !state || !realmId) {
      return NextResponse.redirect(
        new URL("/dashboard/settings/integrations?error=missing_params", req.url)
      );
    }

    // Validate state parameter
    const cookieStore = await cookies();
    const storedState = cookieStore.get("qb_oauth_state")?.value;
    const organizationId = cookieStore.get("qb_oauth_org")?.value;

    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        new URL("/dashboard/settings/integrations?error=invalid_state", req.url)
      );
    }

    if (!organizationId) {
      return NextResponse.redirect(
        new URL("/dashboard/settings/integrations?error=no_org", req.url)
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Store tokens in organization record
    await prisma.organization.update({
      where: { id: organizationId },
      data: {
        quickbooksRealmId: realmId,
        quickbooksAccessToken: tokens.accessToken,
        quickbooksRefreshToken: tokens.refreshToken,
        quickbooksTokenExpiry: new Date(
          Date.now() + tokens.expiresIn * 1000
        ),
      },
    });

    // Clean up cookies
    cookieStore.delete("qb_oauth_state");
    cookieStore.delete("qb_oauth_org");

    // Audit log
    const session = await getServerSession();
    if (session?.user?.id) {
      await logAudit({
        organizationId,
        userId: session.user.id,
        action: "entity_created",
        entityType: "QuickBooksConnection",
        entityId: realmId,
        newValue: { realmId, connectedAt: new Date().toISOString() },
      });
    }

    return NextResponse.redirect(
      new URL(
        "/dashboard/settings/integrations?success=quickbooks_connected",
        req.url
      )
    );
  } catch (error) {
    console.error("[QB_CALLBACK]", error);
    return NextResponse.redirect(
      new URL("/dashboard/settings/integrations?error=token_exchange", req.url)
    );
  }
}

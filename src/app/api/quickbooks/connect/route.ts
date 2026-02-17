import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { buildAuthorizationUrl, generateState } from "@/lib/quickbooks/oauth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.organizationId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const state = generateState();

    // Store state in a secure cookie for CSRF validation
    const cookieStore = await cookies();
    cookieStore.set("qb_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600, // 10 minutes
      path: "/",
    });

    // Also store the org ID so callback knows which org to update
    cookieStore.set("qb_oauth_org", session.user.organizationId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });

    const authUrl = buildAuthorizationUrl(state);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("[QB_CONNECT]", error);
    return NextResponse.json(
      { error: "Failed to initiate QuickBooks connection" },
      { status: 500 }
    );
  }
}

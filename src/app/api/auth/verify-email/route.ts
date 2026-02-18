import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import VerifyEmail from "@/emails/verify-email";
import { z } from "zod";

const postSchema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = postSchema.parse(body);

    // Always return success to prevent email enumeration
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user && !user.emailVerified) {
      // Delete any existing verification tokens for this user
      await prisma.verificationToken.deleteMany({
        where: { identifier: `verify:${email.toLowerCase()}` },
      });

      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await prisma.verificationToken.create({
        data: {
          identifier: `verify:${email.toLowerCase()}`,
          token,
          expires,
        },
      });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const verifyUrl = `${appUrl}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email.toLowerCase())}`;

      await sendEmail({
        to: email.toLowerCase(),
        subject: "Verify your GreenLedger email",
        react: VerifyEmail({ userName: user.name || "there", verifyUrl }),
      });
    }

    return NextResponse.json({ message: "If an account exists, a verification link has been sent." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    console.error("[VERIFY_EMAIL_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return NextResponse.redirect(`${appUrl}/verify-email?error=missing-params`);
    }

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: `verify:${email.toLowerCase()}`,
        token,
        expires: { gt: new Date() },
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!verificationToken) {
      return NextResponse.redirect(`${appUrl}/verify-email?error=invalid-token`);
    }

    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { emailVerified: new Date() },
    });

    // Clean up used token
    await prisma.verificationToken.deleteMany({
      where: { identifier: `verify:${email.toLowerCase()}` },
    });

    return NextResponse.redirect(`${appUrl}/verify-email?verified=true`);
  } catch (error) {
    console.error("[VERIFY_EMAIL_GET]", error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/verify-email?error=server-error`);
  }
}

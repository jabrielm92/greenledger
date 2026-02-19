import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";
import PasswordResetEmail from "@/emails/password-reset";
import { checkRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    const rl = checkRateLimit(`forgot:${email.toLowerCase()}`, { limit: 3, windowSeconds: 60 });
    if (rl.limited) {
      return NextResponse.json(rl.response, { status: 429, headers: rl.headers });
    }

    // Always return success to prevent email enumeration
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user) {
      // Delete any existing tokens for this user
      await prisma.verificationToken.deleteMany({
        where: { identifier: `reset:${email.toLowerCase()}` },
      });

      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.verificationToken.create({
        data: {
          identifier: `reset:${email.toLowerCase()}`,
          token,
          expires,
        },
      });

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const resetUrl = `${appUrl}/reset-password?token=${token}&email=${encodeURIComponent(email.toLowerCase())}`;

      await sendEmail({
        to: email.toLowerCase(),
        subject: "Reset your GreenLedger password",
        react: PasswordResetEmail({ userName: user.name || "there", resetUrl }),
      });
    }

    return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    console.error("[FORGOT_PASSWORD]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

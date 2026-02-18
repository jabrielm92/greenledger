import { Resend } from "resend";
import React from "react";

let _resend: Resend | null = null;

function getResend() {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "GreenLedger <noreply@greenledger.app>";

/**
 * Send a transactional email using Resend with a React Email template.
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  return getResend().emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: params.subject,
    react: params.react,
  });
}

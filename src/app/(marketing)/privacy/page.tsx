import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-brand-secondary mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-12">
            Last updated: February 18, 2026
          </p>

          <p className="text-muted-foreground leading-relaxed mb-10">
            GreenLedger Inc. (&quot;we,&quot; &quot;us,&quot; or
            &quot;our&quot;) is committed to protecting your privacy. This
            Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our ESG compliance platform
            (&quot;the Service&quot;).
          </p>

          {/* 1. Information We Collect */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              1. Information We Collect
            </h2>

            <h3 className="text-base font-medium text-foreground mt-4 mb-2">
              Account Data
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              When you create an account, we collect your name, email address,
              password (stored in hashed form), organization name, and billing
              information. If you sign in through a third-party provider, we may
              receive your name and email from that provider.
            </p>

            <h3 className="text-base font-medium text-foreground mt-4 mb-2">
              Usage Data
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We automatically collect information about how you interact with
              the Service, including pages visited, features used, timestamps,
              IP addresses, browser type, device information, and referring URLs.
            </p>

            <h3 className="text-base font-medium text-foreground mt-4 mb-2">
              Uploaded Documents &amp; ESG Data
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              You may upload invoices, utility bills, receipts, sustainability
              reports, and other documents to the Service for AI-powered data
              extraction and ESG reporting. This data may include financial
              information, energy consumption metrics, emissions data, and other
              business operational data.
            </p>
          </section>

          {/* 2. How We Use Information */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              2. How We Use Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                <span className="font-medium text-foreground">
                  Service Delivery:
                </span>{" "}
                To provide, maintain, and improve the Service, including document
                processing, emissions calculations, and report generation
              </li>
              <li>
                <span className="font-medium text-foreground">
                  AI Processing:
                </span>{" "}
                To extract and classify data from your uploaded documents using
                our AI-powered engine. Document content is sent to our AI
                processing partner (Anthropic) for extraction and is not
                retained by them beyond the processing session
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Analytics:
                </span>{" "}
                To understand how users interact with the Service, identify
                trends, and improve user experience
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Communications:
                </span>{" "}
                To send you transactional emails (password resets, billing
                receipts), service updates, and, with your consent, marketing
                communications
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Security &amp; Fraud Prevention:
                </span>{" "}
                To detect, prevent, and address technical issues, security
                threats, and fraudulent activity
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Legal Compliance:
                </span>{" "}
                To comply with applicable laws, regulations, and legal processes
              </li>
            </ul>
          </section>

          {/* 3. Data Storage & Security */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              3. Data Storage &amp; Security
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We implement industry-standard security measures to protect your
              data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                All data is encrypted in transit (TLS 1.2+) and at rest (AES-256)
              </li>
              <li>
                Multi-tenant data isolation ensures that your
                organization&apos;s data is logically separated from other
                customers&apos; data
              </li>
              <li>
                Passwords are hashed using bcrypt with a high work factor
              </li>
              <li>
                Role-based access control limits data access within your
                organization
              </li>
              <li>
                Complete audit trails record all data access and modifications
              </li>
              <li>
                Regular security assessments and vulnerability testing
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              While we strive to use commercially acceptable means to protect
              your data, no method of transmission or storage is 100% secure.
              We cannot guarantee absolute security.
            </p>
          </section>

          {/* 4. Third-Party Services */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              4. Third-Party Services
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use the following third-party services to operate the platform:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                <span className="font-medium text-foreground">
                  Stripe:
                </span>{" "}
                For payment processing. Stripe processes your payment
                information directly and is PCI-DSS compliant. We do not store
                your full credit card details on our servers
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Anthropic AI:
                </span>{" "}
                For AI-powered document extraction and data classification.
                Document content is processed via Anthropic&apos;s API and is
                not used to train their models
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Resend:
                </span>{" "}
                For transactional email delivery (password resets, billing
                notifications, report delivery)
              </li>
              <li>
                <span className="font-medium text-foreground">
                  QuickBooks (Intuit):
                </span>{" "}
                For optional accounting data integration. Connection is
                authorized via OAuth and can be revoked at any time from your
                account settings
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Each third-party service operates under its own privacy policy. We
              encourage you to review their policies. We only share the minimum
              data necessary for each service to function.
            </p>
          </section>

          {/* 5. Data Retention */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              5. Data Retention
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We retain your data for as long as your account is active or as
              needed to provide the Service. Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                <span className="font-medium text-foreground">
                  Account data:
                </span>{" "}
                Retained while your account is active and for up to 30 days
                after deletion request
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Uploaded documents:
                </span>{" "}
                Retained while your account is active. Deleted within 30 days
                of account termination
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Audit logs:
                </span>{" "}
                Retained for a minimum of 7 years to support regulatory
                compliance requirements
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Usage data:
                </span>{" "}
                Retained in anonymized form for analytics purposes
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Billing records:
                </span>{" "}
                Retained as required by tax and financial regulations
              </li>
            </ul>
          </section>

          {/* 6. Your Rights */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              6. Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Depending on your location, you may have the following rights
              regarding your personal data under applicable data protection
              laws, including the GDPR and CCPA:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                <span className="font-medium text-foreground">
                  Right of Access:
                </span>{" "}
                You can request a copy of the personal data we hold about you
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Right to Rectification:
                </span>{" "}
                You can request that we correct inaccurate or incomplete
                personal data
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Right to Erasure:
                </span>{" "}
                You can request that we delete your personal data, subject to
                legal retention requirements
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Right to Data Portability:
                </span>{" "}
                You can request your data in a structured, commonly used,
                machine-readable format
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Right to Data Export:
                </span>{" "}
                You can export your ESG data, reports, and uploaded documents at
                any time through the Service dashboard
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Right to Restrict Processing:
                </span>{" "}
                You can request that we limit how we process your data
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Right to Object:
                </span>{" "}
                You can object to our processing of your personal data in
                certain circumstances
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              To exercise any of these rights, please contact us at{" "}
              <span className="text-brand-primary font-medium">
                privacy@greenledger.io
              </span>
              . We will respond to your request within 30 days.
            </p>
          </section>

          {/* 7. Cookies */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              7. Cookies
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use cookies and similar tracking technologies to operate and
              improve the Service:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                <span className="font-medium text-foreground">
                  Essential Cookies:
                </span>{" "}
                Required for authentication, session management, and security.
                These cannot be disabled
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Analytics Cookies:
                </span>{" "}
                Help us understand how users interact with the Service. These
                can be disabled through your browser settings
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We do not use advertising cookies or sell your data to
              advertisers. You can control cookie preferences through your
              browser settings.
            </p>
          </section>

          {/* 8. Children's Privacy */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              8. Children&apos;s Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service is not directed to individuals under the age of 16. We
              do not knowingly collect personal information from children under
              16. If we learn that we have collected personal data from a child
              under 16, we will take steps to delete that information promptly.
              If you believe a child under 16 has provided us with personal
              data, please contact us at{" "}
              <span className="text-brand-primary font-medium">
                privacy@greenledger.io
              </span>
              .
            </p>
          </section>

          {/* 9. Changes to Policy */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              9. Changes to This Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new Privacy
              Policy on this page and updating the &quot;Last updated&quot; date
              at the top.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              For significant changes, we will provide additional notice via
              email or through a prominent notice within the Service at least 30
              days before the changes take effect. Your continued use of the
              Service after the effective date constitutes acceptance of the
              updated Privacy Policy.
            </p>
          </section>

          {/* 10. Contact Information */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              10. Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Email:</span>{" "}
                privacy@greenledger.io
              </li>
              <li>
                <span className="font-medium text-foreground">Website:</span>{" "}
                <Link
                  href="/contact"
                  className="text-brand-primary hover:underline"
                >
                  greenledger.io/contact
                </Link>
              </li>
              <li>
                <span className="font-medium text-foreground">Address:</span>{" "}
                GreenLedger Inc., 123 Sustainability Ave, San Francisco, CA
                94105
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Data Protection Officer:
                </span>{" "}
                dpo@greenledger.io
              </li>
            </ul>
          </section>

          {/* Cross-reference */}
          <section className="rounded-lg border bg-slate-50 p-6">
            <p className="text-sm text-muted-foreground">
              Please also review our{" "}
              <Link
                href="/terms"
                className="text-brand-primary hover:underline font-medium"
              >
                Terms of Service
              </Link>{" "}
              which governs your use of the GreenLedger platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

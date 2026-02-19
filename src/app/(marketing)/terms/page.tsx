import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsOfServicePage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold text-brand-secondary mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground mb-12">
            Last updated: February 18, 2026
          </p>

          {/* 1. Acceptance of Terms */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              By accessing or using GreenLedger (&quot;the Service&quot;),
              operated by GreenLedger Inc. (&quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;), you agree to be bound by these Terms of Service
              (&quot;Terms&quot;). If you do not agree to these Terms, you may
              not access or use the Service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              These Terms apply to all visitors, users, and others who access or
              use the Service. By using the Service on behalf of an
              organization, you represent and warrant that you have the
              authority to bind that organization to these Terms.
            </p>
          </section>

          {/* 2. Description of Service */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              2. Description of Service
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              GreenLedger is an ESG (Environmental, Social, and Governance)
              compliance platform designed for small and mid-size businesses.
              The Service provides:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                AI-powered document extraction and classification for
                sustainability data
              </li>
              <li>
                Greenhouse gas emissions calculation and tracking (Scope 1, 2,
                and 3)
              </li>
              <li>
                Multi-framework ESG report generation (CSRD, GRI, SASB, ISSB)
              </li>
              <li>
                QuickBooks integration for automated financial and operational
                data import
              </li>
              <li>
                Multi-tenant organization management with role-based access
                control
              </li>
              <li>Audit trail and document provenance tracking</li>
            </ul>
          </section>

          {/* 3. User Accounts & Responsibilities */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              3. User Accounts &amp; Responsibilities
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              To use the Service, you must create an account and provide
              accurate, complete, and current information. You are responsible
              for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                Maintaining the confidentiality of your account credentials
              </li>
              <li>All activities that occur under your account</li>
              <li>
                Ensuring that all users within your organization comply with
                these Terms
              </li>
              <li>
                Providing accurate and truthful data for ESG reporting purposes
              </li>
              <li>
                Notifying us immediately of any unauthorized use of your account
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We reserve the right to suspend or terminate accounts that violate
              these Terms or engage in fraudulent or harmful activity.
            </p>
          </section>

          {/* 4. Billing & Payment */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              4. Billing &amp; Payment
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              GreenLedger offers subscription-based pricing plans. Payment
              processing is handled securely by Stripe, Inc. By subscribing to a
              paid plan, you agree to the following:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                Subscription fees are billed in advance on a monthly or annual
                basis, depending on the plan selected
              </li>
              <li>
                All fees are non-refundable except as required by applicable law
                or as expressly stated in these Terms
              </li>
              <li>
                We may change pricing with at least 30 days&apos; written notice
                before the next billing cycle
              </li>
              <li>
                Failure to pay may result in suspension or termination of your
                access to the Service
              </li>
              <li>
                You are responsible for any applicable taxes associated with your
                subscription
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Free-tier accounts are subject to usage limits as described on our
              pricing page. We reserve the right to modify free-tier limits at
              any time.
            </p>
          </section>

          {/* 5. Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              5. Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              The Service, including its original content, features,
              functionality, and underlying technology, is and remains the
              exclusive property of GreenLedger Inc. and its licensors. The
              Service is protected by copyright, trademark, and other laws of
              both the United States and foreign countries.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You retain all rights to the data and documents you upload to the
              Service. By uploading content, you grant us a limited,
              non-exclusive license to process, analyze, and store your data
              solely for the purpose of providing the Service to you. We do not
              claim ownership of your data and will not use it for purposes
              other than delivering the Service.
            </p>
          </section>

          {/* 6. Data Privacy */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              6. Data Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Your privacy is important to us. Our collection and use of
              personal information in connection with the Service is described in
              our{" "}
              <Link
                href="/privacy"
                className="text-brand-primary hover:underline font-medium"
              >
                Privacy Policy
              </Link>
              , which is incorporated into these Terms by reference.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By using the Service, you consent to the collection and use of
              information as described in our Privacy Policy. We implement
              industry-standard security measures to protect your data,
              including encryption at rest and in transit, and multi-tenant data
              isolation.
            </p>
          </section>

          {/* 7. Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              7. Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
              SHALL GREENLEDGER INC., ITS DIRECTORS, EMPLOYEES, PARTNERS,
              AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING
              WITHOUT LIMITATION LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER
              INTANGIBLE LOSSES, RESULTING FROM:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                Your access to or use of (or inability to access or use) the
                Service
              </li>
              <li>
                Any conduct or content of any third party on the Service
              </li>
              <li>Any content obtained from the Service</li>
              <li>
                Unauthorized access, use, or alteration of your transmissions or
                content
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Our total liability for any claims under these Terms shall not
              exceed the amount you paid us in the twelve (12) months preceding
              the claim. The Service is provided on an &quot;AS IS&quot; and
              &quot;AS AVAILABLE&quot; basis without warranties of any kind.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              GreenLedger provides tools to assist with ESG compliance reporting.
              The Service does not constitute legal, financial, or regulatory
              advice. You are solely responsible for ensuring the accuracy and
              completeness of your compliance filings.
            </p>
          </section>

          {/* 8. Termination */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              8. Termination
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You may terminate your account at any time by contacting us or
              using the account settings in the Service. We may terminate or
              suspend your account immediately, without prior notice or
              liability, for any reason, including without limitation if you
              breach these Terms.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Upon termination:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
              <li>
                Your right to use the Service will cease immediately
              </li>
              <li>
                You may request an export of your data within 30 days of
                termination
              </li>
              <li>
                We may delete your data after the 30-day data export period,
                unless retention is required by law
              </li>
              <li>
                Any outstanding fees remain payable
              </li>
            </ul>
          </section>

          {/* 9. Changes to Terms */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              9. Changes to Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We reserve the right to modify or replace these Terms at any time.
              If a revision is material, we will provide at least 30 days&apos;
              notice prior to any new terms taking effect, via email
              notification or a prominent notice within the Service.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Your continued use of the Service after the effective date of the
              revised Terms constitutes acceptance of the new Terms. If you do
              not agree to the new Terms, you must stop using the Service.
            </p>
          </section>

          {/* 10. Contact Information */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-brand-secondary mb-3">
              10. Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              If you have any questions about these Terms, please contact us:
            </p>
            <ul className="space-y-1 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">Email:</span>{" "}
                legal@greenledger.io
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
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "CSRD Compliance Guide for Small Businesses (2026)",
  description:
    "Complete CSRD compliance guide for SMBs. Learn requirements, deadlines, penalties, and how to automate reporting. Updated for 2026 regulations.",
  openGraph: {
    title: "CSRD Compliance Guide for Small Businesses (2026)",
    description:
      "Complete CSRD compliance guide for SMBs. Learn requirements, deadlines, penalties, and how to automate reporting.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "CSRD Compliance Guide for Small Businesses (2026)",
    description:
      "Complete CSRD compliance guide for SMBs. Learn requirements, deadlines, and how to automate reporting.",
  },
  alternates: {
    canonical:
      "https://greenledger.arisolutionsinc.com/blog/csrd-compliance-guide-small-business",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "CSRD Compliance Guide for Small Businesses (2026)",
  author: { "@type": "Organization", name: "GreenLedger" },
  publisher: {
    "@type": "Organization",
    name: "GreenLedger",
    logo: {
      "@type": "ImageObject",
      url: "https://greenledger.arisolutionsinc.com/logo.png",
    },
  },
  datePublished: "2026-03-11",
  dateModified: "2026-03-11",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is CSRD?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Corporate Sustainability Reporting Directive (CSRD) is an EU regulation that requires companies to report on their environmental and social impact using the European Sustainability Reporting Standards (ESRS).",
      },
    },
    {
      "@type": "Question",
      name: "Does CSRD apply to small businesses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CSRD applies to SMBs that meet two of these three criteria: more than 250 employees, €50M+ turnover, or €25M+ total assets. It also affects smaller companies in the value chain of larger reporting entities.",
      },
    },
    {
      "@type": "Question",
      name: "What are the penalties for CSRD non-compliance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Penalties vary by EU member state but can include fines up to €10 million or 5% of annual turnover, personal liability for directors, and exclusion from public procurement processes.",
      },
    },
    {
      "@type": "Question",
      name: "When are CSRD reports due?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For the first wave of reporting companies, FY2024 sustainability reports must be published by April 30, 2026, within the annual management report.",
      },
    },
  ],
};

export default function CSRDComplianceGuide() {
  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article className="py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Breadcrumb */}
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-brand-primary transition mb-8"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="inline-block text-xs font-semibold text-brand-primary bg-emerald-50 px-3 py-1 rounded-full mb-4">
              Compliance Guide
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-secondary mb-6 leading-tight">
              CSRD Compliance Guide for Small Businesses: Everything You Need to
              Know (2026 Edition)
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                March 11, 2026
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                12 min read
              </span>
            </div>
          </header>

          {/* CTA - Top */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-10">
            <p className="font-semibold text-brand-secondary mb-2">
              Not sure if CSRD applies to your business?
            </p>
            <p className="text-muted-foreground text-sm mb-3">
              Use our free ROI calculator to estimate your compliance costs and
              potential savings.
            </p>
            <Link
              href="/roi-calculator"
              className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-primary/80 transition"
            >
              Calculate your compliance costs
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {/* Table of Contents */}
          <nav className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10">
            <h2 className="font-bold text-brand-secondary mb-4">
              Table of Contents
            </h2>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>
                <a
                  href="#what-is-csrd"
                  className="text-brand-primary hover:underline"
                >
                  What is CSRD?
                </a>
              </li>
              <li>
                <a
                  href="#does-csrd-apply"
                  className="text-brand-primary hover:underline"
                >
                  Does CSRD Apply to Your Business?
                </a>
              </li>
              <li>
                <a
                  href="#reporting-requirements"
                  className="text-brand-primary hover:underline"
                >
                  CSRD Reporting Requirements Explained
                </a>
              </li>
              <li>
                <a
                  href="#compliance-process"
                  className="text-brand-primary hover:underline"
                >
                  Step-by-Step Compliance Process
                </a>
              </li>
              <li>
                <a
                  href="#common-mistakes"
                  className="text-brand-primary hover:underline"
                >
                  Common Mistakes to Avoid
                </a>
              </li>
              <li>
                <a
                  href="#automation"
                  className="text-brand-primary hover:underline"
                >
                  How to Automate CSRD Reporting
                </a>
              </li>
              <li>
                <a
                  href="#penalties"
                  className="text-brand-primary hover:underline"
                >
                  CSRD Penalties &amp; Fines
                </a>
              </li>
              <li>
                <a href="#faq" className="text-brand-primary hover:underline">
                  Frequently Asked Questions
                </a>
              </li>
            </ol>
          </nav>

          {/* Article Content */}
          <div className="prose prose-slate prose-lg max-w-none prose-headings:text-brand-secondary prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline">
            <section id="what-is-csrd">
              <h2>1. What is CSRD?</h2>
              <p>
                The <strong>Corporate Sustainability Reporting Directive (CSRD)</strong> is a landmark EU regulation
                that requires companies to disclose detailed information about their environmental and social
                impact. It replaces the older Non-Financial Reporting Directive (NFRD) and dramatically
                expands which companies must report.
              </p>
              <p>
                Under CSRD, companies must follow the <strong>European Sustainability Reporting Standards
                (ESRS)</strong>, a comprehensive set of standards developed by EFRAG covering everything from
                climate change mitigation to workforce conditions and governance practices.
              </p>
              <p>
                For small and medium businesses, this represents a significant shift. What was once optional
                corporate social responsibility is now a legal requirement with real consequences for
                non-compliance.
              </p>
            </section>

            <section id="does-csrd-apply">
              <h2>2. Does CSRD Apply to Your Business?</h2>
              <p>
                CSRD applies in phases. The first wave (FY2024 reports, due April 30, 2026) covers large public
                companies already subject to NFRD. But subsequent waves rapidly expand coverage:
              </p>
              <ul>
                <li>
                  <strong>Wave 1 (FY2024):</strong> Large public-interest entities already reporting under NFRD
                  (&gt;500 employees)
                </li>
                <li>
                  <strong>Wave 2 (FY2025):</strong> Other large companies meeting 2 of 3 criteria: 250+ employees,
                  €50M+ turnover, €25M+ total assets
                </li>
                <li>
                  <strong>Wave 3 (FY2026):</strong> Listed SMEs and small/non-complex credit institutions
                </li>
              </ul>
              <p>
                Even if your company doesn&apos;t directly fall under CSRD, you may be affected if you&apos;re in the
                <strong> value chain</strong> of a reporting company. Large companies must report on their entire
                supply chain, which means they&apos;ll request ESG data from their suppliers — including SMBs.
              </p>
            </section>

            <section id="reporting-requirements">
              <h2>3. CSRD Reporting Requirements Explained</h2>
              <p>
                CSRD requires reporting across three scopes of emissions and multiple ESRS topic standards:
              </p>
              <h3>Emissions Scopes</h3>
              <ul>
                <li>
                  <strong>Scope 1 — Direct Emissions:</strong> Emissions from sources your company owns or controls
                  (company vehicles, on-site fuel combustion, manufacturing processes)
                </li>
                <li>
                  <strong>Scope 2 — Indirect Energy Emissions:</strong> Emissions from purchased electricity, heating,
                  and cooling
                </li>
                <li>
                  <strong>Scope 3 — Value Chain Emissions:</strong> All other indirect emissions across 15 categories,
                  including business travel, employee commuting, purchased goods, and waste disposal
                </li>
              </ul>
              <h3>ESRS Standards</h3>
              <p>
                The ESRS framework includes cross-cutting standards (ESRS 1 &amp; 2) and topical standards
                covering:
              </p>
              <ul>
                <li><strong>Environmental:</strong> Climate change (E1), Pollution (E2), Water &amp; marine resources (E3),
                  Biodiversity (E4), Resource use &amp; circular economy (E5)</li>
                <li><strong>Social:</strong> Own workforce (S1), Workers in value chain (S2), Affected communities (S3),
                  Consumers &amp; end-users (S4)</li>
                <li><strong>Governance:</strong> Business conduct (G1)</li>
              </ul>
              <p>
                A <strong>double materiality assessment</strong> determines which standards are relevant to your
                business. Not every company needs to report on every standard.
              </p>
            </section>

            <section id="compliance-process">
              <h2>4. Step-by-Step Compliance Process</h2>
              <ol>
                <li>
                  <strong>Conduct a Double Materiality Assessment:</strong> Identify which ESG topics are material to
                  your business from both an impact and financial perspective
                </li>
                <li>
                  <strong>Identify Data Sources:</strong> Map out where your emissions data lives — utility bills,
                  fuel receipts, travel records, supplier invoices
                </li>
                <li>
                  <strong>Collect &amp; Organize Data:</strong> Gather documents for the reporting period. This is
                  typically the most time-consuming step for SMBs
                </li>
                <li>
                  <strong>Calculate Emissions:</strong> Apply appropriate emission factors to convert activity data
                  into CO2 equivalents
                </li>
                <li>
                  <strong>Generate ESRS-Compliant Report:</strong> Structure your findings according to the relevant
                  ESRS disclosure requirements
                </li>
                <li>
                  <strong>Third-Party Assurance:</strong> CSRD requires limited assurance (initially), moving to
                  reasonable assurance later. Engage an auditor
                </li>
                <li>
                  <strong>Publish:</strong> Include the sustainability report in your annual management report and
                  tag it in XHTML format for digital filing
                </li>
              </ol>
            </section>

            <section id="common-mistakes">
              <h2>5. Common Mistakes to Avoid</h2>
              <ul>
                <li>
                  <strong>Underestimating Scope 3:</strong> Value chain emissions often represent 70-90% of a
                  company&apos;s total footprint. Don&apos;t skip this
                </li>
                <li>
                  <strong>Using Wrong Emission Factors:</strong> Using outdated or region-inappropriate factors leads
                  to inaccurate reporting
                </li>
                <li>
                  <strong>Poor Documentation:</strong> Auditors will ask &quot;where did this number come from?&quot; — every
                  data point needs a traceable source
                </li>
                <li>
                  <strong>Waiting Too Long:</strong> Data collection alone can take 3-6 months if done manually.
                  Start now
                </li>
                <li>
                  <strong>Ignoring Double Materiality:</strong> Reporting everything creates noise. Focus on what&apos;s
                  truly material to your business
                </li>
              </ul>
            </section>

            {/* Mid-article CTA */}
            <div className="not-prose bg-gradient-to-r from-brand-primary to-emerald-600 text-white rounded-xl p-6 my-10">
              <h3 className="text-xl font-bold mb-2">
                See how much you could save on CSRD compliance
              </h3>
              <p className="text-sm opacity-90 mb-4">
                Our free ROI calculator shows your estimated costs vs. automated
                reporting with GreenLedger.
              </p>
              <Link
                href="/roi-calculator"
                className="inline-flex items-center bg-white text-brand-primary px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition"
              >
                Calculate My Savings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <section id="automation">
              <h2>6. How to Automate CSRD Reporting</h2>
              <p>
                Manual CSRD compliance typically costs $47,000+/year and takes 200+ hours. Here&apos;s how the main
                approaches compare:
              </p>

              <div className="not-prose overflow-x-auto my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="border border-slate-200 px-4 py-3 text-left font-semibold">Approach</th>
                      <th className="border border-slate-200 px-4 py-3 text-left font-semibold">Annual Cost</th>
                      <th className="border border-slate-200 px-4 py-3 text-left font-semibold">Setup Time</th>
                      <th className="border border-slate-200 px-4 py-3 text-left font-semibold">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-200 px-4 py-3">Manual (Spreadsheets)</td>
                      <td className="border border-slate-200 px-4 py-3">$15K-$82K</td>
                      <td className="border border-slate-200 px-4 py-3">N/A</td>
                      <td className="border border-slate-200 px-4 py-3">Very small companies</td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="border border-slate-200 px-4 py-3">External Consultant</td>
                      <td className="border border-slate-200 px-4 py-3">$25K-$125K</td>
                      <td className="border border-slate-200 px-4 py-3">2-4 weeks</td>
                      <td className="border border-slate-200 px-4 py-3">One-time reports</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 px-4 py-3">Enterprise Platform</td>
                      <td className="border border-slate-200 px-4 py-3">$30K-$150K</td>
                      <td className="border border-slate-200 px-4 py-3">3-6 months</td>
                      <td className="border border-slate-200 px-4 py-3">Fortune 500</td>
                    </tr>
                    <tr className="bg-emerald-50/50">
                      <td className="border border-slate-200 px-4 py-3 font-semibold text-brand-primary">GreenLedger</td>
                      <td className="border border-slate-200 px-4 py-3 font-semibold text-brand-primary">$2,988-$8,388</td>
                      <td className="border border-slate-200 px-4 py-3 font-semibold text-brand-primary">10 minutes</td>
                      <td className="border border-slate-200 px-4 py-3 font-semibold text-brand-primary">SMBs (1-500 employees)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p>
                Modern AI-powered tools like{" "}
                <Link href="/features" className="text-brand-primary hover:underline">
                  GreenLedger
                </Link>{" "}
                can automatically extract emissions data from utility bills, fuel receipts, and invoices,
                calculate emissions using verified emission factors, and generate audit-ready reports in
                minutes rather than weeks.
              </p>
            </section>

            <section id="penalties">
              <h2>7. CSRD Penalties &amp; Fines</h2>
              <p>
                Non-compliance with CSRD carries serious consequences. While specific penalties vary by EU
                member state, they can include:
              </p>
              <ul>
                <li><strong>Financial Penalties:</strong> Fines up to €10 million or 5% of annual net turnover</li>
                <li><strong>Director Liability:</strong> Personal liability for board members who fail to ensure
                  compliance</li>
                <li><strong>Public Procurement:</strong> Exclusion from public tenders and government contracts</li>
                <li><strong>Reputational Damage:</strong> Non-compliance is publicly disclosed, affecting customer
                  and investor confidence</li>
                <li><strong>Access to Capital:</strong> Banks and investors increasingly require ESG data — non-compliance
                  can affect financing terms</li>
              </ul>
            </section>

            <section id="faq">
              <h2>8. Frequently Asked Questions</h2>

              <h3>What is CSRD?</h3>
              <p>
                The Corporate Sustainability Reporting Directive (CSRD) is an EU regulation that requires
                companies to report on their environmental and social impact using the European Sustainability
                Reporting Standards (ESRS).
              </p>

              <h3>Does CSRD apply to small businesses?</h3>
              <p>
                CSRD applies to SMBs that meet two of three criteria: more than 250 employees, €50M+ turnover,
                or €25M+ total assets. It also affects smaller companies in the value chain of larger
                reporting entities.
              </p>

              <h3>What are the penalties for CSRD non-compliance?</h3>
              <p>
                Penalties vary by EU member state but can include fines up to €10 million or 5% of annual
                turnover, personal liability for directors, and exclusion from public procurement processes.
              </p>

              <h3>When are CSRD reports due?</h3>
              <p>
                For the first wave of reporting companies, FY2024 sustainability reports must be published by
                April 30, 2026, within the annual management report.
              </p>

              <h3>How much does CSRD compliance cost?</h3>
              <p>
                Costs range widely: $15K-$82K for manual approaches, $25K-$125K for consultants, and $30K-$150K
                for enterprise platforms. Automated solutions like GreenLedger start at $249/month ($2,988/year).
              </p>
            </section>
          </div>

          {/* End CTA */}
          <div className="mt-12 bg-gradient-to-br from-brand-primary to-emerald-700 text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">
              Start Your Free CSRD Report in 10 Minutes
            </h2>
            <p className="text-sm opacity-90 mb-6 max-w-lg mx-auto">
              Join 50+ companies using GreenLedger to automate CSRD compliance.
              No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register?source=csrd-blog"
                className="inline-flex items-center bg-white text-brand-primary px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/roi-calculator"
                className="inline-flex items-center text-white/90 hover:text-white font-semibold text-sm transition"
              >
                Calculate Your Savings
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

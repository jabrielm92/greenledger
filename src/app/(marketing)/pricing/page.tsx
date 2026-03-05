import Link from "next/link";
import { ArrowRight, Check, X, HelpCircle, Star } from "lucide-react";

const plans = [
  {
    name: "Base",
    price: "$249",
    description: "For small teams getting started with ESG reporting",
    ideal: "Ideal for companies with under 100 employees and a single reporting obligation.",
    cta: "Get Started",
    highlighted: false,
    highlights: [
      "1 compliance framework (CSRD, GRI, SASB, or ISSB)",
      "50 AI-powered document extractions per month",
      "Scope 1, 2 & 3 emissions calculations",
      "2 audit-ready reports per year",
      "Full data traceability and audit log",
    ],
    features: {
      employees: "Up to 100",
      frameworks: "1",
      adminUsers: "1",
      suppliers: "5",
      documentsPerMonth: "50",
      reportsPerYear: "2",
      aiExtractionsPerMonth: "50",
      quickbooks: false,
      auditAssistance: false,
      support: "Email",
    },
  },
  {
    name: "Professional",
    price: "$399",
    description: "For growing companies with multiple reporting needs",
    ideal: "Ideal for mid-size companies reporting across multiple frameworks with QuickBooks.",
    cta: "Get Started",
    highlighted: true,
    badge: "Most Popular",
    highlights: [
      "3 compliance frameworks simultaneously",
      "200 AI-powered document extractions per month",
      "QuickBooks integration for auto-import",
      "12 audit-ready reports per year",
      "25 supplier ESG risk tracking",
      "Priority email support",
    ],
    features: {
      employees: "Up to 300",
      frameworks: "3",
      adminUsers: "3",
      suppliers: "25",
      documentsPerMonth: "200",
      reportsPerYear: "12",
      aiExtractionsPerMonth: "200",
      quickbooks: true,
      auditAssistance: false,
      support: "Priority email",
    },
  },
  {
    name: "Enterprise",
    price: "$699",
    description: "For organizations needing unlimited access and audit support",
    ideal: "Ideal for organizations with complex supply chains and audit requirements.",
    cta: "Get Started",
    highlighted: false,
    highlights: [
      "Unlimited compliance frameworks",
      "Unlimited AI extractions and documents",
      "Unlimited admin users and reports",
      "Dedicated audit assistance",
      "Unlimited supplier monitoring",
      "Priority + Slack support channel",
    ],
    features: {
      employees: "Up to 500",
      frameworks: "Unlimited",
      adminUsers: "Unlimited",
      suppliers: "Unlimited",
      documentsPerMonth: "Unlimited",
      reportsPerYear: "Unlimited",
      aiExtractionsPerMonth: "Unlimited",
      quickbooks: true,
      auditAssistance: true,
      support: "Priority + Slack",
    },
  },
];

const featureRows = [
  { key: "employees", label: "Employees" },
  { key: "frameworks", label: "Compliance Frameworks" },
  { key: "adminUsers", label: "Admin Users" },
  { key: "suppliers", label: "Supplier Tracking" },
  { key: "documentsPerMonth", label: "Documents / month" },
  { key: "reportsPerYear", label: "Audit-Ready Reports / year" },
  { key: "aiExtractionsPerMonth", label: "AI Extractions / month" },
  { key: "quickbooks", label: "QuickBooks Integration" },
  { key: "auditAssistance", label: "Audit Assistance" },
  { key: "support", label: "Support Level" },
] as const;

const included = [
  "AI-powered document extraction",
  "Scope 1, 2 & 3 emissions calculations",
  "EPA & DEFRA emission factors",
  "Full audit trail & data traceability",
  "Role-based access controls",
  "AES-256 encryption at rest",
  "Mobile-friendly dashboard",
  "CSV & PDF report exports",
];

const faqs = [
  {
    q: "Can I get a demo before purchasing?",
    a: "Of course! Contact our sales team at greenledger@arisolutionsinc.com to schedule a personalized demo and see how GreenLedger can work for your organization.",
  },
  {
    q: "Can I change plans at any time?",
    a: "Absolutely. Upgrade or downgrade your plan at any time from Settings. Changes take effect on your next billing cycle.",
  },
  {
    q: "What happens when I hit a plan limit?",
    a: "You\u2019ll receive a notification when approaching a limit. Once reached, the specific action is blocked with a clear upgrade prompt \u2014 your existing data is never affected.",
  },
  {
    q: "Which compliance frameworks are supported?",
    a: "GreenLedger supports CSRD (EU), GRI Standards, SASB, and ISSB. We regularly add new frameworks as regulations evolve.",
  },
  {
    q: "How does billing work?",
    a: "Plans are billed monthly via Stripe. You can manage payment methods, view invoices, and cancel anytime from the billing settings page.",
  },
  {
    q: "Do you offer annual pricing?",
    a: "Annual pricing with a 20% discount is coming soon. Contact us to be notified when it\u2019s available.",
  },
  {
    q: "Is my data secure?",
    a: "All data is encrypted at rest (AES-256) and in transit (TLS 1.2+). We maintain full audit logs, multi-tenant data isolation, and role-based access controls.",
  },
  {
    q: "What\u2019s included in Audit Assistance?",
    a: "Enterprise plan customers receive dedicated support during audit preparation, including data review, report validation, and direct communication with our compliance team.",
  },
];

export default function PricingPage() {
  return (
    <div>
      {/* Header */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-secondary mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional-grade ESG compliance tools at a fraction of enterprise
            cost. Choose the plan that fits your organization.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 transition-all bg-white ${
                  plan.highlighted
                    ? "border-brand-primary shadow-xl ring-2 ring-brand-primary/20 md:scale-[1.02]"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-lg"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-brand-primary px-4 py-1.5 text-xs font-bold text-white shadow-md">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-brand-secondary">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-brand-secondary">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>

                <Link
                  href="/register"
                  className={`mt-6 flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                    plan.highlighted
                      ? "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/25"
                      : "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/5"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>

                <div className="mt-6 h-px bg-slate-100" />

                <p className="mt-5 text-xs font-semibold text-brand-secondary uppercase tracking-wider mb-3">
                  What&apos;s included
                </p>
                <ul className="space-y-2.5">
                  {plan.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                      {h}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 text-xs text-muted-foreground italic">
                  {plan.ideal}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All plans include */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold text-center text-brand-secondary mb-8">
            Every Plan Includes
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {included.map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-brand-primary flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-brand-secondary mb-3">
            Detailed Plan Comparison
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-10">
            See exactly what each tier includes
          </p>
          <div className="overflow-x-auto max-w-4xl mx-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="py-4 pr-4 text-left font-semibold text-brand-secondary">
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th
                      key={p.name}
                      className={`py-4 px-4 text-center font-bold text-brand-secondary ${
                        p.highlighted ? "bg-brand-primary/5 rounded-t-lg" : ""
                      }`}
                    >
                      {p.name}
                      <div className="text-xs font-normal text-muted-foreground mt-0.5">
                        {p.price}/mo
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row) => (
                  <tr key={row.key} className="border-b border-slate-100">
                    <td className="py-3.5 pr-4 text-muted-foreground font-medium">
                      {row.label}
                    </td>
                    {plans.map((plan) => {
                      const val =
                        plan.features[
                          row.key as keyof typeof plan.features
                        ];
                      return (
                        <td
                          key={plan.name}
                          className={`py-3.5 px-4 text-center ${
                            plan.highlighted ? "bg-brand-primary/5" : ""
                          }`}
                        >
                          {typeof val === "boolean" ? (
                            val ? (
                              <Check className="mx-auto h-5 w-5 text-brand-primary" />
                            ) : (
                              <X className="mx-auto h-5 w-5 text-slate-300" />
                            )
                          ) : (
                            <span className="font-medium text-brand-secondary">
                              {val}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-emerald-50/30 p-10 text-center shadow-sm">
            <div className="flex justify-center gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-lg text-brand-secondary leading-relaxed mb-6">
              &ldquo;We evaluated three enterprise ESG platforms before finding
              GreenLedger. It does everything they do at a fraction of the cost, and
              the onboarding took hours, not months. The Professional plan was the
              obvious choice for a 200-person company like ours.&rdquo;
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-emerald-500 text-sm font-bold text-white">
                MW
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-brand-secondary">Marcus Weber</p>
                <p className="text-xs text-muted-foreground">VP of Sustainability, Atlas Building Group</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-brand-secondary mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-10">
            Everything you need to know about GreenLedger pricing
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-slate-100 bg-white p-6 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-brand-secondary mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-br from-brand-secondary to-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Need a custom plan or have questions?
          </h2>
          <p className="text-slate-300 mb-8 max-w-lg mx-auto">
            Our team is here to help you find the right fit for your organization.
            Contact us for custom pricing, enterprise features, or a personalized demo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-8 py-3 text-sm font-semibold text-white hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/25"
            >
              Contact Sales
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="mailto:greenledger@arisolutionsinc.com"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/20 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              greenledger@arisolutionsinc.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";

const plans = [
  {
    name: "Base",
    price: "$249",
    description: "For small teams getting started with ESG reporting",
    cta: "Start Free Trial",
    highlighted: false,
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
    cta: "Start Free Trial",
    highlighted: true,
    badge: "Most Popular",
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
    cta: "Start Free Trial",
    highlighted: false,
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
  { key: "frameworks", label: "Frameworks" },
  { key: "adminUsers", label: "Admin Users" },
  { key: "suppliers", label: "Suppliers" },
  { key: "documentsPerMonth", label: "Documents / month" },
  { key: "reportsPerYear", label: "Reports / year" },
  { key: "aiExtractionsPerMonth", label: "AI Extractions / month" },
  { key: "quickbooks", label: "QuickBooks Integration" },
  { key: "auditAssistance", label: "Audit Assistance" },
  { key: "support", label: "Support" },
] as const;

const faqs = [
  {
    q: "Is there a free trial?",
    a: "Yes! Every account starts with a 14-day free trial on the Professional plan. No credit card required.",
  },
  {
    q: "Can I change plans at any time?",
    a: "Absolutely. Upgrade or downgrade your plan at any time from Settings. Changes take effect on your next billing cycle.",
  },
  {
    q: "What happens when I hit a plan limit?",
    a: "You'll receive a notification when approaching a limit. Once reached, the specific action is blocked with a clear upgrade prompt — your existing data is never affected.",
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
    a: "Annual pricing with a 20% discount is coming soon. Contact us to be notified when it's available.",
  },
];

export default function PricingPage() {
  return (
    <div>
      {/* Header */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-brand-secondary mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            14-day free trial on every plan. No credit card required.
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
                className={`relative rounded-lg border p-8 ${
                  plan.highlighted
                    ? "border-brand-primary shadow-lg ring-1 ring-brand-primary"
                    : "border-slate-200"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-brand-primary px-3 py-1 text-xs font-medium text-white">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-brand-secondary">
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-brand-secondary">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <Link
                  href="/register"
                  className={`mt-6 flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                    plan.highlighted
                      ? "bg-brand-primary text-white hover:bg-brand-primary/90"
                      : "border border-brand-primary text-brand-primary hover:bg-brand-primary/5"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-brand-secondary mb-8">
            Compare Plans
          </h2>
          <div className="overflow-x-auto max-w-4xl mx-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 pr-4 text-left font-medium text-muted-foreground">
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th
                      key={p.name}
                      className="py-3 px-4 text-center font-semibold text-brand-secondary"
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row) => (
                  <tr key={row.key} className="border-b">
                    <td className="py-3 pr-4 text-muted-foreground">
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
                          className="py-3 px-4 text-center"
                        >
                          {typeof val === "boolean" ? (
                            val ? (
                              <Check className="mx-auto h-4 w-4 text-brand-primary" />
                            ) : (
                              <X className="mx-auto h-4 w-4 text-slate-300" />
                            )
                          ) : (
                            <span className="text-brand-secondary">
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

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-brand-secondary mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-lg border p-6">
                <h3 className="text-sm font-semibold text-brand-secondary mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { Leaf, Shield, BookOpen, Users, Star, Award, Globe, BarChart3 } from "lucide-react";

const testimonials = [
  {
    quote:
      "GreenLedger cut our CSRD reporting time from 6 weeks to 3 days. The AI extraction is remarkably accurate \u2014 our auditors were impressed with the traceability.",
    name: "Sarah Chen",
    role: "Chief Financial Officer",
    company: "Meridian Technologies",
    initials: "SC",
  },
  {
    quote:
      "We evaluated three enterprise ESG platforms before finding GreenLedger. It does everything they do at a fraction of the cost, and the onboarding took hours, not months.",
    name: "Marcus Weber",
    role: "VP of Sustainability",
    company: "Atlas Building Group",
    initials: "MW",
  },
  {
    quote:
      "The QuickBooks integration alone saves us 20+ hours a month. We went from dreading compliance season to having reports ready weeks ahead of deadline.",
    name: "Priya Sharma",
    role: "Operations Director",
    company: "Vantage Supply Co.",
    initials: "PS",
  },
  {
    quote:
      "As a 200-person manufacturer, we thought we\u2019d need a dedicated sustainability hire. GreenLedger made it possible for our existing team to handle everything.",
    name: "David Okafor",
    role: "General Manager",
    company: "Pinnacle Manufacturing",
    initials: "DO",
  },
  {
    quote:
      "The multi-framework support is a game changer. We report to CSRD and GRI from the same data \u2014 no duplicate work, no inconsistencies. Our board loves the dashboards.",
    name: "Elena Vasquez",
    role: "Sustainability Director",
    company: "Horizon Energy Partners",
    initials: "EV",
  },
  {
    quote:
      "Before GreenLedger, our ESG reporting was a quarterly fire drill. Now it\u2019s a background process that runs itself. The ROI was obvious within the first month.",
    name: "Thomas Nguyen",
    role: "COO",
    company: "Pacific Coast Logistics",
    initials: "TN",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-secondary mb-4">
            About GreenLedger
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We believe ESG compliance should be accessible to every business,
            not just the Fortune 500.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10">
                <Leaf className="h-5 w-5 text-brand-primary" />
              </div>
              <h2 className="text-2xl font-bold text-brand-secondary">
                Our Mission
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Environmental, Social, and Governance (ESG) compliance is becoming
              mandatory across the globe. The EU&apos;s Corporate Sustainability
              Reporting Directive (CSRD) alone affects over 50,000 companies.
              Yet the tools available today are built for large enterprises with
              dedicated sustainability teams and six-figure budgets.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              GreenLedger was built to change that. We&apos;re making
              professional-grade ESG compliance tools available to small and
              mid-size businesses at a price they can afford, with an experience
              that doesn&apos;t require a PhD in sustainability reporting.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our AI-powered platform automates the hard parts — data
              extraction, emissions calculation, and multi-framework report
              generation — so teams can focus on actually reducing their
              environmental impact rather than just measuring it.
            </p>
          </div>
        </div>
      </section>

      {/* What we value */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-brand-secondary mb-12">
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10">
                <Shield className="h-7 w-7 text-brand-primary" />
              </div>
              <h3 className="text-lg font-bold text-brand-secondary mb-2">
                Audit-Grade Accuracy
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every data point is traceable to its source document. We build
                for auditors first, because trust is non-negotiable.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10">
                <BookOpen className="h-7 w-7 text-brand-primary" />
              </div>
              <h3 className="text-lg font-bold text-brand-secondary mb-2">
                Regulatory Expertise
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our platform tracks CSRD, GRI, SASB, and ISSB framework changes
                so you don&apos;t have to. Your reports stay compliant as
                regulations evolve.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10">
                <Users className="h-7 w-7 text-brand-primary" />
              </div>
              <h3 className="text-lg font-bold text-brand-secondary mb-2">
                Built for SMBs
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Not a watered-down enterprise tool. Purpose-built for teams of
                10 to 500 with pricing and workflows that make sense at your
                scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What GreenLedger Does */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-brand-secondary mb-12">
            What GreenLedger Does
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: BarChart3,
                title: "Automated Emissions Tracking",
                description:
                  "Upload utility bills, fuel receipts, and invoices. Our AI extracts data and calculates Scope 1, 2, and 3 emissions using EPA and DEFRA emission factors — with full source tracing.",
              },
              {
                icon: Globe,
                title: "Multi-Framework Compliance",
                description:
                  "Generate audit-ready reports for CSRD, GRI, SASB, and ISSB — all from the same underlying data. No duplicate work across frameworks.",
              },
              {
                icon: Shield,
                title: "Full Audit Traceability",
                description:
                  "Every data point is linked to its source document. Full audit logs track every change, so you\u2019re always ready for external verification.",
              },
              {
                icon: Award,
                title: "Enterprise-Grade Security",
                description:
                  "AES-256 encryption at rest, TLS 1.2+ in transit. Role-based access controls, multi-tenant data isolation, and complete audit trails.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-xl border border-slate-100 bg-white p-6 hover:shadow-md transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 flex-shrink-0">
                  <item.icon className="h-6 w-6 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-secondary mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-brand-secondary mb-3">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Trusted by sustainability-focused teams at companies of all sizes.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-slate-100 bg-white p-7 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-brand-secondary leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-emerald-500 text-sm font-bold text-white">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-secondary">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-brand-secondary to-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Ready to get started?
          </h2>
          <p className="text-slate-300 mb-8 max-w-md mx-auto">
            See how GreenLedger can simplify ESG compliance for your organization.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-primary/90 transition-colors shadow-lg shadow-brand-primary/25"
            >
              View Pricing
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/20 text-white px-6 py-2.5 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-400">
            greenledger@arisolutionsinc.com
          </p>
        </div>
      </section>
    </div>
  );
}

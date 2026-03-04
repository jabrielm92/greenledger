import Link from "next/link";
import {
  Leaf,
  ArrowRight,
  FileText,
  BarChart3,
  Shield,
  DollarSign,
  Clock,
  FileWarning,
  Upload,
  Cpu,
  FileCheck,
  Link2,
  Globe,
  Smartphone,
  Star,
  Check,
  ChevronRight,
  Zap,
  Lock,
  HelpCircle,
} from "lucide-react";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { MarketingFooter } from "@/components/layout/marketing-footer";

const faqs = [
  {
    q: "How quickly can I get started?",
    a: "Most teams are up and running within 10 minutes. Upload your first document, and our AI extracts emissions data in seconds.",
  },
  {
    q: "Which compliance frameworks do you support?",
    a: "GreenLedger supports CSRD (EU), GRI Standards, SASB, and ISSB. We regularly add new frameworks as regulations evolve.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. All data is encrypted at rest and in transit. We maintain full audit logs and role-based access controls for your team.",
  },
  {
    q: "Can I connect my accounting software?",
    a: "Yes — our QuickBooks integration auto-imports financial data that feeds directly into emissions calculations. More integrations coming soon.",
  },
  {
    q: "What if I need help with my first report?",
    a: "Our support team is here to help. Professional and Enterprise plans include priority support to guide you through your first compliance report.",
  },
  {
    q: "Do you offer annual pricing?",
    a: "Annual pricing with a 20% discount is coming soon. Contact us to be notified when it becomes available.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white py-24 md:py-36">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-primary/5 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />
          </div>

          <div className="container relative mx-auto px-4 text-center">
            <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-8">
              <Leaf className="mr-2 h-4 w-4" />
              ESG compliance built for growing businesses
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-brand-secondary max-w-4xl mx-auto leading-[1.1]">
              ESG Compliance on{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-emerald-500">
                Autopilot
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stop drowning in spreadsheets. GreenLedger automates ESG data
              collection, emissions calculation, and compliance reporting —
              in minutes, not months.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-8 py-3.5 text-base font-semibold text-white hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30"
              >
                View Pricing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center justify-center rounded-lg border-2 border-slate-200 px-8 py-3.5 text-base font-semibold hover:bg-slate-50 transition-all"
              >
                See How It Works
              </Link>
            </div>

            {/* Dashboard mockup placeholder */}
            <div className="mt-16 mx-auto max-w-4xl">
              <div className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="flex items-center gap-2 border-b bg-slate-50 px-4 py-3">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-amber-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs text-muted-foreground">GreenLedger Dashboard</span>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-4">
                      <p className="text-xs text-muted-foreground">Total Emissions</p>
                      <p className="text-2xl font-bold text-brand-secondary">1,247 <span className="text-sm font-normal text-muted-foreground">tCO2e</span></p>
                      <p className="text-xs text-emerald-600 mt-1">-12% from last period</p>
                    </div>
                    <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
                      <p className="text-xs text-muted-foreground">Documents Processed</p>
                      <p className="text-2xl font-bold text-brand-secondary">342</p>
                      <p className="text-xs text-blue-600 mt-1">99.2% extraction accuracy</p>
                    </div>
                    <div className="rounded-lg bg-amber-50 border border-amber-100 p-4">
                      <p className="text-xs text-muted-foreground">Compliance Score</p>
                      <p className="text-2xl font-bold text-brand-secondary">87%</p>
                      <p className="text-xs text-amber-600 mt-1">CSRD framework</p>
                    </div>
                  </div>
                  <div className="h-32 rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 border border-slate-100 flex items-center justify-center">
                    <div className="flex items-end gap-1.5">
                      {[40, 55, 45, 65, 50, 70, 60, 75, 55, 80, 65, 85].map((h, i) => (
                        <div
                          key={i}
                          className="w-6 rounded-t bg-gradient-to-t from-brand-primary to-emerald-400"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust bar */}
            <div className="mt-16">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-6">
                Trusted by sustainability-focused teams
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
                {["TechCorp", "EcoFirm", "BuildCo", "GreenMfg", "AgriFresh"].map(
                  (name) => (
                    <div
                      key={name}
                      className="flex items-center gap-2 text-base font-bold tracking-wide text-slate-300"
                    >
                      <div className="h-8 w-8 rounded-md bg-slate-100" />
                      {name}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 uppercase tracking-wider mb-4">
                The Problem
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4">
                ESG Compliance Shouldn&apos;t Cost $100K
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Traditional solutions are built for enterprises. SMBs need
                something better.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: DollarSign,
                  iconBg: "bg-red-100",
                  iconColor: "text-red-600",
                  title: "Enterprise tools cost $30K\u2013$100K/yr",
                  description: "Pricing designed for Fortune 500, not growing businesses.",
                },
                {
                  icon: Clock,
                  iconBg: "bg-amber-100",
                  iconColor: "text-amber-600",
                  title: "Manual reporting takes 200+ hours",
                  description: "Spreadsheets, copy-paste, and guesswork waste valuable time.",
                },
                {
                  icon: FileWarning,
                  iconBg: "bg-blue-100",
                  iconColor: "text-blue-600",
                  title: "Regulations change faster than you can track",
                  description: "CSRD, GRI, SASB, ISSB \u2014 keeping up is a full-time job.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow text-center"
                >
                  <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${item.iconBg}`}>
                    <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-secondary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-4">
                How It Works
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4">
                From Upload to Compliant in 3 Steps
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                No consultants. No six-month implementation. Just results.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
              {/* Connecting line (desktop only) */}
              <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-brand-primary/20 via-brand-primary/40 to-brand-primary/20" />

              {[
                {
                  step: 1,
                  icon: Upload,
                  title: "Upload Documents",
                  description: "Drag-and-drop utility bills, fuel receipts, invoices, and travel records. Or connect QuickBooks for auto-import.",
                },
                {
                  step: 2,
                  icon: Cpu,
                  title: "AI Extracts & Calculates",
                  description: "Our AI reads your documents, extracts data, and calculates Scope 1, 2, & 3 emissions using EPA and DEFRA factors.",
                },
                {
                  step: 3,
                  icon: FileCheck,
                  title: "Generate Reports",
                  description: "One-click CSRD, GRI, and SASB-compliant reports. Audit-ready with every number traced to its source.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center relative">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white border-2 border-brand-primary/20 shadow-sm relative z-10">
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white">
                      {item.step}
                    </span>
                    <item.icon className="h-7 w-7 text-brand-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-secondary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary uppercase tracking-wider mb-4">
                Features
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4">
                Everything You Need for ESG Compliance
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Built specifically for the needs of growing businesses.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: FileText,
                  title: "AI Document Extraction",
                  description:
                    "Upload a bill, get emissions data in seconds. Supports invoices, utility bills, fuel receipts, and more.",
                },
                {
                  icon: Globe,
                  title: "Multi-Framework Support",
                  description:
                    "CSRD, GRI, SASB, ISSB \u2014 generate reports for any framework, all from the same data.",
                },
                {
                  icon: Shield,
                  title: "Audit-Ready Traceability",
                  description:
                    "Every number linked to its source document. Full audit log for every change.",
                },
                {
                  icon: Link2,
                  title: "QuickBooks Integration",
                  description:
                    "Auto-import financial data that feeds emissions calculations. No manual data entry.",
                },
                {
                  icon: BarChart3,
                  title: "Supply Chain Monitoring",
                  description:
                    "Track supplier ESG risk scores. Monitor Scope 3 emissions across your supply chain.",
                },
                {
                  icon: Smartphone,
                  title: "Mobile-First Design",
                  description:
                    "Capture data from anywhere. Upload receipts on the go and view dashboards on any device.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group bg-white rounded-xl p-6 border border-slate-100 hover:border-brand-primary/20 hover:shadow-lg transition-all duration-200"
                >
                  <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:bg-brand-primary/15 transition-colors">
                    <feature.icon className="h-6 w-6 text-brand-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-secondary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            {/* Metrics */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center mb-20">
              {[
                { value: "50,000+", label: "Data points processed" },
                { value: "1,200+", label: "Hours saved" },
                { value: "99.2%", label: "Audit accuracy" },
              ].map((stat) => (
                <div key={stat.label} className="relative">
                  <p className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-emerald-500">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  quote:
                    "GreenLedger cut our reporting time from weeks to hours. The AI extraction is remarkably accurate.",
                  name: "Sarah Chen",
                  role: "CFO, TechCorp",
                  initials: "SC",
                },
                {
                  quote:
                    "We went from dreading CSRD compliance to actually being ahead of schedule. Game changer for our team.",
                  name: "Marcus Weber",
                  role: "Sustainability Lead, BuildCo",
                  initials: "MW",
                },
                {
                  quote:
                    "The QuickBooks integration alone saves us 20 hours a month. Best ROI on any SaaS tool we use.",
                  name: "Priya Sharma",
                  role: "Operations Director, EcoFirm",
                  initials: "PS",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-sm font-semibold text-brand-primary">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-brand-secondary">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary uppercase tracking-wider mb-4">
                Pricing
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4">
                Plans That Scale With You
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Transparent pricing. No hidden fees. Cancel anytime.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Base",
                  price: "$249",
                  description: "For small teams getting started with ESG reporting",
                  features: ["Up to 100 employees", "1 compliance framework", "50 AI extractions/mo", "Email support"],
                  highlighted: false,
                },
                {
                  name: "Professional",
                  price: "$399",
                  description: "For growing companies with multiple reporting needs",
                  badge: "Most Popular",
                  features: ["Up to 300 employees", "3 compliance frameworks", "200 AI extractions/mo", "QuickBooks integration", "Priority support"],
                  highlighted: true,
                },
                {
                  name: "Enterprise",
                  price: "$699",
                  description: "For organizations needing unlimited access",
                  features: ["Up to 500 employees", "Unlimited frameworks", "Unlimited AI extractions", "Audit assistance", "Priority + Slack support"],
                  highlighted: false,
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-xl border p-8 ${
                    plan.highlighted
                      ? "border-brand-primary shadow-xl ring-2 ring-brand-primary/20 scale-[1.02]"
                      : "border-slate-200 hover:border-slate-300"
                  } transition-all`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-brand-primary px-4 py-1 text-xs font-semibold text-white shadow-sm">
                        {plan.badge}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-brand-secondary">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-brand-secondary">{plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-brand-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`mt-8 flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                      plan.highlighted
                        ? "bg-brand-primary text-white hover:bg-brand-primary/90 shadow-lg shadow-brand-primary/25"
                        : "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/5"
                    }`}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/pricing"
                className="inline-flex items-center text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
              >
                Compare all plan features
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary uppercase tracking-wider mb-4">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-xl border border-slate-100 bg-white p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-brand-secondary mb-2">
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
        <section className="py-24 bg-gradient-to-br from-brand-secondary via-brand-secondary to-slate-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-brand-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          </div>
          <div className="container relative mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Simplify ESG Compliance?
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-lg mx-auto">
              Join hundreds of companies that trust GreenLedger for their
              ESG reporting needs. Get started in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-8 py-3.5 text-base font-semibold text-white hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/25"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/20 px-8 py-3.5 text-base font-semibold text-white hover:bg-white/10 transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

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
} from "lucide-react";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm text-muted-foreground mb-6">
              <Leaf className="mr-2 h-4 w-4 text-brand-primary" />
              Trusted by 500+ companies
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-brand-secondary max-w-4xl mx-auto">
              ESG Compliance on{" "}
              <span className="text-brand-primary">Autopilot</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Stop drowning in spreadsheets. GreenLedger automates ESG data
              collection, emissions calculation, and compliance reporting for
              SMBs — in minutes, not months.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-brand-primary px-6 py-3 text-base font-medium text-white hover:bg-brand-primary/90 transition-colors"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center justify-center rounded-md border border-input px-6 py-3 text-base font-medium hover:bg-accent transition-colors"
              >
                See How It Works
              </Link>
            </div>

            {/* Trust bar logos */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-40">
              {["TechCorp", "EcoFirm", "BuildCo", "GreenMfg", "AgriFresh"].map(
                (name) => (
                  <div
                    key={name}
                    className="text-sm font-semibold tracking-wider text-slate-400"
                  >
                    {name}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-brand-secondary mb-4">
              ESG Compliance Shouldn&apos;t Cost $100K
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Traditional solutions are built for enterprises. SMBs need
              something better.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <DollarSign className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-brand-secondary mb-2">
                  Enterprise tools cost $30K–$100K/yr
                </h3>
                <p className="text-sm text-muted-foreground">
                  Pricing designed for Fortune 500, not growing businesses.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold text-brand-secondary mb-2">
                  Manual reporting takes 200+ hours
                </h3>
                <p className="text-sm text-muted-foreground">
                  Spreadsheets, copy-paste, and guesswork waste valuable time.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <FileWarning className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-brand-secondary mb-2">
                  Regulations change faster than you can track
                </h3>
                <p className="text-sm text-muted-foreground">
                  CSRD, GRI, SASB, ISSB — keeping up is a full-time job.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-brand-secondary mb-4">
              From Upload to Compliant in 3 Steps
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              No consultants. No six-month implementation. Just results.
            </p>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary text-xl font-bold">
                  1
                </div>
                <Upload className="mx-auto mb-3 h-8 w-8 text-brand-primary" />
                <h3 className="text-lg font-semibold text-brand-secondary mb-2">
                  Upload Documents
                </h3>
                <p className="text-sm text-muted-foreground">
                  Drag-and-drop utility bills, fuel receipts, invoices, and travel
                  records. Or connect QuickBooks for auto-import.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary text-xl font-bold">
                  2
                </div>
                <Cpu className="mx-auto mb-3 h-8 w-8 text-brand-primary" />
                <h3 className="text-lg font-semibold text-brand-secondary mb-2">
                  AI Extracts & Calculates
                </h3>
                <p className="text-sm text-muted-foreground">
                  Our AI reads your documents, extracts data, and calculates
                  Scope 1, 2, & 3 emissions using EPA and DEFRA factors.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary text-xl font-bold">
                  3
                </div>
                <FileCheck className="mx-auto mb-3 h-8 w-8 text-brand-primary" />
                <h3 className="text-lg font-semibold text-brand-secondary mb-2">
                  Generate Reports
                </h3>
                <p className="text-sm text-muted-foreground">
                  One-click CSRD, GRI, and SASB-compliant reports. Audit-ready
                  with every number traced to its source.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-brand-secondary mb-4">
              Everything You Need for ESG Compliance
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Built specifically for the needs of growing businesses.
            </p>
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
                    "CSRD, GRI, SASB, ISSB — generate reports for any framework, all from the same data.",
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
                  className="bg-white rounded-lg p-6 shadow-sm border"
                >
                  <div className="h-10 w-10 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-5 w-5 text-brand-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-brand-secondary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {/* Metrics */}
            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto text-center mb-16">
              {[
                { value: "50,000+", label: "Data points processed" },
                { value: "1,200+", label: "Hours saved" },
                { value: "99.2%", label: "Audit accuracy" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-bold text-brand-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
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
                },
                {
                  quote:
                    "We went from dreading CSRD compliance to actually being ahead of schedule. Game changer for our team.",
                  name: "Marcus Weber",
                  role: "Sustainability Lead, BuildCo",
                },
                {
                  quote:
                    "The QuickBooks integration alone saves us 20 hours a month. Best ROI on any SaaS tool we use.",
                  name: "Priya Sharma",
                  role: "Operations Director, EcoFirm",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="rounded-lg border bg-white p-6 shadow-sm"
                >
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="text-sm font-semibold text-brand-secondary">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 bg-brand-secondary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Your 14-Day Free Trial
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-lg mx-auto">
              No credit card required. Setup in 10 minutes.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-brand-primary px-8 py-3 text-base font-medium text-white hover:bg-brand-primary/90 transition-colors"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

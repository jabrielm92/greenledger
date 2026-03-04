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
  HelpCircle,
  TrendingDown,
  Lock,
  Zap,
  Target,
  Award,
  Building2,
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
    a: "Absolutely. All data is encrypted at rest (AES-256) and in transit (TLS 1.2+). We maintain full audit logs, role-based access controls, and multi-tenant data isolation.",
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

const testimonials = [
  {
    quote:
      "GreenLedger cut our CSRD reporting time from 6 weeks to 3 days. The AI extraction is remarkably accurate — our auditors were impressed with the traceability.",
    name: "Sarah Chen",
    role: "Chief Financial Officer",
    company: "Meridian Technologies",
    initials: "SC",
    metric: "93% faster reporting",
  },
  {
    quote:
      "We evaluated three enterprise ESG platforms before finding GreenLedger. It does everything they do at a fraction of the cost, and the onboarding took hours, not months.",
    name: "Marcus Weber",
    role: "VP of Sustainability",
    company: "Atlas Building Group",
    initials: "MW",
    metric: "$47K saved annually",
  },
  {
    quote:
      "The QuickBooks integration alone saves us 20+ hours a month. We went from dreading compliance season to having reports ready weeks ahead of deadline.",
    name: "Priya Sharma",
    role: "Operations Director",
    company: "Vantage Supply Co.",
    initials: "PS",
    metric: "20+ hrs saved/month",
  },
  {
    quote:
      "As a 200-person manufacturer, we thought we&apos;d need a dedicated sustainability hire. GreenLedger made it possible for our existing team to handle everything.",
    name: "David Okafor",
    role: "General Manager",
    company: "Pinnacle Manufacturing",
    initials: "DO",
    metric: "Zero new hires needed",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white py-24 md:py-36">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand-primary/[0.04] blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-100/30 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-emerald-50/20 blur-3xl" />
          </div>

          <div className="container relative mx-auto px-4 text-center">
            <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-8">
              <Leaf className="mr-2 h-4 w-4" />
              AI-Powered ESG Compliance Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-brand-secondary max-w-4xl mx-auto leading-[1.08]">
              ESG Compliance on{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-emerald-500">
                Autopilot
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stop drowning in spreadsheets. GreenLedger automates ESG data
              collection, emissions calculation, and multi-framework compliance
              reporting — so you can focus on actually reducing your impact.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-8 py-3.5 text-base font-semibold text-white hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 hover:-translate-y-0.5"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg border-2 border-slate-200 px-8 py-3.5 text-base font-semibold text-brand-secondary hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                View Pricing
              </Link>
            </div>

            {/* Key value props under CTA */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-brand-primary" />
                CSRD, GRI, SASB, ISSB
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-brand-primary" />
                AI document extraction
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-brand-primary" />
                Audit-ready reports
              </span>
            </div>

            {/* Dashboard mockup */}
            <div className="mt-16 mx-auto max-w-5xl">
              <div className="rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur shadow-2xl shadow-slate-300/30 overflow-hidden">
                <div className="flex items-center gap-2 border-b bg-slate-50/80 px-5 py-3">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                  <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                  <div className="h-3 w-3 rounded-full bg-[#28C840]" />
                  <span className="ml-4 text-xs font-medium text-muted-foreground tracking-wide">GreenLedger Dashboard</span>
                </div>
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Emissions</p>
                        <TrendingDown className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <p className="text-2xl font-bold text-brand-secondary">1,247 <span className="text-xs font-normal text-muted-foreground">tCO2e</span></p>
                      <p className="text-xs font-medium text-emerald-600 mt-1">-12.4% vs last quarter</p>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Docs Processed</p>
                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-brand-secondary">342</p>
                      <p className="text-xs font-medium text-blue-600 mt-1">99.2% extraction accuracy</p>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">CSRD Score</p>
                        <Target className="h-3.5 w-3.5 text-amber-600" />
                      </div>
                      <p className="text-2xl font-bold text-brand-secondary">87%</p>
                      <p className="text-xs font-medium text-amber-600 mt-1">+9 pts this period</p>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-100 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Suppliers</p>
                        <Building2 className="h-3.5 w-3.5 text-violet-600" />
                      </div>
                      <p className="text-2xl font-bold text-brand-secondary">24</p>
                      <p className="text-xs font-medium text-violet-600 mt-1">3 need attention</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 h-40 rounded-xl bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-100 flex items-end justify-center p-4 pb-6">
                      <div className="flex items-end gap-1 w-full max-w-md">
                        {[32, 48, 38, 56, 42, 62, 52, 68, 48, 72, 58, 78].map((h, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div
                              className="w-full rounded-t-md bg-gradient-to-t from-brand-primary to-emerald-400 min-w-[12px]"
                              style={{ height: `${h * 1.4}px` }}
                            />
                            <span className="text-[9px] text-muted-foreground">{["J","F","M","A","M","J","J","A","S","O","N","D"][i]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="h-40 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/30 border border-slate-100 p-4 flex flex-col justify-between">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Scope Breakdown</p>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Scope 1</span>
                            <span className="font-medium text-brand-secondary">312 tCO2e</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-primary w-[25%]" /></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Scope 2</span>
                            <span className="font-medium text-brand-secondary">498 tCO2e</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-400 w-[40%]" /></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Scope 3</span>
                            <span className="font-medium text-brand-secondary">437 tCO2e</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-400 w-[35%]" /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust bar */}
            <div className="mt-20">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 mb-8 font-medium">
                Trusted by sustainability-focused organizations
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-6">
                {[
                  "Meridian Tech",
                  "Atlas Group",
                  "Vantage Supply",
                  "Pinnacle Mfg",
                  "Horizon Energy",
                ].map((name) => (
                  <div
                    key={name}
                    className="flex items-center gap-2.5 text-base font-semibold tracking-wide text-slate-300/80"
                  >
                    <div className="h-8 w-8 rounded-lg bg-slate-100/80" />
                    {name}
                  </div>
                ))}
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
                ESG Compliance Shouldn&apos;t Be This Hard
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                New regulations like CSRD are expanding to cover tens of thousands
                of companies. But the tools available today weren&apos;t built for you.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: DollarSign,
                  iconBg: "bg-red-100",
                  iconColor: "text-red-600",
                  title: "Enterprise tools cost $30K\u2013$100K/year",
                  description:
                    "Major ESG platforms are priced for Fortune 500 companies with dedicated sustainability departments and six-figure budgets.",
                },
                {
                  icon: Clock,
                  iconBg: "bg-amber-100",
                  iconColor: "text-amber-600",
                  title: "Manual reporting takes 200+ hours",
                  description:
                    "Gathering data across utility bills, invoices, and spreadsheets. Manually entering numbers. Hoping the math is right.",
                },
                {
                  icon: FileWarning,
                  iconBg: "bg-blue-100",
                  iconColor: "text-blue-600",
                  title: "Regulations keep changing",
                  description:
                    "CSRD, GRI, SASB, ISSB — each framework has different requirements, and they\u2019re all evolving. One mistake risks non-compliance.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
                >
                  <div
                    className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${item.iconBg}`}
                  >
                    <item.icon className={`h-7 w-7 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-brand-secondary mb-3">
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
                From Upload to Audit-Ready in 3 Steps
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                No consultants. No six-month implementation. Set up in minutes,
                generate your first compliance report the same day.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
              <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-brand-primary/10 via-brand-primary/30 to-brand-primary/10" />

              {[
                {
                  step: 1,
                  icon: Upload,
                  title: "Upload Your Documents",
                  description:
                    "Drag-and-drop utility bills, fuel receipts, invoices, and travel records. Or connect QuickBooks to auto-import financial data — no manual entry required.",
                },
                {
                  step: 2,
                  icon: Cpu,
                  title: "AI Extracts & Calculates",
                  description:
                    "Our AI reads every document, extracts the relevant data points, and calculates Scope 1, 2, and 3 emissions using EPA and DEFRA emission factors — with full source tracing.",
                },
                {
                  step: 3,
                  icon: FileCheck,
                  title: "Generate Compliant Reports",
                  description:
                    "One-click CSRD, GRI, SASB, or ISSB reports. Every number traced to its source document. Ready for auditors, regulators, and stakeholders.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center relative">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white border-2 border-brand-primary/15 shadow-lg shadow-brand-primary/5 relative z-10">
                    <span className="absolute -top-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white shadow-md">
                      {item.step}
                    </span>
                    <item.icon className="h-8 w-8 text-brand-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-brand-secondary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features — Detailed */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary uppercase tracking-wider mb-4">
                Platform Capabilities
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4">
                Everything You Need for ESG Compliance
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                A complete platform that replaces spreadsheets, consultants, and
                expensive enterprise tools — purpose-built for growing businesses.
              </p>
            </div>

            {/* Feature rows — alternating layout */}
            <div className="max-w-5xl mx-auto space-y-20">
              {/* Feature 1 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-5">
                    <FileText className="h-6 w-6 text-brand-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-secondary mb-3">
                    AI-Powered Document Extraction
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-5">
                    Upload utility bills, invoices, fuel receipts, or travel
                    records. Our AI reads each document, identifies the relevant
                    data points, and extracts them with 99%+ accuracy — in seconds,
                    not hours.
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      "Supports PDF, image, and scanned documents",
                      "Confidence scores on every extraction",
                      "Human-in-the-loop review for edge cases",
                      "Full audit trail linking data to source documents",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-slate-100 p-8 shadow-sm">
                  <div className="space-y-3">
                    <div className="rounded-lg bg-white border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Electric bill — Mar 2026</span>
                        <span className="text-[10px] rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 font-medium">98% confidence</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-muted-foreground">Usage:</span> <span className="font-medium text-brand-secondary">4,280 kWh</span></div>
                        <div><span className="text-muted-foreground">Cost:</span> <span className="font-medium text-brand-secondary">$513.60</span></div>
                        <div><span className="text-muted-foreground">Emissions:</span> <span className="font-medium text-brand-secondary">1.84 tCO2e</span></div>
                        <div><span className="text-muted-foreground">Scope:</span> <span className="font-medium text-brand-secondary">Scope 2</span></div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-white border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Natural gas — Mar 2026</span>
                        <span className="text-[10px] rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 font-medium">99% confidence</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-muted-foreground">Usage:</span> <span className="font-medium text-brand-secondary">850 therms</span></div>
                        <div><span className="text-muted-foreground">Cost:</span> <span className="font-medium text-brand-secondary">$1,105.00</span></div>
                        <div><span className="text-muted-foreground">Emissions:</span> <span className="font-medium text-brand-secondary">4.51 tCO2e</span></div>
                        <div><span className="text-muted-foreground">Scope:</span> <span className="font-medium text-brand-secondary">Scope 1</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1 rounded-2xl bg-gradient-to-br from-blue-50 to-violet-50 border border-slate-100 p-8 shadow-sm">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { framework: "CSRD", status: "Complete", progress: 87, color: "emerald" },
                      { framework: "GRI", status: "In Progress", progress: 64, color: "blue" },
                      { framework: "SASB", status: "Complete", progress: 92, color: "emerald" },
                      { framework: "ISSB", status: "Not Started", progress: 0, color: "slate" },
                    ].map((fw) => (
                      <div key={fw.framework} className="rounded-lg bg-white border border-slate-200 p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-bold text-brand-secondary">{fw.framework}</span>
                          <span className={`text-[10px] rounded-full px-2 py-0.5 font-medium ${
                            fw.color === "emerald" ? "bg-emerald-100 text-emerald-700" :
                            fw.color === "blue" ? "bg-blue-100 text-blue-700" :
                            "bg-slate-100 text-slate-500"
                          }`}>{fw.status}</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100">
                          <div className={`h-full rounded-full ${
                            fw.color === "emerald" ? "bg-emerald-500" :
                            fw.color === "blue" ? "bg-blue-500" :
                            "bg-slate-300"
                          }`} style={{ width: `${fw.progress}%` }} />
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-2">{fw.progress}% complete</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-5">
                    <Globe className="h-6 w-6 text-brand-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-secondary mb-3">
                    Multi-Framework Compliance
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-5">
                    Enter your data once. Generate reports for any framework — CSRD,
                    GRI, SASB, or ISSB — from the same underlying dataset. No
                    duplicate work across frameworks.
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      "Track compliance progress per framework in real time",
                      "Pre-built templates aligned to latest standards",
                      "Auto-mapped disclosure requirements",
                      "Framework updates applied automatically as regulations evolve",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="h-12 w-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center mb-5">
                    <Shield className="h-6 w-6 text-brand-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-secondary mb-3">
                    Audit-Ready Traceability
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-5">
                    Every number in every report is linked directly to its source
                    document. When auditors ask &ldquo;where did this number come
                    from?&rdquo; — you have the answer in one click.
                  </p>
                  <ul className="space-y-2.5">
                    {[
                      "Complete audit log for every data point and change",
                      "One-click source document retrieval",
                      "Role-based access controls for your team",
                      "Immutable change history with timestamps and user attribution",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-emerald-50 border border-slate-100 p-8 shadow-sm">
                  <div className="space-y-3">
                    <div className="rounded-lg bg-white border border-slate-200 p-4 shadow-sm">
                      <p className="text-xs font-medium text-muted-foreground mb-3">Audit Trail — Emissions Entry #1247</p>
                      <div className="space-y-2">
                        {[
                          { action: "Created from document extraction", user: "AI Engine", time: "Mar 1, 10:23 AM" },
                          { action: "Reviewed and approved", user: "Sarah C.", time: "Mar 1, 2:15 PM" },
                          { action: "Included in CSRD Q1 Report", user: "System", time: "Mar 2, 9:00 AM" },
                        ].map((entry) => (
                          <div key={entry.time} className="flex items-start gap-2 text-[11px]">
                            <div className="h-1.5 w-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0" />
                            <div>
                              <p className="text-brand-secondary font-medium">{entry.action}</p>
                              <p className="text-muted-foreground">{entry.user} &middot; {entry.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional features grid */}
            <div className="mt-20 max-w-5xl mx-auto">
              <h3 className="text-xl font-bold text-brand-secondary text-center mb-10">
                Plus everything else you need
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Link2,
                    title: "QuickBooks Integration",
                    description: "Auto-import financial data. No manual data entry — transactions flow directly into emissions calculations.",
                  },
                  {
                    icon: BarChart3,
                    title: "Supply Chain Monitoring",
                    description: "Track supplier ESG risk scores. Monitor Scope 3 emissions across your entire supply chain.",
                  },
                  {
                    icon: Smartphone,
                    title: "Mobile-First Design",
                    description: "Capture receipts on the go. Upload documents and view dashboards from any device.",
                  },
                  {
                    icon: Zap,
                    title: "Emissions Calculator",
                    description: "Automated Scope 1, 2, and 3 calculations using EPA and DEFRA emission factors. Always up to date.",
                  },
                  {
                    icon: Lock,
                    title: "Enterprise-Grade Security",
                    description: "AES-256 encryption at rest, TLS 1.2+ in transit. Multi-tenant isolation and SOC 2 aligned controls.",
                  },
                  {
                    icon: Award,
                    title: "Compliance Dashboard",
                    description: "Real-time compliance scores per framework. See exactly what&apos;s complete, in progress, or missing.",
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="group rounded-xl p-6 border border-slate-100 hover:border-brand-primary/20 hover:shadow-lg transition-all duration-300 bg-white"
                  >
                    <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                      <feature.icon className="h-5 w-5 text-brand-primary group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="text-base font-bold text-brand-secondary mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof — Metrics + Testimonials */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-6">
              <span className="inline-block rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary uppercase tracking-wider mb-4">
                Results
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4">
                Trusted by Teams That Take Compliance Seriously
              </h2>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center mb-20">
              {[
                { value: "50,000+", label: "Data points processed" },
                { value: "93%", label: "Faster reporting" },
                { value: "99.2%", label: "Extraction accuracy" },
                { value: "4.9/5", label: "Customer satisfaction" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
                  <p className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-emerald-500">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-brand-primary bg-brand-primary/10 rounded-full px-3 py-1">
                      {t.metric}
                    </span>
                  </div>
                  <p className="text-sm text-brand-secondary mb-6 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-5 border-t border-slate-100">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-emerald-500 text-sm font-bold text-white">
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

        {/* Pricing Preview */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <span className="inline-block rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary uppercase tracking-wider mb-4">
                Pricing
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-secondary mb-4">
                Professional-Grade Tools at SMB-Friendly Prices
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Transparent pricing. No hidden fees. No long-term contracts.
                Cancel anytime.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Base",
                  price: "$249",
                  period: "/month",
                  description: "For small teams getting started with ESG reporting",
                  features: [
                    "Up to 100 employees",
                    "1 compliance framework",
                    "1 admin user",
                    "5 suppliers tracked",
                    "50 documents/month",
                    "50 AI extractions/month",
                    "2 reports/year",
                    "Email support",
                  ],
                  highlighted: false,
                },
                {
                  name: "Professional",
                  price: "$399",
                  period: "/month",
                  description: "For growing companies with multiple reporting needs",
                  badge: "Most Popular",
                  features: [
                    "Up to 300 employees",
                    "3 compliance frameworks",
                    "3 admin users",
                    "25 suppliers tracked",
                    "200 documents/month",
                    "200 AI extractions/month",
                    "12 reports/year",
                    "QuickBooks integration",
                    "Priority email support",
                  ],
                  highlighted: true,
                },
                {
                  name: "Enterprise",
                  price: "$699",
                  period: "/month",
                  description: "For organizations needing full-scale compliance",
                  features: [
                    "Up to 500 employees",
                    "Unlimited frameworks",
                    "Unlimited admin users",
                    "Unlimited suppliers",
                    "Unlimited documents",
                    "Unlimited AI extractions",
                    "Unlimited reports",
                    "QuickBooks integration",
                    "Audit assistance",
                    "Priority + Slack support",
                  ],
                  highlighted: false,
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border p-8 ${
                    plan.highlighted
                      ? "border-brand-primary shadow-xl ring-2 ring-brand-primary/20 scale-[1.02]"
                      : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                  } transition-all bg-white`}
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
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                  <div className="mt-6 h-px bg-slate-100" />
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <Check className="h-4 w-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`mt-8 flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
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
                className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-primary/80 transition-colors"
              >
                Compare all plan features in detail
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
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-100 bg-white p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-brand-secondary mb-2">
                        {faq.q}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
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
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-brand-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-brand-primary/5 blur-3xl" />
          </div>
          <div className="container relative mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Ready to Simplify ESG Compliance?
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
              Join hundreds of companies that trust GreenLedger for their ESG
              reporting needs. Set up in minutes. Generate your first report today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-brand-primary px-8 py-3.5 text-base font-semibold text-white hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/25 hover:-translate-y-0.5"
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
            <p className="mt-6 text-sm text-slate-400">
              Questions? Email us at greenledger@arisolutionsinc.com
            </p>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

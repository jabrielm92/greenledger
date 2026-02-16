import Link from "next/link";
import { Leaf, ArrowRight, FileText, BarChart3, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-brand-primary" />
            <span className="text-xl font-bold text-brand-secondary">
              GreenLedger
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-brand-primary hover:text-brand-primary/80"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary/90 transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm text-muted-foreground mb-6">
              <Leaf className="mr-2 h-4 w-4 text-brand-primary" />
              ESG compliance on autopilot
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-brand-secondary max-w-3xl mx-auto">
              ESG Reporting Made{" "}
              <span className="text-brand-primary">Simple</span> for Growing
              Businesses
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform complex regulatory requirements into simple workflows.
              AI-powered data extraction, emissions calculation, and compliance
              reporting — all in under 10 minutes.
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
                href="/about"
                className="inline-flex items-center justify-center rounded-md border border-input px-6 py-3 text-base font-medium hover:bg-accent transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-brand-secondary mb-12">
              Everything you need for ESG compliance
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="h-10 w-10 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-5 w-5 text-brand-primary" />
                </div>
                <h3 className="text-lg font-semibold text-brand-secondary mb-2">
                  AI Document Extraction
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload utility bills, invoices, and receipts. Our AI extracts
                  the data you need for emissions reporting automatically.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="h-10 w-10 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-5 w-5 text-brand-primary" />
                </div>
                <h3 className="text-lg font-semibold text-brand-secondary mb-2">
                  Emissions Calculator
                </h3>
                <p className="text-sm text-muted-foreground">
                  Scope 1 & 2 emissions calculated automatically using
                  EPA and DEFRA emission factors with full audit trail.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <div className="h-10 w-10 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-5 w-5 text-brand-primary" />
                </div>
                <h3 className="text-lg font-semibold text-brand-secondary mb-2">
                  Compliance Reports
                </h3>
                <p className="text-sm text-muted-foreground">
                  Generate CSRD-ready reports with AI. Audit-ready from day one,
                  with every data point traceable to its source document.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-brand-primary" />
            <span className="text-sm font-semibold text-brand-secondary">
              GreenLedger
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GreenLedger. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

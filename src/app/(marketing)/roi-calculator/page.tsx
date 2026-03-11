"use client";

import { useState } from "react";
import {
  Calculator,
  Clock,
  DollarSign,
  FileCheck,
  ArrowRight,
  Check,
} from "lucide-react";

type CompanySize = "1-50" | "50-100" | "100-250" | "250-500";
type CurrentMethod = "manual" | "consultant" | "enterprise";

interface FormData {
  companySize: CompanySize;
  currentMethod: CurrentMethod;
  frameworks: number;
  reportsPerYear: number;
}

interface Results {
  currentCost: number;
  greenLedgerCost: number;
  savings: number;
  percentageSaved: number;
  hoursSaved: number;
}

const baseCosts: Record<CurrentMethod, Record<CompanySize, number>> = {
  manual: {
    "1-50": 15000,
    "50-100": 28000,
    "100-250": 47000,
    "250-500": 82000,
  },
  consultant: {
    "1-50": 25000,
    "50-100": 42000,
    "100-250": 68000,
    "250-500": 125000,
  },
  enterprise: {
    "1-50": 30000,
    "50-100": 55000,
    "100-250": 95000,
    "250-500": 150000,
  },
};

export default function ROICalculatorPage() {
  const [formData, setFormData] = useState<FormData>({
    companySize: "50-100",
    currentMethod: "manual",
    frameworks: 1,
    reportsPerYear: 2,
  });

  const [results, setResults] = useState<Results | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const calculateROI = () => {
    const currentCost = baseCosts[formData.currentMethod][formData.companySize];
    const frameworkMultiplier = formData.frameworks > 1 ? 1.4 : 1;
    const reportMultiplier = formData.reportsPerYear > 4 ? 1.3 : 1;

    const totalCurrentCost = Math.round(
      currentCost * frameworkMultiplier * reportMultiplier
    );

    const greenLedgerCost =
      formData.companySize === "250-500"
        ? 8388
        : formData.frameworks > 2
          ? 4788
          : 2988;

    const savings = totalCurrentCost - greenLedgerCost;
    const percentageSaved = Math.round((savings / totalCurrentCost) * 100);
    const hoursSaved = Math.round(totalCurrentCost / 50);

    setResults({
      currentCost: totalCurrentCost,
      greenLedgerCost,
      savings,
      percentageSaved,
      hoursSaved,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !results) return;

    setSubmitting(true);
    try {
      await fetch("/api/leads/roi-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          results,
          formData,
          timestamp: new Date().toISOString(),
        }),
      });
      setSubmitted(true);
    } catch {
      // Still redirect on error — don't block the user
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 mb-6">
            <Calculator className="mr-2 h-4 w-4" />
            Free ROI Calculator
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-secondary mb-4">
            Calculate Your ESG Compliance Costs
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how much you could save with GreenLedger vs. manual reporting,
            consultants, or enterprise platforms
          </p>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Company Size (Employees)
              </label>
              <select
                value={formData.companySize}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    companySize: e.target.value as CompanySize,
                  })
                }
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition"
              >
                <option value="1-50">1-50 employees</option>
                <option value="50-100">50-100 employees</option>
                <option value="100-250">100-250 employees</option>
                <option value="250-500">250-500 employees</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Current Reporting Method
              </label>
              <select
                value={formData.currentMethod}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentMethod: e.target.value as CurrentMethod,
                  })
                }
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition"
              >
                <option value="manual">
                  Manual (Spreadsheets + Staff Time)
                </option>
                <option value="consultant">External Consultant</option>
                <option value="enterprise">Enterprise Platform</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Number of Frameworks
              </label>
              <select
                value={formData.frameworks}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    frameworks: parseInt(e.target.value),
                  })
                }
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition"
              >
                <option value="1">1 Framework (e.g., CSRD only)</option>
                <option value="2">2 Frameworks (e.g., CSRD + GRI)</option>
                <option value="3">
                  3+ Frameworks (CSRD + GRI + SASB + ISSB)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Reports Per Year
              </label>
              <select
                value={formData.reportsPerYear}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    reportsPerYear: parseInt(e.target.value),
                  })
                }
                className="w-full border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition"
              >
                <option value="1">1 (Annual only)</option>
                <option value="2">2 (Annual + Mid-year)</option>
                <option value="4">4 (Quarterly)</option>
                <option value="12">12 (Monthly)</option>
              </select>
            </div>
          </div>

          <button
            onClick={calculateROI}
            className="w-full bg-brand-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-brand-primary/90 transition shadow-lg shadow-brand-primary/25"
          >
            Calculate My Savings
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-gradient-to-br from-brand-primary to-emerald-700 text-white rounded-2xl shadow-2xl p-6 sm:p-8 mb-8 animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
              Your Results
            </h2>

            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center">
                <p className="text-sm opacity-90 mb-2">Current Annual Cost</p>
                <p className="text-3xl sm:text-4xl font-bold">
                  ${results.currentCost.toLocaleString()}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-xl p-5 text-center">
                <p className="text-sm opacity-90 mb-2">GreenLedger Cost</p>
                <p className="text-3xl sm:text-4xl font-bold">
                  ${results.greenLedgerCost.toLocaleString()}
                </p>
                <p className="text-xs opacity-75 mt-1">per year</p>
              </div>

              <div className="bg-white rounded-xl p-5 text-center text-brand-primary">
                <p className="text-sm mb-2 font-semibold">You Save</p>
                <p className="text-3xl sm:text-4xl font-bold">
                  ${results.savings.toLocaleString()}
                </p>
                <p className="text-sm font-semibold mt-1">
                  ({results.percentageSaved}% reduction)
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">What This Means:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span>
                    Save approximately{" "}
                    <strong>{results.hoursSaved} hours</strong> of staff time
                    annually
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span>
                    Reduce compliance costs by{" "}
                    <strong>{results.percentageSaved}%</strong>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <FileCheck className="h-5 w-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                  <span>
                    Get audit-ready reports in <strong>minutes</strong>, not
                    weeks
                  </span>
                </li>
              </ul>
            </div>

            {/* Lead Capture Form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Get Your Free First Report
                </h3>
                <p className="text-muted-foreground mb-4">
                  Enter your email to receive a detailed breakdown + access to a
                  free trial
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@company.com"
                    required
                    className="flex-1 border-2 border-slate-200 rounded-lg px-4 py-3 focus:border-brand-primary focus:outline-none text-foreground"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-brand-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-primary/90 transition whitespace-nowrap disabled:opacity-60"
                  >
                    {submitting ? "Sending..." : "Claim Free Trial"}
                    {!submitting && <ArrowRight className="inline ml-2 h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  No credit card required. Set up in 10 minutes.
                </p>
              </form>
            ) : (
              <div className="bg-white rounded-xl p-6 text-center">
                <Check className="h-12 w-12 text-brand-primary mx-auto mb-3" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  You&apos;re all set!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Check your email for your detailed savings breakdown and free
                  trial access.
                </p>
                <a
                  href={`/register?email=${encodeURIComponent(email)}&source=roi-calculator`}
                  className="inline-flex items-center bg-brand-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-primary/90 transition"
                >
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Trust Signals */}
        <div className="text-center text-sm text-muted-foreground mt-8">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-brand-primary" />
              99.2% AI accuracy
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-brand-primary" />
              10-minute setup
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-brand-primary" />
              CSRD, GRI, SASB, ISSB
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-brand-primary" />
              Full audit trail
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

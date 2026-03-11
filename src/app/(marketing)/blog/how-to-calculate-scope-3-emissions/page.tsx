import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "How to Calculate Scope 3 Emissions Without a Consultant",
  description:
    "Learn to calculate Scope 3 emissions without expensive consultants. Includes step-by-step methods for all 15 categories, emission factors, and real examples. Save $15K+.",
  openGraph: {
    title: "How to Calculate Scope 3 Emissions Without a Consultant",
    description:
      "Step-by-step guide to calculating Scope 3 emissions across all 15 categories. Save $15K+ with practical methods.",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Calculate Scope 3 Emissions Without a Consultant",
    description:
      "Step-by-step guide to calculating Scope 3 emissions. Save $15K+ with practical methods.",
  },
  alternates: {
    canonical:
      "https://greenledger.arisolutionsinc.com/blog/how-to-calculate-scope-3-emissions",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Calculate Scope 3 Emissions Without a Consultant",
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

const categories = [
  {
    num: 1,
    name: "Purchased Goods & Services",
    desc: "Emissions from production of goods and services your company buys.",
    method:
      "Spend-based: Multiply purchase amounts by industry emission factors (e.g., $100K office supplies × 0.5 kg CO2e/$ = 50 tCO2e).",
    difficulty: "Medium",
  },
  {
    num: 2,
    name: "Capital Goods",
    desc: "Emissions from production of capital goods (equipment, buildings, vehicles).",
    method:
      "Spend-based: Similar to Category 1 but for capital expenditures. Amortize over useful life or report in year of purchase.",
    difficulty: "Medium",
  },
  {
    num: 3,
    name: "Fuel & Energy-Related Activities",
    desc: "Upstream emissions from fuel and energy not in Scope 1 or 2 (extraction, refining, transmission losses).",
    method:
      "Use well-to-tank (WTT) emission factors applied to your Scope 1 & 2 consumption data. Typically adds 10-20% to your Scope 1+2 total.",
    difficulty: "Easy",
  },
  {
    num: 4,
    name: "Upstream Transportation & Distribution",
    desc: "Emissions from transporting purchased goods from suppliers to your facilities.",
    method:
      "Distance-based: Weight (tonnes) × Distance (km) × Mode factor (e.g., road: 0.1 kg CO2e/tonne-km, air: 0.6 kg CO2e/tonne-km).",
    difficulty: "Medium",
  },
  {
    num: 5,
    name: "Waste Generated in Operations",
    desc: "Emissions from disposal and treatment of waste your company generates.",
    method:
      "Waste-type: Weight of waste (tonnes) × Disposal method factor (e.g., landfill: 0.58 tCO2e/tonne, recycling: 0.02 tCO2e/tonne).",
    difficulty: "Easy",
  },
  {
    num: 6,
    name: "Business Travel",
    desc: "Emissions from employee travel for business purposes (flights, hotels, rental cars).",
    method:
      "Distance-based: Flight miles × class factor + hotel nights × factor. Short-haul flight: 0.255 kg CO2e/km, long-haul: 0.195 kg CO2e/km.",
    difficulty: "Easy",
  },
  {
    num: 7,
    name: "Employee Commuting",
    desc: "Emissions from employees traveling between home and work.",
    method:
      "Survey-based: Survey employees on commute mode and distance. Apply factors per mode (car: 0.21 kg CO2e/km, bus: 0.089, train: 0.041).",
    difficulty: "Easy",
  },
  {
    num: 8,
    name: "Upstream Leased Assets",
    desc: "Emissions from operation of assets leased by your company (not in Scope 1 or 2).",
    method:
      "Asset-specific: Calculate energy use of leased spaces/equipment. Often already covered if you include all sites in Scope 1 & 2.",
    difficulty: "Low",
  },
  {
    num: 9,
    name: "Downstream Transportation & Distribution",
    desc: "Emissions from transporting sold products to customers.",
    method:
      "Similar to Category 4 but for outbound logistics. Use shipping records and carrier emission data.",
    difficulty: "Medium",
  },
  {
    num: 10,
    name: "Processing of Sold Products",
    desc: "Emissions from further processing of intermediate products by downstream companies.",
    method:
      "Relevant for manufacturers selling intermediate goods. Estimate processing energy per unit of product sold.",
    difficulty: "Hard",
  },
  {
    num: 11,
    name: "Use of Sold Products",
    desc: "Emissions from end-use of products your company sells.",
    method:
      "Product-specific: Estimate energy consumption during product lifetime × grid emission factor. Critical for electronics, vehicles, appliances.",
    difficulty: "Hard",
  },
  {
    num: 12,
    name: "End-of-Life Treatment of Sold Products",
    desc: "Emissions from disposal of products your company sells.",
    method:
      "Estimate product weight × disposal method emission factors. Similar approach to Category 5 but for your products.",
    difficulty: "Medium",
  },
  {
    num: 13,
    name: "Downstream Leased Assets",
    desc: "Emissions from operation of assets you lease to others.",
    method:
      "Calculate energy consumption of leased assets. Applies if you're a landlord or lease equipment to others.",
    difficulty: "Low",
  },
  {
    num: 14,
    name: "Franchises",
    desc: "Emissions from operation of franchises.",
    method:
      "Aggregate Scope 1 & 2 emissions from all franchise locations. Applies only to franchisors.",
    difficulty: "Medium",
  },
  {
    num: 15,
    name: "Investments",
    desc: "Emissions associated with your company's investments and financing activities.",
    method:
      "Proportional: Investment amount / investee's total equity × investee's emissions. Primarily relevant for financial institutions.",
    difficulty: "Hard",
  },
];

export default function Scope3Guide() {
  return (
    <>
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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
              Tutorial
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-secondary mb-6 leading-tight">
              How to Calculate Scope 3 Emissions Without a Consultant
              (Step-by-Step Guide)
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                March 11, 2026
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                15 min read
              </span>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-slate prose-lg max-w-none prose-headings:text-brand-secondary prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline">
            <p className="lead text-xl text-muted-foreground">
              Scope 3 emissions typically represent 70-90% of a company&apos;s total carbon footprint, yet
              they&apos;re the most challenging to calculate. Consultants charge $15K+ for this work alone.
              This guide shows you how to do it yourself.
            </p>

            <section>
              <h2>What Are Scope 3 Emissions?</h2>
              <p>
                Scope 3 emissions are all indirect emissions that occur in your company&apos;s value chain —
                both upstream (your suppliers) and downstream (your customers). The GHG Protocol defines
                15 categories of Scope 3 emissions.
              </p>
              <p>
                Unlike Scope 1 (direct emissions from your operations) and Scope 2 (purchased electricity),
                Scope 3 covers everything else: the emissions embedded in the products you buy, the
                transportation of goods, business travel, employee commuting, and how customers use and
                dispose of your products.
              </p>
            </section>

            <section>
              <h2>Why Scope 3 is Hardest to Calculate (But Most Important)</h2>
              <p>Three factors make Scope 3 uniquely challenging:</p>
              <ol>
                <li>
                  <strong>Data availability:</strong> You depend on third parties (suppliers, logistics providers)
                  for much of the data. Response rates to data requests average just 30%
                </li>
                <li>
                  <strong>Boundary setting:</strong> Deciding what to include and exclude requires judgment calls
                  that can dramatically change your total
                </li>
                <li>
                  <strong>Methodology choices:</strong> Each category can be calculated using different methods
                  (spend-based, activity-based, hybrid), each with different accuracy levels
                </li>
              </ol>
              <p>
                Despite these challenges, Scope 3 is essential for CSRD, GRI, and ISSB compliance. Skipping
                it is not an option.
              </p>
            </section>

            <section>
              <h2>Data You&apos;ll Need to Collect</h2>
              <p>Before you start calculating, gather these data sources:</p>
              <ul>
                <li><strong>Procurement records:</strong> Purchase orders, invoices, spend data by category</li>
                <li><strong>Logistics data:</strong> Shipping records, freight bills, distances, weights</li>
                <li><strong>Travel records:</strong> Flight bookings, expense reports, mileage logs</li>
                <li><strong>Waste records:</strong> Waste disposal invoices, recycling reports</li>
                <li><strong>Employee data:</strong> Headcount, office locations, commute survey results</li>
                <li><strong>Product data:</strong> Sales volumes, product weights, energy consumption specs</li>
              </ul>
            </section>

            {/* Mid-article CTA */}
            <div className="not-prose bg-gradient-to-r from-brand-primary to-emerald-600 text-white rounded-xl p-6 my-10">
              <h3 className="text-xl font-bold mb-2">
                Skip the manual work — calculate all 15 categories automatically
              </h3>
              <p className="text-sm opacity-90 mb-4">
                GreenLedger&apos;s AI extracts data from your documents and calculates Scope 3 emissions across
                all applicable categories.
              </p>
              <Link
                href="/register?source=scope3-blog"
                className="inline-flex items-center bg-white text-brand-primary px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition"
              >
                Get Your Free Scope 3 Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <section>
              <h2>The 15 Scope 3 Categories Explained</h2>
              <p>
                Here&apos;s a practical breakdown of each category, including the calculation method most suitable
                for SMBs:
              </p>
            </section>
          </div>

          {/* Categories Grid */}
          <div className="space-y-4 my-10">
            {categories.map((cat) => (
              <div
                key={cat.num}
                className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-brand-primary font-bold text-sm">
                    {cat.num}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-brand-secondary">
                        {cat.name}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          cat.difficulty === "Easy"
                            ? "bg-green-50 text-green-700"
                            : cat.difficulty === "Medium"
                              ? "bg-yellow-50 text-yellow-700"
                              : cat.difficulty === "Hard"
                                ? "bg-red-50 text-red-700"
                                : "bg-slate-50 text-slate-600"
                        }`}
                      >
                        {cat.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {cat.desc}
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold text-brand-secondary">
                        How to calculate:{" "}
                      </span>
                      {cat.method}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Remaining Content */}
          <div className="prose prose-slate prose-lg max-w-none prose-headings:text-brand-secondary prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline">
            <section>
              <h2>Common Calculation Mistakes</h2>
              <ul>
                <li>
                  <strong>Double counting:</strong> Ensuring Scope 3 categories don&apos;t overlap with your Scope 1
                  and 2 boundaries
                </li>
                <li>
                  <strong>Using global averages when regional data exists:</strong> Emission factors vary
                  significantly by region — US electricity grid factors differ dramatically from EU factors
                </li>
                <li>
                  <strong>Ignoring upstream energy emissions (Category 3):</strong> Many companies forget the
                  well-to-tank emissions of their Scope 1 &amp; 2 energy sources
                </li>
                <li>
                  <strong>Not documenting assumptions:</strong> Auditors need to understand your methodology.
                  Document every assumption and data gap
                </li>
                <li>
                  <strong>Mixing calculation methods inconsistently:</strong> Pick one primary method per category
                  and apply it consistently year over year
                </li>
              </ul>
            </section>

            <section>
              <h2>How to Estimate When Exact Data is Unavailable</h2>
              <p>
                Perfect data doesn&apos;t exist. Here are accepted estimation approaches:
              </p>
              <ol>
                <li>
                  <strong>Spend-based method:</strong> Use financial spend data and industry-average emission
                  factors. Least accurate but most practical for getting started
                </li>
                <li>
                  <strong>Average-data method:</strong> Use industry averages for specific activities (e.g.,
                  average emissions per tonne of steel produced)
                </li>
                <li>
                  <strong>Hybrid method:</strong> Combine supplier-specific data (where available) with
                  industry averages (for gaps). Most common approach
                </li>
                <li>
                  <strong>Supplier-specific method:</strong> Collect actual emissions data from each supplier.
                  Most accurate but hardest to obtain
                </li>
              </ol>
              <p>
                The key principle: <strong>it&apos;s better to estimate than to exclude</strong>. Start with
                spend-based calculations and improve data quality over time.
              </p>
            </section>
          </div>

          {/* End CTA */}
          <div className="mt-12 bg-gradient-to-br from-brand-primary to-emerald-700 text-white rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">
              Calculate All 15 Categories Automatically
            </h2>
            <p className="text-sm opacity-90 mb-6 max-w-lg mx-auto">
              GreenLedger automates Scope 3 calculations using your existing
              documents. Get your free report in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register?source=scope3-blog"
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

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — ESG Compliance Resources & Guides",
  description:
    "Expert guides on CSRD compliance, ESG reporting, Scope 3 emissions, and sustainability frameworks for small and medium businesses.",
  openGraph: {
    title: "GreenLedger Blog — ESG Compliance Resources & Guides",
    description:
      "Expert guides on CSRD compliance, ESG reporting, and sustainability frameworks for SMBs.",
    type: "website",
  },
};

const articles = [
  {
    slug: "csrd-compliance-guide-small-business",
    title: "CSRD Compliance Guide for Small Businesses (2026)",
    description:
      "Complete guide to CSRD compliance for SMBs. Learn requirements, deadlines, penalties, and how to automate your reporting.",
    date: "2026-03-11",
    readTime: "12 min read",
    category: "Compliance Guide",
  },
  {
    slug: "how-to-calculate-scope-3-emissions",
    title: "How to Calculate Scope 3 Emissions Without a Consultant",
    description:
      "Step-by-step guide to calculating Scope 3 emissions across all 15 categories. Save $15K+ with practical methods and free tools.",
    date: "2026-03-11",
    readTime: "15 min read",
    category: "Tutorial",
  },
];

export default function BlogPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-secondary mb-4">
            ESG Compliance Resources
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practical guides, tutorials, and insights to help your business
            navigate ESG compliance requirements.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 overflow-hidden"
            >
              <div className="p-6 sm:p-8">
                <div className="inline-block text-xs font-semibold text-brand-primary bg-emerald-50 px-3 py-1 rounded-full mb-4">
                  {article.category}
                </div>
                <h2 className="text-xl font-bold text-brand-secondary mb-3 group-hover:text-brand-primary transition-colors">
                  {article.title}
                </h2>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {article.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(article.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {article.readTime}
                  </span>
                </div>
                <span className="inline-flex items-center text-sm font-semibold text-brand-primary mt-4 group-hover:gap-2 transition-all">
                  Read article
                  <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Leaf, Shield, BookOpen, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-brand-secondary mb-4">
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10">
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
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
                <Shield className="h-6 w-6 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold text-brand-secondary mb-2">
                Audit-Grade Accuracy
              </h3>
              <p className="text-sm text-muted-foreground">
                Every data point is traceable to its source document. We build
                for auditors first, because trust is non-negotiable.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
                <BookOpen className="h-6 w-6 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold text-brand-secondary mb-2">
                Regulatory Expertise
              </h3>
              <p className="text-sm text-muted-foreground">
                Our team tracks CSRD, GRI, SASB, and ISSB framework changes so
                you don&apos;t have to. Your reports stay compliant as
                regulations evolve.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
                <Users className="h-6 w-6 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold text-brand-secondary mb-2">
                Built for SMBs
              </h3>
              <p className="text-sm text-muted-foreground">
                Not a watered-down enterprise tool. Purpose-built for teams of
                10 to 500 with pricing and workflows that make sense at your
                scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team placeholder */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-brand-secondary mb-4">
            Our Team
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            We&apos;re a team of sustainability experts, engineers, and former
            auditors building the tools we wish existed.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { name: "Alex Thornton", role: "CEO & Co-Founder" },
              { name: "Maria Santos", role: "CTO & Co-Founder" },
              { name: "James Park", role: "Head of Sustainability" },
            ].map((member) => (
              <div key={member.name} className="rounded-lg border bg-white p-6">
                <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-slate-200" />
                <p className="text-sm font-semibold text-brand-secondary">
                  {member.name}
                </p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact info */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-brand-secondary mb-4">
            Get in Touch
          </h2>
          <p className="text-muted-foreground mb-2">
            Have questions? We&apos;d love to hear from you.
          </p>
          <p className="text-sm text-brand-primary font-medium">
            hello@greenledger.io
          </p>
        </div>
      </section>
    </div>
  );
}

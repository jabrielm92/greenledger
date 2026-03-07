// ============================================
// FRAMEWORK GUIDANCE CONTENT
// Written from the perspective of an ESG consultant
// advising SMEs on compliance obligations.
// ============================================

export interface FrameworkGuide {
  id: string;
  name: string;
  fullName: string;
  tagline: string;
  what: string;
  why: (ctx: OrgContext) => string;
  how: string[];
  deadlines: string[];
  mandatoryFor: string[];
  voluntaryFor: string[];
  keyTopics: string[];
  greenledgerHelps: string[];
  industryNotes: Partial<Record<string, string>>;
}

export interface OrgContext {
  country: string | null;
  industry: string | null;
  employeeCount: number | null;
  companyName: string | null;
}

const UK_MANDATORY_NOTE =
  "The UK is adopting ISSB-aligned UK Sustainability Disclosure Standards (UK SDS). " +
  "Large UK companies and listed entities will be required to report under these standards. " +
  "Starting preparation now is strongly recommended to ensure readiness.";

export const FRAMEWORK_GUIDES: FrameworkGuide[] = [
  {
    id: "CSRD",
    name: "CSRD / ESRS",
    fullName: "Corporate Sustainability Reporting Directive (EU)",
    tagline: "The EU's flagship sustainability reporting regulation",
    what:
      "The CSRD requires companies operating in the EU to disclose detailed environmental, social, and governance (ESG) data using the European Sustainability Reporting Standards (ESRS). " +
      "It replaces the older Non-Financial Reporting Directive (NFRD) and dramatically expands the scope of companies covered — from roughly 11,000 to nearly 50,000 across the EU.",
    why: (ctx) => {
      if (isEU(ctx.country)) {
        return (
          "As an EU-based company, CSRD compliance is likely mandatory for your organisation. " +
          "Non-compliance can result in fines, reputational damage, and exclusion from public procurement. " +
          "Beyond compliance, CSRD reporting builds investor confidence and strengthens your supply chain relationships."
        );
      }
      if (ctx.country === "GB") {
        return (
          "While the UK has its own reporting regime, many UK companies with EU subsidiaries or EU-listed securities " +
          "fall within CSRD scope. If your business operates in the EU single market, you may need to comply. " +
          "Understanding CSRD also helps align with upcoming UK SDS requirements."
        );
      }
      return (
        "Even if your company is not EU-based, CSRD may apply if you have EU subsidiaries, generate significant " +
        "EU revenue (over EUR 150M), or are part of EU supply chains. Many global companies are proactively " +
        "aligning with CSRD to satisfy EU clients and investors."
      );
    },
    how: [
      "Conduct a double materiality assessment to identify which ESRS topics are material to your business",
      "Map your existing data collection to ESRS disclosure requirements (E1-E5, S1-S4, G1)",
      "Set up scope 1, 2, and 3 emissions tracking aligned with ESRS E1",
      "Establish governance structures and assign ESG reporting responsibilities",
      "Prepare for limited assurance on sustainability statements from an approved auditor",
    ],
    deadlines: [
      "FY 2024 (reporting in 2025): Large public-interest entities with 500+ employees",
      "FY 2025 (reporting in 2026): Large companies meeting 2 of 3 criteria (250+ employees, EUR 50M+ revenue, EUR 25M+ assets)",
      "FY 2026 (reporting in 2027): Listed SMEs (with opt-out possible until 2028)",
      "FY 2028 (reporting in 2029): Non-EU companies with EUR 150M+ EU revenue",
    ],
    mandatoryFor: ["EU member states", "Non-EU companies with significant EU operations"],
    voluntaryFor: ["Companies outside EU with no EU nexus"],
    keyTopics: [
      "Double materiality assessment",
      "Climate change (ESRS E1)",
      "Pollution (ESRS E2)",
      "Biodiversity (ESRS E3)",
      "Workforce conditions (ESRS S1)",
      "Business conduct (ESRS G1)",
    ],
    greenledgerHelps: [
      "Automated emissions data collection across all three scopes, mapped to ESRS E1 requirements",
      "AI-powered document extraction that categorises utility bills, invoices, and supplier data into ESRS-aligned metrics",
      "Pre-built CSRD report templates that structure your disclosures by ESRS topic",
      "Supplier ESG risk scoring to support value chain (Scope 3) disclosures",
      "Audit-ready data trail with full provenance tracking for assurance readiness",
    ],
    industryNotes: {
      MANUFACTURING:
        "Manufacturing companies face heightened scrutiny under ESRS E1 (climate) and E2 (pollution). Your Scope 1 emissions from combustion and process emissions are a priority.",
      CONSTRUCTION:
        "Construction falls under high-impact sectors. Pay close attention to ESRS E1 transition plans and ESRS E3 biodiversity impact from land use.",
      ENERGY:
        "Energy companies are among the first expected to report. ESRS E1 climate transition plans and Scope 1 disclosures are critical.",
      FOOD_BEVERAGE:
        "Food & beverage companies should focus on ESRS E1 (supply chain emissions), E3 (biodiversity/land use), and S1 (workforce in agricultural supply chains).",
    },
  },
  {
    id: "GRI",
    name: "GRI Standards",
    fullName: "Global Reporting Initiative Standards",
    tagline: "The world's most widely used sustainability reporting framework",
    what:
      "The GRI Standards provide a comprehensive, modular framework for organisations to report on their economic, environmental, and social impacts. " +
      "Used by over 10,000 organisations in 100+ countries, GRI is the global baseline for sustainability reporting. " +
      "GRI 2021 introduced the concept of impact materiality — reporting on how your company affects people and the planet.",
    why: (ctx) => {
      if (ctx.country === "GB") {
        return (
          "Many UK companies use GRI as a voluntary best practice framework, especially for annual sustainability reports. " +
          "GRI disclosures complement the upcoming mandatory UK SDS reporting and demonstrate leadership to stakeholders. " +
          "If you work with public sector clients, GRI reporting can strengthen your position in procurement."
        );
      }
      return (
        "GRI is the most recognised sustainability reporting framework globally. " +
        "It is particularly valuable for companies wanting to communicate their ESG performance to a broad stakeholder base — " +
        "including customers, employees, investors, and civil society. Many RFPs and tenders now request GRI-aligned disclosures."
      );
    },
    how: [
      "Define your reporting scope and boundaries using GRI 1: Foundation 2021",
      "Conduct a stakeholder-inclusive materiality assessment to prioritise topics",
      "Select the relevant GRI Topic Standards (e.g., GRI 302: Energy, GRI 305: Emissions, GRI 306: Waste)",
      "Collect quantitative data and qualitative context for each material topic",
      "Publish a GRI Content Index mapping your disclosures to specific GRI standards",
    ],
    deadlines: [
      "No mandatory deadline — GRI is voluntary",
      "Most companies report annually, aligned with their financial year",
      "Consider publishing within 3-4 months of fiscal year end for timeliness",
    ],
    mandatoryFor: ["Some jurisdictions require GRI-aligned reporting (e.g., EU CSRD accepts GRI interoperability)"],
    voluntaryFor: ["Global — all industries and sizes"],
    keyTopics: [
      "Energy consumption (GRI 302)",
      "GHG emissions (GRI 305)",
      "Waste management (GRI 306)",
      "Employment practices (GRI 401)",
      "Diversity & equal opportunity (GRI 405)",
      "Anti-corruption (GRI 205)",
    ],
    greenledgerHelps: [
      "Automated data collection maps directly to GRI 302 (Energy) and GRI 305 (Emissions) indicators",
      "Document AI extracts utility and waste data aligned with GRI 306 disclosure requirements",
      "Generate GRI Content Index automatically from your tracked metrics",
      "Industry-specific materiality suggestions based on your sector",
      "Export GRI-formatted reports ready for publication or stakeholder review",
    ],
    industryNotes: {
      PROFESSIONAL_SERVICES:
        "Professional services firms typically focus on GRI 305 (Scope 2 from offices), GRI 302 (energy), and GRI 401 (employment). Your Scope 3 business travel may be the largest emissions source.",
      RETAIL:
        "Retail companies should pay attention to GRI 305 (supply chain emissions), GRI 306 (packaging waste), and GRI 414 (supplier social assessment).",
      TECHNOLOGY:
        "Tech companies should focus on GRI 302 (data centre energy), GRI 305 (Scope 2 electricity), and GRI 418 (customer privacy).",
    },
  },
  {
    id: "SASB",
    name: "SASB Standards",
    fullName: "Sustainability Accounting Standards Board Standards",
    tagline: "Industry-specific ESG metrics for investors",
    what:
      "SASB Standards identify the subset of ESG issues most relevant to financial performance in 77 industries. " +
      "Unlike GRI's stakeholder focus, SASB is designed for investors — it helps companies disclose the sustainability " +
      "information that is financially material. SASB is now maintained by the IFRS Foundation alongside the ISSB standards.",
    why: (ctx) => {
      const industryNote = ctx.industry
        ? ` As a ${formatIndustry(ctx.industry)} company, SASB has specific metrics tailored to your sector's material ESG risks.`
        : "";
      if (ctx.country === "GB") {
        return (
          "UK investors increasingly expect SASB-aligned disclosures. SASB's industry-specific approach helps you " +
          "communicate financially material ESG risks in a language investors understand." +
          industryNote +
          " SASB also aligns closely with ISSB standards being adopted as UK SDS."
        );
      }
      return (
        "SASB disclosures help attract ESG-focused investors and meet growing demands from asset managers. " +
        "Many institutional investors (BlackRock, Vanguard, State Street) explicitly request SASB-aligned reporting." +
        industryNote
      );
    },
    how: [
      "Identify your SASB industry classification (from the 77 industry standards)",
      "Review the disclosure topics and metrics specific to your industry",
      "Assess which metrics are financially material to your company",
      "Collect quantitative data for each material metric",
      "Disclose in your annual report, investor presentations, or standalone SASB report",
    ],
    deadlines: [
      "No mandatory deadline — SASB is voluntary",
      "Typically disclosed alongside annual financial reporting",
      "Many companies include SASB tables in proxy statements or 10-K filings",
    ],
    mandatoryFor: ["No direct mandate, but increasingly expected by institutional investors"],
    voluntaryFor: ["Global — especially useful for companies seeking investment"],
    keyTopics: [
      "Industry-specific GHG emissions metrics",
      "Energy management",
      "Water & wastewater management",
      "Physical & transition climate risks",
      "Human capital management",
      "Business model resilience",
    ],
    greenledgerHelps: [
      "Auto-maps your emissions data to SASB industry-specific metrics",
      "AI identifies which SASB disclosure topics are material based on your industry selection",
      "Pre-populated SASB reporting templates for your specific industry sector",
      "Quantitative metrics tracking aligned with SASB measurement methodology",
      "Side-by-side SASB and ISSB reporting to maximise disclosure efficiency",
    ],
    industryNotes: {
      MANUFACTURING:
        "SASB's Resource Transformation sector covers manufacturing. Key metrics include energy intensity, hazardous waste, and product lifecycle impacts.",
      HEALTHCARE:
        "Healthcare companies should focus on SASB metrics around drug safety, access to medicines, and energy intensity of facilities.",
      LOGISTICS:
        "Transportation & logistics SASB metrics emphasise fleet fuel efficiency, emissions intensity per tonne-km, and accident rates.",
      AGRICULTURE:
        "SASB's Food & Agriculture sector tracks water withdrawal, land use, and GHG emissions from agricultural operations.",
    },
  },
  {
    id: "ISSB",
    name: "ISSB (S1 & S2)",
    fullName: "IFRS Sustainability Disclosure Standards",
    tagline: "The emerging global baseline for sustainability and climate disclosure",
    what:
      "The International Sustainability Standards Board (ISSB) published IFRS S1 (General Sustainability Disclosures) and " +
      "IFRS S2 (Climate-related Disclosures) in June 2023. These standards create a global baseline for investor-focused " +
      "sustainability reporting, building on the TCFD recommendations. Over 20 jurisdictions are adopting or aligning with ISSB, " +
      "making it the fastest-growing mandatory framework globally.",
    why: (ctx) => {
      if (ctx.country === "GB") {
        return (
          "The UK Government has confirmed it will adopt ISSB-aligned UK Sustainability Disclosure Standards (UK SDS). " +
          "This means ISSB compliance will become mandatory for UK-listed companies and large private companies. " +
          "The FCA is expected to require UK SDS reporting for listed entities, with phased implementation beginning soon. " +
          "Starting your ISSB preparation now gives your company a significant head start and avoids last-minute scrambles."
        );
      }
      if (isEU(ctx.country)) {
        return (
          "While the EU primarily uses CSRD/ESRS, the ESRS standards have a high degree of interoperability with ISSB S1 and S2. " +
          "Companies reporting under CSRD can leverage their data to also satisfy ISSB requirements, which is valuable for global investor relations."
        );
      }
      if (ctx.country === "CA") {
        return (
          "Canada's CSA (Canadian Securities Administrators) is aligning national sustainability disclosure with ISSB. " +
          "Canadian listed companies should prepare for mandatory ISSB-based reporting."
        );
      }
      if (ctx.country === "JP") {
        return (
          "Japan's Financial Services Agency (JFSA) is incorporating ISSB standards into its disclosure framework. " +
          "Japanese listed companies should anticipate mandatory ISSB-aligned reporting."
        );
      }
      if (ctx.country === "SG") {
        return (
          "Singapore (SGX) is adopting ISSB-aligned climate reporting for listed companies. " +
          "Mandatory climate-related disclosures based on ISSB S2 are being phased in."
        );
      }
      return (
        "ISSB is rapidly becoming the global standard. Over 20 jurisdictions are adopting or aligning with it. " +
        "Even if not yet mandatory in your country, early adoption demonstrates leadership and prepares your company " +
        "for inevitable regulatory requirements."
      );
    },
    how: [
      "Assess your current TCFD/climate reporting maturity — ISSB S2 builds directly on TCFD's four pillars",
      "Identify sustainability-related risks and opportunities across your value chain (S1 requirement)",
      "Quantify Scope 1, 2, and 3 GHG emissions using the GHG Protocol (S2 requirement)",
      "Develop climate scenario analysis covering at least a 1.5°C and a high-warming scenario",
      "Establish governance processes for oversight of sustainability risks at board and management level",
      "Set and disclose climate-related targets with progress tracking metrics",
    ],
    deadlines: [
      "ISSB S1 & S2 are effective for annual periods beginning on or after 1 January 2024",
      "UK SDS: Expected phased adoption — listed companies first, then large private entities",
      "Canada: CSA consultation ongoing, expected mandatory adoption in 2025-2026",
      "Jurisdictions set their own timelines for mandatory adoption",
    ],
    mandatoryFor: [
      "UK (upcoming via UK SDS)",
      "Canada, Japan, Singapore, Australia, Nigeria, and others adopting ISSB",
      "Jurisdictions aligning national standards with ISSB baseline",
    ],
    voluntaryFor: ["Companies in jurisdictions not yet mandating ISSB — early adoption is encouraged"],
    keyTopics: [
      "Governance of sustainability risks (S1)",
      "Strategy and business model resilience (S1)",
      "Risk management processes (S1)",
      "Metrics and targets (S1 & S2)",
      "GHG emissions — Scope 1, 2, 3 (S2)",
      "Climate scenario analysis (S2)",
      "Transition plans (S2)",
    ],
    greenledgerHelps: [
      "Complete Scope 1, 2, and 3 emissions tracking aligned with GHG Protocol as required by ISSB S2",
      "AI-powered document extraction automatically categorises emissions data by scope and category",
      "Climate target tracking with progress dashboards to meet ISSB S2 metrics and targets requirements",
      "Pre-built ISSB S1/S2 report templates structured around the four TCFD pillars (Governance, Strategy, Risk Management, Metrics & Targets)",
      "Supplier emissions data collection to support Scope 3 value chain disclosures",
      "Audit-ready data with full traceability to satisfy assurance requirements",
    ],
    industryNotes: {
      ENERGY:
        "Energy companies are high-priority under ISSB S2. Climate transition plans, Scope 1 intensity metrics, and stranded asset analysis are critical disclosures.",
      MANUFACTURING:
        "Manufacturing companies should prioritise Scope 1 & 2 emissions quantification and develop transition plans for energy-intensive processes.",
      CONSTRUCTION:
        "Construction firms should focus on embodied carbon in materials (Scope 3), energy efficiency of buildings delivered, and climate physical risk exposure.",
      LOGISTICS:
        "Logistics companies face scrutiny on fleet emissions (Scope 1), fuel transition plans, and climate physical risk to infrastructure/routes.",
    },
  },
];

// ============================================
// HELPERS
// ============================================

const EU_COUNTRY_CODES = [
  "DE", "FR", "NL", "BE", "IT", "ES", "PT", "AT", "SE", "DK",
  "FI", "IE", "PL", "CZ",
];

function isEU(country: string | null): boolean {
  return !!country && EU_COUNTRY_CODES.includes(country);
}

function formatIndustry(industry: string): string {
  const map: Record<string, string> = {
    MANUFACTURING: "manufacturing",
    LOGISTICS: "logistics & transportation",
    PROFESSIONAL_SERVICES: "professional services",
    CONSTRUCTION: "construction",
    TECHNOLOGY: "technology",
    RETAIL: "retail",
    FOOD_BEVERAGE: "food & beverage",
    HEALTHCARE: "healthcare",
    ENERGY: "energy",
    AGRICULTURE: "agriculture",
    OTHER: "",
  };
  return map[industry] || industry.toLowerCase();
}

export function getRelevanceLevel(
  frameworkId: string,
  country: string | null,
  industry: string | null,
): "mandatory" | "recommended" | "optional" {
  if (frameworkId === "CSRD" && isEU(country)) return "mandatory";
  if (frameworkId === "CSRD" && country === "GB") return "recommended";
  if (frameworkId === "ISSB" && country === "GB") return "mandatory";
  if (frameworkId === "ISSB" && ["CA", "JP", "SG"].includes(country || "")) return "mandatory";
  if (frameworkId === "ISSB" && isEU(country)) return "recommended";
  if (frameworkId === "SASB" && ["US", "GB", "CA"].includes(country || "")) return "recommended";
  if (frameworkId === "GRI") return "recommended";

  // Industry-based signals
  if (frameworkId === "CSRD" && industry === "ENERGY") return "recommended";

  return "optional";
}

export function getUKComplianceBanner(country: string | null): string | null {
  if (country !== "GB") return null;
  return (
    "As a UK-based organisation, sustainability reporting is transitioning from voluntary to mandatory. " +
    "The UK Government is implementing UK Sustainability Disclosure Standards (UK SDS) aligned with ISSB S1 and S2. " +
    "Large companies and listed entities will be required to comply. We recommend prioritising ISSB preparation now, " +
    "complemented by GRI or SASB for broader stakeholder communication. GreenLedger tracks your data against all " +
    "applicable frameworks simultaneously, so you only enter data once."
  );
}

export function getRegulatorySummary(country: string | null): string {
  if (country === "GB") {
    return "UK SDS (ISSB-aligned) is becoming mandatory. The FCA will require climate disclosures from listed companies, with broader coverage expected.";
  }
  if (isEU(country)) {
    return "CSRD/ESRS reporting is mandatory for qualifying EU companies, with phased timelines from 2025 to 2029.";
  }
  if (country === "US") {
    return "The US landscape includes SEC climate rules (currently paused) and California SB-253/SB-261. Voluntary ISSB and SASB adoption is growing.";
  }
  if (country === "CA") {
    return "Canada is adopting ISSB-aligned standards through the CSA. Mandatory sustainability disclosures are expected for listed companies.";
  }
  return "Sustainability disclosure requirements are expanding globally. Proactive adoption of international frameworks positions your company ahead of regulation.";
}

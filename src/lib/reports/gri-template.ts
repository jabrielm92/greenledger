import type { ReportTemplate } from "@/types";

/**
 * GRI Standards Report Template (2021 revision)
 *
 * The Global Reporting Initiative (GRI) Standards are the most widely used
 * voluntary sustainability reporting framework. This template covers:
 * - GRI 2: General Disclosures (organization profile, governance, strategy)
 * - GRI 3: Material Topics (materiality assessment process)
 * - GRI 302: Energy (consumption, intensity, reduction)
 * - GRI 303: Water and Effluents
 * - GRI 305: Emissions (Scope 1/2/3, intensity, reduction)
 * - GRI 306: Waste (generation, disposal)
 * - GRI 308: Supplier Environmental Assessment
 * - GRI 401: Employment
 * - GRI 403: Occupational Health and Safety
 * - GRI 405: Diversity and Equal Opportunity
 */
export const GRI_TEMPLATE: ReportTemplate = {
  id: "GRI_2021",
  name: "GRI Standards Report",
  sections: [
    // ==========================================
    // UNIVERSAL STANDARDS
    // ==========================================
    {
      code: "GRI-2",
      title: "General Disclosures",
      required: true,
      subsections: [
        {
          code: "GRI-2-1",
          title: "Organizational Details",
          required: true,
        },
        {
          code: "GRI-2-2",
          title: "Entities Included in Sustainability Reporting",
          required: true,
        },
        {
          code: "GRI-2-3",
          title: "Reporting Period, Frequency and Contact Point",
          required: true,
        },
        {
          code: "GRI-2-6",
          title: "Activities, Value Chain and Other Business Relationships",
          required: true,
        },
        {
          code: "GRI-2-7",
          title: "Employees",
          required: true,
        },
        {
          code: "GRI-2-9",
          title: "Governance Structure and Composition",
          required: true,
        },
        {
          code: "GRI-2-22",
          title: "Statement on Sustainable Development Strategy",
          required: true,
        },
        {
          code: "GRI-2-27",
          title: "Compliance with Laws and Regulations",
          required: true,
        },
        {
          code: "GRI-2-29",
          title: "Approach to Stakeholder Engagement",
          required: false,
        },
      ],
    },
    {
      code: "GRI-3",
      title: "Material Topics",
      required: true,
      subsections: [
        {
          code: "GRI-3-1",
          title: "Process to Determine Material Topics",
          required: true,
        },
        {
          code: "GRI-3-2",
          title: "List of Material Topics",
          required: true,
        },
        {
          code: "GRI-3-3",
          title: "Management of Material Topics",
          required: true,
        },
      ],
    },

    // ==========================================
    // ENVIRONMENTAL STANDARDS (GRI 300 series)
    // ==========================================
    {
      code: "GRI-302",
      title: "Energy",
      required: true,
      subsections: [
        {
          code: "GRI-302-1",
          title: "Energy Consumption Within the Organization",
          required: true,
        },
        {
          code: "GRI-302-2",
          title: "Energy Consumption Outside of the Organization",
          required: false,
        },
        {
          code: "GRI-302-3",
          title: "Energy Intensity",
          required: false,
        },
        {
          code: "GRI-302-4",
          title: "Reduction of Energy Consumption",
          required: false,
        },
      ],
    },
    {
      code: "GRI-303",
      title: "Water and Effluents",
      required: false,
      subsections: [
        {
          code: "GRI-303-1",
          title: "Interactions with Water as a Shared Resource",
          required: false,
        },
        {
          code: "GRI-303-3",
          title: "Water Withdrawal",
          required: false,
        },
        {
          code: "GRI-303-5",
          title: "Water Consumption",
          required: false,
        },
      ],
    },
    {
      code: "GRI-305",
      title: "Emissions",
      required: true,
      subsections: [
        {
          code: "GRI-305-1",
          title: "Direct (Scope 1) GHG Emissions",
          required: true,
        },
        {
          code: "GRI-305-2",
          title: "Energy Indirect (Scope 2) GHG Emissions",
          required: true,
        },
        {
          code: "GRI-305-3",
          title: "Other Indirect (Scope 3) GHG Emissions",
          required: false,
        },
        {
          code: "GRI-305-4",
          title: "GHG Emissions Intensity",
          required: false,
        },
        {
          code: "GRI-305-5",
          title: "Reduction of GHG Emissions",
          required: false,
        },
        {
          code: "GRI-305-6",
          title: "Emissions of Ozone-Depleting Substances (ODS)",
          required: false,
        },
        {
          code: "GRI-305-7",
          title: "Nitrogen Oxides, Sulfur Oxides, and Other Significant Air Emissions",
          required: false,
        },
      ],
    },
    {
      code: "GRI-306",
      title: "Waste",
      required: false,
      subsections: [
        {
          code: "GRI-306-1",
          title: "Waste Generation and Significant Waste-Related Impacts",
          required: false,
        },
        {
          code: "GRI-306-2",
          title: "Management of Significant Waste-Related Impacts",
          required: false,
        },
        {
          code: "GRI-306-3",
          title: "Waste Generated",
          required: false,
        },
        {
          code: "GRI-306-4",
          title: "Waste Diverted from Disposal",
          required: false,
        },
        {
          code: "GRI-306-5",
          title: "Waste Directed to Disposal",
          required: false,
        },
      ],
    },
    {
      code: "GRI-308",
      title: "Supplier Environmental Assessment",
      required: false,
      subsections: [
        {
          code: "GRI-308-1",
          title: "New Suppliers Screened Using Environmental Criteria",
          required: false,
        },
        {
          code: "GRI-308-2",
          title: "Negative Environmental Impacts in the Supply Chain and Actions Taken",
          required: false,
        },
      ],
    },

    // ==========================================
    // SOCIAL STANDARDS (GRI 400 series)
    // ==========================================
    {
      code: "GRI-401",
      title: "Employment",
      required: false,
      subsections: [
        {
          code: "GRI-401-1",
          title: "New Employee Hires and Employee Turnover",
          required: false,
        },
        {
          code: "GRI-401-2",
          title: "Benefits Provided to Full-Time Employees",
          required: false,
        },
        {
          code: "GRI-401-3",
          title: "Parental Leave",
          required: false,
        },
      ],
    },
    {
      code: "GRI-403",
      title: "Occupational Health and Safety",
      required: false,
      subsections: [
        {
          code: "GRI-403-1",
          title: "Occupational Health and Safety Management System",
          required: false,
        },
        {
          code: "GRI-403-9",
          title: "Work-Related Injuries",
          required: false,
        },
        {
          code: "GRI-403-10",
          title: "Work-Related Ill Health",
          required: false,
        },
      ],
    },
    {
      code: "GRI-405",
      title: "Diversity and Equal Opportunity",
      required: false,
      subsections: [
        {
          code: "GRI-405-1",
          title: "Diversity of Governance Bodies and Employees",
          required: false,
        },
        {
          code: "GRI-405-2",
          title: "Ratio of Basic Salary and Remuneration of Women to Men",
          required: false,
        },
      ],
    },
  ],
};

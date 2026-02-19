import type { ReportTemplate } from "@/types";

/**
 * GRI Standards Report Template — Stub
 *
 * The Global Reporting Initiative (GRI) Standards are the most widely used
 * voluntary sustainability reporting framework. Full implementation is
 * planned for Phase 2; this stub establishes the structure.
 */
export const GRI_TEMPLATE: ReportTemplate = {
  id: "GRI_2021",
  name: "GRI Standards Report",
  sections: [
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
          code: "GRI-2-22",
          title: "Statement on Sustainable Development Strategy",
          required: true,
        },
        {
          code: "GRI-2-27",
          title: "Compliance with Laws and Regulations",
          required: true,
        },
      ],
    },
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
          code: "GRI-305-4",
          title: "GHG Emissions Intensity",
          required: false,
        },
        {
          code: "GRI-305-5",
          title: "Reduction of GHG Emissions",
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
          title: "Negative Environmental Impacts in Supply Chain",
          required: false,
        },
      ],
    },
  ],
};

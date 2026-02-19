import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedEmissionFactors() {
  console.log("Seeding emission factors...");

  const factors = [
    // ============================================
    // ELECTRICITY GRID FACTORS (Scope 2)
    // ============================================
    { category: "electricity", subcategory: "grid", region: "US", unit: "kgCO2e/kWh", co2ePerUnit: 0.417, co2PerUnit: 0.390, ch4PerUnit: 0.012, n2oPerUnit: 0.015, source: "EPA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "US-CA", unit: "kgCO2e/kWh", co2ePerUnit: 0.225, co2PerUnit: 0.210, ch4PerUnit: 0.007, n2oPerUnit: 0.008, source: "EPA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "US-TX", unit: "kgCO2e/kWh", co2ePerUnit: 0.396, co2PerUnit: 0.370, ch4PerUnit: 0.012, n2oPerUnit: 0.014, source: "EPA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "US-NY", unit: "kgCO2e/kWh", co2ePerUnit: 0.228, co2PerUnit: 0.213, ch4PerUnit: 0.007, n2oPerUnit: 0.008, source: "EPA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "US-FL", unit: "kgCO2e/kWh", co2ePerUnit: 0.415, co2PerUnit: 0.388, ch4PerUnit: 0.012, n2oPerUnit: 0.015, source: "EPA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "EU", unit: "kgCO2e/kWh", co2ePerUnit: 0.256, co2PerUnit: 0.240, ch4PerUnit: 0.008, n2oPerUnit: 0.008, source: "EEA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "GB", unit: "kgCO2e/kWh", co2ePerUnit: 0.207, co2PerUnit: 0.193, ch4PerUnit: 0.006, n2oPerUnit: 0.008, source: "DEFRA", year: 2025 },
    { category: "electricity", subcategory: "grid", region: "DE", unit: "kgCO2e/kWh", co2ePerUnit: 0.366, co2PerUnit: 0.343, ch4PerUnit: 0.011, n2oPerUnit: 0.012, source: "UBA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "FR", unit: "kgCO2e/kWh", co2ePerUnit: 0.052, co2PerUnit: 0.049, ch4PerUnit: 0.001, n2oPerUnit: 0.002, source: "ADEME", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "CA", unit: "kgCO2e/kWh", co2ePerUnit: 0.120, co2PerUnit: 0.112, ch4PerUnit: 0.004, n2oPerUnit: 0.004, source: "ECCC", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "NL", unit: "kgCO2e/kWh", co2ePerUnit: 0.328, co2PerUnit: 0.307, ch4PerUnit: 0.010, n2oPerUnit: 0.011, source: "EEA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "ES", unit: "kgCO2e/kWh", co2ePerUnit: 0.149, co2PerUnit: 0.139, ch4PerUnit: 0.005, n2oPerUnit: 0.005, source: "EEA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "IT", unit: "kgCO2e/kWh", co2ePerUnit: 0.257, co2PerUnit: 0.241, ch4PerUnit: 0.008, n2oPerUnit: 0.008, source: "EEA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "SE", unit: "kgCO2e/kWh", co2ePerUnit: 0.013, co2PerUnit: 0.012, ch4PerUnit: 0.000, n2oPerUnit: 0.001, source: "EEA", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "AU", unit: "kgCO2e/kWh", co2ePerUnit: 0.680, co2PerUnit: 0.636, ch4PerUnit: 0.020, n2oPerUnit: 0.024, source: "DEE", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "JP", unit: "kgCO2e/kWh", co2ePerUnit: 0.457, co2PerUnit: 0.428, ch4PerUnit: 0.013, n2oPerUnit: 0.016, source: "MOE", year: 2024 },
    { category: "electricity", subcategory: "grid", region: "IN", unit: "kgCO2e/kWh", co2ePerUnit: 0.708, co2PerUnit: 0.663, ch4PerUnit: 0.021, n2oPerUnit: 0.024, source: "CEA", year: 2024 },

    // ============================================
    // NATURAL GAS (Scope 1 - Stationary Combustion)
    // ============================================
    { category: "natural_gas", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/therm", co2ePerUnit: 5.31, co2PerUnit: 5.28, ch4PerUnit: 0.01, n2oPerUnit: 0.02, source: "EPA", year: 2024 },
    { category: "natural_gas", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/m3", co2ePerUnit: 2.02, co2PerUnit: 2.00, ch4PerUnit: 0.004, n2oPerUnit: 0.016, source: "EPA", year: 2024 },
    { category: "natural_gas", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/kWh", co2ePerUnit: 0.184, co2PerUnit: 0.183, ch4PerUnit: 0.0004, n2oPerUnit: 0.0006, source: "DEFRA", year: 2025 },
    { category: "natural_gas", subcategory: "combustion", region: "US", unit: "kgCO2e/MCF", co2ePerUnit: 53.06, co2PerUnit: 52.91, ch4PerUnit: 0.05, n2oPerUnit: 0.10, source: "EPA", year: 2024 },

    // ============================================
    // DIESEL (Scope 1)
    // ============================================
    { category: "diesel", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/liter", co2ePerUnit: 2.68, co2PerUnit: 2.65, ch4PerUnit: 0.01, n2oPerUnit: 0.02, source: "DEFRA", year: 2025 },
    { category: "diesel", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/gallon", co2ePerUnit: 10.15, co2PerUnit: 10.04, ch4PerUnit: 0.04, n2oPerUnit: 0.07, source: "EPA", year: 2024 },
    { category: "diesel", subcategory: "combustion", region: "US", unit: "kgCO2e/gallon", co2ePerUnit: 10.21, co2PerUnit: 10.10, ch4PerUnit: 0.04, n2oPerUnit: 0.07, source: "EPA", year: 2024 },

    // ============================================
    // GASOLINE / PETROL (Scope 1)
    // ============================================
    { category: "gasoline", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/liter", co2ePerUnit: 2.31, co2PerUnit: 2.29, ch4PerUnit: 0.008, n2oPerUnit: 0.012, source: "DEFRA", year: 2025 },
    { category: "gasoline", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/gallon", co2ePerUnit: 8.78, co2PerUnit: 8.70, ch4PerUnit: 0.03, n2oPerUnit: 0.05, source: "EPA", year: 2024 },
    { category: "gasoline", subcategory: "combustion", region: "US", unit: "kgCO2e/gallon", co2ePerUnit: 8.78, co2PerUnit: 8.70, ch4PerUnit: 0.03, n2oPerUnit: 0.05, source: "EPA", year: 2024 },

    // ============================================
    // LPG / PROPANE (Scope 1)
    // ============================================
    { category: "lpg", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/liter", co2ePerUnit: 1.56, co2PerUnit: 1.54, ch4PerUnit: 0.008, n2oPerUnit: 0.012, source: "DEFRA", year: 2025 },
    { category: "lpg", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/gallon", co2ePerUnit: 5.74, co2PerUnit: 5.68, ch4PerUnit: 0.03, n2oPerUnit: 0.03, source: "EPA", year: 2024 },

    // ============================================
    // FUEL OIL (Scope 1)
    // ============================================
    { category: "fuel_oil", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/liter", co2ePerUnit: 2.96, co2PerUnit: 2.93, ch4PerUnit: 0.01, n2oPerUnit: 0.02, source: "DEFRA", year: 2025 },
    { category: "fuel_oil", subcategory: "combustion", region: "GLOBAL", unit: "kgCO2e/gallon", co2ePerUnit: 11.24, co2PerUnit: 11.13, ch4PerUnit: 0.04, n2oPerUnit: 0.07, source: "EPA", year: 2024 },

    // ============================================
    // MOBILE COMBUSTION - DISTANCE (Scope 1)
    // ============================================
    { category: "vehicle", subcategory: "average_car", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.171, co2PerUnit: 0.170, ch4PerUnit: 0.0005, n2oPerUnit: 0.0005, source: "DEFRA", year: 2025 },
    { category: "vehicle", subcategory: "average_car", region: "GLOBAL", unit: "kgCO2e/mile", co2ePerUnit: 0.275, co2PerUnit: 0.273, ch4PerUnit: 0.001, n2oPerUnit: 0.001, source: "EPA", year: 2024 },
    { category: "vehicle", subcategory: "small_car", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.139, co2PerUnit: 0.138, ch4PerUnit: 0.0004, n2oPerUnit: 0.0004, source: "DEFRA", year: 2025 },
    { category: "vehicle", subcategory: "large_car", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.209, co2PerUnit: 0.207, ch4PerUnit: 0.001, n2oPerUnit: 0.001, source: "DEFRA", year: 2025 },
    { category: "vehicle", subcategory: "van", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.245, co2PerUnit: 0.243, ch4PerUnit: 0.001, n2oPerUnit: 0.001, source: "DEFRA", year: 2025 },
    { category: "vehicle", subcategory: "hgv", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.882, co2PerUnit: 0.874, ch4PerUnit: 0.004, n2oPerUnit: 0.004, source: "DEFRA", year: 2025 },
    { category: "vehicle", subcategory: "motorcycle", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.113, co2PerUnit: 0.112, ch4PerUnit: 0.0005, n2oPerUnit: 0.0005, source: "DEFRA", year: 2025 },

    // ============================================
    // AIR TRAVEL (Scope 1 or 3 depending on context)
    // ============================================
    { category: "air_travel", subcategory: "domestic", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.255, co2PerUnit: 0.244, ch4PerUnit: 0.001, n2oPerUnit: 0.010, source: "DEFRA", year: 2025 },
    { category: "air_travel", subcategory: "short_haul", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.156, co2PerUnit: 0.149, ch4PerUnit: 0.001, n2oPerUnit: 0.006, source: "DEFRA", year: 2025 },
    { category: "air_travel", subcategory: "long_haul", region: "GLOBAL", unit: "kgCO2e/km", co2ePerUnit: 0.195, co2PerUnit: 0.186, ch4PerUnit: 0.001, n2oPerUnit: 0.008, source: "DEFRA", year: 2025 },

    // ============================================
    // REFRIGERANTS (Scope 1 - Fugitive Emissions)
    // ============================================
    { category: "refrigerant", subcategory: "R-410A", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 2088.0, co2PerUnit: 2088.0, ch4PerUnit: null, n2oPerUnit: null, source: "IPCC", year: 2024 },
    { category: "refrigerant", subcategory: "R-134a", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 1430.0, co2PerUnit: 1430.0, ch4PerUnit: null, n2oPerUnit: null, source: "IPCC", year: 2024 },
    { category: "refrigerant", subcategory: "R-32", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 675.0, co2PerUnit: 675.0, ch4PerUnit: null, n2oPerUnit: null, source: "IPCC", year: 2024 },
    { category: "refrigerant", subcategory: "R-404A", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 3922.0, co2PerUnit: 3922.0, ch4PerUnit: null, n2oPerUnit: null, source: "IPCC", year: 2024 },
    { category: "refrigerant", subcategory: "R-407C", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 1774.0, co2PerUnit: 1774.0, ch4PerUnit: null, n2oPerUnit: null, source: "IPCC", year: 2024 },
    { category: "refrigerant", subcategory: "R-22", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 1810.0, co2PerUnit: 1810.0, ch4PerUnit: null, n2oPerUnit: null, source: "IPCC", year: 2024 },

    // ============================================
    // PURCHASED HEAT/STEAM (Scope 2)
    // ============================================
    { category: "district_heating", subcategory: "heat", region: "EU", unit: "kgCO2e/kWh", co2ePerUnit: 0.190, co2PerUnit: 0.185, ch4PerUnit: 0.002, n2oPerUnit: 0.003, source: "EEA", year: 2024 },
    { category: "district_heating", subcategory: "heat", region: "GB", unit: "kgCO2e/kWh", co2ePerUnit: 0.176, co2PerUnit: 0.172, ch4PerUnit: 0.002, n2oPerUnit: 0.002, source: "DEFRA", year: 2025 },
    { category: "district_heating", subcategory: "steam", region: "US", unit: "kgCO2e/kWh", co2ePerUnit: 0.255, co2PerUnit: 0.249, ch4PerUnit: 0.003, n2oPerUnit: 0.003, source: "EPA", year: 2024 },

    // ============================================
    // PURCHASED COOLING (Scope 2)
    // ============================================
    { category: "district_cooling", subcategory: "cooling", region: "GLOBAL", unit: "kgCO2e/kWh", co2ePerUnit: 0.210, co2PerUnit: 0.205, ch4PerUnit: 0.002, n2oPerUnit: 0.003, source: "IEA", year: 2024 },

    // ============================================
    // COAL (Scope 1 - Stationary)
    // ============================================
    { category: "coal", subcategory: "bituminous", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 2.42, co2PerUnit: 2.40, ch4PerUnit: 0.01, n2oPerUnit: 0.01, source: "EPA", year: 2024 },
    { category: "coal", subcategory: "anthracite", region: "GLOBAL", unit: "kgCO2e/kg", co2ePerUnit: 2.60, co2PerUnit: 2.58, ch4PerUnit: 0.01, n2oPerUnit: 0.01, source: "EPA", year: 2024 },

    // ============================================
    // WASTE (Scope 1/3)
    // ============================================
    { category: "waste", subcategory: "landfill_general", region: "GLOBAL", unit: "kgCO2e/tonne", co2ePerUnit: 457.0, co2PerUnit: 35.0, ch4PerUnit: 420.0, n2oPerUnit: 2.0, source: "DEFRA", year: 2025 },
    { category: "waste", subcategory: "recycling_mixed", region: "GLOBAL", unit: "kgCO2e/tonne", co2ePerUnit: 21.0, co2PerUnit: 21.0, ch4PerUnit: null, n2oPerUnit: null, source: "DEFRA", year: 2025 },
    { category: "waste", subcategory: "incineration", region: "GLOBAL", unit: "kgCO2e/tonne", co2ePerUnit: 21.3, co2PerUnit: 21.0, ch4PerUnit: 0.1, n2oPerUnit: 0.2, source: "DEFRA", year: 2025 },

    // ============================================
    // WATER (Scope 3 but useful for reporting)
    // ============================================
    { category: "water", subcategory: "supply", region: "GB", unit: "kgCO2e/m3", co2ePerUnit: 0.149, co2PerUnit: 0.149, ch4PerUnit: null, n2oPerUnit: null, source: "DEFRA", year: 2025 },
    { category: "water", subcategory: "treatment", region: "GB", unit: "kgCO2e/m3", co2ePerUnit: 0.272, co2PerUnit: 0.272, ch4PerUnit: null, n2oPerUnit: null, source: "DEFRA", year: 2025 },
  ];

  for (const factor of factors) {
    await prisma.emissionFactor.upsert({
      where: {
        category_subcategory_region_source_year: {
          category: factor.category,
          subcategory: factor.subcategory,
          region: factor.region,
          source: factor.source,
          year: factor.year,
        },
      },
      update: {
        co2ePerUnit: factor.co2ePerUnit,
        co2PerUnit: factor.co2PerUnit,
        ch4PerUnit: factor.ch4PerUnit,
        n2oPerUnit: factor.n2oPerUnit,
        unit: factor.unit,
        isActive: true,
      },
      create: {
        category: factor.category,
        subcategory: factor.subcategory,
        region: factor.region,
        unit: factor.unit,
        co2ePerUnit: factor.co2ePerUnit,
        co2PerUnit: factor.co2PerUnit,
        ch4PerUnit: factor.ch4PerUnit,
        n2oPerUnit: factor.n2oPerUnit,
        source: factor.source,
        year: factor.year,
        validFrom: new Date(`${factor.year}-01-01`),
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${factors.length} emission factors.`);
}

async function seedComplianceFrameworks() {
  console.log("Seeding compliance frameworks...");

  // CSRD Framework
  const csrd = await prisma.complianceFramework.upsert({
    where: { name: "CSRD" },
    update: {},
    create: {
      name: "CSRD",
      displayName: "CSRD / ESRS Report",
      version: "2024",
      description:
        "EU Corporate Sustainability Reporting Directive based on European Sustainability Reporting Standards (ESRS)",
      regions: ["EU"],
      isActive: true,
    },
  });

  const csrdSections = [
    {
      code: "ESRS2",
      title: "General Disclosures",
      sortOrder: 1,
      isRequired: true,
      subsections: [
        { code: "ESRS2-BP1", title: "Basis for Preparation", isRequired: true },
        { code: "ESRS2-GOV1", title: "Governance — Role of Administrative Bodies", isRequired: true },
        { code: "ESRS2-SBM1", title: "Strategy — Market Position & Business Model", isRequired: true },
        { code: "ESRS2-IRO1", title: "Impact, Risk & Opportunity Identification", isRequired: true },
      ],
    },
    {
      code: "E1",
      title: "Climate Change",
      sortOrder: 2,
      isRequired: true,
      subsections: [
        { code: "E1-1", title: "Transition Plan for Climate Change Mitigation", isRequired: true },
        { code: "E1-4", title: "Targets Related to Climate Change", isRequired: true },
        { code: "E1-5", title: "Energy Consumption & Mix", isRequired: true },
        { code: "E1-6", title: "Gross Scope 1, 2, 3 GHG Emissions", isRequired: true },
        { code: "E1-7", title: "GHG Removals & Carbon Credits", isRequired: false },
        { code: "E1-9", title: "Anticipated Financial Effects of Climate Change", isRequired: false },
      ],
    },
    {
      code: "S1",
      title: "Own Workforce",
      sortOrder: 3,
      isRequired: true,
      subsections: [
        { code: "S1-1", title: "Policies Related to Own Workforce", isRequired: true },
        { code: "S1-6", title: "Characteristics of Employees", isRequired: true },
        { code: "S1-9", title: "Diversity Metrics", isRequired: false },
      ],
    },
    {
      code: "G1",
      title: "Business Conduct",
      sortOrder: 4,
      isRequired: true,
      subsections: [
        { code: "G1-1", title: "Corporate Culture & Business Conduct Policies", isRequired: true },
        { code: "G1-3", title: "Prevention & Detection of Corruption/Bribery", isRequired: true },
      ],
    },
  ];

  for (const section of csrdSections) {
    const parentSection = await prisma.frameworkSection.upsert({
      where: { id: `${csrd.id}-${section.code}` },
      update: {
        title: section.title,
        sortOrder: section.sortOrder,
        isRequired: section.isRequired,
      },
      create: {
        id: `${csrd.id}-${section.code}`,
        frameworkId: csrd.id,
        code: section.code,
        title: section.title,
        sortOrder: section.sortOrder,
        isRequired: section.isRequired,
      },
    });

    if (section.subsections) {
      for (let i = 0; i < section.subsections.length; i++) {
        const sub = section.subsections[i];
        await prisma.frameworkSection.upsert({
          where: { id: `${csrd.id}-${sub.code}` },
          update: {
            title: sub.title,
            sortOrder: i + 1,
            isRequired: sub.isRequired,
          },
          create: {
            id: `${csrd.id}-${sub.code}`,
            frameworkId: csrd.id,
            code: sub.code,
            title: sub.title,
            parentId: parentSection.id,
            sortOrder: i + 1,
            isRequired: sub.isRequired,
          },
        });
      }
    }
  }

  // Seed data points for key sections
  const e16Section = await prisma.frameworkSection.findFirst({
    where: { code: "E1-6", frameworkId: csrd.id },
  });

  if (e16Section) {
    const dataPoints = [
      { code: "E1-6-1", label: "Total Scope 1 GHG Emissions", dataType: "NUMERIC" as const, unit: "tCO2e", isRequired: true },
      { code: "E1-6-2", label: "Total Scope 2 GHG Emissions (location-based)", dataType: "NUMERIC" as const, unit: "tCO2e", isRequired: true },
      { code: "E1-6-3", label: "Total Scope 2 GHG Emissions (market-based)", dataType: "NUMERIC" as const, unit: "tCO2e", isRequired: true },
      { code: "E1-6-4", label: "Total Scope 3 GHG Emissions", dataType: "NUMERIC" as const, unit: "tCO2e", isRequired: false },
      { code: "E1-6-5", label: "Total GHG Emissions", dataType: "NUMERIC" as const, unit: "tCO2e", isRequired: true },
      { code: "E1-6-6", label: "GHG Emissions Intensity (per revenue)", dataType: "NUMERIC" as const, unit: "tCO2e/EUR M", isRequired: false },
      { code: "E1-6-N", label: "GHG Emissions Methodology Narrative", dataType: "NARRATIVE" as const, unit: null, isRequired: true },
    ];

    for (const dp of dataPoints) {
      await prisma.frameworkDataPoint.upsert({
        where: { id: `${e16Section.id}-${dp.code}` },
        update: { label: dp.label, dataType: dp.dataType, unit: dp.unit, isRequired: dp.isRequired },
        create: {
          id: `${e16Section.id}-${dp.code}`,
          sectionId: e16Section.id,
          code: dp.code,
          label: dp.label,
          dataType: dp.dataType,
          unit: dp.unit,
          isRequired: dp.isRequired,
        },
      });
    }
  }

  const e15Section = await prisma.frameworkSection.findFirst({
    where: { code: "E1-5", frameworkId: csrd.id },
  });

  if (e15Section) {
    const dataPoints = [
      { code: "E1-5-1", label: "Total Energy Consumption", dataType: "NUMERIC" as const, unit: "MWh", isRequired: true },
      { code: "E1-5-2", label: "Energy from Fossil Sources", dataType: "NUMERIC" as const, unit: "MWh", isRequired: true },
      { code: "E1-5-3", label: "Energy from Renewable Sources", dataType: "NUMERIC" as const, unit: "MWh", isRequired: true },
      { code: "E1-5-4", label: "Renewable Energy Percentage", dataType: "PERCENTAGE" as const, unit: "%", isRequired: true },
      { code: "E1-5-N", label: "Energy Consumption Narrative", dataType: "NARRATIVE" as const, unit: null, isRequired: true },
    ];

    for (const dp of dataPoints) {
      await prisma.frameworkDataPoint.upsert({
        where: { id: `${e15Section.id}-${dp.code}` },
        update: { label: dp.label, dataType: dp.dataType, unit: dp.unit, isRequired: dp.isRequired },
        create: {
          id: `${e15Section.id}-${dp.code}`,
          sectionId: e15Section.id,
          code: dp.code,
          label: dp.label,
          dataType: dp.dataType,
          unit: dp.unit,
          isRequired: dp.isRequired,
        },
      });
    }
  }

  // GRI Framework (stub)
  await prisma.complianceFramework.upsert({
    where: { name: "GRI" },
    update: {},
    create: {
      name: "GRI",
      displayName: "GRI Standards",
      version: "2021",
      description: "Global Reporting Initiative Universal, Sector, and Topic Standards",
      regions: ["GLOBAL"],
      isActive: true,
    },
  });

  // SASB Framework (stub)
  await prisma.complianceFramework.upsert({
    where: { name: "SASB" },
    update: {},
    create: {
      name: "SASB",
      displayName: "SASB Standards",
      version: "2023",
      description: "Sustainability Accounting Standards Board industry-specific standards",
      regions: ["GLOBAL"],
      isActive: true,
    },
  });

  // ISSB S1 (stub)
  await prisma.complianceFramework.upsert({
    where: { name: "ISSB_S1" },
    update: {},
    create: {
      name: "ISSB_S1",
      displayName: "ISSB S1 — General Sustainability",
      version: "2023",
      description: "IFRS S1 General Requirements for Disclosure of Sustainability-related Financial Information",
      regions: ["GLOBAL"],
      isActive: true,
    },
  });

  // ISSB S2 (stub)
  await prisma.complianceFramework.upsert({
    where: { name: "ISSB_S2" },
    update: {},
    create: {
      name: "ISSB_S2",
      displayName: "ISSB S2 — Climate-related Disclosures",
      version: "2023",
      description: "IFRS S2 Climate-related Disclosures",
      regions: ["GLOBAL"],
      isActive: true,
    },
  });

  // SB-253 (stub)
  await prisma.complianceFramework.upsert({
    where: { name: "SB253" },
    update: {},
    create: {
      name: "SB253",
      displayName: "California SB-253",
      version: "2024",
      description: "Climate Corporate Data Accountability Act requiring Scope 1, 2, and 3 reporting",
      regions: ["US-CA"],
      isActive: true,
    },
  });

  console.log("Seeded compliance frameworks.");
}

async function main() {
  console.log("Starting seed...");
  await seedEmissionFactors();
  await seedComplianceFrameworks();
  console.log("Seed complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

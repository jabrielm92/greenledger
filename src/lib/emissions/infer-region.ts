/**
 * Infers the emission factor region from extracted document data.
 *
 * Uses provider/vendor name, currency, and address to determine
 * the most specific region code that matches our seed data.
 *
 * Supported regions: US, US-CA, US-TX, US-NY, US-FL, EU, GB, DE, FR, CA, AU, JP, IN, GLOBAL
 */

// Currency → region (unambiguous single-country currencies)
const CURRENCY_TO_REGION: Record<string, string> = {
  GBP: "GB",
  CAD: "CA",
  AUD: "AU",
  JPY: "JP",
  INR: "IN",
  USD: "US",
};

// EUR is ambiguous — needs provider/address to narrow down
const EUR_COUNTRY_KEYWORDS: [RegExp, string][] = [
  [/germany|deutschland|berlin|munich|m[üu]nchen|hamburg|frankfurt|stuttgart|baden/i, "DE"],
  [/france|paris|lyon|marseille/i, "FR"],
  [/netherlands|nederland|amsterdam|rotterdam/i, "NL"],
  [/spain|españa|madrid|barcelona/i, "ES"],
  [/italy|italia|rome|roma|milan|milano/i, "IT"],
  [/sweden|sverige|stockholm/i, "SE"],
];

// Well-known energy providers → region
const PROVIDER_TO_REGION: [RegExp, string][] = [
  // Germany
  [/enbw|e\.on|rwe|vattenfall.*de|stadtwerke|lichtblick|yello/i, "DE"],
  // France
  [/edf|engie|total\s*energies.*fr/i, "FR"],
  // UK
  [/british\s*gas|octopus\s*energy|bulb|ovo\s*energy|sse|scottish\s*power|edf\s*energy|npower/i, "GB"],
  // Australia
  [/agl|origin\s*energy|energy\s*australia|ergon|ausgrid/i, "AU"],
  // Japan
  [/tepco|kansai\s*electric|chubu\s*electric|tokyo\s*electric/i, "JP"],
  // India
  [/tata\s*power|adani.*power|reliance\s*energy|bses/i, "IN"],
  // Canada
  [/hydro[- ]qu[ée]bec|bc\s*hydro|ontario\s*power|toronto\s*hydro/i, "CA"],
  // US (generic)
  [/duke\s*energy|dominion|southern\s*company|exelon|nextera|pg&?e|con\s*edison|ppl|entergy|xcel/i, "US"],
];

// US state patterns for sub-region
const US_STATE_PATTERNS: [RegExp, string][] = [
  [/\bcalifornia\b|\b,?\s*CA\s*\d{5}|\bsan\s*francisco\b|\blos\s*angeles\b|\bsan\s*diego\b/i, "US-CA"],
  [/\btexas\b|\b,?\s*TX\s*\d{5}|\bhouston\b|\bdallas\b|\baustin\b|\bsan\s*antonio\b/i, "US-TX"],
  [/\bnew\s*york\b|\b,?\s*NY\s*\d{5}|\bmanhattan\b|\bbrooklyn\b|\bbronx\b/i, "US-NY"],
  [/\bflorida\b|\b,?\s*FL\s*\d{5}|\bmiami\b|\borlando\b|\btampa\b|\bjacksonville\b/i, "US-FL"],
];

// Country name / ISO patterns → region
const COUNTRY_PATTERNS: [RegExp, string][] = [
  [/\bunited\s*states\b|\busa\b|\bu\.s\.a?\b/i, "US"],
  [/\bunited\s*kingdom\b|\bengland\b|\bscotland\b|\bwales\b|\b,?\s*UK\b/i, "GB"],
  [/\bgermany\b|\bdeutschland\b/i, "DE"],
  [/\bfrance\b/i, "FR"],
  [/\bcanada\b/i, "CA"],
  [/\baustralia\b/i, "AU"],
  [/\bjapan\b/i, "JP"],
  [/\bindia\b/i, "IN"],
];

interface InferRegionInput {
  provider?: string | null;
  vendor?: string | null;
  currency?: string | null;
  address?: string | null;
  location?: string | null;
}

/**
 * Infer the best emission factor region from document context.
 * Returns the most specific region possible, falling back to "GLOBAL".
 */
export function inferRegion(input: InferRegionInput): string {
  const provider = input.provider || input.vendor || "";
  const address = input.address || input.location || "";
  const currency = input.currency?.toUpperCase() || "";
  const combined = `${provider} ${address}`;

  // 1. Try provider name → most specific signal
  for (const [pattern, region] of PROVIDER_TO_REGION) {
    if (pattern.test(provider)) {
      // If US provider, try to narrow to state from address
      if (region === "US") {
        const stateRegion = matchUSState(combined);
        if (stateRegion) return stateRegion;
      }
      return region;
    }
  }

  // 2. Try address/location for country
  for (const [pattern, region] of COUNTRY_PATTERNS) {
    if (pattern.test(address)) {
      if (region === "US") {
        const stateRegion = matchUSState(address);
        if (stateRegion) return stateRegion;
      }
      return region;
    }
  }

  // 3. Try US state patterns in combined text
  const stateRegion = matchUSState(combined);
  if (stateRegion) return stateRegion;

  // 4. Try currency
  if (currency && currency !== "EUR") {
    const currencyRegion = CURRENCY_TO_REGION[currency];
    if (currencyRegion) return currencyRegion;
  }

  // 5. EUR currency — try to narrow with provider/address keywords
  if (currency === "EUR") {
    for (const [pattern, region] of EUR_COUNTRY_KEYWORDS) {
      if (pattern.test(combined)) return region;
    }
    // Can't narrow further — use EU aggregate
    return "EU";
  }

  return "GLOBAL";
}

function matchUSState(text: string): string | null {
  for (const [pattern, region] of US_STATE_PATTERNS) {
    if (pattern.test(text)) return region;
  }
  return null;
}

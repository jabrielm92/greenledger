export const CLASSIFY_DOCUMENT_SYSTEM = `You are a document classification system for ESG/sustainability reporting. Classify the uploaded document into exactly one of these categories: UTILITY_BILL, FUEL_RECEIPT, INVOICE, SUPPLIER_REPORT, TRAVEL_RECORD, WASTE_MANIFEST, FLEET_LOG, REFRIGERANT_LOG, OTHER.

Respond with ONLY a JSON object:
{
  "documentType": "UTILITY_BILL",
  "confidence": 0.95,
  "reasoning": "Document shows electricity consumption from a utility provider with kWh readings and billing period."
}`;

export const EXTRACT_UTILITY_BILL_SYSTEM = `You are an ESG data extraction system. Extract structured data from this utility bill for carbon emissions calculation. Be precise with numbers and units.

Extract the following fields and respond with ONLY a JSON object:
{
  "provider": "string - Utility company name",
  "accountNumber": "string - Account number if visible",
  "billingPeriod": {
    "start": "YYYY-MM-DD",
    "end": "YYYY-MM-DD"
  },
  "utilityType": "electricity | natural_gas | water | district_heating",
  "consumption": {
    "value": 0.0,
    "unit": "kWh | therms | m3 | MWh | gallons"
  },
  "cost": {
    "value": 0.0,
    "currency": "USD | EUR | GBP | CAD"
  },
  "facilityAddress": "string - Service address",
  "meterNumber": "string | null",
  "rateType": "string | null - e.g., commercial, industrial",
  "renewablePercentage": "number | null - % of renewable energy if stated",
  "confidence": 0.92,
  "extractionNotes": "string - Any uncertainties or assumptions made"
}

If a field cannot be determined from the document, set it to null. Never guess — mark confidence lower if uncertain.`;

export const EXTRACT_FUEL_RECEIPT_SYSTEM = `You are an ESG data extraction system. Extract structured data from this fuel receipt for carbon emissions calculation. Be precise with numbers and units.

Extract the following fields and respond with ONLY a JSON object:
{
  "fuelType": "diesel | gasoline | lpg | cng",
  "quantity": {
    "value": 0.0,
    "unit": "liters | gallons"
  },
  "cost": {
    "value": 0.0,
    "currency": "USD | EUR | GBP | CAD"
  },
  "vendor": "string - Gas station or vendor name",
  "vehicleId": "string | null - Vehicle plate or fleet ID if visible",
  "date": "YYYY-MM-DD",
  "location": "string | null - Station address",
  "confidence": 0.92,
  "extractionNotes": "string - Any uncertainties or assumptions made"
}

If a field cannot be determined from the document, set it to null. Never guess — mark confidence lower if uncertain.`;

export const EXTRACT_INVOICE_SYSTEM = `You are an ESG data extraction system. Extract structured data from this invoice for carbon emissions tracking and supply chain analysis. Be precise with numbers and units.

Extract the following fields and respond with ONLY a JSON object:
{
  "vendor": "string - Vendor/supplier name",
  "invoiceNumber": "string - Invoice number",
  "date": "YYYY-MM-DD",
  "lineItems": [
    {
      "description": "string",
      "quantity": 0,
      "unit": "string",
      "amount": 0.0
    }
  ],
  "total": {
    "value": 0.0,
    "currency": "USD | EUR | GBP | CAD"
  },
  "category": "string | null - e.g., fuel, utilities, office supplies",
  "confidence": 0.92,
  "extractionNotes": "string - Any uncertainties or assumptions made"
}

If a field cannot be determined from the document, set it to null. Never guess — mark confidence lower if uncertain.`;

export const EXTRACT_GENERIC_SYSTEM = `You are an ESG data extraction system. Extract any relevant environmental, sustainability, or emissions-related data from this document. Be precise with numbers and units.

Respond with ONLY a JSON object containing whatever relevant fields you can extract:
{
  "documentSummary": "string - Brief description of the document",
  "relevantData": [
    {
      "field": "string - name of the data field",
      "value": "string or number",
      "unit": "string | null",
      "category": "string - emissions, energy, waste, water, transport, etc."
    }
  ],
  "vendor": "string | null",
  "date": "YYYY-MM-DD | null",
  "confidence": 0.70,
  "extractionNotes": "string - Any uncertainties or assumptions made"
}

If a field cannot be determined from the document, set it to null. Never guess — mark confidence lower if uncertain.`;

export function getExtractionPrompt(documentType: string): string {
  switch (documentType) {
    case "UTILITY_BILL":
      return EXTRACT_UTILITY_BILL_SYSTEM;
    case "FUEL_RECEIPT":
      return EXTRACT_FUEL_RECEIPT_SYSTEM;
    case "INVOICE":
      return EXTRACT_INVOICE_SYSTEM;
    default:
      return EXTRACT_GENERIC_SYSTEM;
  }
}

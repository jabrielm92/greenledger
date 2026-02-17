/**
 * QuickBooks data sync logic.
 * Imports expense transactions, bills, and vendors into GreenLedger.
 */

import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit/logger";
import {
  getQuickBooksClient,
  type QBPurchase,
  type QBBill,
  type QBVendor,
} from "./client";

interface SyncResult {
  expensesImported: number;
  billsImported: number;
  vendorsImported: number;
  documentsCreated: number;
  errors: string[];
}

// Account name patterns that indicate emissions-relevant expenses
const UTILITY_PATTERNS = [
  /utilit/i,
  /electric/i,
  /gas\b/i,
  /water/i,
  /energy/i,
  /power/i,
];
const FUEL_PATTERNS = [/fuel/i, /gas(oline)?/i, /diesel/i, /petrol/i];
const TRAVEL_PATTERNS = [/travel/i, /transport/i, /vehicle/i, /fleet/i, /mileage/i];

type ExpenseCategory = "utility" | "fuel" | "travel" | "other";

function classifyExpense(accountName: string): ExpenseCategory {
  if (UTILITY_PATTERNS.some((p) => p.test(accountName))) return "utility";
  if (FUEL_PATTERNS.some((p) => p.test(accountName))) return "fuel";
  if (TRAVEL_PATTERNS.some((p) => p.test(accountName))) return "travel";
  return "other";
}

/**
 * Sync QuickBooks data for an organization.
 */
export async function syncQuickBooksData(
  organizationId: string,
  userId: string,
  options?: { startDate?: string; endDate?: string }
): Promise<SyncResult> {
  const client = await getQuickBooksClient(organizationId);

  // Default to current year
  const now = new Date();
  const startDate = options?.startDate || `${now.getFullYear()}-01-01`;
  const endDate =
    options?.endDate || now.toISOString().slice(0, 10);

  const result: SyncResult = {
    expensesImported: 0,
    billsImported: 0,
    vendorsImported: 0,
    documentsCreated: 0,
    errors: [],
  };

  // 1. Sync vendors as suppliers
  try {
    const vendors = await client.getVendors();
    result.vendorsImported = await syncVendors(
      organizationId,
      vendors
    );
  } catch (err) {
    result.errors.push(
      `Vendor sync failed: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }

  // 2. Sync expense purchases
  try {
    const expenses = await client.getExpenses(startDate, endDate);
    const expResult = await syncExpenses(
      organizationId,
      expenses
    );
    result.expensesImported = expResult.imported;
    result.documentsCreated += expResult.documentsCreated;
  } catch (err) {
    result.errors.push(
      `Expense sync failed: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }

  // 3. Sync bills
  try {
    const bills = await client.getBills(startDate, endDate);
    const billResult = await syncBills(organizationId, bills);
    result.billsImported = billResult.imported;
    result.documentsCreated += billResult.documentsCreated;
  } catch (err) {
    result.errors.push(
      `Bill sync failed: ${err instanceof Error ? err.message : "Unknown error"}`
    );
  }

  // 4. Log the sync
  await logAudit({
    organizationId,
    userId,
    action: "entity_created",
    entityType: "QuickBooksSync",
    entityId: `sync-${Date.now()}`,
    newValue: {
      expensesImported: result.expensesImported,
      billsImported: result.billsImported,
      vendorsImported: result.vendorsImported,
      documentsCreated: result.documentsCreated,
      errors: result.errors.length,
      dateRange: { startDate, endDate },
    },
  });

  return result;
}

async function syncVendors(
  organizationId: string,
  vendors: QBVendor[]
): Promise<number> {
  let imported = 0;

  for (const vendor of vendors) {
    // Upsert by name within the organization
    const existing = await prisma.supplier.findFirst({
      where: { organizationId, name: vendor.DisplayName },
    });

    if (!existing) {
      await prisma.supplier.create({
        data: {
          organizationId,
          name: vendor.DisplayName,
          contactEmail: vendor.PrimaryEmailAddr?.Address || null,
          country: vendor.BillAddr?.Country || null,
          website: vendor.WebAddr?.URI || null,
          esgRiskLevel: "UNKNOWN",
        },
      });
      imported++;
    }
  }

  return imported;
}

async function syncExpenses(
  organizationId: string,
  expenses: QBPurchase[]
): Promise<{ imported: number; documentsCreated: number }> {
  let imported = 0;
  let documentsCreated = 0;

  for (const expense of expenses) {
    for (const line of expense.Line) {
      const accountName =
        line.AccountBasedExpenseLineDetail?.AccountRef.name || "";
      const category = classifyExpense(accountName);

      // Only import emissions-relevant expenses
      if (category === "other") continue;

      // Check for duplicate
      const existing = await prisma.document.findFirst({
        where: {
          organizationId,
          fileName: `QB-Purchase-${expense.Id}-Line-${line.Id}`,
        },
      });

      if (existing) continue;

      // Create a virtual document record
      await prisma.document.create({
        data: {
          organizationId,
          fileName: `QB-Purchase-${expense.Id}-Line-${line.Id}`,
          fileType: "application/json",
          fileSize: 0,
          storagePath: `quickbooks://purchase/${expense.Id}`,
          status: "EXTRACTED",
          classification: mapCategoryToClassification(category),
          extractedData: {
            source: "quickbooks",
            type: "purchase",
            vendor: expense.EntityRef?.name || "Unknown",
            amount: line.Amount,
            date: expense.TxnDate,
            account: accountName,
            category,
            description: line.Description || expense.PrivateNote || "",
          },
        },
      });

      documentsCreated++;
      imported++;
    }
  }

  return { imported, documentsCreated };
}

async function syncBills(
  organizationId: string,
  bills: QBBill[]
): Promise<{ imported: number; documentsCreated: number }> {
  let imported = 0;
  let documentsCreated = 0;

  for (const bill of bills) {
    for (const line of bill.Line) {
      const accountName =
        line.AccountBasedExpenseLineDetail?.AccountRef.name || "";
      const category = classifyExpense(accountName);

      if (category === "other") continue;

      const existing = await prisma.document.findFirst({
        where: {
          organizationId,
          fileName: `QB-Bill-${bill.Id}-Line-${line.Id}`,
        },
      });

      if (existing) continue;

      await prisma.document.create({
        data: {
          organizationId,
          fileName: `QB-Bill-${bill.Id}-Line-${line.Id}`,
          fileType: "application/json",
          fileSize: 0,
          storagePath: `quickbooks://bill/${bill.Id}`,
          status: "EXTRACTED",
          classification: mapCategoryToClassification(category),
          extractedData: {
            source: "quickbooks",
            type: "bill",
            vendor: bill.VendorRef?.name || "Unknown",
            amount: line.Amount,
            date: bill.TxnDate,
            dueDate: bill.DueDate,
            account: accountName,
            category,
            description: line.Description || bill.PrivateNote || "",
          },
        },
      });

      documentsCreated++;
      imported++;
    }
  }

  return { imported, documentsCreated };
}

function mapCategoryToClassification(
  category: ExpenseCategory
): string {
  switch (category) {
    case "utility":
      return "UTILITY_BILL";
    case "fuel":
      return "FUEL_RECEIPT";
    case "travel":
      return "TRAVEL_RECORD";
    default:
      return "OTHER";
  }
}

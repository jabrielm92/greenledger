export interface QuickBooksTokens {
  accessToken: string;
  refreshToken: string;
  realmId: string;
  expiresAt: Date;
}

export interface QuickBooksExpense {
  id: string;
  date: string;
  vendorName: string;
  amount: number;
  currency: string;
  description: string;
  accountName: string;
  accountType: string;
  category: "utility" | "fuel" | "travel" | "vehicle" | "other";
}

export interface QuickBooksSyncResult {
  syncedAt: Date;
  transactionsFound: number;
  transactionsImported: number;
  vendorsImported: number;
  errors: string[];
}

export interface QuickBooksVendor {
  id: string;
  displayName: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: {
    line1: string;
    city: string;
    country: string;
    postalCode: string;
  };
}

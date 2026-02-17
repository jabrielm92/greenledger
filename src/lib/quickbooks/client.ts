/**
 * QuickBooks Online API client.
 * Handles authenticated requests with automatic token refresh.
 */

import { prisma } from "@/lib/prisma";
import { refreshAccessToken } from "./oauth";

const QB_API_BASE =
  process.env.QUICKBOOKS_ENVIRONMENT === "production"
    ? "https://quickbooks.api.intuit.com"
    : "https://sandbox-quickbooks.api.intuit.com";

const API_VERSION = "v3";

interface QBClientConfig {
  organizationId: string;
  realmId: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiry: Date | null;
}

/**
 * Create an authenticated QuickBooks client for an organization.
 */
export async function getQuickBooksClient(
  organizationId: string
): Promise<QuickBooksClient> {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      quickbooksRealmId: true,
      quickbooksAccessToken: true,
      quickbooksRefreshToken: true,
      quickbooksTokenExpiry: true,
    },
  });

  if (
    !org?.quickbooksRealmId ||
    !org?.quickbooksAccessToken ||
    !org?.quickbooksRefreshToken
  ) {
    throw new Error("QuickBooks is not connected for this organization");
  }

  return new QuickBooksClient({
    organizationId,
    realmId: org.quickbooksRealmId,
    accessToken: org.quickbooksAccessToken,
    refreshToken: org.quickbooksRefreshToken,
    tokenExpiry: org.quickbooksTokenExpiry,
  });
}

export class QuickBooksClient {
  private config: QBClientConfig;

  constructor(config: QBClientConfig) {
    this.config = config;
  }

  /**
   * Ensure the access token is fresh before making API calls.
   */
  private async ensureFreshToken(): Promise<string> {
    const now = new Date();
    const expiry = this.config.tokenExpiry;

    // Refresh if expired or expiring within 5 minutes
    if (!expiry || now >= new Date(expiry.getTime() - 5 * 60 * 1000)) {
      const tokens = await refreshAccessToken(this.config.refreshToken);

      // Update stored tokens
      await prisma.organization.update({
        where: { id: this.config.organizationId },
        data: {
          quickbooksAccessToken: tokens.accessToken,
          quickbooksRefreshToken: tokens.refreshToken,
          quickbooksTokenExpiry: new Date(
            Date.now() + tokens.expiresIn * 1000
          ),
        },
      });

      this.config.accessToken = tokens.accessToken;
      this.config.refreshToken = tokens.refreshToken;
      this.config.tokenExpiry = new Date(
        Date.now() + tokens.expiresIn * 1000
      );
    }

    return this.config.accessToken;
  }

  /**
   * Make an authenticated GET request to the QuickBooks API.
   */
  async get<T>(endpoint: string): Promise<T> {
    const token = await this.ensureFreshToken();
    const url = `${QB_API_BASE}/${API_VERSION}/company/${this.config.realmId}/${endpoint}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`QuickBooks API error: ${res.status} ${error}`);
    }

    return res.json();
  }

  /**
   * Run a QuickBooks query using the Query API.
   */
  async query<T>(sql: string): Promise<T> {
    const token = await this.ensureFreshToken();
    const url = `${QB_API_BASE}/${API_VERSION}/company/${this.config.realmId}/query?query=${encodeURIComponent(sql)}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`QuickBooks query error: ${res.status} ${error}`);
    }

    return res.json();
  }

  /**
   * Fetch expense purchases for a date range.
   */
  async getExpenses(
    startDate: string,
    endDate: string
  ): Promise<QBPurchase[]> {
    const result = await this.query<{ QueryResponse: { Purchase?: QBPurchase[] } }>(
      `SELECT * FROM Purchase WHERE TxnDate >= '${startDate}' AND TxnDate <= '${endDate}'`
    );
    return result.QueryResponse.Purchase || [];
  }

  /**
   * Fetch bills for a date range.
   */
  async getBills(startDate: string, endDate: string): Promise<QBBill[]> {
    const result = await this.query<{ QueryResponse: { Bill?: QBBill[] } }>(
      `SELECT * FROM Bill WHERE TxnDate >= '${startDate}' AND TxnDate <= '${endDate}'`
    );
    return result.QueryResponse.Bill || [];
  }

  /**
   * Fetch all vendors.
   */
  async getVendors(): Promise<QBVendor[]> {
    const result = await this.query<{ QueryResponse: { Vendor?: QBVendor[] } }>(
      "SELECT * FROM Vendor MAXRESULTS 1000"
    );
    return result.QueryResponse.Vendor || [];
  }

  /**
   * Fetch company info.
   */
  async getCompanyInfo(): Promise<QBCompanyInfo> {
    const result = await this.get<{ CompanyInfo: QBCompanyInfo }>(
      `companyinfo/${this.config.realmId}`
    );
    return result.CompanyInfo;
  }

  get realmId(): string {
    return this.config.realmId;
  }
}

// QuickBooks API response types

export interface QBPurchase {
  Id: string;
  TxnDate: string;
  TotalAmt: number;
  PaymentType?: string;
  EntityRef?: { value: string; name: string };
  AccountRef?: { value: string; name: string };
  Line: QBLine[];
  PrivateNote?: string;
}

export interface QBBill {
  Id: string;
  TxnDate: string;
  DueDate?: string;
  TotalAmt: number;
  VendorRef?: { value: string; name: string };
  Line: QBLine[];
  PrivateNote?: string;
}

export interface QBLine {
  Id: string;
  Amount: number;
  Description?: string;
  DetailType: string;
  AccountBasedExpenseLineDetail?: {
    AccountRef: { value: string; name: string };
    ClassRef?: { value: string; name: string };
  };
}

export interface QBVendor {
  Id: string;
  DisplayName: string;
  PrimaryEmailAddr?: { Address: string };
  PrimaryPhone?: { FreeFormNumber: string };
  WebAddr?: { URI: string };
  BillAddr?: {
    Line1?: string;
    City?: string;
    CountrySubDivisionCode?: string;
    PostalCode?: string;
    Country?: string;
  };
}

export interface QBCompanyInfo {
  CompanyName: string;
  Country: string;
  CompanyAddr?: {
    Line1?: string;
    City?: string;
    CountrySubDivisionCode?: string;
    PostalCode?: string;
  };
}

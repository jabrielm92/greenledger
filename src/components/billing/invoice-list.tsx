"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ExternalLink } from "lucide-react";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
  pdfUrl?: string;
}

interface InvoiceListProps {
  invoices: Invoice[];
  isLoading?: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  open: "bg-blue-100 text-blue-700",
  draft: "bg-slate-100 text-slate-600",
  void: "bg-slate-100 text-slate-400",
  uncollectible: "bg-red-100 text-red-700",
};

export function InvoiceList({ invoices, isLoading }: InvoiceListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Loading invoices...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Invoice History</CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <p className="text-sm text-slate-500">No invoices yet.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="text-sm">
                      {format(new Date(inv.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      ${(inv.amount / 100).toFixed(2)}{" "}
                      <span className="text-xs text-slate-400">
                        {inv.currency.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={STATUS_STYLES[inv.status] || ""}
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {inv.pdfUrl && (
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          PDF
                        </a>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

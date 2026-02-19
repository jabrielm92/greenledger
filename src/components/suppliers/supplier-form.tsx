"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INDUSTRIES = [
  { value: "MANUFACTURING", label: "Manufacturing" },
  { value: "LOGISTICS", label: "Logistics" },
  { value: "PROFESSIONAL_SERVICES", label: "Professional Services" },
  { value: "CONSTRUCTION", label: "Construction" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "RETAIL", label: "Retail" },
  { value: "FOOD_BEVERAGE", label: "Food & Beverage" },
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "ENERGY", label: "Energy" },
  { value: "AGRICULTURE", label: "Agriculture" },
  { value: "OTHER", label: "Other" },
];

const RISK_LEVELS = [
  { value: "UNKNOWN", label: "Unknown" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
];

interface SupplierFormProps {
  supplier?: {
    id: string;
    name: string;
    contactName?: string | null;
    contactEmail?: string | null;
    industry?: string | null;
    country?: string | null;
    website?: string | null;
    esgRiskLevel: string;
    esgScore?: number | null;
    notes?: string | null;
  };
  onCancel?: () => void;
}

export function SupplierForm({ supplier, onCancel }: SupplierFormProps) {
  const router = useRouter();
  const isEditing = !!supplier;

  const [name, setName] = useState(supplier?.name || "");
  const [contactName, setContactName] = useState(supplier?.contactName || "");
  const [contactEmail, setContactEmail] = useState(
    supplier?.contactEmail || ""
  );
  const [industry, setIndustry] = useState(supplier?.industry || "");
  const [country, setCountry] = useState(supplier?.country || "");
  const [website, setWebsite] = useState(supplier?.website || "");
  const [esgRiskLevel, setEsgRiskLevel] = useState(
    supplier?.esgRiskLevel || "UNKNOWN"
  );
  const [notes, setNotes] = useState(supplier?.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const payload = {
        name,
        contactName: contactName || undefined,
        contactEmail: contactEmail || undefined,
        industry: industry || undefined,
        country: country || undefined,
        website: website || undefined,
        esgRiskLevel,
        notes: notes || undefined,
      };

      const url = isEditing
        ? `/api/suppliers/${supplier.id}`
        : "/api/suppliers";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save supplier");
      }

      const result = await res.json();
      router.push(`/dashboard/suppliers/${result.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {isEditing ? "Edit Supplier" : "Add Supplier"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Supplier Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Company name"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Contact Name</Label>
              <Input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Primary contact"
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g., United States"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Website</Label>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>ESG Risk Level</Label>
            <Select value={esgRiskLevel} onValueChange={setEsgRiskLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RISK_LEVELS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Assessment notes, compliance details..."
              rows={3}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSaving || !name}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isSaving
                ? "Saving..."
                : isEditing
                ? "Update Supplier"
                : "Add Supplier"}
            </Button>
            {onCancel && (
              <Button type="button" variant="ghost" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn, formatEnumValue } from "@/lib/utils";
import { Check, Edit2, RotateCcw, X } from "lucide-react";

interface ExtractionReviewProps {
  documentId: string;
  documentType: string | null;
  extractedData: Record<string, unknown> | null;
  confidence: number | null;
  onConfirm: (data: Record<string, unknown>) => void;
  onReExtract: () => void;
  onReject: () => void;
  isSubmitting?: boolean;
}

function ConfidenceDot({ confidence }: { confidence: number }) {
  const color =
    confidence >= 0.8
      ? "bg-emerald-500"
      : confidence >= 0.5
      ? "bg-yellow-500"
      : "bg-red-500";
  return <span className={cn("inline-block h-2 w-2 rounded-full", color)} />;
}

function flattenData(
  data: Record<string, unknown>,
  prefix = ""
): Array<{ key: string; label: string; value: string }> {
  const entries: Array<{ key: string; label: string; value: string }> = [];

  for (const [key, value] of Object.entries(data)) {
    if (key === "confidence" || key === "extractionNotes") continue;

    const fullKey = prefix ? `${prefix}.${key}` : key;
    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase());

    if (value && typeof value === "object" && !Array.isArray(value)) {
      entries.push(
        ...flattenData(value as Record<string, unknown>, fullKey)
      );
    } else if (Array.isArray(value)) {
      entries.push({
        key: fullKey,
        label,
        value: JSON.stringify(value, null, 2),
      });
    } else {
      entries.push({
        key: fullKey,
        label,
        value: value != null ? String(value) : "",
      });
    }
  }

  return entries;
}

export function ExtractionReview({
  documentId,
  documentType,
  extractedData,
  confidence,
  onConfirm,
  onReExtract,
  onReject,
  isSubmitting,
}: ExtractionReviewProps) {
  const [editedData, setEditedData] = useState<Record<string, unknown>>(
    extractedData || {}
  );
  const [editingField, setEditingField] = useState<string | null>(null);

  const fields = flattenData(editedData);

  const updateField = (key: string, value: string) => {
    const keys = key.split(".");
    const updated = { ...editedData };
    let current: Record<string, unknown> = updated;

    for (let i = 0; i < keys.length - 1; i++) {
      if (typeof current[keys[i]] === "object" && current[keys[i]] !== null) {
        current[keys[i]] = { ...(current[keys[i]] as Record<string, unknown>) };
        current = current[keys[i]] as Record<string, unknown>;
      }
    }

    const lastKey = keys[keys.length - 1];
    const numVal = Number(value);
    current[lastKey] = !isNaN(numVal) && value !== "" ? numVal : value;

    setEditedData(updated);
    setEditingField(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Extracted Data Review</CardTitle>
          <div className="flex items-center gap-2">
            {documentType && (
              <Badge variant="outline">
                {formatEnumValue(documentType)}
              </Badge>
            )}
            {confidence != null && (
              <Badge
                variant="secondary"
                className={cn(
                  confidence >= 0.8
                    ? "bg-emerald-100 text-emerald-700"
                    : confidence >= 0.5
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                )}
              >
                {Math.round(confidence * 100)}% confidence
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!extractedData ? (
          <p className="py-4 text-center text-sm text-slate-500">
            No extracted data available
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {fields.map((field) => (
                <div key={field.key} className="flex items-start gap-3">
                  <ConfidenceDot confidence={confidence ?? 0} />
                  <div className="min-w-0 flex-1">
                    <Label className="text-xs text-slate-500">
                      {field.label}
                    </Label>
                    {editingField === field.key ? (
                      <div className="mt-1 flex gap-2">
                        <Input
                          defaultValue={field.value}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              updateField(
                                field.key,
                                (e.target as HTMLInputElement).value
                              );
                            }
                            if (e.key === "Escape") {
                              setEditingField(null);
                            }
                          }}
                          className="h-8 text-sm"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setEditingField(null)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-sm">
                          {field.value || "—"}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setEditingField(field.key)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {extractedData.extractionNotes && (
              <div className="mt-4 rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">
                  Extraction Notes
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {String(extractedData.extractionNotes)}
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <Button
                onClick={() => onConfirm(editedData)}
                disabled={isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="mr-2 h-4 w-4" />
                Confirm & Create Emission Entry
              </Button>
              <Button
                variant="outline"
                onClick={onReExtract}
                disabled={isSubmitting}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Re-extract
              </Button>
              <Button
                variant="ghost"
                onClick={onReject}
                disabled={isSubmitting}
                className="text-red-600 hover:text-red-700"
              >
                <X className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

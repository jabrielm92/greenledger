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
import { CalculationDetail } from "./calculation-detail";
import type { CalculationResult } from "@/types";

const SCOPE_1_CATEGORIES = [
  { value: "natural_gas", label: "Natural Gas" },
  { value: "diesel", label: "Diesel" },
  { value: "gasoline", label: "Gasoline / Petrol" },
  { value: "lpg", label: "LPG / Propane" },
  { value: "fuel_oil", label: "Fuel Oil" },
  { value: "vehicle", label: "Vehicle (distance)" },
  { value: "refrigerant", label: "Refrigerants" },
  { value: "coal", label: "Coal" },
];

const SCOPE_2_CATEGORIES = [
  { value: "electricity", label: "Purchased Electricity" },
  { value: "district_heating", label: "Purchased Heat / Steam" },
  { value: "district_cooling", label: "Purchased Cooling" },
];

const UNITS_BY_CATEGORY: Record<string, { value: string; label: string }[]> = {
  natural_gas: [
    { value: "therms", label: "Therms" },
    { value: "kWh", label: "kWh" },
    { value: "m3", label: "Cubic Meters (m³)" },
    { value: "MCF", label: "MCF" },
  ],
  diesel: [
    { value: "liters", label: "Liters" },
    { value: "gallons", label: "Gallons" },
  ],
  gasoline: [
    { value: "liters", label: "Liters" },
    { value: "gallons", label: "Gallons" },
  ],
  lpg: [
    { value: "liters", label: "Liters" },
    { value: "gallons", label: "Gallons" },
  ],
  fuel_oil: [
    { value: "liters", label: "Liters" },
    { value: "gallons", label: "Gallons" },
  ],
  vehicle: [
    { value: "km", label: "Kilometers" },
    { value: "miles", label: "Miles" },
  ],
  refrigerant: [{ value: "kg", label: "Kilograms" }],
  coal: [
    { value: "kg", label: "Kilograms" },
    { value: "tonnes", label: "Tonnes" },
  ],
  electricity: [
    { value: "kWh", label: "kWh" },
    { value: "MWh", label: "MWh" },
  ],
  district_heating: [
    { value: "kWh", label: "kWh" },
    { value: "MWh", label: "MWh" },
    { value: "GJ", label: "GJ" },
  ],
  district_cooling: [
    { value: "kWh", label: "kWh" },
    { value: "MWh", label: "MWh" },
  ],
};

const VEHICLE_SUBCATEGORIES = [
  { value: "average_car", label: "Average Car" },
  { value: "small_car", label: "Small Car" },
  { value: "large_car", label: "Large Car" },
  { value: "van", label: "Van" },
  { value: "hgv", label: "HGV / Truck" },
  { value: "motorcycle", label: "Motorcycle" },
];

const REFRIGERANT_SUBCATEGORIES = [
  { value: "R-410A", label: "R-410A" },
  { value: "R-134a", label: "R-134a" },
  { value: "R-32", label: "R-32" },
  { value: "R-404A", label: "R-404A" },
  { value: "R-407C", label: "R-407C" },
  { value: "R-22", label: "R-22" },
];

interface EmissionsFormProps {
  className?: string;
}

export function EmissionsForm({ className }: EmissionsFormProps) {
  const router = useRouter();
  const [scope, setScope] = useState<"SCOPE_1" | "SCOPE_2">("SCOPE_1");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [source, setSource] = useState("");
  const [activityValue, setActivityValue] = useState("");
  const [activityUnit, setActivityUnit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [region, setRegion] = useState("US");

  const [calcResult, setCalcResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const categories = scope === "SCOPE_1" ? SCOPE_1_CATEGORIES : SCOPE_2_CATEGORIES;
  const units = UNITS_BY_CATEGORY[category] || [];
  const showSubcategory = category === "vehicle" || category === "refrigerant";
  const subcategories =
    category === "vehicle"
      ? VEHICLE_SUBCATEGORIES
      : category === "refrigerant"
      ? REFRIGERANT_SUBCATEGORIES
      : [];

  const handleCalculate = async () => {
    setError("");
    setIsCalculating(true);
    try {
      const res = await fetch("/api/emissions/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityValue: parseFloat(activityValue),
          activityUnit,
          category,
          subcategory: subcategory || undefined,
          region,
          year: new Date().getFullYear(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Calculation failed");
      }

      const result = await res.json();
      setCalcResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation failed");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSave = async () => {
    if (!calcResult) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/emissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope,
          category,
          subcategory: subcategory || undefined,
          source,
          activityValue: parseFloat(activityValue),
          activityUnit,
          emissionFactor: calcResult.emissionFactor,
          emissionFactorSource: calcResult.emissionFactorSource,
          co2e: calcResult.co2e,
          co2: calcResult.co2,
          ch4: calcResult.ch4,
          n2o: calcResult.n2o,
          startDate,
          endDate,
          location: location || undefined,
          notes: notes || undefined,
          calculationMethod: calcResult.methodology,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      router.push("/dashboard/emissions");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  const canCalculate =
    category && activityValue && activityUnit && region;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Add Emissions Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scope */}
        <div className="space-y-2">
          <Label>Scope</Label>
          <div className="flex gap-4">
            {(["SCOPE_1", "SCOPE_2"] as const).map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="scope"
                  value={s}
                  checked={scope === s}
                  onChange={() => {
                    setScope(s);
                    setCategory("");
                    setSubcategory("");
                    setActivityUnit("");
                    setCalcResult(null);
                  }}
                  className="accent-emerald-600"
                />
                <span className="text-sm">
                  {s === "SCOPE_1" ? "Scope 1 (Direct)" : "Scope 2 (Indirect)"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v);
              setSubcategory("");
              setActivityUnit("");
              setCalcResult(null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory */}
        {showSubcategory && (
          <div className="space-y-2">
            <Label>Subcategory</Label>
            <Select value={subcategory} onValueChange={setSubcategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select subcategory" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Source description */}
        <div className="space-y-2">
          <Label>Source Description</Label>
          <Input
            placeholder="e.g., Office natural gas heating"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>

        {/* Activity value & unit */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Activity Value</Label>
            <Input
              type="number"
              step="any"
              placeholder="0.00"
              value={activityValue}
              onChange={(e) => {
                setActivityValue(e.target.value);
                setCalcResult(null);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Unit</Label>
            <Select
              value={activityUnit}
              onValueChange={(v) => {
                setActivityUnit(v);
                setCalcResult(null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {units.map((u) => (
                  <SelectItem key={u.value} value={u.value}>
                    {u.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Region */}
        <div className="space-y-2">
          <Label>Region</Label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="US-CA">US - California</SelectItem>
              <SelectItem value="US-TX">US - Texas</SelectItem>
              <SelectItem value="US-NY">US - New York</SelectItem>
              <SelectItem value="EU">European Union</SelectItem>
              <SelectItem value="GB">United Kingdom</SelectItem>
              <SelectItem value="DE">Germany</SelectItem>
              <SelectItem value="FR">France</SelectItem>
              <SelectItem value="CA">Canada</SelectItem>
              <SelectItem value="AU">Australia</SelectItem>
              <SelectItem value="GLOBAL">Global Average</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date range */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>End Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label>Location / Facility (optional)</Label>
          <Input
            placeholder="e.g., HQ Office, Warehouse A"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label>Notes (optional)</Label>
          <Textarea
            placeholder="Any additional context..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {/* Calculate button */}
        <Button
          onClick={handleCalculate}
          disabled={!canCalculate || isCalculating}
          className="w-full"
          variant="outline"
        >
          {isCalculating ? "Calculating..." : "Calculate Emissions"}
        </Button>

        {/* Calculation result */}
        {calcResult && (
          <>
            <CalculationDetail result={calcResult} />
            <Button
              onClick={handleSave}
              disabled={isSaving || !source || !startDate || !endDate}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isSaving ? "Saving..." : "Confirm & Save Entry"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

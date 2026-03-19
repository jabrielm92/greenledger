"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EmissionFactor {
  id: string;
  category: string;
  subcategory: string | null;
  scope: string | null;
  region: string;
  unit: string;
  co2ePerUnit: number;
  source: string;
  version: string;
  validFrom: string;
  validTo: string | null;
  isActive: boolean;
  year: number;
  sourceUrl: string | null;
  notes: string | null;
}

const ALL_VALUE = "__all__";

export default function EmissionFactorsPage() {
  const [factors, setFactors] = useState<EmissionFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState(ALL_VALUE);
  const [filterRegion, setFilterRegion] = useState(ALL_VALUE);

  // New factor form
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    scope: "",
    region: "",
    unit: "",
    co2ePerUnit: "",
    source: "",
    version: "",
    year: new Date().getFullYear().toString(),
    sourceUrl: "",
    notes: "",
  });

  const fetchFactors = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterCategory !== ALL_VALUE) params.append("category", filterCategory);
    if (filterRegion !== ALL_VALUE) params.append("region", filterRegion);

    const res = await fetch(`/api/admin/emission-factors?${params}`);
    const data = await res.json();
    setFactors(data.factors || []);
    setLoading(false);
  }, [filterCategory, filterRegion]);

  useEffect(() => {
    fetchFactors();
  }, [fetchFactors]);

  async function markExpired(factorId: string) {
    if (!confirm("Mark this factor as expired?")) return;
    await fetch(`/api/admin/emission-factors/${factorId}/expire`, { method: "POST" });
    fetchFactors();
  }

  async function handleCreateFactor(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/emission-factors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setShowForm(false);
      setFormData({
        category: "", subcategory: "", scope: "", region: "", unit: "",
        co2ePerUnit: "", source: "", version: "",
        year: new Date().getFullYear().toString(), sourceUrl: "", notes: "",
      });
      fetchFactors();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Emission Factors Management</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add New Factor"}
        </Button>
      </div>

      {/* New Factor Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add New Emission Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateFactor} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., electricity"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Subcategory</Label>
                <Input
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  placeholder="e.g., grid_average"
                />
              </div>
              <div className="space-y-2">
                <Label>Region *</Label>
                <Input
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="e.g., US, UK, EU, GLOBAL"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Unit *</Label>
                <Input
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., kWh, gallon"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>CO2e Per Unit *</Label>
                <Input
                  type="number"
                  step="any"
                  value={formData.co2ePerUnit}
                  onChange={(e) => setFormData({ ...formData, co2ePerUnit: e.target.value })}
                  placeholder="kg CO2e"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Source *</Label>
                <Input
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g., EPA_2026"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Scope</Label>
                <Select
                  value={formData.scope || undefined}
                  onValueChange={(v) => setFormData({ ...formData, scope: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Select scope" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Scope 1</SelectItem>
                    <SelectItem value="2">Scope 2</SelectItem>
                    <SelectItem value="3">Scope 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Version</Label>
                <Input
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="e.g., v2026.1"
                />
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Source URL</Label>
                <Input
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Notes</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Change notes, methodology updates..."
                />
              </div>
              <div className="col-span-2">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Create Factor
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4 rounded-lg border bg-white p-4">
        <div>
          <Label>Category</Label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>All</SelectItem>
              <SelectItem value="electricity">Electricity</SelectItem>
              <SelectItem value="natural_gas">Natural Gas</SelectItem>
              <SelectItem value="fuel">Fuel</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Region</Label>
          <Select value={filterRegion} onValueChange={setFilterRegion}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>All</SelectItem>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="EU">European Union</SelectItem>
              <SelectItem value="GLOBAL">Global</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Factors Table */}
      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-4 text-left text-sm font-semibold">Category</th>
              <th className="p-4 text-left text-sm font-semibold">Region</th>
              <th className="p-4 text-left text-sm font-semibold">CO2e Factor</th>
              <th className="p-4 text-left text-sm font-semibold">Source</th>
              <th className="p-4 text-left text-sm font-semibold">Version</th>
              <th className="p-4 text-left text-sm font-semibold">Valid From</th>
              <th className="p-4 text-left text-sm font-semibold">Status</th>
              <th className="p-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500">Loading...</td>
              </tr>
            ) : factors.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500">
                  No emission factors found
                </td>
              </tr>
            ) : (
              factors.map((factor) => (
                <tr key={factor.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{factor.category}</div>
                    {factor.subcategory && (
                      <div className="text-sm text-gray-500">{factor.subcategory}</div>
                    )}
                  </td>
                  <td className="p-4">{factor.region}</td>
                  <td className="p-4">{factor.co2ePerUnit.toFixed(4)} kg CO2e/{factor.unit}</td>
                  <td className="p-4 text-sm">{factor.source}</td>
                  <td className="p-4">
                    <Badge variant="secondary">{factor.version}</Badge>
                  </td>
                  <td className="p-4 text-sm">
                    {new Date(factor.validFrom).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {factor.isActive ? (
                      <Badge className="bg-emerald-100 text-emerald-700">Current</Badge>
                    ) : (
                      <Badge variant="secondary">Expired</Badge>
                    )}
                  </td>
                  <td className="p-4">
                    {factor.isActive && (
                      <Button variant="ghost" size="sm" onClick={() => markExpired(factor.id)}>
                        Expire
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

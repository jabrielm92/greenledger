"use client";

import { useCallback, useEffect, useState } from "react";
import type { EmissionsSummary, CategoryBreakdown, MonthlyEmission } from "@/types";

interface EmissionEntry {
  id: string;
  scope: string;
  category: string;
  subcategory: string | null;
  source: string;
  activityValue: number;
  activityUnit: string;
  co2e: number;
  startDate: string;
  endDate: string;
  document?: { id: string; fileName: string } | null;
}

interface UseEmissionsOptions {
  page?: number;
  pageSize?: number;
  scope?: string;
  category?: string;
}

export function useEmissions(options: UseEmissionsOptions = {}) {
  const { page = 1, pageSize = 20, scope, category } = options;
  const [entries, setEntries] = useState<EmissionEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (scope) params.set("scope", scope);
      if (category) params.set("category", category);

      const res = await fetch(`/api/emissions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch emissions:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, scope, category]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { entries, total, totalPages, isLoading, refetch: fetchEntries };
}

export function useEmissionsSummary(year?: number) {
  const [summary, setSummary] = useState<{
    totalScope1: number;
    totalScope2: number;
    totalEmissions: number;
    entryCount: number;
    byCategory: CategoryBreakdown[];
    byMonth: MonthlyEmission[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch_() {
      setIsLoading(true);
      try {
        const params = year ? `?year=${year}` : "";
        const res = await fetch(`/api/emissions/summary${params}`);
        if (res.ok) {
          const data = await res.json();
          setSummary(data);
        }
      } catch (err) {
        console.error("Failed to fetch emissions summary:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetch_();
  }, [year]);

  return { summary, isLoading };
}

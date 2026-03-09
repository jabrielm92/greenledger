"use client";

import { useCallback, useEffect, useState } from "react";
import type { CategoryBreakdown, MonthlyEmission } from "@/types";

const POLL_INTERVAL_MS = 30_000; // 30 seconds

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

  // Refetch when tab regains focus (e.g. user returns from documents page)
  useEffect(() => {
    const onFocus = () => fetchEntries();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchEntries]);

  // Poll for new data while the page is visible
  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) fetchEntries();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchEntries]);

  return { entries, total, totalPages, isLoading, refetch: fetchEntries };
}

export function useEmissionsSummary(year?: number) {
  const [summary, setSummary] = useState<{
    totalScope1: number;
    totalScope2: number;
    totalScope3: number;
    totalEmissions: number;
    entryCount: number;
    byCategory: CategoryBreakdown[];
    byMonth: MonthlyEmission[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
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
  }, [year]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // Refetch when tab regains focus
  useEffect(() => {
    const onFocus = () => fetchSummary();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [fetchSummary]);

  // Poll for new data while the page is visible
  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) fetchSummary();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchSummary]);

  return { summary, isLoading, refetch: fetchSummary };
}

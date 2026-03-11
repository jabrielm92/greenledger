"use client";

import { useState, useEffect } from "react";
import { Clock, X } from "lucide-react";
import Link from "next/link";

export function CSRDUrgencyBanner() {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner 3+ times
    const dismissCount = parseInt(
      localStorage.getItem("csrd-banner-dismissed") || "0",
      10
    );
    if (dismissCount >= 3) {
      setDismissed(true);
      return;
    }

    const deadline = new Date("2026-04-30");
    const today = new Date();
    const diff = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    setDaysRemaining(diff);
  }, []);

  const handleDismiss = () => {
    const current = parseInt(
      localStorage.getItem("csrd-banner-dismissed") || "0",
      10
    );
    localStorage.setItem("csrd-banner-dismissed", String(current + 1));
    setDismissed(true);
  };

  if (dismissed || daysRemaining === null || daysRemaining <= 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-2.5 px-4">
      <div className="container mx-auto flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <Clock className="h-5 w-5 animate-pulse flex-shrink-0" />
          <div className="min-w-0">
            <p className="font-bold text-sm sm:text-base">
              CSRD Deadline: {daysRemaining} days until first reports due
            </p>
            <p className="text-xs sm:text-sm opacity-90 hidden sm:block">
              EU companies: FY2024 sustainability reports must be published by
              April 30, 2026
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/register?source=csrd-banner"
            className="bg-white text-red-600 px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition whitespace-nowrap"
          >
            Start Now
          </Link>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white p-1 transition"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

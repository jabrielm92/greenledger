"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "./use-current-user";

interface Organization {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  employeeCount: number | null;
  country: string | null;
  city: string | null;
  plan: string;
  onboardingComplete: boolean;
}

export function useOrganization() {
  const { user, isAuthenticated } = useCurrentUser();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.organizationId) {
      setIsLoading(false);
      return;
    }

    async function fetchOrganization() {
      try {
        const res = await fetch("/api/organizations/current");
        if (res.ok) {
          const data = await res.json();
          setOrganization(data);
        }
      } catch (err) {
        console.error("Failed to fetch organization:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrganization();
  }, [isAuthenticated, user?.organizationId]);

  return {
    organization,
    isLoading,
    hasOrganization: !!organization,
  };
}

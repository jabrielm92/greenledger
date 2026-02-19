"use client";

import { useSession } from "next-auth/react";
import type { SessionUser } from "@/types";

export function useCurrentUser() {
  const { data: session, status, update } = useSession();

  const user = session?.user as SessionUser | undefined;

  return {
    user: user ?? null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    hasOrganization: !!user?.organizationId,
    updateSession: update,
  };
}

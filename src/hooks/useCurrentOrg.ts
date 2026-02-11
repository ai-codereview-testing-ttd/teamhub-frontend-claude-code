// ============================================================
// TeamHub Frontend — useCurrentOrg Hook
// ============================================================

import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/requests";
import { useAuth } from "./useAuth";
import type { Organization } from "@/types";

export function useCurrentOrg() {
  const { user } = useAuth();
  const orgId = user?.organizationId;

  const {
    data: organization,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["organization", orgId],
    queryFn: () => apiGet<Organization>(`/organizations/${orgId}`),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    organization,
    organizationId: orgId,
    isLoading,
    error,
  };
}

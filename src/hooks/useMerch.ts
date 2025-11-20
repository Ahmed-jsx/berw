import { useQuery } from "@tanstack/react-query";
import { api, Merchant } from "@/lib/api";

// Re-export Merchant type for convenience
export type { Merchant } from "@/lib/api";

// --------------------
// HOOK: useMerchants (uses API from lib/api.ts)
// --------------------
export const useMerchants = () =>
  useQuery<Merchant[], Error>({
    queryKey: ["merchants"],
    queryFn: api.merchants.getAll,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - merchants don't change often
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - keep in cache for a week
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if we have prefetched data
    refetchOnReconnect: false,
    retry: 2,
  });

export const useMerchant = (id: number) =>
  useQuery<Merchant, Error>({
    queryKey: ["merchants", id],
    queryFn: () => api.merchants.getById(id),
    enabled: !!id,
  });

// Legacy exports for backward compatibility
export const useMerch = () => {
  const all = useMerchants();
  return { all };
};

export const useOneMerch = useMerchant;

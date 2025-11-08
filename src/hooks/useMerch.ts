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

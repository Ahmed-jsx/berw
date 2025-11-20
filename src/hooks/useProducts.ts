import { api, Product } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useProducts = () =>
  useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: api.products.getAll,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - products don't change often
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - keep in cache for a week
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if we have prefetched data
    refetchOnReconnect: false,
    retry: 2,
  });

export const useProduct = (id: number) =>
  useQuery<Product, Error>({
    queryKey: ["products", id],
    queryFn: () => api.products.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

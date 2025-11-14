import { api, Product } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useProducts = () =>
  useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: api.products.getAll,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes (same as useExtras)
    gcTime: 1000 * 60 * 10, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus for better performance
    refetchOnMount: false, // Don't refetch on mount if data is still fresh
    retry: 2, // Retry up to 2 times on failure
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

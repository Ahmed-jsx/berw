import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Product } from "@/types/Product";

export const PRODUCTS_QUERY_KEY = "products";

// 🔥 All products
export const useProducts = (): UseQueryResult<Product[], Error> => {
  return useQuery<Product[], Error>({
    queryKey: [PRODUCTS_QUERY_KEY],
    queryFn: api.products.getAll, // no extra unwrap needed
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useProduct = (id: string): UseQueryResult<Product, Error> => {
  return useQuery<Product, Error>({
    queryKey: [PRODUCTS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await api.products.getById(id);
      // Handle case where API returns array with single product
      if (Array.isArray(response)) {
        return response[0]; // Return first (and only) item
      }
      // Handle case where API returns single product object
      if (response && typeof response === 'object' && 'product_id' in response) {
        return response;
      }
      // Handle nested response structure
      if (response && 'product' in response) {
        const product = (response as any).product;
        if (Array.isArray(product)) {
          return product[0];
        }
        return product;
      }
      throw new Error('Invalid product response format');
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
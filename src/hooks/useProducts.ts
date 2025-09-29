import { api, Product } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useProducts = () =>
  useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: api.products.getAll,
  });

export const useProduct = (id: number) =>
  useQuery<Product, Error>({
    queryKey: ["products", id],
    queryFn: () => api.products.getById(id),
    enabled: !!id,
  });

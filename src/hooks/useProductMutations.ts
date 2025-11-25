import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Product } from "@/lib/api";
import { toast } from "sonner";

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: api.products.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { 
      id: number; 
      body: Partial<Product> & { 
        product_photo?: File;
        category?: string; // category_name for backend
        price?: number; // price as number (backend expects this)
      } 
    }) =>
      api.products.update(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", id] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => api.products.delete(id),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => {
      toast.error("Failed to delete product");
    },
  });

  return { create, update, remove };
};

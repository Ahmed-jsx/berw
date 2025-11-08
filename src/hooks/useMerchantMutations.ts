import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Merchant, CreateMerchant } from "@/lib/api";
import { toast } from "sonner";

export const useMerchantMutations = () => {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: api.merchants.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      toast.success("Merchant created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create merchant");
    },
  });

  const update = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: Partial<CreateMerchant> & { merchant_photo?: File };
    }) => api.merchants.update(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      queryClient.invalidateQueries({ queryKey: ["merchants", id] });
      toast.success("Merchant updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update merchant");
    },
  });

  const remove = useMutation({
    mutationFn: (id: number) => api.merchants.delete(id),
    onSuccess: () => {
      toast.success("Merchant deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
    },
    onError: () => {
      toast.error("Failed to delete merchant");
    },
  });

  return { create, update, remove };
};


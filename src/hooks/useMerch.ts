import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Merchant {
  merchant_id: number;
  merchant_name: string;
  merchant_description: string | null;
  merchant_price: number;
  created_at: string;
  updated_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --------------------
// API HELPERS
// --------------------
const merchAPI = {
  getAll: async (): Promise<Merchant[]> => {
    const res = await fetch(`${API_URL}/merchants`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch merchants");
    const data = await res.json();
    return data.merchants;
  },

  getById: async (id: number): Promise<Merchant> => {
    const res = await fetch(`${API_URL}/merchants/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch merchant with id ${id}`);
    const data = await res.json();
    return data.merchant;
  },

  update: async ({
    id,
    body,
  }: {
    id: number;
    body: Partial<Merchant>;
  }): Promise<Merchant> => {
    const res = await fetch(`${API_URL}/merchants/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Failed to update merchant ${id}`);
    const data = await res.json();
    return data.merchant;
  },

  delete: async (id: number): Promise<Merchant> => {
    const res = await fetch(`${API_URL}/merchants/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`Failed to delete merchant ${id}`);
    const data = await res.json();
    return data.deleted;
  },
};

// --------------------
// HOOK: useMerch
// --------------------
export const useMerch = () => {
  const queryClient = useQueryClient();

  // 🔹 GET ALL MERCHANTS
  const all = useQuery({
    queryKey: ["merchants"],
    queryFn: merchAPI.getAll,
  });

  // 🔹 GET ONE MERCHANT
  const one = (id: number) =>
    useQuery({
      queryKey: ["merchants", id],
      queryFn: () => merchAPI.getById(id),
      enabled: !!id,
    });

  // 🔹 UPDATE MERCHANT
  const update = useMutation({
    mutationFn: merchAPI.update,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      queryClient.invalidateQueries({ queryKey: ["merchants", id] });
    },
  });

  // 🔹 DELETE MERCHANT
  const remove = useMutation({
    mutationFn: merchAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
    },
  });

  return { all, one, update, remove };
};
export const useOneMerch = (id: number) => {
  return useQuery({
    queryKey: ["merchants", id],
    queryFn: () => merchAPI.getById(id),
    enabled: !!id,
  });
};

import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface Category {
  category_id: number;
  category_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface CategoriesResponse {
  message: string;
  categories: Category[];
}

const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data: CategoriesResponse = await res.json();
  return data.categories;
};

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return async (category: Omit<Category, 'category_id' | 'created_at' | 'updated_at'>) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });
    if (!res.ok) throw new Error("Failed to create category");
    const data: Category = await res.json();
    await queryClient.invalidateQueries({ queryKey: ["categories"] });
    return data;
  };
};

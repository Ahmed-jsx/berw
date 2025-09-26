import { useAuthStore } from "@/store/auth-store";
import { Product, ProductsResponse, ProductResponse } from '@/types/Product';
import type { User } from "@/types/user";

export const apiFetch = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = useAuthStore.getState().token;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) throw new Error("API error");

  return res.json() as Promise<T>;
};

export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      const data: ProductsResponse = await response.json();
      return data.products; // Extract the products array from the response
    },
    getById: async (id: string): Promise<Product> => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product ${id}: ${response.status} ${response.statusText}`);
      }
      const data: ProductResponse = await response.json();
      return data.product; // Extract the product from the response
    }
  }
};

export const fetchUser = async (): Promise<User | null> => {
  try {
    const data = await apiFetch<User>("https://monkey-dc6r.onrender.com/api/user/me");
    useAuthStore.getState().setAuth(
      useAuthStore.getState().token as string,
      data
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    useAuthStore.getState().clearAuth();
    return null;
  }
};
import { useAuthStore } from "@/store/auth-store";
import {  ProductsResponse, ProductResponse } from '@/types/Product';
import type { User } from "@/types/user";
import z from "zod";

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
const ProductSchema = z.object({
  product_id: z.number(),
  product_name: z.string(),
  product_components: z.string(),
  product_price: z.string(), // backend sends as string
  product_category: z.string(),
  product_photo: z.string(),
  is_featured: z.boolean(),
  has_points: z.boolean(),
  points: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Product = z.infer<typeof ProductSchema>;

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const api = {
  products: {
    // Get all products
    getAll: async (): Promise<Product[]> => {
      const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch products");
      const data: unknown = await res.json();
      const parsed = z
        .object({
          message: z.string(),
          products: z.array(ProductSchema),
        })
        .parse(data);
      return parsed.products;
    },

    // Get product by id
    getById: async (id: number): Promise<Product> => {
      const res = await fetch(`${API_URL}/products/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
      const data: unknown = await res.json();
      const parsed = z
        .object({
          message: z.string(),
          product: z.array(ProductSchema), // Changed to array
        })
        .parse(data);
      return parsed.product[0]; // Return first item from array
    },

    // Create product
    create: async (
      body: Omit<Product, "product_id" | "created_at" | "updated_at">
    ): Promise<Product> => {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed to create product");
      const data: unknown = await res.json();
      const parsed = z
        .object({
          message: z.string(),
          product: ProductSchema,
        })
        .parse(data);
      return parsed.product;
    },

    // Update product
    update: async (
      id: number,
      body: Partial<Product>
    ): Promise<Product> => {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT", // confirm if backend uses PUT or PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Failed to update product ${id}`);
      const data: unknown = await res.json();
      const parsed = z
        .object({
          message: z.string(),
          product: ProductSchema,
        })
        .parse(data);
      return parsed.product;
    },

    // Delete product
    delete: async (id: number): Promise<{ message: string }> => {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete product ${id}`);
      return res.json();
    },
  },
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
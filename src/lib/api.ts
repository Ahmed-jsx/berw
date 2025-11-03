import { useAuthStore } from "@/store/auth-store";
import { ProductsResponse, ProductResponse } from "@/types/Product";
import type { User } from "@/types/user";
import axios from "axios";
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
  product_components: z.string().nullable().optional().default(""),
  product_price: z.string(),
  product_category: z.string().nullable().default("Uncategorized"), // ✅ Fixed: allow null
  product_photo: z.string().nullable().optional(),
  is_featured: z.boolean(),
  has_points: z.boolean(),
  points: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type Product = z.infer<typeof ProductSchema>;

export interface CreateProduct {
  product_name: string;
  category: string;
  price: number;
  product_components: string;
  product_photo?: string; // Optional — may be URL from backend
  file?: File; // For uploading a new image
  is_featured: boolean;
  has_points: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export const api = {
  products: {
    // Get all products
    getAll: async (): Promise<Product[]> => {
      const res = await fetch(`${API_URL}/products`, { cache: "default" });
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();

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

      // Try to parse as object first (most common API pattern)
      try {
        const parsed = z
          .object({
            message: z.string(),
            product: ProductSchema, // Single object, not array
          })
          .parse(data);
        return parsed.product;
      } catch (error) {
        // Fallback: try parsing as array if the API returns array format
        const parsed = z
          .object({
            message: z.string(),
            product: z.array(ProductSchema),
          })
          .parse(data);
        return parsed.product[0];
      }
    },

    // Create product
    create: async (body: CreateProduct): Promise<Product> => {
      try {
        const formData = new FormData();

        // Required fields
        formData.append("product_name", body.product_name);
        formData.append("category", body.category);
        formData.append("price", String(body.price));

        // Optional fields - only add if they have values
        if (body.product_components) {
          formData.append("product_components", body.product_components);
        }

        // Boolean fields - backend might expect specific format
        // Try different formats based on what your backend accepts:

        // Option 1: String boolean
        formData.append("is_featured", String(body.is_featured));
        formData.append("has_points", String(body.has_points));

        // Option 2: If backend expects 1/0 instead, use this:
        // formData.append("is_featured", body.is_featured ? "1" : "0");
        // formData.append("has_points", body.has_points ? "1" : "0");

        // Option 3: If backend expects true/false lowercase strings:
        // formData.append("is_featured", body.is_featured ? "true" : "false");
        // formData.append("has_points", body.has_points ? "true" : "false");

        // File upload
        if (body.file) {
          formData.append("product_photo", body.file);
          console.log("📸 Uploading file:", {
            name: body.file.name,
            type: body.file.type,
            size: body.file.size,
          });
        }

        // Debug logging
        console.log("📤 Sending product data:");
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}:`, `[File: ${value.name}]`);
          } else {
            console.log(`  ${key}:`, value);
          }
        }

        const res = await axios.post(`${API_URL}/products`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("✅ Success response:", res.data);

        const parsed = z
          .object({
            message: z.string(),
            product: ProductSchema,
          })
          .parse(res.data);

        return parsed.product;
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          console.error("❌ Axios Error Details:", {
            status: err.response?.status,
            statusText: err.response?.statusText,
            data: err.response?.data,
            url: err.config?.url,
          });

          const errorMsg =
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Unknown error";

          throw new Error(
            `Failed to create product (${err.response?.status}): ${errorMsg}`
          );
        }
        console.error("❌ Unexpected error:", err);
        throw err;
      }
    },

    // Update product
    update: async (id: number, body: Partial<Product>): Promise<Product> => {
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
    const data = await apiFetch<User>(
      "https://monkey-dc6r.onrender.com/api/user/me"
    );
    useAuthStore
      .getState()
      .setAuth(useAuthStore.getState().token as string, data);
    return data;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    useAuthStore.getState().clearAuth();
    return null;
  }
};

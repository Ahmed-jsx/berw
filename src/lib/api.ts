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
  product_photo?: File; // File for uploading a new image
  is_featured: boolean;
  has_points: boolean;
}

// Merchant Schema
const MerchantSchema = z.object({
  merchant_id: z.number(),
  merchant_name: z.string(),
  merchant_description: z.string().nullable().optional(),
  merchant_price: z.string(),
  merchant_category: z.string().nullable().optional(),
  merchant_photo: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Merchant = z.infer<typeof MerchantSchema>;

export interface CreateMerchant {
  merchant_name: string;
  merchant_description: string;
  merchant_price: number;
  merchant_category?: string;
  merchant_photo?: File; // File for uploading a new image
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
        if (body.product_photo) {
          formData.append("product_photo", body.product_photo);
          console.log("📸 Uploading file:", {
            name: body.product_photo.name,
            type: body.product_photo.type,
            size: body.product_photo.size,
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
  merchants: {
    // Get all merchants
    getAll: async (): Promise<Merchant[]> => {
      const res = await fetch(`${API_URL}/merchants`, { cache: "default" });
      if (!res.ok) throw new Error("Failed to fetch merchants");

      const data = await res.json();

      const parsed = z
        .object({
          message: z.string().optional(),
          merchants: z.array(MerchantSchema),
        })
        .parse(data);

      return parsed.merchants;
    },

    // Get merchant by id
    getById: async (id: number): Promise<Merchant> => {
      const res = await fetch(`${API_URL}/merchants/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch merchant ${id}`);
      const data: unknown = await res.json();

      try {
        const parsed = z
          .object({
            message: z.string().optional(),
            merchant: MerchantSchema,
          })
          .parse(data);
        return parsed.merchant;
      } catch (error) {
        const parsed = z
          .object({
            message: z.string().optional(),
            merchant: z.array(MerchantSchema),
          })
          .parse(data);
        return parsed.merchant[0];
      }
    },

    // Create merchant
    create: async (body: CreateMerchant): Promise<Merchant> => {
      try {
        const token = useAuthStore.getState().token;
        const formData = new FormData();

        // Required fields
        formData.append("merchant_name", body.merchant_name);
        formData.append("merchant_description", body.merchant_description);
        formData.append("merchant_price", String(body.merchant_price));

        // Optional fields
        if (body.merchant_category) {
          formData.append("merchant_category", body.merchant_category);
        }

        // File upload
        if (body.merchant_photo) {
          formData.append("merchant_photo", body.merchant_photo);
          console.log("📸 Uploading merchant file:", {
            name: body.merchant_photo.name,
            type: body.merchant_photo.type,
            size: body.merchant_photo.size,
          });
        }

        // Debug logging
        console.log("📤 Sending merchant data:");
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`  ${key}:`, `[File: ${value.name}]`);
          } else {
            console.log(`  ${key}:`, value);
          }
        }

        // Prepare headers
        const headers: Record<string, string> = {};

        // Add Authorization header if token exists
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await axios.post(`${API_URL}/merchants`, formData, {
          headers,
        });

        console.log("✅ Success response:", res.data);

        const parsed = z
          .object({
            success: z.boolean().optional(),
            message: z.string().optional(),
            merchant: MerchantSchema,
          })
          .parse(res.data);

        return parsed.merchant;
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          // Properly serialize error details for logging
          const errorDetails: Record<string, any> = {};

          if (err.response) {
            errorDetails.status = err.response.status;
            errorDetails.statusText = err.response.statusText;
            errorDetails.data = err.response.data;
            errorDetails.headers = err.response.headers;
          }

          if (err.config) {
            errorDetails.url = err.config.url;
            errorDetails.method = err.config.method;
          }

          if (err.message) {
            errorDetails.message = err.message;
          }

          if (err.code) {
            errorDetails.code = err.code;
          }

          // Log error details
          console.error(
            "❌ Axios Error Details:",
            JSON.stringify(errorDetails, null, 2)
          );

          // Also log individual properties for better visibility
          if (err.response) {
            console.error("  Status:", err.response.status);
            console.error("  Status Text:", err.response.statusText);
            console.error("  Response Data:", err.response.data);
          }
          if (err.config?.url) {
            console.error("  URL:", err.config.url);
          }
          if (err.message) {
            console.error("  Error Message:", err.message);
          }

          // Extract error message from response
          let errorMsg = "Unknown error";

          if (err.response?.data) {
            if (typeof err.response.data === "string") {
              errorMsg = err.response.data;
            } else if (err.response.data.message) {
              errorMsg = err.response.data.message;
            } else if (err.response.data.error) {
              errorMsg = err.response.data.error;
            } else if (err.response.data.errors) {
              errorMsg = Array.isArray(err.response.data.errors)
                ? err.response.data.errors.join(", ")
                : JSON.stringify(err.response.data.errors);
            } else {
              errorMsg = JSON.stringify(err.response.data);
            }
          } else if (err.message) {
            errorMsg = err.message;
          }

          const statusCode = err.response?.status || "Unknown";
          throw new Error(
            `Failed to create merchant (${statusCode}): ${errorMsg}`
          );
        }

        // Handle non-axios errors
        console.error("❌ Unexpected error:", err);
        const errorMessage =
          err?.message || String(err) || "Unknown error occurred";
        throw new Error(`Failed to create merchant: ${errorMessage}`);
      }
    },

    // Update merchant
    update: async (
      id: number,
      body: Partial<CreateMerchant> & { merchant_photo?: File }
    ): Promise<Merchant> => {
      try {
        const token = useAuthStore.getState().token;
        const formData = new FormData();

        // Append only provided fields
        if (body.merchant_name) {
          formData.append("merchant_name", body.merchant_name);
        }
        if (body.merchant_description !== undefined) {
          formData.append("merchant_description", body.merchant_description);
        }
        if (body.merchant_price !== undefined) {
          formData.append("merchant_price", String(body.merchant_price));
        }
        if (body.merchant_category !== undefined) {
          formData.append("merchant_category", body.merchant_category || "");
        }

        // File upload
        if (body.merchant_photo) {
          formData.append("merchant_photo", body.merchant_photo);
        }

        // Prepare headers
        const headers: Record<string, string> = {};

        // Add Authorization header if token exists
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await axios.put(`${API_URL}/merchants/${id}`, formData, {
          headers,
        });

        const parsed = z
          .object({
            success: z.boolean().optional(),
            message: z.string().optional(),
            merchant: MerchantSchema,
          })
          .parse(res.data);

        return parsed.merchant;
      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          const errorMsg =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Unknown error";

          const statusCode = err.response?.status || "Unknown";
          throw new Error(
            `Failed to update merchant (${statusCode}): ${errorMsg}`
          );
        }
        throw err;
      }
    },

    // Delete merchant
    delete: async (id: number): Promise<{ message: string }> => {
      const token = useAuthStore.getState().token;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch(`${API_URL}/merchants/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error(`Failed to delete merchant ${id}`);
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

// services/orderApi.ts

import {
  Order,
  CheckoutRequest,
  CheckoutResponse,
  OrderSearchParams,
} from "@/types/order";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class OrderApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "OrderApiError";
  }
}

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // If JSON parsing fails, use the default error message
      console.error("Failed to parse error response:", e);
    }

    throw new OrderApiError(errorMessage, response.status);
  }

  const data = await response.json();
  return data;
};

export const orderApi = {
  // 1. Checkout Order
  checkout: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
    try {
      const response = await fetch(`${API_URL}/orders/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await handleApiResponse<CheckoutResponse>(response);

      // Ensure total_price is a number
      if (typeof result.total_price === "string") {
        result.total_price = parseFloat(result.total_price);
      }

      return result;
    } catch (error) {
      if (error instanceof OrderApiError) {
        throw error;
      }
      throw new OrderApiError(
        error instanceof Error ? error.message : "Failed to checkout"
      );
    }
  },

  // 2. Get Order Details by Order ID (Admin)
  getOrderDetailsByIdAdmin: async (orderId: number): Promise<Order> => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/details`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      return handleApiResponse<Order>(response);
    } catch (error) {
      if (error instanceof OrderApiError) {
        throw error;
      }
      throw new OrderApiError(
        error instanceof Error ? error.message : "Failed to fetch order details"
      );
    }
  },

  // 3. Get Order Details by Order Code (Admin)
  getOrderDetailsByCodeAdmin: async (orderCode: string): Promise<Order> => {
    try {
      const response = await fetch(
        `${API_URL}/orders/code/${orderCode}/details`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );

      return handleApiResponse<Order>(response);
    } catch (error) {
      if (error instanceof OrderApiError) {
        throw error;
      }
      throw new OrderApiError(
        error instanceof Error ? error.message : "Failed to fetch order details"
      );
    }
  },

  // 4. Get Order by Order ID
  getOrderById: async (orderId: number): Promise<Order> => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`);
      return handleApiResponse<Order>(response);
    } catch (error) {
      if (error instanceof OrderApiError) {
        throw error;
      }
      throw new OrderApiError(
        error instanceof Error ? error.message : "Failed to fetch order"
      );
    }
  },

  // 5. Get Order by Order Code
  getOrderByCode: async (orderCode: string): Promise<Order> => {
    try {
      const response = await fetch(`${API_URL}/orders/code/${orderCode}`);
      return handleApiResponse<Order>(response);
    } catch (error) {
      if (error instanceof OrderApiError) {
        throw error;
      }
      throw new OrderApiError(
        error instanceof Error ? error.message : "Failed to fetch order"
      );
    }
  },

  // 6. Search Orders by Order Code
  searchOrdersByCode: async (params: OrderSearchParams): Promise<Order[]> => {
    try {
      const searchParams = new URLSearchParams();
      if (params.code) searchParams.append("code", params.code);

      const response = await fetch(
        `${API_URL}/orders/search?${searchParams.toString()}`
      );
      return handleApiResponse<Order[]>(response);
    } catch (error) {
      if (error instanceof OrderApiError) {
        throw error;
      }
      throw new OrderApiError(
        error instanceof Error ? error.message : "Failed to search orders"
      );
    }
  },

  // 7. Get All Orders (Admin)
  getAllOrdersAdmin: async (): Promise<Order[]> => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      return handleApiResponse<Order[]>(response);
    } catch (error) {
      if (error instanceof OrderApiError) {
        throw error;
      }
      throw new OrderApiError(
        error instanceof Error ? error.message : "Failed to fetch orders"
      );
    }
  },

  // 8. Get All Orders for User
  getUserOrders: async (): Promise<Order[]> => {
    try {
      const response = await fetch(`${API_URL}/orders/user`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      return handleApiResponse<Order[]>(response);
    } catch (error) {
      if (error instanceof OrderApiError) {
        throw error;
      }
      throw new OrderApiError(
        error instanceof Error ? error.message : "Failed to fetch user orders"
      );
    }
  },
};

export const updateOrderStatus = async (
  orderId: number,
  status: string
): Promise<Order> => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({ status }),
    });

    return handleApiResponse<Order>(response);
  } catch (error) {
    if (error instanceof OrderApiError) {
      throw error;
    }
    throw new OrderApiError(
      error instanceof Error ? error.message : "Failed to update order status"
    );
  }
};

// Helper function to get auth token
const getAuthToken = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken") || "";
  }
  return "";
};

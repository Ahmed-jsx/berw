// services/orderApi.ts

import { 
    Order, 
    CheckoutRequest, 
    CheckoutResponse, 
    OrderSearchParams 
  } from '@/types/order';
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  class OrderApiError extends Error {
    constructor(message: string, public status?: number) {
      super(message);
      this.name = 'OrderApiError';
    }
  }
  
  const handleApiResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new OrderApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status
      );
    }
    
    return response.json();
  };
  
  export const orderApi = {
    // 1. Checkout Order
    checkout: async (data: CheckoutRequest): Promise<CheckoutResponse> => {
      const response = await fetch(`${API_URL}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return handleApiResponse<CheckoutResponse>(response);
    },
  
    // 2. Get Order Details by Order ID (Admin)
    getOrderDetailsByIdAdmin: async (orderId: number): Promise<Order> => {
      const response = await fetch(`${API_URL}/orders/${orderId}/details`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      
      return handleApiResponse<Order>(response);
    },
  
    // 3. Get Order Details by Order Code (Admin)
    getOrderDetailsByCodeAdmin: async (orderCode: string): Promise<Order> => {
      const response = await fetch(`${API_URL}/orders/code/${orderCode}/details`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      
      return handleApiResponse<Order>(response);
    },
  
    // 4. Get Order by Order ID
    getOrderById: async (orderId: number): Promise<Order> => {
      const response = await fetch(`${API_URL}/orders/${orderId}`);
      return handleApiResponse<Order>(response);
    },
  
    // 5. Get Order by Order Code
    getOrderByCode: async (orderCode: string): Promise<Order> => {
      const response = await fetch(`${API_URL}/orders/code/${orderCode}`);
      return handleApiResponse<Order>(response);
    },
  
    // 6. Search Orders by Order Code
    searchOrdersByCode: async (params: OrderSearchParams): Promise<Order[]> => {
      const searchParams = new URLSearchParams();
      if (params.code) searchParams.append('code', params.code);
  
      const response = await fetch(`${API_URL}/orders/search?${searchParams.toString()}`);
      return handleApiResponse<Order[]>(response);
    },
  
    // 7. Get All Orders (Admin)
    getAllOrdersAdmin: async (): Promise<Order[]> => {
      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      
      return handleApiResponse<Order[]>(response);
    },
  
    // 8. Get All Orders for User
    getUserOrders: async (): Promise<Order[]> => {
      const response = await fetch(`${API_URL}/orders/user`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      });
      
      return handleApiResponse<Order[]>(response);
    },
  };
  
  // Helper function to get auth token
  // You'll need to implement this based on your auth system
  const getAuthToken = (): string => {
    // Replace with your actual auth token retrieval logic
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || '';
    }
    return '';
  };
  
  export { OrderApiError };
// hooks/useOrderQueries.ts

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import {
  Order,
  CheckoutRequest,
  CheckoutResponse,
  OrderSearchParams,
} from "@/types/order";
import React from "react";
import { useOrderStore } from "@/store/orderStore";
import { orderApi, OrderApiError } from "@/services/orderApi";

// ============================================================================
// QUERY KEYS FACTORY
// ============================================================================

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: string) => [...orderKeys.lists(), { filters }] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
  detailByCode: (code: string) =>
    [...orderKeys.details(), "code", code] as const,
  userOrders: (userId?: number) => [...orderKeys.all, "user", userId] as const,
  search: (params: OrderSearchParams) =>
    [...orderKeys.all, "search", params] as const,
  admin: {
    all: () => [...orderKeys.all, "admin"] as const,
    details: (id: number) => [...orderKeys.admin.all(), "details", id] as const,
    detailsByCode: (code: string) =>
      [...orderKeys.admin.all(), "details", "code", code] as const,
  },
};

// ============================================================================
// QUERY HOOKS
// ============================================================================

// Get Order by ID
export const useOrder = (
  orderId: number,
  options?: Omit<UseQueryOptions<Order, OrderApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => orderApi.getOrderById(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

// Get Order by Code
export const useOrderByCode = (
  orderCode: string,
  options?: Omit<UseQueryOptions<Order, OrderApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: orderKeys.detailByCode(orderCode),
    queryFn: () => orderApi.getOrderByCode(orderCode),
    enabled: !!orderCode,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

// Get User Orders
export const useUserOrders = (
  options?: Omit<
    UseQueryOptions<Order[], OrderApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: orderKeys.userOrders(),
    queryFn: orderApi.getUserOrders,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};

// Search Orders by Code
export const useSearchOrders = (
  searchParams: OrderSearchParams,
  options?: Omit<
    UseQueryOptions<Order[], OrderApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: orderKeys.search(searchParams),
    queryFn: () => orderApi.searchOrdersByCode(searchParams),
    enabled: !!searchParams.code && searchParams.code.length > 0,
    staleTime: 1000 * 60 * 1, // 1 minute
    ...options,
  });
};

// Admin: Get All Orders
export const useAdminOrders = (
  options?: Omit<
    UseQueryOptions<Order[], OrderApiError>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: orderKeys.admin.all(),
    queryFn: orderApi.getAllOrdersAdmin,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

// Admin: Get Order Details by ID
export const useAdminOrderDetails = (
  orderId: number,
  options?: Omit<UseQueryOptions<Order, OrderApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: orderKeys.admin.details(orderId),
    queryFn: () => orderApi.getOrderDetailsByIdAdmin(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

// Admin: Get Order Details by Code
export const useAdminOrderDetailsByCode = (
  orderCode: string,
  options?: Omit<UseQueryOptions<Order, OrderApiError>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: orderKeys.admin.detailsByCode(orderCode),
    queryFn: () => orderApi.getOrderDetailsByCodeAdmin(orderCode),
    enabled: !!orderCode,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};

// ============================================================================
// MUTATION HOOKS
// ============================================================================

// Checkout Order
export const useCheckoutOrder = (
  options?: UseMutationOptions<CheckoutResponse, OrderApiError, CheckoutRequest>
) => {
  const queryClient = useQueryClient();
  const { clearCart, setCheckingOut, setCheckoutError, setCurrentOrder } =
    useOrderStore();

  return useMutation({
    mutationFn: orderApi.checkout,
    onMutate: () => {
      setCheckingOut(true);
      setCheckoutError(null);
    },
    onSuccess: async (data, variables) => {
      // Clear cart on successful checkout
      clearCart();

      // Fetch the complete order details and set as current order
      try {
        const orderDetails = await orderApi.getOrderById(data.order_id);
        setCurrentOrder(orderDetails);
      } catch (error) {
        console.warn("Failed to fetch order details after checkout:", error);
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: orderKeys.userOrders() });
      queryClient.invalidateQueries({ queryKey: orderKeys.admin.all() });

      setCheckingOut(false);
    },
    onError: (error) => {
      setCheckoutError(error.message);
      setCheckingOut(false);
    },
    ...options,
  });
};

// ============================================================================
// COMPOUND HOOKS (Combining multiple queries/mutations)
// ============================================================================

// Hook for order management dashboard (admin)
export const useOrderManagement = () => {
  const { orderFilters } = useOrderStore();
  const isSearching = !!orderFilters.searchTerm?.trim();

  const ordersQuery = useAdminOrders({
    enabled: !isSearching, // ✅ only fetch all when not searching
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  const searchQuery = useSearchOrders(
    { code: orderFilters.searchTerm },
    {
      enabled: isSearching, // ✅ only fetch search results when searching
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
    }
  );

  const activeQuery = isSearching ? searchQuery : ordersQuery;

  return {
    orders: activeQuery.data || [],
    isLoading: activeQuery.isLoading,
    error: activeQuery.error,
    refetch: activeQuery.refetch,
  };
};

// Hook for customer order tracking
export const useOrderTracking = (orderCode?: string) => {
  const orderByCodeQuery = useOrderByCode(orderCode || "", {
    enabled: !!orderCode,
  });

  return {
    order: orderByCodeQuery.data,
    isLoading: orderByCodeQuery.isLoading,
    error: orderByCodeQuery.error,
    refetch: orderByCodeQuery.refetch,
  };
};

// Hook for checkout process - FIXED VERSION
export interface CheckoutItem {
  product_id: number;
  quantity: number;
  extras?: number[];
}

export function useCheckoutProcess() {
  const queryClient = useQueryClient();
  const { clearCart } = useOrderStore();

  const mutation = useMutation<
    CheckoutResponse,
    Error,
    { user_id: number; items: CheckoutItem[] }
  >({
    mutationFn: async ({ user_id, items }) => {
      // Use the orderApi instead of direct fetch
      return orderApi.checkout({ user_id, items });
    },
    onSuccess: (data) => {
      // Clear cart on success
      clearCart();

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: orderKeys.userOrders() });
      queryClient.invalidateQueries({ queryKey: orderKeys.admin.all() });
    },
  });

  return {
    checkout: (user_id: number, items: CheckoutItem[]) =>
      mutation.mutate({ user_id, items }),
    isCheckingOut: mutation.isPending,
    checkoutError: mutation.error?.message || null,
    checkoutData: mutation.data,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}

// Hook for syncing orders with store
export const useOrderSync = (isAdmin = false) => {
  const { setOrders } = useOrderStore();

  const userOrdersQuery = useUserOrders({ enabled: !isAdmin });
  const adminOrdersQuery = useAdminOrders({ enabled: isAdmin });

  const activeQuery = isAdmin ? adminOrdersQuery : userOrdersQuery;

  // Sync orders to store when data changes
  React.useEffect(() => {
    if (activeQuery.data) {
      setOrders(activeQuery.data);
    }
  }, [activeQuery.data, setOrders]);

  return {
    orders: activeQuery.data || [],
    isLoading: activeQuery.isLoading,
    error: activeQuery.error,
    refetch: activeQuery.refetch,
  };
};

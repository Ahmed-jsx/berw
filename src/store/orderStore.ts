// store/orderStore.ts

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { CheckoutItem, Order, OrderStatus } from "@/types/order";
import { Extra } from "@/types/extras";

type CheckoutExtras = number[];

interface CartItem extends Omit<CheckoutItem, "extras"> {
  product_name?: string;
  product_price?: number;
  product_category?: string;
  extras: CheckoutExtras; // always store IDs
  extrasData?: Extra[]; // hydrated details for UI + price calculations
  notes?: string;
}

interface OrderStore {
  cartItems: CartItem[];
  cartTotal: number;

  currentOrder: Order | null;
  isCheckingOut: boolean;
  checkoutError: string | null;

  orders: Order[];
  selectedOrderIds: number[];
  orderFilters: {
    status?: OrderStatus;
    dateRange?: { start: Date; end: Date };
    searchTerm?: string;
  };

  isOrderDetailsModalOpen: boolean;
  selectedOrderForDetails: Order | null;

  // 🔹 Extras helper
  getExtrasDataByIds: (ids: number[], allExtras: Extra[]) => Extra[];

  // Cart Actions
  addToCart: (item: CartItem, allExtras: Extra[]) => void;
  updateCartItem: (
    productId: number,
    updates: Partial<CartItem>,
    allExtras: Extra[]
  ) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;

  // Checkout Actions
  setCheckingOut: (loading: boolean) => void;
  setCheckoutError: (error: string | null) => void;
  setCurrentOrder: (order: Order | null) => void;

  // Orders Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (orderId: number, updates: Partial<Order>) => void;
  selectOrder: (orderId: number) => void;
  deselectOrder: (orderId: number) => void;
  clearOrderSelection: () => void;

  // Filter Actions
  setOrderFilters: (filters: Partial<OrderStore["orderFilters"]>) => void;
  clearOrderFilters: () => void;

  // Modal Actions
  openOrderDetailsModal: (order: Order) => void;
  closeOrderDetailsModal: () => void;

  // Computed Values
  getCartItemsCount: () => number;
  getCartTotalPrice: () => number;
  getFilteredOrders: () => Order[];
}

export const useOrderStore = create<OrderStore>()(
  devtools(
    persist(
      (set, get) => ({
        cartItems: [],
        cartTotal: 0,
        currentOrder: null,
        isCheckingOut: false,
        checkoutError: null,
        orders: [],
        selectedOrderIds: [],
        orderFilters: {},
        isOrderDetailsModalOpen: false,
        selectedOrderForDetails: null,

        // 🔹 Helper to hydrate extras by ID
        getExtrasDataByIds: (ids: number[] = [], allExtras: Extra[] = []) => {
          const lookup = new Map(allExtras.map((ex) => [ex.id, ex]));
          return ids.map((id) => lookup.get(id)).filter(Boolean) as Extra[];
        },

        // 🔹 Add to cart (hydrate extrasData before saving)
        addToCart: (item, allExtras) => {
          set((state) => {
            const existingItemIndex = state.cartItems.findIndex(
              (cartItem) => cartItem.product_id === item.product_id
            );

            const hydrateExtras = get().getExtrasDataByIds(
              item.extras || [],
              allExtras
            );

            if (existingItemIndex >= 0) {
              const updatedItems = [...state.cartItems];
              const existing = updatedItems[existingItemIndex];

              updatedItems[existingItemIndex] = {
                ...existing,
                quantity: existing.quantity + item.quantity,
                extras: Array.from(new Set([...(existing.extras || []), ...(item.extras || [])])),
                extrasData: Array.from(
                  new Map(
                    [...(existing.extrasData || []), ...hydrateExtras].map((e) => [e.id, e])
                  ).values()
                ),
              };

              return { cartItems: updatedItems };
            }

            const newItem: CartItem = {
              ...item,
              extras: item.extras || [],
              extrasData: hydrateExtras,
            };

            return { cartItems: [...state.cartItems, newItem] };
          });
        },

        // 🔹 Update cart item (rehydrate extrasData if extras changed)
        updateCartItem: (productId, updates, allExtras) => {
          set((state) => ({
            cartItems: state.cartItems.map((item) => {
              if (item.product_id !== productId) return item;

              const updatedExtras = updates.extras ?? item.extras;
              const hydrateExtras = get().getExtrasDataByIds(
                updatedExtras,
                allExtras
              );

              return {
                ...item,
                ...updates,
                extras: updatedExtras,
                extrasData: hydrateExtras,
              };
            }),
          }));
        },

        removeFromCart: (productId) => {
          set((state) => ({
            cartItems: state.cartItems.filter(
              (item) => item.product_id !== productId
            ),
          }));
        },

        clearCart: () => set({ cartItems: [], cartTotal: 0 }),

        updateCartItemQuantity: (productId, quantity) => {
          if (quantity <= 0) {
            get().removeFromCart(productId);
            return;
          }
          set((state) => ({
            cartItems: state.cartItems.map((item) =>
              item.product_id === productId ? { ...item, quantity } : item
            ),
          }));
        },

        setCheckingOut: (loading) => set({ isCheckingOut: loading }),
        setCheckoutError: (error) => set({ checkoutError: error }),
        setCurrentOrder: (order) => set({ currentOrder: order }),

        setOrders: (orders) => set({ orders }),
        addOrder: (order) =>
          set((state) => ({ orders: [order, ...state.orders] })),
        updateOrder: (orderId, updates) =>
          set((state) => ({
            orders: state.orders.map((order) =>
              order.order_id === orderId ? { ...order, ...updates } : order
            ),
          })),

        selectOrder: (orderId) =>
          set((state) => ({
            selectedOrderIds: state.selectedOrderIds.includes(orderId)
              ? state.selectedOrderIds
              : [...state.selectedOrderIds, orderId],
          })),
        deselectOrder: (orderId) =>
          set((state) => ({
            selectedOrderIds: state.selectedOrderIds.filter((id) => id !== orderId),
          })),
        clearOrderSelection: () => set({ selectedOrderIds: [] }),

        setOrderFilters: (filters) =>
          set((state) => ({ orderFilters: { ...state.orderFilters, ...filters } })),
        clearOrderFilters: () => set({ orderFilters: {} }),

        openOrderDetailsModal: (order) =>
          set({
            isOrderDetailsModalOpen: true,
            selectedOrderForDetails: order,
          }),
        closeOrderDetailsModal: () =>
          set({
            isOrderDetailsModalOpen: false,
            selectedOrderForDetails: null,
          }),

        getCartItemsCount: () =>
          get().cartItems.reduce((total, item) => total + item.quantity, 0),

        getCartTotalPrice: () =>
          get().cartItems.reduce((total, item) => {
            const basePrice = (item.product_price || 0) * item.quantity;
            const extrasPrice =
              item.extrasData?.reduce(
                (sum, ex) => sum + (ex.price || 0) * item.quantity,
                0
              ) ?? 0;
            return total + basePrice + extrasPrice;
          }, 0),

        getFilteredOrders: () => {
          const { orders, orderFilters } = get();
          return orders.filter((order) => {
            if (orderFilters.status && order.order_status !== orderFilters.status) {
              return false;
            }
            if (orderFilters.searchTerm) {
              const searchTerm = orderFilters.searchTerm.toLowerCase();
              const matchesCode = order.order_code
                .toLowerCase()
                .includes(searchTerm);
              const matchesUserName =
                order.user_name?.toLowerCase().includes(searchTerm) || false;
              const matchesUserEmail =
                order.user_email?.toLowerCase().includes(searchTerm) || false;
              if (!matchesCode && !matchesUserName && !matchesUserEmail) {
                return false;
              }
            }
            if (orderFilters.dateRange) {
              if (!order.created_at) return false;
              const orderDate = new Date(order.created_at);
              const { start, end } = orderFilters.dateRange;
              if (orderDate < start || orderDate > end) {
                return false;
              }
            }
            return true;
          });
        },
      }),
      {
        name: "order-store",
        partialize: (state) => ({
          cartItems: state.cartItems,
          orderFilters: state.orderFilters,
        }),
      }
    ),
    { name: "OrderStore" }
  )
);

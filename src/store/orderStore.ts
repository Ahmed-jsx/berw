// store/orderStore.ts

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { CheckoutItem, Order, OrderStatus } from "@/types/order";
import { Extra } from "@/types/extras";

type CheckoutExtras = number[];

interface CartItem {
  // Common fields
  type: "product" | "merchant";
  quantity: number;
  notes?: string;

  // Product-specific fields
  product_id?: number;
  product_name?: string;
  product_price?: number;
  product_photo?: string;
  product_category?: string;
  extras?: CheckoutExtras; // Only for products
  extrasData?: Extra[]; // Hydrated extras for UI

  // Merchant-specific fields
  merchant_id?: number;
  merchant_name?: string;
  merchant_price?: number;
  merchant_photo?: string;
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

  // Extras helper
  getExtrasDataByIds: (ids: number[], allExtras: Extra[]) => Extra[];

  // Cart Actions
  addToCart: (item: CartItem, allExtras?: Extra[]) => void;
  updateCartItem: (
    itemId: { product_id?: number; merchant_id?: number },
    updates: Partial<CartItem>,
    allExtras?: Extra[]
  ) => void;
  removeFromCart: (itemId: {
    product_id?: number;
    merchant_id?: number;
  }) => void;
  clearCart: () => void;
  updateCartItemQuantity: (
    itemId: { product_id?: number; merchant_id?: number },
    quantity: number
  ) => void;

  // Checkout Actions
  setCheckingOut: (loading: boolean) => void;
  setCheckoutError: (error: string | null) => void;
  setCurrentOrder: (order: Order | null) => void;
  formatCheckoutPayload: (userId: number) => any;

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

        // Helper to hydrate extras by ID
        getExtrasDataByIds: (ids: number[] = [], allExtras: Extra[] = []) => {
          const lookup = new Map(allExtras.map((ex) => [ex.id, ex]));
          return ids.map((id) => lookup.get(id)).filter(Boolean) as Extra[];
        },

        // Add to cart (supports both products and merchants)
        addToCart: (item, allExtras = []) => {
          console.log("🛒 addToCart called:", { item, allExtras });

          set((state) => {
            const isProduct = item.type === "product";
            const existingItemIndex = state.cartItems.findIndex((cartItem) => {
              if (isProduct) {
                return (
                  cartItem.type === "product" &&
                  cartItem.product_id === item.product_id
                );
              } else {
                return (
                  cartItem.type === "merchant" &&
                  cartItem.merchant_id === item.merchant_id
                );
              }
            });

            // Hydrate extras for products
            const hydrateExtras = isProduct
              ? get().getExtrasDataByIds(item.extras || [], allExtras)
              : [];

            console.log("💎 Hydrated extras:", hydrateExtras);

            if (existingItemIndex >= 0) {
              const updatedItems = [...state.cartItems];
              const existing = updatedItems[existingItemIndex];

              updatedItems[existingItemIndex] = {
                ...existing,
                quantity: existing.quantity + item.quantity,
                ...(isProduct && {
                  extras: Array.from(
                    new Set([
                      ...(existing.extras || []),
                      ...(item.extras || []),
                    ])
                  ),
                  extrasData: Array.from(
                    new Map(
                      [...(existing.extrasData || []), ...hydrateExtras].map(
                        (e) => [e.id, e]
                      )
                    ).values()
                  ),
                }),
              };

              console.log(
                "✅ Updated existing item:",
                updatedItems[existingItemIndex]
              );
              return { cartItems: updatedItems };
            }

            const newItem: CartItem = {
              ...item,
              ...(isProduct && {
                extras: item.extras || [],
                extrasData: hydrateExtras,
              }),
            };

            console.log("✅ Added new item:", newItem);
            return { cartItems: [...state.cartItems, newItem] };
          });
        },

        // Update cart item
        updateCartItem: (itemId, updates, allExtras = []) => {
          set((state) => ({
            cartItems: state.cartItems.map((item) => {
              const matches =
                (itemId.product_id &&
                  item.type === "product" &&
                  item.product_id === itemId.product_id) ||
                (itemId.merchant_id &&
                  item.type === "merchant" &&
                  item.merchant_id === itemId.merchant_id);

              if (!matches) return item;

              if (item.type === "product" && updates.extras) {
                const hydrateExtras = get().getExtrasDataByIds(
                  updates.extras,
                  allExtras
                );
                return {
                  ...item,
                  ...updates,
                  extrasData: hydrateExtras,
                };
              }

              return { ...item, ...updates };
            }),
          }));
        },

        removeFromCart: (itemId) => {
          console.log("removeFromCart called with:", itemId);
          set((state) => {
            const filteredItems = state.cartItems.filter((item) => {
              if (itemId.product_id) {
                const shouldKeep = !(
                  item.type === "product" &&
                  item.product_id === itemId.product_id
                );
                console.log(
                  `Product check: item.type=${item.type}, item.product_id=${item.product_id}, shouldKeep=${shouldKeep}`
                );
                return shouldKeep;
              }
              if (itemId.merchant_id) {
                const shouldKeep = !(
                  item.type === "merchant" &&
                  item.merchant_id === itemId.merchant_id
                );
                console.log(
                  `Merchant check: item.type=${item.type}, item.merchant_id=${item.merchant_id}, shouldKeep=${shouldKeep}`
                );
                return shouldKeep;
              }
              return true;
            });
            console.log("Filtered items:", filteredItems);
            return { cartItems: filteredItems };
          });
        },

        clearCart: () => set({ cartItems: [], cartTotal: 0 }),

        updateCartItemQuantity: (itemId, quantity) => {
          if (quantity <= 0) {
            get().removeFromCart(itemId);
            return;
          }
          set((state) => ({
            cartItems: state.cartItems.map((item) => {
              const matches =
                (itemId.product_id &&
                  item.type === "product" &&
                  item.product_id === itemId.product_id) ||
                (itemId.merchant_id &&
                  item.type === "merchant" &&
                  item.merchant_id === itemId.merchant_id);

              return matches ? { ...item, quantity } : item;
            }),
          }));
        },

        // Format checkout payload for API
        formatCheckoutPayload: (userId: number) => {
          const { cartItems } = get();

          return {
            user_id: userId,
            items: cartItems.map((item) => {
              if (item.type === "product") {
                return {
                  type: "product",
                  product_id: item.product_id!,
                  quantity: item.quantity,
                  extras: item.extras || [],
                };
              } else {
                return {
                  type: "merchant",
                  merchant_id: item.merchant_id!,
                  quantity: item.quantity,
                };
              }
            }),
          };
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
            selectedOrderIds: state.selectedOrderIds.filter(
              (id) => id !== orderId
            ),
          })),
        clearOrderSelection: () => set({ selectedOrderIds: [] }),

        setOrderFilters: (filters) =>
          set((state) => ({
            orderFilters: { ...state.orderFilters, ...filters },
          })),
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
            let itemPrice = 0;

            if (item.type === "product") {
              const basePrice = (item.product_price || 0) * item.quantity;
              const extrasPrice =
                item.extrasData?.reduce(
                  (sum, ex) => sum + (ex.price || 0) * item.quantity,
                  0
                ) ?? 0;
              itemPrice = basePrice + extrasPrice;
            } else {
              itemPrice = (item.merchant_price || 0) * item.quantity;
            }

            return total + itemPrice;
          }, 0),

        getFilteredOrders: () => {
          const { orders, orderFilters } = get();
          return orders.filter((order) => {
            if (
              orderFilters.status &&
              order.order_status !== orderFilters.status
            ) {
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

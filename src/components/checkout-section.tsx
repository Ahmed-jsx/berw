"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Loader2,
  Trash,
  ShoppingBag,
  Package,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useOrderStore } from "@/store/orderStore";
import { useCheckoutProcess } from "@/query/useOrderQueries";
import { useAuthStore } from "@/store/auth-store";

export function CheckoutSection() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const {
    cartItems,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    getCartTotalPrice,
    getCartItemsCount,
    formatCheckoutPayload,
  } = useOrderStore();

  const {
    checkout,
    isCheckingOut,
    checkoutError,
    checkoutData,
    isSuccess,
    reset,
  } = useCheckoutProcess();


  // Watch for successful checkout - redirect to thank-you page
  useEffect(() => {
    if (isSuccess && checkoutData) {
      const totalPrice =
        typeof checkoutData.total_price === "string"
          ? parseFloat(checkoutData.total_price)
          : checkoutData.total_price;

      // Store order data in sessionStorage for the thank-you page
      sessionStorage.setItem(
        "orderSuccess",
        JSON.stringify({
          orderId: checkoutData.order_id,
          orderCode: checkoutData.order_code,
          totalPrice: totalPrice,
          timestamp: Date.now(),
        })
      );

      // Clear cart after successful order
      clearCart();
      
      toast.success("Order placed successfully!");
      reset();
      
      // Redirect to thank-you page
      router.push("/thank-you");
    }
  }, [isSuccess, checkoutData, reset, clearCart, router]);

  useEffect(() => {
    if (checkoutError) {
      toast.error(checkoutError);
    }
  }, [checkoutError]);

  // Calculate totals
  const subtotal = useMemo(() => getCartTotalPrice(), [cartItems]);
  const total = subtotal;

  // Handle quantity updates
  const handleQuantityChange = (
    itemId: { product_id?: number; merchant_id?: number },
    change: number
  ) => {
    const item = cartItems.find(
      (item) =>
        (itemId.product_id &&
          item.type === "product" &&
          item.product_id === itemId.product_id) ||
        (itemId.merchant_id &&
          item.type === "merchant" &&
          item.merchant_id === itemId.merchant_id)
    );
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      toast.success("Item removed from cart");
    } else {
      updateCartItemQuantity(itemId, newQuantity);
    }
  };

  // Handle item removal
  const handleRemoveItem = (itemId: {
    product_id?: number;
    merchant_id?: number;
  }) => {
    const item = cartItems.find(
      (item) =>
        (itemId.product_id &&
          item.type === "product" &&
          item.product_id === itemId.product_id) ||
        (itemId.merchant_id &&
          item.type === "merchant" &&
          item.merchant_id === itemId.merchant_id)
    );
    const itemName =
      item?.type === "product" ? item.product_name : item?.merchant_name;
    removeFromCart(itemId);
    toast.success(`${itemName || "Item"} removed from cart`);
  };

  // Handle checkout
  const handleCheckout = () => {
    if (!isAuthenticated || !user) {
      // Store the checkout destination in sessionStorage
      sessionStorage.setItem("redirectAfterAuth", "/check-out");
      toast.error("Please sign in to continue");
      router.push("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const payload = formatCheckoutPayload(user.id);
    checkout(payload.user_id, payload.items);
  };

  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen max-w-[calc(100vw-6rem)] my-8 mx-auto rounded-[40px] bg-secondary p-6 pt-40">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="bg-white/10 rounded-full p-8 mb-6">
            <ShoppingCart className="h-16 w-16 text-white/60" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Your cart is empty
          </h2>
          <p className="text-white/70 mb-8 max-w-md">
            Looks like you haven't added any items to your cart yet. Explore our
            menu and find something delicious!
          </p>
          <Link href="/menu">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full">
              Explore Menu
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[calc(100vw-6rem)] my-8 mx-auto rounded-[40px] bg-secondary p-6 pt-40">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-secondary-foreground hover:bg-secondary-foreground/10"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-secondary-foreground">
              Check Out
            </h1>
            <p className="text-white/70 text-sm">
              {getCartItemsCount()} items in your cart
            </p>
          </div>
        </div>

        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-full disabled:opacity-50"
          onClick={handleCheckout}
          disabled={isCheckingOut || cartItems.length === 0}
        >
          {isCheckingOut ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Confirm Order"
          )}
        </Button>
      </div>

      {/* Error Display */}
      {checkoutError && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
          {checkoutError}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Details */}
        <Card className="p-6 bg-white/10 border-0 rounded-3xl">
          <h2 className="text-lg font-medium text-white mb-4">
            Order Details ({cartItems.length} items)
          </h2>

          <div className="space-y-4 mb-6">
            {cartItems.map((item, index) => {
              const isProduct = item.type === "product";
              const itemName = isProduct
                ? item.product_name
                : item.merchant_name;
              const itemPrice = isProduct
                ? item.product_price
                : item.merchant_price;
              const itemPhoto = isProduct
                ? item.product_photo
                : item.merchant_photo;
              const itemId = isProduct ? item.product_id : item.merchant_id;

              const basePrice = (itemPrice || 0) * item.quantity;
              const extrasTotal = isProduct
                ? item.extrasData?.reduce(
                    (sum, ex) =>
                      sum + (ex.price || 0) * ((ex as any).quantity || 1),
                    0
                  ) ?? 0
                : 0;
              const itemTotalPrice = basePrice + extrasTotal;

              return (
                <div
                  key={`${item.type}-${itemId}-${index}`}
                  className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Item Image with Type Badge */}
                  <div className="relative w-20 h-20 sm:w-16 sm:h-16 rounded-xl bg-gray-100 mx-auto sm:mx-0">
                    <Image
                      src={itemPhoto || "/bg1.png"}
                      alt={itemName || "Item"}
                      fill
                      className="object-cover rounded-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/bg1.png";
                      }}
                    />
                    <div className="absolute -top-1 -right-1 bg-primary rounded-full p-1">
                      {isProduct ? (
                        <ShoppingBag className="h-3 w-3 text-white" />
                      ) : (
                        <Package className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="text-center sm:text-left flex-1">
                        <h3 className="font-medium text-gray-900 break-words">
                          {itemName || "Unknown Item"}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {isProduct ? "Product" : "Merchandise"}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {(itemPrice || 0).toFixed(2)} EGP each × {item.quantity}
                        </p>
                        {isProduct && item.extras && Object.keys(item.extras).length > 0 && (
                          <div className="flex flex-wrap justify-center sm:justify-start gap-1 mt-2">
                            {item.extrasData?.map((extra) => {
                              const extraQuantity = (extra as any).quantity || 1;
                              const extraTotal = (extra.price || 0) * extraQuantity;
                              return (
                                <span
                                  key={extra.id}
                                  className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
                                >
                                  {extra.name} × {extraQuantity} (+{extraTotal.toFixed(2)} EGP)
                                </span>
                              );
                            })}
                          </div>
                        )}
                        <p className="text-primary font-bold text-lg mt-2">
                          Total: {itemTotalPrice.toFixed(2)} EGP
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="self-end sm:self-auto size-8 text-gray-400 hover:text-gray-600 flex-shrink-0"
                        onClick={() =>
                          handleRemoveItem(
                            isProduct
                              ? { product_id: item.product_id }
                              : { merchant_id: item.merchant_id }
                          )
                        }
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex justify-center sm:justify-end items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-gray-300 bg-transparent hover:bg-gray-50"
                      onClick={() =>
                        handleQuantityChange(
                          isProduct
                            ? { product_id: item.product_id }
                            : { merchant_id: item.merchant_id },
                          -1
                        )
                      }
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-gray-300 bg-transparent hover:bg-gray-50"
                      onClick={() =>
                        handleQuantityChange(
                          isProduct
                            ? { product_id: item.product_id }
                            : { merchant_id: item.merchant_id },
                          1
                        )
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <Link href="/menu">
            <Button className="w-full bg-secondary/90 text-secondary-foreground hover:bg-secondary-foreground/30 rounded-full py-3">
              Add More Items
            </Button>
          </Link>
        </Card>

        {/* Payment Summary */}
        <Card className="p-6 bg-white/10 border-0 rounded-3xl">
          <h2 className="text-lg font-medium text-white mb-4">
            Payment Summary
          </h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Subtotal</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">
                  {subtotal.toFixed(2)}
                </span>
                <span className="text-white/70">EGP</span>
              </div>
            </div>

            <hr className="border-white/20" />

            <div className="flex justify-between items-center">
              <span className="text-white font-medium">Total</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-white">
                  {total.toFixed(2)}
                </span>
                <span className="text-white/70">EGP</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/70 mb-6 leading-relaxed">
            Your order will be prepared fresh
          </p>

          {!isAuthenticated && (
            <div className="text-center text-white/70 mb-4">
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>{" "}
              to track your order
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useOrderStore } from "@/store/orderStore";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartButton() {
  const [open, setOpen] = useState(false);
  const cartItems = useOrderStore((state) => state.cartItems);
  const getCartTotalPrice = useOrderStore((state) => state.getCartTotalPrice);
  const removeFromCart = useOrderStore((state) => state.removeFromCart);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="relative rounded-full p-3 flex items-center  backdrop-blur-md bg-white/20 border-white/30 shadow-lg hover:bg-white/30 transition-all duration-200"
        >
          <span className="font-medium">Cart</span>
          {cartItems.length > 0 && (
            <span className="rounded-full bg-primary absolute -top-3 -right-4 text-white px-3 py-1 text-sm font-semibold shadow-md">
              {cartItems.length}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col w-full px-4 sm:max-w-lg backdrop-blur-md bg-white/20 border border-white/30 shadow-2xl rounded-xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold text-white">
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {cartItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-white/80 text-lg mb-2">Your cart is empty</p>
              <p className="text-white/60 text-sm">
                Add some delicious items to get started
              </p>
            </div>
          )}

          {cartItems.map((item, index) => {
            const extrasTotal =
              item.extrasData?.reduce(
                (sum, e) => sum + e.price * item.quantity,
                0
              ) ?? 0;
            const itemTotal =
              (item.product_price || 0) * item.quantity + extrasTotal;

            return (
              <Card
                key={index}
                className="p-4 backdrop-blur-md bg-white/10 border border-white/20 shadow-lg rounded-2xl hover:bg-white/15 transition-all duration-200"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={"/bg1.png"}
                      alt={item.product_name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-white/20"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-2">
                        {item.product_name}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20 text-xs px-2 py-1 h-auto rounded-lg ml-2"
                      >
                        <Trash2 className="h-4 w-4" /> Remove
                      </Button>
                    </div>

                    {/* Quantity and Price Row */}
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-4">
                        <span className="text-white/80 text-sm">
                          Qty:{" "}
                          <span className="font-medium text-white">
                            {item.quantity}
                          </span>
                        </span>
                        <span className="text-white/80 text-sm">
                          ${(item.product_price || 0).toFixed(2)} each
                        </span>
                      </div>
                    </div>

                    {/* Extras */}
                    {item.extrasData && item.extrasData.length > 0 && (
                      <div className="mb-3">
                        <p className="text-white/80 text-xs font-medium mb-1">
                          Extras:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {item.extrasData.map((e) => (
                            <span
                              key={e.id}
                              className="inline-block bg-white/10 text-white text-xs px-2 py-1 rounded-full border border-white/20"
                            >
                              {e.name} (+${e.price})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {item.notes && (
                      <div className="mb-3">
                        <p className="text-white/80 text-xs font-medium mb-1">
                          Note:
                        </p>
                        <p className="text-white/70 text-xs italic bg-white/5 p-2 rounded-lg border border-white/10">
                          {item.notes}
                        </p>
                      </div>
                    )}

                    {/* Item Total */}
                    <div className="flex justify-end">
                      <span className="text-primary bg-white/50 backdrop-blur-md rounded-full px-2 py-1 font-bold text-lg">
                        ${itemTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {cartItems.length > 0 && (
          <div className="mt-6 border-t border-white/30 py-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white text-lg font-medium">Total:</span>
              <span className="text-white text-2xl font-bold">
                ${getCartTotalPrice().toFixed(2)}
              </span>
            </div>
            <Link href={"/check-out"}>
              <Button className="w-full rounded-2xl text-lg py-6 backdrop-blur-md bg-primary/90 hover:bg-primary shadow-lg font-semibold transition-all duration-200 hover:scale-[1.02]">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

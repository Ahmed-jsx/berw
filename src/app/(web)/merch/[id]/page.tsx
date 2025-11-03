"use client";

import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Loader2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useOrderStore } from "@/store/orderStore";
import { toast } from "sonner";
import { useRelatedMerch } from "@/hooks/useRelatedMerch";
import { useMerch, useOneMerch } from "@/hooks/useMerch";

export default function SingleMerchPage() {
  const router = useRouter();
  const params = useParams();
  const { addToCart } = useOrderStore();
  const [quantity, setQuantity] = useState(1);

  // ✅ ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const { one } = useMerch();
  const { data: merch, isLoading, error } = useOneMerch(Number(params.id));

  // ✅ Fetch related merch based on category
  const { data: related = [], isLoading: loadingRelated } = useRelatedMerch(
    merch?.category
  );

  // ✅ Move useMemo here - BEFORE conditional returns
  const totalPrice = useMemo(() => {
    const base = parseFloat(merch?.merchant_price || "0");
    return (base * quantity).toFixed(2);
  }, [merch, quantity]);

  // ✅ Now it's safe to have conditional returns
  const handleQuantityChange = (change: number) => {
    setQuantity((q) => Math.max(1, q + change));
  };

  const handleAddToCart = () => {
    if (!merch) return;

    addToCart({
      type: "merchant",
      merchant_id: merch.merchant_id,
      merchant_name: merch.merchant_name,
      merchant_price: parseFloat(merch.merchant_price), // Parse string to number
      merchant_photo: merch.merchant_photo || merch.image || "/monkey1.png",
      quantity,
    });

    toast.success(`${merch.merchant_name} added to cart!`);
  };

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );

  if (error || !merch)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Merch Not Found</h2>
        <Button onClick={() => router.push("/merch")}>Back to Merch</Button>
      </div>
    );

  return (
    <main className="min-h-screen w-full lg:max-w-[calc(100vw-6rem)] lg:my-8 my-12 px-2 lg:mx-auto lg:rounded-[40px] relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] mt-12 rounded-default overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm"
          style={{
            backgroundImage: `url(${"/monkey1.png"})`,
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 px-4 md:px-8 lg:px-12 min-h-[70vh]">
          {/* Left - Image */}
          <div className="flex justify-center">
            <Image
              src={"/monkey1.png"}
              alt={merch.merchant_name}
              width={500}
              height={500}
              className="object-cover w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl shadow-2xl"
            />
          </div>

          {/* Right - Info */}
          <div className="text-white space-y-5">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              {merch.merchant_name}
            </h1>

            {merch.merchant_description && (
              <p className="text-white/90 text-base sm:text-lg max-w-lg leading-relaxed">
                {merch.merchant_description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-2xl font-bold w-8 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-2xl font-bold bg-white/20 backdrop-blur-lg border border-white/15 px-5 py-3 rounded-full">
                {totalPrice} <span className="text-sm text-white/80">EGP</span>
              </div>

              <Button
                onClick={handleAddToCart}
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-3 font-medium text-lg"
              >
                + Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Merch Section */}
      <section className="py-12 px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
          You may also like
        </h2>

        {loadingRelated ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : related.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {related
              .filter((item) => item.merchant_id !== merch.merchant_id)
              .slice(0, 4)
              .map((item) => (
                <motion.div
                  key={item.merchant_id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48">
                    <Image
                      src={item.image || "/fallback.png"}
                      alt={item.merchant_name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-1">
                      {item.merchant_name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.merchant_description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-primary">
                        {item.merchant_price} EGP
                      </span>
                      <Button
                        size="sm"
                        onClick={() =>
                          router.push(`/merch/${item.merchant_id}`)
                        }
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center">
            No related merch found.
          </p>
        )}
      </section>
    </main>
  );
}

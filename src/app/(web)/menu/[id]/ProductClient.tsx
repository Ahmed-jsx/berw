"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useExtras, type Extra } from "@/hooks/useExtras";
import { useProduct } from "@/hooks/useProducts";
import { useOrderStore } from "@/store/orderStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import ShareButtons from "@/components/product/ShareButtons";

// Form schema
const orderFormSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  extras: z.record(z.number(), z.number()).optional(), // Map of extra ID to quantity
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface ProductClientProps {
  id: number;
}

export default function ProductClient({ id }: ProductClientProps) {
  const router = useRouter();

  const { data: productResponse, isLoading, error } = useProduct(id);
  const { addToCart } = useOrderStore();
  const { data: extras = [], isLoading: loadingExtras } = useExtras();

  // Extract product from array response
  const product =
    productResponse && Array.isArray(productResponse)
      ? productResponse[0]
      : productResponse;

  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<{ [extraId: number]: number }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      quantity: 1,
      extras: {},
      notes: "",
    },
  });

  // Calculate total price including extras
  const totalPrice = useMemo(() => {
    if (!product) return 0;
    const basePrice = parseFloat(product.product_price) * quantity;
    const extrasPrice =
      Object.entries(selectedExtras).reduce((sum, [extraId, extraQuantity]) => {
        const extra = extras.find((e) => e.id === Number(extraId));
        return sum + (extra ? extra.price * extraQuantity : 0);
      }, 0) ?? 0;
    return basePrice + extrasPrice;
  }, [product, quantity, selectedExtras, extras]);

  // Handle extra quantity change
  const handleExtraQuantityChange = (extraId: number, change: number) => {
    setSelectedExtras((prev) => {
      const currentQuantity = prev[extraId] || 0;
      const newQuantity = currentQuantity + change;
      
      if (newQuantity <= 0) {
        // Remove extra if quantity is 0 or less
        const { [extraId]: removed, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [extraId]: newQuantity,
      };
    });
  };

  // Get quantity for an extra
  const getExtraQuantity = (extraId: number) => {
    return selectedExtras[extraId] || 0;
  };

  // Handle quantity change
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      setValue("quantity", newQuantity);
    }
  };

  // Handle form submission
  const onSubmit = (data: OrderFormData) => {
    if (!product) return;
    
    // Filter extras that have quantity > 0
    const extrasWithQuantity = Object.entries(selectedExtras)
      .filter(([_, quantity]) => quantity > 0)
      .reduce((acc, [id, quantity]) => ({ ...acc, [id]: quantity }), {});

    const cartItem = {
      type: "product" as const,
      product_id: product.product_id,
      product_name: product.product_name,
      product_price: parseFloat(product.product_price),
      product_photo: product.product_photo,
      product_category: product.product_category,
      quantity,
      extras: extrasWithQuantity,
      notes: data.notes,
    };

    addToCart(cartItem, extras as any);
    toast.success(`${product.product_name} added to cart!`, {
      duration: 1000,
    });
  };

  // Loading Skeleton Component
  const ProductPageSkeleton = () => (
    <>
      <main className="lg:min-h-screen w-full lg:max-w-[calc(100vw-6rem)] px-2 lg:mx-auto lg:rounded-[40px] relative overflow-hidden">
        {/* Hero Section Skeleton */}
        <section className="relative min-h-[80vh] sm:min-h-[75vh] lg:min-h-[80vh] pt-16 sm:pt-20 rounded-default overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Content Skeleton */}
          <div className="relative z-10 flex items-center min-h-[75vh] sm:min-h-[70vh] lg:min-h-[75vh] px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center w-full max-w-7xl mx-auto">
              {/* Left - Product image skeleton */}
              <div className="flex justify-center order-1 lg:order-1">
                <div className="relative">
                  <div className="w-56 h-56 xs:w-64 xs:h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-gray-400 rounded-2xl shadow-2xl animate-pulse" />
                  <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 bg-gray-500 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Right - Product info skeleton */}
              <div className="text-white space-y-4 sm:space-y-5 lg:space-y-6 order-2 lg:order-2">
                <div className="space-y-3">
                  {/* Title skeleton */}
                  <div className="h-8 sm:h-10 md:h-12 bg-white/30 rounded-lg w-3/4 animate-pulse" />
                  {/* Category badge skeleton */}
                  <div className="h-8 bg-white/20 rounded-full w-32 animate-pulse" />
                </div>

                {/* Description skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-white/20 rounded w-full animate-pulse" />
                  <div className="h-4 bg-white/20 rounded w-5/6 animate-pulse" />
                  <div className="h-4 bg-white/20 rounded w-4/6 animate-pulse" />
                </div>

                {/* Points badge skeleton */}
                <div className="h-10 bg-white/20 rounded-full w-64 animate-pulse" />

                {/* Quantity and Price skeleton */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-5 bg-white/20 rounded w-20 animate-pulse" />
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 sm:h-10 sm:w-10 bg-white/20 rounded-full animate-pulse" />
                      <div className="h-6 bg-white/20 rounded w-8 animate-pulse" />
                      <div className="h-9 w-9 sm:h-10 sm:w-10 bg-white/20 rounded-full animate-pulse" />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="h-14 sm:h-16 bg-white/20 rounded-full w-40 sm:w-48 animate-pulse" />
                    <div className="h-12 sm:h-14 bg-white/30 rounded-full w-full sm:w-40 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Extras and Notes Skeleton */}
      <section className="py-6 sm:py-8 lg:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
          <div className="lg:col-span-8 space-y-5 sm:space-y-6 lg:space-y-8">
            {/* Title skeleton */}
            <div className="h-8 sm:h-10 bg-gray-300 rounded-lg w-48 animate-pulse" />

            {/* Extras grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card
                  key={i}
                  className="p-4 sm:p-5 lg:p-6 bg-gray-100 border border-gray-200 animate-pulse"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                      <div className="h-5 w-5 bg-gray-300 rounded" />
                      <div className="h-5 bg-gray-300 rounded w-32" />
                    </div>
                    <div className="h-5 bg-gray-300 rounded w-16" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4 sm:space-y-5 lg:space-y-6">
            {/* Notes label skeleton */}
            <div className="h-6 sm:h-7 bg-gray-300 rounded w-48 animate-pulse" />
            {/* Notes input skeleton */}
            <div className="h-12 sm:h-14 bg-gray-200 rounded-full animate-pulse" />
            {/* Helper text skeleton */}
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    </>
  );

  // Loading state
  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto p-4 sm:p-6">
          <div className="bg-destructive/10 rounded-full p-3 sm:p-4 w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 flex items-center justify-center">
            <ShoppingCart className="h-7 w-7 sm:h-8 sm:w-8 text-destructive" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2">
            Product Not Found
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Go Back
            </Button>
            <Link href="/menu" className="w-full sm:w-auto">
              <Button className="bg-primary text-primary-foreground w-full">
                View Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="lg:min-h-screen w-full lg:max-w-[calc(100vw-6rem)] py-8  px-2 lg:mx-auto lg:rounded-[40px] relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] mt-12 lg:mt-0 sm:min-h-[75vh] lg:min-h-[80vh] pt-16 sm:pt-20  rounded-default overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: product.product_photo ? `url(${product.product_photo})` : "/bg1.png",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "blur(3px)",
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center min-h-[75vh] sm:min-h-[70vh] lg:min-h-[75vh] px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center w-full max-w-7xl mx-auto">
              {/* Left - Product image */}
              <div className="flex justify-center order-1 lg:order-1">
                <div className="relative">
                  <Image
                    width={500}
                    height={500}
                    src={product.product_photo || "/bg1.png"}
                    alt={product.product_name}
                    className="w-56 h-56 xs:w-64  xs:h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover rounded-2xl shadow-2xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = product.product_photo || "/bg1.png";
                    }}
                  />
                  {product.is_featured && (
                    <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-primary rounded-full p-2 sm:p-3">
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground fill-current" />
                    </div>
                  )}
                </div>
              </div>

              {/* Right - Product info */}
              <div className="text-white space-y-4 sm:space-y-5 lg:space-y-6 order-2 lg:order-2">
                <div>
                  <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 leading-tight">
                    {product.product_name}
                  </h1>
                  <div className="bg-primary/10 border border-primary/20 backdrop-blur-md rounded-full px-3 py-1.5 sm:px-4 sm:py-2 inline-block">
                    <span className="text-xs sm:text-sm md:text-base text-primary font-medium">
                      {product.product_category}
                    </span>
                  </div>
                </div>

                <p className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-lg">
                  {product.product_components}
                </p>

                {product.has_points && (
                  <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-md rounded-full px-3 py-1.5 sm:px-4 sm:py-2 w-fit">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                    <span className="text-xs sm:text-sm md:text-base text-green-300 font-medium">
                      Earn {product.points} points with this order
                    </span>
                  </div>
                )}

                {/* Quantity and Price */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <span className="text-sm sm:text-base text-white font-medium">
                      Quantity:
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                      >
                        <Minus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                      <span className="text-xl sm:text-2xl font-bold text-white w-10 sm:w-12 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                      >
                        <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col my-6 sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="text-xl sm:text-2xl lg:text-3xl bg-white/20 backdrop-blur-lg border border-white/15 px-4 py-2.5 sm:px-5 sm:py-3 lg:px-6 lg:py-3 rounded-full font-bold text-primary text-center sm:text-left">
                      {totalPrice.toFixed(2)}{" "}
                      <span className="text-sm sm:text-base lg:text-lg text-primary/80">
                        EGP
                      </span>
                    </div>

                    <Button
                      onClick={handleSubmit(onSubmit)}
                      size="lg"
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 sm:px-8 sm:py-3 rounded-full text-base sm:text-lg"
                    >
                      + Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Extras and Notes */}
      <section className="py-6 sm:py-8 lg:py-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10">
          {/* Titles Row */}
          <div className="lg:col-span-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Any extras?
            </h2>
          </div>
          {/* Share title - hidden on mobile, shown on desktop */}
          <div className="hidden lg:block  lg:col-span-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Share this product
            </h2>
          </div>
          
          {/* Content Row */}
          <div className="lg:col-span-8 h-full w-full space-y-5 sm:space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 grid-rows-2 sm:grid-cols-2  w-full gap-4 sm:gap-5 lg:gap-6">
              {extras.map((extra) => {
                const extraQuantity = getExtraQuantity(extra.id);
                return (
                  <Card
                    key={extra.id}
                    className="p-4 sm:p-5 lg:p-6 bg-card border border-border hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <Label
                          htmlFor={`extra-${extra.id}`}
                          className="text-sm sm:text-base lg:text-lg font-medium cursor-pointer truncate flex-1"
                        >
                          {extra.name}
                        </Label>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-sm sm:text-base lg:text-lg text-primary font-bold whitespace-nowrap">
                          {extra.price} EGP
                        </span>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleExtraQuantityChange(extra.id, -1)}
                            disabled={extraQuantity <= 0}
                            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                          >
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <span className="text-sm sm:text-base font-bold text-foreground w-6 sm:w-8 text-center">
                            {extraQuantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleExtraQuantityChange(extra.id, 1)}
                            className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {Object.keys(selectedExtras).length > 0 && (
              <Card className="p-3 sm:p-4 bg-primary/10 border border-primary/20">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm sm:text-base font-medium text-foreground">
                      Selected Extras:
                    </span>
                    <span className="text-sm sm:text-base lg:text-lg font-bold text-primary whitespace-nowrap">
                      +
                      {Object.entries(selectedExtras).reduce((sum, [id, qty]) => {
                        const extra = extras.find((e) => e.id === Number(id));
                        return sum + (extra ? extra.price * qty : 0);
                      }, 0)}{" "}
                      EGP
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(selectedExtras)
                      .filter(([_, qty]) => qty > 0)
                      .map(([id, qty]) => {
                        const extra = extras.find((e) => e.id === Number(id));
                        if (!extra) return null;
                        return (
                          <span
                            key={id}
                            className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full border border-primary/30"
                          >
                            {extra.name} x{qty} (+{extra.price * qty} EGP)
                          </span>
                        );
                      })}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Second Column - Share Buttons */}
          <div className="lg:col-span-4 py-12 lg:py-0 h-full space-y-4 sm:space-y-6">
            {/* Share title - shown on mobile, hidden on desktop */}
            <div className="lg:hidden">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                Share this product
              </h2>
            </div>
            <Card className="p-4 sm:p-5 h-full justify-center row-span-2 lg:p-6 bg-primary/10 backdrop-blur-lg border border-primary/20 hover:shadow-md transition-shadow">
              <ShareButtons
                productId={product.product_id}
                productName={product.product_name}
                productPrice={parseFloat(product.product_price)}
                productImage={product.product_photo}
              />
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}


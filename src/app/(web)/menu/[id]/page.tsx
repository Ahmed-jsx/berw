"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExtras, type Extra } from "@/hooks/useExtras";
import { useProduct } from "@/hooks/useProducts";
import { useOrderStore } from "@/store/orderStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface PageProps {
  params: {
    id: string;
  };
}

// Form schema
const orderFormSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1"),
  extras: z.array(z.number()).optional(),
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

function SingleProductPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);

  const { data: productResponse, isLoading, error } = useProduct(id);
  const { addToCart } = useOrderStore();
  const { data: extras = [], isLoading: loadingExtras } = useExtras();

  // Extract product from array response
  const product =
    productResponse && Array.isArray(productResponse)
      ? productResponse[0]
      : productResponse;

  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      quantity: 1,
      extras: [],
      notes: "",
    },
  });

  // Calculate total price including extras
  const totalPrice = useMemo(() => {
    if (!product) return 0;
    const basePrice = parseFloat(product.product_price) * quantity;
    const extrasPrice =
      selectedExtras.reduce((sum, extraId) => {
        const extra = extras.find((e) => e.id === extraId);
        return sum + (extra ? extra.price * quantity : 0);
      }, 0) ?? 0;
    return basePrice + extrasPrice;
  }, [product, quantity, selectedExtras, extras]);

  // Handle extra selection
  const handleExtraChange = (extraId: number, checked: boolean) => {
    if (checked) {
      setSelectedExtras((prev) => [...prev, extraId]);
    } else {
      setSelectedExtras((prev) => prev.filter((id) => id !== extraId));
    }
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

    const extrasData: Extra[] = extras.filter((e) =>
      selectedExtras.includes(e.id)
    );

    const cartItem = {
      product_id: product.product_id,
      product_name: product.product_name,
      product_price: parseFloat(product.product_price),
      product_photo: product.product_photo,
      product_category: product.product_category,
      quantity,
      extras: selectedExtras,
      notes: data.notes,
    };

    addToCart(cartItem, extras);
    toast.success(`${product.product_name} added to cart!`, {
      duration: 3000,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Loading Product
          </h2>
          <p className="text-muted-foreground">Please wait...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-destructive/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ShoppingCart className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Product Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              Go Back
            </Button>
            <Link href="/menu">
              <Button className="bg-primary text-primary-foreground">
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
      <main className="min-h-screen max-w-7xl my-8 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] rounded-default overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("/bg1.png")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "blur(3px)",
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center min-h-[70vh] px-4 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full">
              {/* Left - Product image */}
              <div className="flex justify-center">
                <div className="relative">
                  <Image
                    width={500}
                    height={500}
                    src={"/bg1.png"}
                    alt={product.product_name}
                    className="w-72 h-72 md:w-96 md:h-96 object-cover rounded-2xl shadow-2xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/bg1.png";
                    }}
                  />
                  {product.is_featured && (
                    <div className="absolute -top-4 -right-4 bg-primary rounded-full p-3">
                      <Star className="h-6 w-6 text-primary-foreground fill-current" />
                    </div>
                  )}
                </div>
              </div>

              {/* Right - Product info */}
              <div className="text-white space-y-6">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">
                    {product.product_name}
                  </h1>
                  <div className="bg-secondary/80 backdrop-blur-md rounded-full px-4 py-2 inline-block">
                    <span className="text-secondary-foreground font-medium">
                      {product.product_category}
                    </span>
                  </div>
                </div>

                <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-lg">
                  {product.product_components}
                </p>

                {product.has_points && (
                  <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-md rounded-full px-4 py-2 w-fit">
                    <Star className="h-4 w-4 text-green-400" />
                    <span className="text-green-300 font-medium">
                      Earn {product.points} points with this order
                    </span>
                  </div>
                )}

                {/* Quantity and Price */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-white font-medium">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="h-10 w-10 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-2xl font-bold text-white w-12 text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        className="h-10 w-10 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-2xl sm:text-3xl bg-white/20 backdrop-blur-lg border border-white/15 px-6 py-3 rounded-full font-bold text-primary">
                      {totalPrice.toFixed(2)}{" "}
                      <span className="text-lg text-primary/80">EGP</span>
                    </div>

                    <Button
                      onClick={handleSubmit(onSubmit)}
                      size="lg"
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-full text-lg"
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
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              Any extras?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {extras.map((extra) => (
                <Card
                  key={extra.id}
                  className="p-6 bg-card border border-border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={`extra-${extra.id}`}
                        checked={selectedExtras.includes(extra.id)}
                        onCheckedChange={(checked) =>
                          handleExtraChange(extra.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`extra-${extra.id}`}
                        className="text-lg font-medium cursor-pointer"
                      >
                        {extra.name}
                      </Label>
                    </div>
                    <span className="text-primary font-bold">
                      +{extra.price} EGP
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {selectedExtras.length > 0 && (
              <Card className="p-4 bg-primary/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    Selected Extras:
                  </span>
                  <span className="font-bold text-primary">
                    +
                    {selectedExtras.reduce((sum, id) => {
                      const extra = extras.find((e) => e.id === id);
                      return sum + (extra ? extra.price * quantity : 0);
                    }, 0)}{" "}
                    EGP
                  </span>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Label
              className="text-xl md:text-2xl font-medium text-foreground"
              htmlFor="notes"
            >
              Add Special Note (Optional)
            </Label>
            <Input
              {...register("notes")}
              type="text"
              id="notes"
              className="rounded-full p-4 placeholder:text-muted-foreground bg-background border-input w-full"
              placeholder="Add your note here..."
            />
            <p className="text-sm text-muted-foreground">
              Let us know about any dietary restrictions or special preferences.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default SingleProductPage;

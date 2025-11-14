"use client";

import ItemBadge from "@/components/ItemBadge";
import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useProducts } from "@/hooks/useProducts";
import { useCheckoutProcess } from "@/query/useOrderQueries";
import { useCoffeeStore } from "@/store/coffeeStore";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

// Loading Skeleton Component
function ProductCardSkeleton() {
  return (
    <div className="relative rounded-2xl h-[350px] w-full max-w-[400px] overflow-hidden bg-gray-200 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400" />
      <div className="absolute inset-0 flex flex-col justify-end p-5 space-y-3">
        <div className="h-6 bg-gray-500 rounded w-3/4" />
        <div className="h-4 bg-gray-500 rounded w-full" />
        <div className="h-4 bg-gray-500 rounded w-2/3" />
        <div className="h-10 bg-gray-500 rounded w-1/2 mt-2" />
      </div>
    </div>
  );
}

export function ExploreCoffee() {
  const router = useRouter();
  const { active, setActive } = useCoffeeStore();
  const { data: products, isLoading, error } = useProducts();
  const { checkout, isCheckingOut, checkoutError } = useCheckoutProcess();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // ✅ Safe category extraction
  const categories = useMemo(() => {
    if (!products) return [];

    const seen = new Set<string>();

    return products.reduce<{ label: string; value: string; image: string }[]>(
      (acc, p) => {
        const rawCategory = p.product_category ?? "Uncategorized";
        const normalized = rawCategory.trim().toLowerCase();

        if (!seen.has(normalized)) {
          seen.add(normalized);
          acc.push({
            label: rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1),
            value: normalized,
            image: "/bg1.png",
          });
        }
        return acc;
      },
      []
    );
  }, [products]);

  // ✅ Ensure active category is valid
  useEffect(() => {
    if (
      categories.length > 0 &&
      (!active || !categories.find((c) => c.value === active))
    ) {
      setActive(categories[0].value as any);
    }
  }, [categories, active, setActive]);

  // ✅ Filter products safely
  const visible = useMemo(() => {
    if (!products) return [];

    let filteredProducts = [];

    const safeCategory = (val: string | null | undefined) =>
      (val ?? "Uncategorized").trim().toLowerCase();

    if (!active || !categories.find((c) => c.value === active)) {
      if (categories.length > 0) {
        const firstCategoryValue = categories[0].value;
        filteredProducts = products.filter(
          (p) => safeCategory(p.product_category) === firstCategoryValue
        );
      } else {
        filteredProducts = products;
      }
    } else {
      filteredProducts = products.filter(
        (p) => safeCategory(p.product_category) === active
      );
    }

    return filteredProducts.slice(0, 6);
  }, [products, active, categories]);

  // ✅ Embla Carousel API handlers
  const onSelect = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!api) return;

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  // Reset carousel when category changes
  useEffect(() => {
    if (api) {
      api.scrollTo(0);
    }
  }, [active, api]);

  const activeCategoryLabel =
    categories.find((c) => c.value === active)?.label ||
    categories[0]?.label ||
    "Coffee";

  const effectiveActive =
    active && categories.find((c) => c.value === active)
      ? active
      : categories[0]?.value || null;

  return (
    <main className="w-full bg-white">
      <section className="mx-auto max-w-6xl px-6 lg:py-10">


        {/* ✅ Category badges */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <ItemBadge
              key={cat.value}
              title={cat.label}
              image={cat.image}
              active={effectiveActive === cat.value}
              onClick={() => setActive(cat.value as any)}
              size="md"
            />
          ))}
        </div>

        <h3 className="mt-8 text-center text-3xl font-bold text-teal-800">
          {activeCategoryLabel}
        </h3>

        {/* ✅ Loading & Error States */}
        {isLoading && (
          <div className="mt-8">
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
            <div className="sm:hidden">
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[85vw] snap-center">
                    <ProductCardSkeleton />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="mt-8 text-center">
            <div className="inline-flex flex-col items-center gap-3 p-6 rounded-lg bg-red-50 border border-red-200 max-w-md mx-auto">
              <p className="text-red-600 font-medium">
                Failed to load products
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}
        {checkoutError && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              <span className="font-medium">{checkoutError}</span>
            </div>
          </div>
        )}

        {/* ✅ Desktop Grid */}
        {!isLoading && !error && (
          <div className="mt-8 hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((item) => (
              <ItemCard
                key={item.product_id}
                id={item.product_id}
                name={item.product_name}
                description={item.product_components || ""}
                price={Number(item.product_price)}
                product_photo={item.product_photo || ""}
              />
            ))}

            {visible.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="inline-flex flex-col items-center gap-3 p-6 rounded-lg bg-gray-50 border border-gray-200">
                  <p className="text-gray-600 font-medium">
                    No items yet in this category.
                  </p>
                  <p className="text-sm text-gray-500">
                    Check back later for new products!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ✅ Mobile Carousel */}
        {!isLoading && !error && visible.length > 0 && (
          <div className="sm:hidden mt-8 relative px-2">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: visible.length > 1,
                dragFree: false,
              }}
              className="w-full"
            >
              <div className="relative">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {visible.map((item) => (
                    <CarouselItem
                      key={item.product_id}
                      className="pl-2 md:pl-4 basis-full"
                    >
                      <div className="px-2">
                        <ItemCard
                          id={item.product_id}
                          name={item.product_name}
                          description={item.product_components || ""}
                          price={Number(item.product_price)}
                          product_photo={item.product_photo || ""}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Arrows */}
                {visible.length > 1 && (
                  <>
                    <CarouselPrevious
                      className="left-2 md:left-4 h-10 w-10 bg-white/90 hover:bg-white shadow-lg border-0 disabled:opacity-30"
                      aria-label="Previous product"
                    />
                    <CarouselNext
                      className="right-2 md:right-4 h-10 w-10 bg-white/90 hover:bg-white shadow-lg border-0 disabled:opacity-30"
                      aria-label="Next product"
                    />
                  </>
                )}
              </div>
            </Carousel>

            {/* Enhanced Indicators */}
            {visible.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <div className="flex items-center gap-2">
                  {visible.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => api?.scrollTo(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === current
                          ? "bg-teal-600 w-8"
                          : "bg-gray-300 w-2 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                      aria-current={i === current ? "true" : "false"}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-2 font-medium">
                  {current + 1} / {visible.length}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Empty State for Mobile */}
        {!isLoading && !error && visible.length === 0 && (
          <div className="sm:hidden mt-8 text-center px-4">
            <div className="inline-flex flex-col items-center gap-3 p-6 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-gray-600 font-medium">
                No items yet in this category.
              </p>
              <p className="text-sm text-gray-500">
                Check back later for new products!
              </p>
            </div>
          </div>
        )}

        {/* ✅ See More Button */}
        {!isLoading && !error && visible.length > 0 && (
          <div className="mt-10 text-center">
            <Button
              onClick={() => router.push("/menu")}
              className="bg-secondary hover:bg-secondary/80 text-white shadow-lg transition-colors px-8 py-6 text-base font-semibold"
              aria-label="View all products in menu"
            >
              See More in Menu
            </Button>
          </div>
        )}

        {isCheckingOut && (
          <div className="text-center mt-6 text-teal-600">
            Processing your order...
          </div>
        )}
      </section>
    </main>
  );
}

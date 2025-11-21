"use client";

import ItemBadge from "@/components/ItemBadge";
import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useCheckoutProcess } from "@/query/useOrderQueries";
import { useCoffeeStore } from "@/store/coffeeStore";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { fetchExtras } from "@/lib/fetchers/extras";

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
  const queryClient = useQueryClient();
  const { active, setActive } = useCoffeeStore();
  const { data: products, isLoading, error } = useProducts();
  const { checkout, isCheckingOut, checkoutError } = useCheckoutProcess();

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

  // Prefetch individual product data and extras when visible products are loaded
  useEffect(() => {
    if (visible.length > 0) {
      // Prefetch extras once (same for all products)
      queryClient.prefetchQuery({
        queryKey: ["extras"],
        queryFn: fetchExtras,
        staleTime: 1000 * 60 * 5, // 5 minutes
      });

      // Prefetch individual product data for each visible item
      visible.forEach((item) => {
        queryClient.prefetchQuery({
          queryKey: ["products", item.product_id],
          queryFn: () => api.products.getById(item.product_id),
          staleTime: 1000 * 60 * 5, // 5 minutes
        });
      });
    }
  }, [visible, queryClient]);

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
            <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:overflow-visible snap-x snap-mandatory">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-none w-[280px] sm:w-auto snap-center mr-4 sm:mr-0">
                  <ProductCardSkeleton />
                </div>
              ))}
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

        {/* ✅ Mobile: Horizontal Scroll | Desktop: Grid */}
        {!isLoading && !error && (
          <div className="mt-8 flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 sm:overflow-visible snap-x snap-mandatory">
            {visible.map((item) => (
              <div
                key={item.product_id}
                className="flex-none w-[280px] sm:w-auto snap-center mr-4 sm:mr-0"
              >
                <ItemCard
                  id={item.product_id}
                  name={item.product_name}
                  description={item.product_components || ""}
                  price={Number(item.product_price)}
                  product_photo={item.product_photo || ""}
                  route="/menu"
                />
              </div>
            ))}

            {visible.length === 0 && (
              <div className="col-span-full text-center py-12 min-w-full">
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

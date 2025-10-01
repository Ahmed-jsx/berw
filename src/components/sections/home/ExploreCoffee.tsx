"use client";

import { useMemo, useEffect } from "react";
import ItemBadge from "@/components/ItemBadge";
import ItemCard from "@/components/ItemCard";
import { useCoffeeStore } from "@/store/coffeeStore";
import { useProducts } from "@/hooks/useProducts";
import { useCheckoutProcess } from "@/query/useOrderQueries";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { useOrderStore } from "@/store/orderStore";

export function ExploreCoffee() {
  const { active, setActive } = useCoffeeStore();
  const { data: products, isLoading, error } = useProducts();
  const { checkout, isCheckingOut, checkoutError } = useCheckoutProcess();
  const { user, isAuthenticated } = useAuthStore();

  // ✅ Extract unique categories (remove duplicates, normalize case)
  const categories = useMemo(() => {
    if (!products) return [];
    const seen = new Set<string>();
    return products.reduce<{ label: string; value: string; image: string }[]>(
      (acc, p) => {
        const normalized = p.product_category.trim().toLowerCase();
        if (!seen.has(normalized)) {
          seen.add(normalized);
          acc.push({
            label:
              p.product_category.charAt(0).toUpperCase() +
              p.product_category.slice(1),
            value: normalized,
            image: "/bg1.png",
          });
        }
        return acc;
      },
      []
    );
  }, [products]);

  // ✅ Set first category as active when categories are loaded
  useEffect(() => {
    if (
      categories.length > 0 &&
      (!active || !categories.find((c) => c.value === active))
    ) {
      setActive(categories[0].value);
    }
  }, [categories, active, setActive]);

  const visible = useMemo(() => {
    if (!products) return [];
    if (!active || !categories.find((c) => c.value === active)) {
      // If no active category or invalid category, show first category's products
      if (categories.length > 0) {
        const firstCategoryValue = categories[0].value;
        return products.filter(
          (p) => p.product_category.trim().toLowerCase() === firstCategoryValue
        );
      }
      return products;
    }
    return products.filter(
      (p) => p.product_category.trim().toLowerCase() === active
    );
  }, [products, active, categories]);

  // ✅ Get active category label with fallback
  const activeCategoryLabel = useMemo(() => {
    if (!active || !categories.find((c) => c.value === active)) {
      return categories.length > 0 ? categories[0].label : "Coffee";
    }
    return categories.find((c) => c.value === active)?.label ?? "Coffee";
  }, [categories, active]);

  // ✅ Get the effective active category (for badge highlighting)
  const effectiveActive = useMemo(() => {
    if (!active || !categories.find((c) => c.value === active)) {
      return categories.length > 0 ? categories[0].value : null;
    }
    return active;
  }, [active, categories]);

  const userId = user?.id;

  return (
    <main className="min-h-dvh w-full bg-white">
      <section className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-center text-sm font-semibold tracking-wide text-teal-700">
          Explore the Coffee World
        </h2>

        {/* Category Badges */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <ItemBadge
              key={cat.value}
              title={cat.label}
              image={cat.image}
              active={effectiveActive === cat.value}
              onClick={() => setActive(cat.value)}
              size="md"
            />
          ))}
        </div>

        {/* Heading */}
        <h3 className="mt-8 text-center text-3xl font-bold text-teal-800">
          {activeCategoryLabel}
        </h3>

        {/* Loading/Error */}
        {isLoading && (
          <div className="text-center mt-6 text-gray-500">Loading...</div>
        )}
        {error && (
          <div className="text-center text-red-500">
            Failed to load products.
          </div>
        )}
        {checkoutError && (
          <div className="text-center text-red-600 mt-4">{checkoutError}</div>
        )}

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((item) => (
            <ItemCard
              key={item.product_id}
              id={item.product_id}
              name={item.product_name}
              description={item.product_components}
              price={Number(item.product_price)}
              image={item.product_photo}
              onOrder={() => {
                if (!isAuthenticated) {
                  toast.error("Please login to add items");
                  return;
                }

                // ✅ Add to Zustand cart instead of checkout
                useOrderStore.getState().addToCart({
                  product_id: item.product_id,
                  quantity: 1,
                  extras: [],
                  product_name: item.product_name,
                  product_price: Number(item.product_price),
                  product_category: item.product_category,
                });

                toast.success(`${item.product_name} added to cart`, {
                  duration: 500,
                });
              }}
            />
          ))}

          {!isLoading && visible.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No items yet in this category.
            </div>
          )}
        </div>

        {/* Loading checkout */}
        {isCheckingOut && (
          <div className="text-center mt-6 text-teal-600">
            Processing your order...
          </div>
        )}
      </section>
    </main>
  );
}

"use client";

import ItemBadge from "@/components/ItemBadge";
import ItemCard from "@/components/ItemCard";
import { useProducts } from "@/hooks/useProducts";
import { useCheckoutProcess } from "@/query/useOrderQueries";
import { useAuthStore } from "@/store/auth-store";
import { useCoffeeStore } from "@/store/coffeeStore";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

export function ExploreCoffee() {
  const router = useRouter();
  const { active, setActive } = useCoffeeStore();
  const { data: products, isLoading, error } = useProducts();
  const { checkout, isCheckingOut, checkoutError } = useCheckoutProcess();
  const { user } = useAuthStore();

  const [currentIndex, setCurrentIndex] = useState(0);

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
      setActive(categories[0].value);
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

  // ✅ Auto-scroll effect for mobile carousel
  useEffect(() => {
    if (visible.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visible.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [visible.length]);

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
        <h2 className="text-center text-sm font-semibold tracking-wide text-teal-700">
          Explore the Coffee World
        </h2>

        {/* ✅ Category badges */}
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

        <h3 className="mt-8 text-center text-3xl font-bold text-teal-800">
          {activeCategoryLabel}
        </h3>

        {/* ✅ Loading & Error States */}
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

        {/* ✅ Desktop Grid */}
        <div className="mt-8 hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((item) => (
            <ItemCard
              key={item.product_id}
              id={item.product_id}
              name={item.product_name}
              description={item.product_components || ""}
              price={Number(item.product_price)}
              product_photo={item.product_photo || ""}
              product_data={item.product_data || ""}
            />
          ))}

          {!isLoading && visible.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No items yet in this category.
            </div>
          )}
        </div>

        {/* ✅ Mobile Carousel */}
        <div className="sm:hidden mt-6 relative">
          <Carousel className="w-full max-w-[95vw] mx-auto">
            <CarouselContent
              className="transition-transform duration-700"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
                display: "flex",
              }}
            >
              {visible.map((item) => (
                <CarouselItem
                  key={item.product_id}
                  className="basis-full flex-shrink-0"
                >
                  <ItemCard
                    id={item.product_id}
                    name={item.product_name}
                    description={item.product_components || ""}
                    price={Number(item.product_price)}
                    product_photo={item.product_photo || ""}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* ✅ Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {visible.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === currentIndex
                    ? "bg-teal-600 w-4"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ✅ See More Button */}
        <div className="mt-10 text-center">
          <Button
            onClick={() => router.push("/menu")}
            className="bg-secondary hover:bg-secondary/80 text-white shadow-lg transition-colors"
          >
            See More in Menu
          </Button>
        </div>

        {isCheckingOut && (
          <div className="text-center mt-6 text-teal-600">
            Processing your order...
          </div>
        )}
      </section>
    </main>
  );
}

"use client";

import SectionHeader from "@/components/global/SectionHeader";
import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
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

const FeaturedItems = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: products, isLoading, error } = useProducts();

  // Filter and limit to a maximum of 4 featured items
  const isFeatured = products?.filter((item) => item.is_featured);
  const items = isFeatured?.slice(0, 4) ?? [];
  const ItemsHaveFeatured = items.length > 0;

  // Prefetch individual product data and extras when products are loaded
  useEffect(() => {
    if (items.length > 0) {
      // Prefetch extras once (same for all products)
      queryClient.prefetchQuery({
        queryKey: ["extras"],
        queryFn: fetchExtras,
        staleTime: 1000 * 60 * 5, // 5 minutes
      });

      // Prefetch individual product data for each featured item
      items.forEach((item) => {
        queryClient.prefetchQuery({
          queryKey: ["products", item.product_id],
          queryFn: () => api.products.getById(item.product_id),
          staleTime: 1000 * 60 * 5, // 5 minutes
        });
      });
    }
  }, [items, queryClient]);

  // Handler for the button click
  const handleShowAllMenu = () => {
    router.push("/menu");
  };

  return (
    <section className="max-w-[1220px] px-8 lg:px-0 py-24 mx-auto">
      <SectionHeader title="Explore Hot Items" />

      {/* ✅ Loading State */}
      {isLoading && (
        <div className="mt-12">
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible snap-x snap-mandatory">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-none w-[280px] md:w-auto snap-center mr-4 md:mr-0">
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Error State */}
      {error && (
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-3 p-6 rounded-lg bg-red-50 border border-red-200 max-w-md mx-auto">
            <p className="text-red-600 font-medium">
              Failed to load featured products
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

      {/* ✅ No Featured Items State */}
      {!isLoading && !error && !ItemsHaveFeatured && (
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-3 p-6 rounded-lg bg-gray-50 border border-gray-200 max-w-md mx-auto">
            <p className="text-gray-600 font-medium">
              No featured items available
            </p>
            <p className="text-sm text-gray-500">
              Check back later for featured products!
            </p>
            <Button
              onClick={handleShowAllMenu}
              className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg transition-colors mt-4"
              aria-label="View full menu"
            >
              View Full Menu
            </Button>
          </div>
        </div>
      )}

      {/* ✅ Mobile: Horizontal Scroll | Desktop: Grid */}
      {!isLoading && !error && ItemsHaveFeatured && (
        <>
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible snap-x snap-mandatory mt-12">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="flex-none w-[280px] md:w-auto snap-center mr-4 md:mr-0"
              >
                <ItemCard
                  isFeatured={item.is_featured}
                  id={item.product_id}
                  name={item.product_name}
                  description={item.product_components}
                  price={Number(item.product_price)}
                  product_photo={item.product_photo}
                />
              </div>
            ))}
          </div>

          {/* ✅ Show All Button */}
          <div className="flex items-center justify-center mt-12">
            <Button
              onClick={handleShowAllMenu}
              className="bg-secondary hover:bg-secondary/80 text-white shadow-lg transition-colors px-8 py-6 text-base font-semibold"
              aria-label="View all products in menu"
            >
              Show All Menu
            </Button>
          </div>
        </>
      )}
    </section>
  );
};

export default FeaturedItems;

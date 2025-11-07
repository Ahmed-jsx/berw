"use client";

import SectionHeader from "@/components/global/SectionHeader";
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
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

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
  const { data: products, isLoading, error } = useProducts();

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Filter and limit to a maximum of 4 featured items
  const isFeatured = products?.filter((item) => item.is_featured);
  const items = isFeatured?.slice(0, 4) ?? [];
  const ItemsHaveFeatured = items.length > 0;

  // Handler for the button click
  const handleShowAllMenu = () => {
    router.push("/menu");
  };

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

  return (
    <section className="max-w-[1220px] px-8 lg:px-0 py-24 mx-auto">
      <SectionHeader title="Explore Hot Items" />

      {/* ✅ Loading State */}
      {isLoading && (
        <div className="mt-12">
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
          <div className="md:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[85vw] snap-center">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
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

      {/* ✅ Desktop Grid */}
      {!isLoading && !error && ItemsHaveFeatured && (
        <>
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {items.map((item) => (
              <ItemCard
                isFeatured={item.is_featured}
                key={item.product_id}
                id={item.product_id}
                name={item.product_name}
                description={item.product_components}
                price={Number(item.product_price)}
                product_photo={item.product_photo}
              />
            ))}
          </div>

          {/* ✅ Mobile Carousel */}
          <div className="md:hidden mt-12 relative px-2">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: items.length > 1,
                dragFree: false,
              }}
              className="w-full"
            >
              <div className="relative">
                <CarouselContent className="-ml-2">
                  {items.map((item) => (
                    <CarouselItem
                      key={item.product_id}
                      className="pl-2 basis-full"
                    >
                      <div className="px-2">
                        <ItemCard
                          isFeatured={item.is_featured}
                          id={item.product_id}
                          name={item.product_name}
                          description={item.product_components}
                          price={Number(item.product_price)}
                          product_photo={item.product_photo}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Arrows */}
                {items.length > 1 && (
                  <>
                    <CarouselPrevious
                      className="left-2 h-10 w-10 bg-white/90 hover:bg-white shadow-lg border-0 disabled:opacity-30"
                      aria-label="Previous featured item"
                    />
                    <CarouselNext
                      className="right-2 h-10 w-10 bg-white/90 hover:bg-white shadow-lg border-0 disabled:opacity-30"
                      aria-label="Next featured item"
                    />
                  </>
                )}
              </div>
            </Carousel>

            {/* Enhanced Indicators */}
            {items.length > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <div className="flex items-center gap-2">
                  {items.map((_, i) => (
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
                  {current + 1} / {items.length}
                </span>
              </div>
            )}
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

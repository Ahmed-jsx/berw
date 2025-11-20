"use client";

import SectionHeader from "@/components/global/SectionHeader";
import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { useMerchants } from "@/hooks/useMerch";
import { useRouter } from "next/navigation";

// Loading Skeleton Component
function MerchCardSkeleton() {
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

const FeaturedMerch = () => {
  const router = useRouter();
  const { data: merchants, isLoading, error } = useMerchants();

  // Limit to a maximum of 4 merchants
  const items = merchants?.slice(0, 4) ?? [];
  const hasMerchants = items.length > 0;

  // Handler for the button click
  const handleShowAllMerch = () => {
    router.push("/merch");
  };

  return (
    <section className="max-w-[1220px] px-8 lg:px-0 py-24 mx-auto">
      <SectionHeader title="Shop Our Merch" />

      {/* ✅ Loading State */}
      {isLoading && (
        <div className="mt-12">
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible snap-x snap-mandatory">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-none w-[280px] md:w-auto snap-center mr-4 md:mr-0">
                <MerchCardSkeleton />
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
              Failed to load merchandise
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

      {/* ✅ No Merchants State */}
      {!isLoading && !error && !hasMerchants && (
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-3 p-6 rounded-lg bg-gray-50 border border-gray-200 max-w-md mx-auto">
            <p className="text-gray-600 font-medium">
              No merchandise available
            </p>
            <p className="text-sm text-gray-500">
              Check back later for our merchandise!
            </p>
            <Button
              onClick={handleShowAllMerch}
              className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg transition-colors mt-4"
              aria-label="View all merchandise"
            >
              View All Merch
            </Button>
          </div>
        </div>
      )}

      {/* ✅ Mobile: Horizontal Scroll | Desktop: Grid */}
      {!isLoading && !error && hasMerchants && (
        <>
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible snap-x snap-mandatory mt-12">
            {items.map((item) => (
              <div
                key={item.merchant_id}
                className="flex-none w-[280px] md:w-auto snap-center mr-4 md:mr-0"
              >
                <ItemCard
                  id={item.merchant_id}
                  name={item.merchant_name}
                  description={item.merchant_description}
                  price={Number(item.merchant_price)}
                  product_photo={item.merchant_photo}
                  route="/merch"
                  buttonText="View Details"
                />
              </div>
            ))}
          </div>

          {/* ✅ Show All Button */}
          <div className="flex items-center justify-center mt-12">
            <Button
              onClick={handleShowAllMerch}
              className="bg-secondary hover:bg-secondary/80 text-white shadow-lg transition-colors px-8 py-6 text-base font-semibold"
              aria-label="View all merchandise"
            >
              Show All Merch
            </Button>
          </div>
        </>
      )}
    </section>
  );
};

export default FeaturedMerch;


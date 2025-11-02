"use client";

import SectionHeader from "@/components/global/SectionHeader";
import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { useRouter } from "next/navigation";
// The following imports are not used but kept for context consistency
import { useCheckoutProcess } from "@/query/useOrderQueries";
import { useAuthStore } from "@/store/auth-store";

const FeaturedItems = () => {
  const router = useRouter();
  // 💡 Destructure isLoading and error from the hook
  const { data: products, isLoading, error } = useProducts();

  // Filter and limit to a maximum of 4 featured items
  const isFeatured = products?.filter((item) => item.is_featured);
  const items = isFeatured?.slice(0, 4) ?? [];
  const ItemsHaveFeatured = items.length > 0;

  // Handler for the button click
  const handleShowAllMenu = () => {
    router.push("/menu");
  };

  // 1. Loading State Component (simple text for this example)
  if (isLoading) {
    return (
      <section className="max-w-[1220px] px-8 lg:px-0 py-24 mx-auto text-center text-xl text-teal-600">
        <SectionHeader title="Loading Hot Items..." />
        {/* Placeholder or Skeleton could go here for a better UI */}
        <div className="mt-20 text-gray-500">Fetching the finest coffee...</div>
      </section>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <section className="max-w-[1220px] px-8 lg:px-0 py-24 mx-auto text-center text-red-600">
        <SectionHeader title="Error" />
        <p className="mt-8">
          Failed to load featured products. Please try again.
        </p>
      </section>
    );
  }

  // 3. No Featured Items State
  if (!ItemsHaveFeatured) {
    return (
      <section className="max-w-[1220px] px-8 lg:px-0 py-24 mx-auto text-center">
        <SectionHeader title="Explore Our Menu" />
        <p className="mt-8 text-gray-500">
          We don't have any featured items right now, but you can explore our
          full menu.
        </p>
        <div className="flex items-center justify-center mt-8">
          <Button
            onClick={handleShowAllMenu}
            className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg transition-colors"
          >
            View Full Menu
          </Button>
        </div>
      </section>
    );
  }

  // 4. Main Content (ItemsHaveFeatured is true)
  return (
    <section className="max-w-[1220px] px-8 lg:px-0 py-24 mx-auto">
      <SectionHeader title="Explore Hot Items" />

      {/* Grid setup for 1, 2, and 4 columns */}
      <div className="grid  py-12 grid-cols-1 md:grid-cols-3 mt-20 lg:grid-cols-3 gap-6">
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

      <div className="flex items-center justify-center">
        <Button
          onClick={handleShowAllMenu}
          className="bg-secondary hover:bg-secondary/80 text-white shadow-lg transition-colors"
        >
          Show All Menu
        </Button>
      </div>
    </section>
  );
};

export default FeaturedItems;

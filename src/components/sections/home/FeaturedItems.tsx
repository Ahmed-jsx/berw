import React from "react";

import { useProducts } from "@/hooks/useProducts";
import SectionHeader from "@/components/global/SectionHeader";
import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";

const FeaturedItems = () => {
  const { data: products } = useProducts();
  const isFeatured = products?.filter((item) => item.is_featured);
  const items = isFeatured?.slice(0, 4) ?? [];
  const ItemsHaveFeatured = items.length > 0;
  return (
    <>
      {ItemsHaveFeatured ? (
        <section className="max-w-[1220px] px-8 lg:px-0 py-24 mx-auto">
          <SectionHeader title="Explore Hot Items" />
          <div className="grid place-items-center py-12 grid-cols-1 md:grid-cols-2 mt-20 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard
                isFeatured={item.is_featured}
                key={item.product_id}
                id={item.product_id}
                name={item.product_name}
                description={item.product_components}
                price={Number(item.product_price)}
                image={item.product_photo}
              />
            ))}
          </div>
          <div className="flex items-center justify-center">
            <Button>Show All Menu</Button>
          </div>
        </section>
      ) : null}
    </>
  );
};

export default FeaturedItems;

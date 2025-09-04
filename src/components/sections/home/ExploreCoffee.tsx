"use client";

import { useMemo } from "react";

import ItemBadge from "@/components/ItemBadge";
import ItemCard from "@/components/ItemCard";
import { CategorySlug, coffees } from "@/data/coffees";
import { useCoffeeStore } from "@/store/coffeeStore";

const categories = [
  {
    label: "Classics",
    slug: "classics" as CategorySlug,
    image: "/bg1.png",
  },
  {
    label: "Signature Drinks",
    slug: "signature-drinks" as CategorySlug,
    image: "/bg1.png",
  },
  {
    label: "Matcha",
    slug: "matcha" as CategorySlug,
    image: "/bg1.png",
  },
  {
    label: "Non Coffee Refreshers",
    slug: "non-coffee-refreshers" as CategorySlug,
    image: "/bg1.png",
  },
  {
    label: "Filter Brewing",
    slug: "filter-brewing" as CategorySlug,
    image: "/bg1.png",
  },
];

export function ExploreCoffee() {
  const { active, setActive } = useCoffeeStore(); // Use the centralized store

  const visible = useMemo(() => {
    return coffees.filter((c) => c.category === active);
  }, [active]);

  const activeCategoryLabel =
    categories.find((c) => c.slug === active)?.label ?? "Coffee";

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
              key={cat.slug}
              title={cat.label}
              image={cat.image}
              active={active === cat.slug}
              onClick={() => setActive(cat.slug)}
              size="md"
            />
          ))}
        </div>

        {/* Heading */}
        <h3 className="mt-8 text-center text-3xl font-bold text-teal-800">
          {activeCategoryLabel}
        </h3>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((item) => (
            <ItemCard
              key={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))}

          {/* Empty state */}
          {visible.length === 0 && (
            <div className="col-span-full text-center text-gray-500">
              No items yet in this category.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

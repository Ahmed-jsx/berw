"use client";

import { useMemo, useEffect } from "react";
import { parseAsString, useQueryState } from "nuqs";

import ItemBadge from "@/components/ItemBadge";
import ItemCard from "@/components/ItemCard";
import { categories, CategorySlug, coffees } from "@/data/coffees";
import { useCoffeeStore } from "@/store/coffeeStore"; // Import the centralized store
import { useCoffeeFilters } from "@/store/coffeeFilters"; // Import the filters store

// ---- Component ----
export function ExploreCoffee() {
  const { active, setActive } = useCoffeeStore(); // Use the centralized store
  const { search } = useCoffeeFilters(); // Use the filters store

  // Bind Zustand state to nuqs search param
  const [categoryParam, setCategoryParam] = useQueryState(
    "category",
    parseAsString.withDefault("classics")
  );

  // Sync store with URL param
  useEffect(() => {
    if (categoryParam) {
      setActive(categoryParam as CategorySlug);
    }
  }, [categoryParam, setActive]);

  // Sync URL param with store
  useEffect(() => {
    setCategoryParam(active);
  }, [active, setCategoryParam]);

  const visible = useMemo(() => {
    if (search) {
      const searchResults = coffees.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      );
      if (searchResults.length > 0) {
        // If search yields results, update the active category to the first match
        // This will trigger the useEffect to update the URL param
        if (active !== searchResults[0].category) {
          setActive(searchResults[0].category);
        }
        return searchResults;
      }
    }
    // If no search term or no results, filter by the active category
    return coffees.filter((c) => c.category === active);
  }, [active, search, setActive]);

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

// store/coffeeStore.ts
"use client";

import { create } from "zustand";
import { CategorySlug } from "@/data/coffees";

interface CoffeeStore {
  active: CategorySlug;
  search: string;
  setActive: (slug: CategorySlug) => void;
  setSearch: (term: string) => void;
  resetSearch: () => void;
}

export const useCoffeeStore = create<CoffeeStore>((set) => ({
  active: "classics",
  search: "",
  setActive: (slug) => set({ active: slug }),
  setSearch: (term) => set({ search: term }),
  resetSearch: () => set({ search: "" }),
}));

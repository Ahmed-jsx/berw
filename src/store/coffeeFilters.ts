// store/coffeeFilters.ts
"use client";

import { create } from "zustand";

interface CoffeeFilterState {
  search: string;
  setSearch: (search: string) => void;
}

export const useCoffeeFilters = create<CoffeeFilterState>()((set) => ({
  search: "",
  setSearch: (search) => set({ search }),
}));

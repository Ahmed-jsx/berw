"use client";

import { useCoffeeFilters } from "@/store/coffeeFilters";
import { useEffect } from "react";

export default function HeroSection() {
  const { setSearch: setStoreSearch } = useCoffeeFilters();

  return (
    <section
      className="relative max-w-[calc(100vw-6rem)] my-8 mx-auto rounded-default min-h-[80vh] overflow-hidden flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/bg1.png')" }}
    >
      {/* Blur Overlay */}
      <div className="absolute inset-0 rounded-default bg-black/20 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 text-center">
        {/* Heading */}
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          Explore the Coffee World
        </h1>

        {/* Search */}
        <div className="mt-6 flex justify-center">
          <input
            type="text"
            placeholder="Search your favorite drink..."
            className="w-full max-w-lg px-6 py-3 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 text-black focus:ring-yellow-400"
          />
        </div>
      </div>
    </section>
  );
}

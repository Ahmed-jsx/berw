"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "Colombia Los Naranjos",
    price: "$4.50",
    image: "/bg1.png", // Placeholder
    roast: "Light Roast",
  },
  {
    id: 2,
    name: "Brazil Santos",
    price: "$3.80",
    image: "/bg1.png", // Placeholder
    roast: "Medium Roast",
  },
  {
    id: 3,
    name: "Ethiopia Yirgacheffe",
    price: "$5.00",
    image: "/bg1.png", // Placeholder
    roast: "Light Roast",
  },
  {
    id: 4,
    name: "Kenya AA",
    price: "$4.20",
    image: "/bg1.png", // Placeholder
    roast: "Dark Roast",
  },
];

const BestSeller = () => {
  return (
    <section className="w-full py-16 bg-[#F9F9F9]">
      <div className="max-w-[1220px] mx-auto px-4 lg:px-0">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Best Sellers</h2>
            <p className="text-gray-600">Discover our most popular coffees</p>
          </div>
          <Button variant="link" className="text-[#B44D20] font-semibold hidden md:flex items-center gap-2">
            See all coffees <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile: Horizontal Scroll | Desktop: Grid */}
        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible snap-x snap-mandatory scrollbar-hide">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-none w-[280px] md:w-auto snap-center mr-4 md:mr-0 group cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-white shadow-sm">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-gray-800">
                  {product.roast}
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-[#B44D20] transition-colors">
                {product.name}
              </h3>
              <p className="text-gray-600 font-medium">{product.price}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 md:hidden flex justify-center">
           <Button variant="link" className="text-[#B44D20] font-semibold flex items-center gap-2">
            See all coffees <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;

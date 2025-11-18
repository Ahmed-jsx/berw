"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface FeaturedItemCardProps {
  id: number;
  name: string;
  description?: string | null;
  price?: number | string | null;
  product_photo?: string | null;
  isFeatured?: boolean;
  route?: string; // Optional route prefix (default: "/menu")
  buttonText?: string; // Optional button text (default: "Customize")
}

const FeaturedItemCard = ({
  id,
  name,
  description,
  price = 0,
  product_photo,
  route = "/menu",
  buttonText = "Customize",
}: FeaturedItemCardProps) => {
  const router = useRouter();

  // ✅ Ensure price is always a number
  const numericPrice = Number(price);
  const displayPrice =
    !isNaN(numericPrice) && numericPrice > 0
      ? `${numericPrice.toFixed(2)} EGP`
      : "—";

  // ✅ Image fallback
  const imageSrc =
    product_photo && product_photo.trim() !== ""
      ? product_photo
      : "/bg1.png";

  const handleCardClick = () => {
    router.push(`${route}/${id}` as any);
  };

  return (
    <>
      {/* ✅ Mobile View - Card with Text Below Image */}
      <Card
        onClick={handleCardClick}
        className="overflow-hidden p-0 cursor-pointer active:scale-[0.98] transition-transform md:hidden"
      >
        <div className="flex gap-3 p-2">
          {/* ✅ Image Section - Mobile (Smaller, Left Side) */}
          <div className="relative h-[100px] w-[100px] flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={imageSrc}
              alt={name || "Product"}
              fill
              className="object-cover transition-all duration-500"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = "/monkey1.png";
              }}
            />
          </div>

          {/* ✅ Content Section - Mobile (Right Side) */}
          <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold leading-tight line-clamp-1 text-foreground">
                {name}
              </h2>
              {description && (
                <p className="text-muted-foreground text-xs line-clamp-2 leading-tight">
                  {description}
                </p>
              )}
            </div>

            {/* ✅ Footer with Price and Button - Mobile */}
            <div className="flex items-center justify-between gap-2 mt-2">
              <span className="text-foreground font-bold text-sm flex-shrink-0">
                {displayPrice}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`${route}/${id}` as any);
                }}
                className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-medium text-xs hover:bg-primary/90 active:bg-primary/80 transition-colors flex-shrink-0 whitespace-nowrap"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* ✅ Desktop View - Overlay Style */}
      <div
        onClick={handleCardClick}
        className="hidden md:block relative group rounded-2xl lg:h-[350px] aspect-square w-full overflow-hidden cursor-pointer shadow-md"
      >
        <Image
          src={imageSrc}
          alt={name || "Product"}
          fill
          className="object-cover rounded-2xl transition-all duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = "/monkey1.png";
          }}
        />

        {/* ✅ Overlay with gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5 lg:pb-6">
          <div className="space-y-1.5 lg:space-y-2 text-white">
            <h2 className="text-base lg:text-lg font-semibold leading-tight line-clamp-1">
              {name}
            </h2>
            {description && (
              <p className="text-gray-200 text-xs lg:text-sm line-clamp-2 leading-tight">
                {description}
              </p>
            )}
            <div className="flex items-center justify-between gap-2 mt-2.5 lg:mt-3">
              <span className="text-white font-bold text-sm lg:text-base flex-shrink-0">
                {displayPrice}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`${route}/${id}` as any);
                }}
                className="bg-white text-black px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg font-medium text-xs lg:text-sm hover:bg-gray-200 active:bg-gray-300 transition-colors flex-shrink-0 whitespace-nowrap"
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturedItemCard;


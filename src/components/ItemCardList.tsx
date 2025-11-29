"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProductUrl } from "@/lib/utils/url";

interface ItemCardListProps {
  id: number;
  name: string;
  description?: string | null;
  price?: number | string | null;
  product_photo?: string | null;
  isOutOfStock?: boolean;
  route?: string;
}

const ItemCardList = ({
  id,
  name,
  description,
  price = 0,
  product_photo,
  isOutOfStock = false,
  route = "/menu",
}: ItemCardListProps) => {
  const router = useRouter();

  // Ensure price is always a number
  const numericPrice = Number(price);
  const displayPrice =
    !isNaN(numericPrice) && numericPrice > 0
      ? `${numericPrice.toFixed(2)} EGP`
      : "—";

  // Image fallback
  const imageSrc =
    product_photo && product_photo.trim() !== ""
      ? product_photo
      : "/bg1.png";

  const handleCardClick = () => {
    if (route === "/menu") {
      router.push(getProductUrl(id, name));
    } else {
      router.push(`${route}/${id}`);
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (route === "/menu") {
      router.push(getProductUrl(id, name));
    } else {
      router.push(`${route}/${id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-secondary/50 hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      {/* Product Image */}
      <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-gray-200">
        <Image
          src={imageSrc}
          alt={name || "Product"}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.src = "/bg1.png";
          }}
        />
        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-br-lg">
            Out of stock
          </div>
        )}
        {/* Add Button */}
        {!isOutOfStock && (
          <button
            onClick={handleAddClick}
            className={cn(
              "absolute bottom-0 right-0 bg-primary text-white rounded-tl-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              "hover:bg-primary/90"
            )}
            aria-label="Add to cart"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-secondary">{displayPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default ItemCardList;


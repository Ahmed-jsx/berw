"use client";

import Image from "next/image";
import { motion, useAnimation } from "motion/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProductUrl } from "@/lib/utils/url";

interface ItemCardProps {
  id: number;
  name: string;
  description?: string | null;
  price?: number | string | null;
  product_photo?: string | null;
  isFeatured?: boolean;
  route?: string; // Optional route prefix (default: "/menu")
  buttonText?: string; // Optional button text (default: "Customize")
}

const contentVariants = {
  rest: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  hover: { transition: { staggerChildren: 0.1, staggerDirection: 1 } },
};

const itemVariants = {
  rest: { y: "100%", opacity: 0, transition: { duration: 0.3 } },
  hover: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.4 },
  },
};

const ItemCard = ({
  id,
  name,
  description,
  price = 0,
  product_photo,
  route = "/menu",
  buttonText = "Customize",
}: ItemCardProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const controls = useAnimation();
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Disable animation on mobile
  const motionProps = isMobile
    ? {}
    : { initial: "rest", whileHover: "hover", animate: "rest" };

  const handleCardClick = () => {
    if (route === "/menu") {
      router.push(getProductUrl(id, name));
    } else {
      router.push(`${route}/${id}`);
    }
  };

  return (
    <motion.div
      {...motionProps}
      onClick={handleCardClick}
      className="relative group rounded-2xl h-[350px] w-full max-w-[400px] overflow-hidden cursor-pointer shadow-md"
    >
      {/* ✅ Background Image with fallback */}
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

      {/* ✅ Improved overlay with gradient for better text readability */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isMobile
            ? "bg-gradient-to-t from-black/70 via-black/30 to-transparent"
            : "opacity-0 group-hover:opacity-100 bg-gradient-to-t from-black/70 via-black/40 to-transparent"
        }`}
      />

      {/* Content */}
      <div
        className={`absolute inset-0 flex flex-col justify-end p-5 ${
          isMobile ? "pb-6" : ""
        }`}
      >
        {isMobile ? (
          <div className="space-y-2 text-white">
            <h2 className="text-lg font-semibold">{name}</h2>
            {description && (
              <p className="text-gray-200 text-sm line-clamp-2">
                {description}
              </p>
            )}
            <div className="flex items-center justify-between mt-3">
              <span className="text-white font-bold text-base">
                {displayPrice}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (route === "/menu") {
                    router.push(getProductUrl(id, name));
                  } else {
                    router.push(`${route}/${id}`);
                  }
                }}
                className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
              >
                {buttonText}
              </button>
            </div>
          </div>
        ) : (
          <motion.div variants={contentVariants} className="space-y-2">
            <motion.h2
              variants={itemVariants}
              className="text-white text-xl font-bold"
            >
              {name}
            </motion.h2>

            {description && (
              <motion.p
                variants={itemVariants}
                className="text-gray-300 text-sm line-clamp-2"
              >
                {description}
              </motion.p>
            )}

            <motion.p
              variants={itemVariants}
              className="text-white text-lg font-semibold"
            >
              {displayPrice}
            </motion.p>

            <motion.button
              variants={itemVariants}
              onClick={(e) => {
                e.stopPropagation();
                if (route === "/menu") {
                  router.push(getProductUrl(id, name));
                } else {
                  router.push(`${route}/${id}`);
                }
              }}
              className="w-full bg-primary text-black py-2 mt-2 rounded-md font-medium text-sm hover:bg-gray-200 transition-colors"
            >
              {buttonText}
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ItemCard;

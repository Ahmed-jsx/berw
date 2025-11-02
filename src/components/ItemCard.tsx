"use client";

import Image from "next/image";
import { motion, useAnimation } from "motion/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ItemCardProps {
  id: number;
  name: string;
  description: string | null;
  price: number;
  product_photo?: string | null;
  isFeatured?: boolean;
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
    transition: { duration: 0.4, ease: [0.17, 0.67, 0.83, 0.67] },
  },
};

const ItemCard = ({
  id,
  name,
  description,
  price,
  product_photo,
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

  // Prefer product_photo, fallback to

  // Disable animation on mobile
  const motionProps = isMobile
    ? {}
    : { initial: "rest", whileHover: "hover", animate: "rest" };

  return (
    <motion.div
      {...motionProps}
      className="relative group rounded-2xl h-[350px] w-full max-w-[400px] overflow-hidden cursor-pointer shadow-md"
    >
      {/* Background Image */}
      <Image
        src={product_photo || "/monkey1.png"}
        alt={name}
        fill
        className="object-cover rounded-2xl transition-all duration-500 group-hover:scale-105"
      />

      {/* Overlay (stronger on mobile for text visibility) */}
      <div
        className={`absolute inset-0 transition-all duration-300 ${
          isMobile
            ? "bg-black/20"
            : "bg-black/20 opacity-0 group-hover:opacity-50"
        }`}
      />

      {/* Text & content */}
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
                {price.toFixed(2)} EGP
              </span>
              <button className="bg-white text-black px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
                Customize
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
              {price.toFixed(2)} EGP
            </motion.p>

            <motion.button
              variants={itemVariants}
              onClick={() => router.push(`/menu/${id}`)}
              className="w-full bg-white text-black py-2 mt-2 rounded-md font-medium text-sm hover:bg-gray-200 transition-colors"
            >
              Customize
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ItemCard;

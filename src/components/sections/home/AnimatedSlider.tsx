"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Fragment } from "react";

const images = [
  { id: 1, src: "/1.png", alt: "Coffee shop workspace with laptop" },
  { id: 2, src: "/1.png", alt: "Monkey Brew specialty coffee sign" },
  { id: 3, src: "/1.png", alt: "Professional coffee brewing equipment" },
  { id: 4, src: "/1.png", alt: "Artistic coffee cup with beans" },
  { id: 5, src: "/1.png", alt: "Coffee roasting process" },
];

export default function AnimatedSlider() {
  return (
    <div className="w-full min-h-screen  overflow-hidden">
      <div className="relative w-full h-screen flex flex-col justify-center items-center py-16">
        {/* Yellow elements moving left */}
        <div className="absolute top-0 w-full h-32 flex items-center overflow-hidden">
          <motion.div
            className="flex gap-6 min-w-max"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {Array.from({ length: 2 }).map((_, i) => (
              <Fragment key={i}>
                {Array.from({ length: 10 }).map((_, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="w-72 h-16 bg-yellow-400 rounded-2xl shadow-md"
                  />
                ))}
              </Fragment>
            ))}
          </motion.div>
        </div>

        {/* Images moving left infinitely */}
        <div className="overflow-hidden w-full">
          <motion.div
            className="flex gap-10"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              duration: 15,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {Array.from({ length: 2 }).map((_, index) => (
              <Fragment key={index}>
                {images.map((logo) => (
                  <div
                    key={`${index}-${logo.id}`}
                    className="w-[363px] h-[445px] flex-shrink-0"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      className="w-full h-full object-cover rounded-xl shadow-sm"
                      width={363}
                      height={445}
                    />
                  </div>
                ))}
              </Fragment>
            ))}
          </motion.div>
        </div>

        {/* Teal elements moving right */}
        <div className="absolute bottom-0 w-full h-32 flex items-center overflow-hidden">
          <motion.div
            className="flex gap-6 min-w-max"
            animate={{ x: ["-100%", "0%"] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {Array.from({ length: 2 }).map((_, i) => (
              <Fragment key={i}>
                {Array.from({ length: 10 }).map((_, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="w-80 h-20 bg-teal-600 rounded-2xl shadow-md"
                  />
                ))}
              </Fragment>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

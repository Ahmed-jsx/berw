"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useHeroData } from "@/hooks/useHeroData";
import { urlFor } from "@/sanity/lib/image";

// Fallback slides if Sanity data is unavailable
const fallbackSlides = [
  {
    image: "/bg1.png",
    title:
      "The Best Spanish Latte in Town, Maybe Even The Best You'll Ever Taste.",
    description:
      "At Monkey Brew, we craft our Spanish Latte with care-rich, creamy, and full of flavor. Along with our special coffee drinks, it's one of the many reasons coffee lovers choose us every day.",
    buttonText: "Order Now",
  },
  {
    image: "/bg1.png",
    title: "Experience the Perfect Espresso Every Single Time.",
    description:
      "Our master baristas use premium beans and precise techniques to create espresso shots that are smooth, bold, and unforgettable. Taste the difference quality makes.",
    buttonText: "Order Now",
  },
  {
    image: "/bg1.png",
    title: "Handcrafted Cold Brew That Hits Different.",
    description:
      "Slow-steeped for 16 hours to bring out smooth, naturally sweet flavors. Our cold brew is the perfect refreshment for any time of day.",
    buttonText: "Order Now",
  },
];

export default function Hero() {
  const { data: heroData, isLoading } = useHeroData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Use Sanity data if available, otherwise use fallback
  const slides = heroData?.slides?.length
    ? heroData.slides.map((slide) => {
        let imageUrl = "/bg1.png";
        try {
          if (slide.image) {
            const imageBuilder = urlFor(slide.image);
            if (imageBuilder) {
              const url = imageBuilder.url();
              if (url) {
                imageUrl = url;
              }
            }
          }
        } catch (error) {
          console.error("Error generating image URL:", error);
          imageUrl = "/bg1.png";
        }
        return {
          image: imageUrl,
          title: slide.title || "Welcome",
          description: slide.description || "",
          buttonText: slide.buttonText || "Order Now",
        };
      })
    : fallbackSlides;

  const autoRotateInterval = heroData?.autoRotateInterval
    ? heroData.autoRotateInterval * 1000
    : 5000;

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoRotateInterval);

    return () => clearInterval(timer);
  }, [isPaused, slides.length, autoRotateInterval]);

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const contentVariants = {
    enter: {
      y: 20,
      opacity: 0,
    },
    center: {
      y: 0,
      opacity: 1,
    },
    exit: {
      y: -20,
      opacity: 0,
    },
  };

  // Show loading skeleton while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen lg:max-w-[calc(100vw-6rem)] lg:my-8 lg:mx-auto max-w-full lg:rounded-[40px] relative overflow-hidden bg-gray-900 animate-pulse">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <section className="max-w-6xl mx-auto px-4">
            <div className="text-center space-y-8">
              <div className="h-16 bg-gray-700 rounded-lg max-w-4xl mx-auto"></div>
              <div className="h-24 bg-gray-700 rounded-lg max-w-3xl mx-auto"></div>
              <div className="h-14 bg-gray-700 rounded-full w-48 mx-auto"></div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen lg:max-w-[calc(100vw-6rem)] lg:my-8 lg:mx-auto max-w-full lg:rounded-[40px] relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with AnimatePresence */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title || "Coffee Background"}
            fill
            style={{ objectFit: "cover" }}
            className="object-cover"
            priority={currentSlide === 0}
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = "/bg1.png";
            }}
          />
          <div className="absolute inset-0 bg-black/25"></div>
        </motion.div>
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <section className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  delay: 0.3,
                  duration: 0.6,
                }}
                className="space-y-8"
              >
                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white leading-tight max-w-6xl mx-auto">
                  {slides[currentSlide].title}
                </h1>

                {/* Description */}
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  {slides[currentSlide].description}
                </p>

                {/* CTA Button */}
                <Link href="/menu">
                  <div className="pt-4">
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/80  shadow-primary text-black px-12 py-4 rounded-full text-lg font-semibold shadow-[0_0_10px_#FFD700]"
                    >
                      {slides[currentSlide].buttonText}
                    </Button>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Dots */}
            <div className="flex justify-center mt-24 space-x-3">
              {slides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentSlide ? "bg-yellow-500" : "bg-white/50"
                  }`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: index === currentSlide ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="min-h-screen max-w-[calc(100vw-6rem)] my-8 mx-auto rounded-[40px] relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/bg1.png"
          alt="Coffee Background"
          fill
          style={{ objectFit: "cover" }}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/25"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 pt-40 pb-16">
        <section className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-8">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-white leading-tight max-w-6xl mx-auto">
              The Best Spanish Latte in Town, Maybe Even The Best You&apos;ll
              Ever Taste.
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              At Monkey Brew, we craft our Spanish Latte with care-rich, creamy,
              and full of flavor. Along with our special coffee drinks,
              it&apos;s one of the many reasons coffee lovers choose us every
              day.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/80  shadow-primary text-black px-12 py-4 rounded-full text-lg font-semibold shadow-[0_0_10px_#FFD700]"
              >
                Order Now
              </Button>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center mt-12 space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-white/50 rounded-full"></div>
              <div className="w-3 h-3 bg-white/50 rounded-full"></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

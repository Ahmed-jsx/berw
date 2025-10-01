import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

const images = [
  { src: "/yellow-monkey.png", alt: "Coffee beans" },
  { src: "/yellow-monkey.png", alt: "Coffee cup" },
  { src: "/yellow-monkey.png", alt: "Coffee bag" },
  { src: "/yellow-monkey.png", alt: "Coffee plant" },
].map((image) => ({ ...image, width: 230, height: 150 }));

const Cta = () => {
  return (
    <section className="w-full py-24 max-w-[calc(100vw-4rem)] mx-auto">
      <div className="w-full rounded-default bg-secondary">
        <div className=" flex items-center px-6 max-w-[1220px] mx-auto py-12 justify-between">
          <div className="flex flex-col gap-6 items-start">
            <h2 className="lg:text-5xl text-3xl  max-w-[700px] leading-1.2 font-bold text-white">
              Let&apos;s turn every coffee bean into a Reward!
            </h2>
            <p className="text-white/90 max-w-[700px]">
              Get reward points on every single drink you order and redeem them
              anytime with exciting offers in our store!
            </p>
            <Button variant="primary" className="">
              Explore Monkey Rewards
            </Button>
          </div>
          <div className="lg:flex hidden gap-4 flex-wrap justify-center">
            {images.map((image, index) => (
              <Image key={index} {...image} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;

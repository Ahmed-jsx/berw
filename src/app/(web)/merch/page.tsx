"use client";
import { useMerchQuery } from "@/query/merch";
import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import MerchCard from "./MerchCard";

const Merch = () => {
  const { data: merch } = useMerchQuery();
  return (
    <div className="">
      <div>
        <div className="min-h-[600px] lg:max-w-[calc(100vw-6rem)] lg:my-8 lg:mx-auto max-w-full lg:rounded-[40px] relative overflow-hidden">
          <motion.div
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
              src={"/bg1.png"}
              alt="Coffee Background"
              fill
              style={{ objectFit: "cover" }}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/25"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <p className="text-4xl font-bold">Our Merch</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="max-w-[1440px] mx-auto">
        {merch?.merchants.map((item) => (
          <MerchCard merch={item} key={item.merchant_name} />
        ))}
      </div>
    </div>
  );
};

export default Merch;

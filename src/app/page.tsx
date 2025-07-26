"use client";
import DiscountDialog from "@/components/Discount";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function Soon() {
  return (
    <div className="w-full h-screen relative dark:bg-gradient-to-b dark:from-[rgba(3,111,118,0.68)] dark:via-[rgba(255,210,28,0.705)] dark:to-transparent bg-gradient-to-b from-[rgba(3,111,118,0.68)] via-[rgba(255,210,28,0.705)] to-transparent">
      {/* Floating Decorative Images */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        className="lg:block absolute hidden top-2 left-2 "
      >
        <Image src="/1.svg" width={300} height={80} alt="decoration-left" />
      </motion.div>{" "}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        className="lg:block absolute hidden top-[450px] left-[100px] "
      >
        <Image src="/1.svg" width={200} height={80} alt="decoration-left" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        className="lg:block absolute hidden top-[300px] left-[300px] "
      >
        <Image src="/1.svg" width={150} height={80} alt="decoration-left" />
      </motion.div>{" "}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        className="lg:block absolute hidden top-2 right-2 "
      >
        <Image src="/cup.svg" width={300} height={80} alt="decoration-left" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        className="lg:block absolute hidden top-[350px] right-[200px] "
      >
        <Image src="/cup.svg" width={200} height={80} alt="decoration-left" />
      </motion.div>
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        className="lg:block absolute hidden top-[550px] right-2 "
      >
        <Image src="/cup.svg" width={200} height={80} alt="decoration-left" />
      </motion.div>
      {/* Main Content */}
      <div className="flex items-center justify-center h-full px-8 lg:px-0">
        <div className="flex flex-col lg:mt-10 mt-24 items-center text-center  space-y-6">
          <Image
            src="/logo.png"
            width={150}
            height={150}
            alt="logo"
            className="w-[200px] md:w-[250px] lg:w-[200px]"
          />

          <DiscountDialog />

          <Link className="w-full px-8 lg:px-0" href={"/"}>
            <Button className="rounded-full font-medium bg-[#E7BC20] hover:bg-[##E7BC20]/80 text-lg w-[300px] py-[30px]">
              Show Menu
            </Button>
          </Link>

          <div className="max-w-[700px] my-[30px] px-8 lg:px-0 text-[#047578] flex flex-col  gap-2">
            <p className="mt-[30px] font-semibold text-lg  lg:text-xl">
              {" "}
              Sign up with your data and get a 25% discount on your order on our
              store, and subscribe to get our updates{" "}
            </p>
            <p className="text-xs mt-4">Terms and conditions apply.</p>
          </div>

          {/* Uncomment this if you want to show "COMING SOON" text */}

          <div className="flex justify-center mb-24 items-center">
            <Image
              src="/COMING SOON.svg"
              alt="coming soon"
              width={300}
              height={200}
              className="w-[200px]  "
            />
          </div>
        </div>
      </div>
    </div>
  );
}

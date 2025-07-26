"use client";
import { motion } from "motion/react";
import Image from "next/image";

export const FloatingImage = ({
  src,
  className,
  floatDuration = 5,
  delay = 0.3,
  width,
  height,
}: {
  src: string;
  className: string;
  floatDuration?: number;
  delay?: number;
  width: number;
  height: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
    transition={{
      opacity: { duration: 0.6, delay },
      scale: { duration: 0.6, delay },
      y: {
        duration: floatDuration,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay: delay + 0.4,
      },
    }}
    className={className}
  >
    <Image src={src} width={width} height={height} alt="floating" />
  </motion.div>
);

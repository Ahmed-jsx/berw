import Image from "next/image";
import React from "react";

interface LogoProps {
  variant?: "primary" | "secondary";
  width?: number;
}

const Logo = ({ variant = "primary", width = 80 }: LogoProps) => {
  return (
    <div>
      {variant === "primary" ? (
        <Image src="/logo.png" width={width} height={150} alt="logo" />
      ) : (
        <Image src="/logo-white.png" width={width} height={150} alt="logo" />
      )}
    </div>
  );
};

export default Logo;

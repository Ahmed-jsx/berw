import Image from "next/image";
import React from "react";

interface LogoProps {
  variant?: "primary" | "secondary";
  width?: number;
  className?: string;
}

const Logo = ({ variant = "primary", width = 80, className }: LogoProps) => {
  return (
    <div>
      {variant === "primary" ? (
        <Image
          className={className}
          src="/logo.png"
          width={width}
          height={150}
          alt="logo"
        />
      ) : (
        <Image
          className={className}
          src="/logo-white.png"
          width={width}
          height={150}
          alt="logo"
        />
      )}
    </div>
  );
};

export default Logo;

import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <div className="bg-[#047578]">
      <div className="flex justify-center py-8 text-white">
        <div className="flex flex-col items-center gap-2">
          <Image src={"/monkey.png"} width={50} height={40} alt="monkey logo" />
          <p className="text-sm">All rights are reserved ©Monkey Brew 2025</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;

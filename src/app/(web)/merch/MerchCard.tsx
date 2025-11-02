import Image from "next/image";
import React from "react";

const MerchCard = ({ merch }: { merch: any }) => {
  return (
    <div className="flex flex-col">
      <div className="w-[200px] rounded-default h-[200px] relative">
        <Image
          src={"/bg1.png"}
          alt="merch image"
          fill
          className="object-cover rounded-xl"
        />
      </div>
      <div className="p-2">
        <h2 className="text-lg text-start  font-semibold">
          {merch.merchant_name}
        </h2>
        <p className="text-sm text-gray-400 text-start">
          {merch.merchant_price}
        </p>
      </div>
    </div>
  );
};

export default MerchCard;

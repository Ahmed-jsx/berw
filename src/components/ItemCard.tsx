"use client";
import Image from "next/image";
import { Button } from "./ui/button";

interface ItemCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  isFeatured?: boolean;
  onOrder?: () => void;
}

const ItemCard = ({
  id,
  name,
  description,
  price,
  image,
  isFeatured,
  onOrder,
}: ItemCardProps) => {
  return (
    <div
      datatype="card"
      className="flex flex-col  p-4 gap-4 rounded-3xl bg-primary w-full justify-between"
    >
      <div>
        <Image
          src={"/bg1.png"}
          width={230}
          height={200}
          alt={name}
          className="rounded-[10px] h-[300px] w-full object-cover"
        />
      </div>

      <h3 className="text-2xl font-bold text-white">{name}</h3>
      <p className="text-[#FFFADA]">{description}</p>

      <div className="mt-20 flex justify-between items-center">
        <div className="text-xl font-bold text-white">
          <span className="mr-2 font-medium">EGP</span> {price}
        </div>
        <Button
          type="button"
          className="rounded-full bg-secondary cursor-pointer text-white"
          onClick={onOrder}
        >
          <span className="mr-2">+</span>
          Order
        </Button>
      </div>
    </div>
  );
};

export default ItemCard;

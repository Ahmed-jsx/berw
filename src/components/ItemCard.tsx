import Image from "next/image";
import { Button } from "./ui/button";

interface ItemCardProps {
  name: string;
  description: string;
  price: number;
  image: string;
}

const ItemCard = ({ name, description, price, image }: ItemCardProps) => {
  return (
    <div className="flex flex-col p-4 gap-4 rounded-3xl bg-primary w-full justify-between">
      <div className="">
        <Image
          src={image}
          width={230}
          height={200}
          alt={name}
          className="rounded-[10px] h-[200px] w-full"
        />
      </div>
      <h3 className="text-2xl font-bold text-white">{name}</h3>
      <p className="text-[#FFFADA]">{description}</p>
      <div className="mt-20 flex justify-between items-center">
        <div className="text-xl font-bold text-white">
          <span className="mr-2 font-medium">EPG</span> {price}
        </div>
        <Button className="rounded-full bg-secondary text-white">
          <span className="mr-2">+</span>
          Order
        </Button>
      </div>
    </div>
  );
};

export default ItemCard;

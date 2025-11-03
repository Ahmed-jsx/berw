import Image from "next/image";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface MenuCardProps {
  id: number;
  name: string;
  description: string | null;
  price: number;
  product_photo?: string | null;
  isFeatured?: boolean;
  onClick?: () => void;
}

const MenuCard = ({
  name,
  description,
  price,
  product_photo,
  isFeatured,
  onClick,
}: MenuCardProps) => {
  const router = useRouter();
  return (
    <div
      onClick={onClick}
      className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-40 w-full bg-muted">
        <Image src={"/monkey1.png"} alt={name} fill className="object-cover" />
        {isFeatured && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-base text-foreground mb-1 line-clamp-1">
          {name}
        </h3>

        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 min-h-[40px]">
            {description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">
            {price.toFixed(2)} EGP
          </span>
          <button
            onClick={() => router.push(`/menu/${id}`)}
            className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Customize
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;

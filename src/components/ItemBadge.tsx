import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ItemBadgeProps {
  title: string;
  image?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  active?: boolean;
  onClick?: () => void;
}

const sizeMap = {
  sm: 32,
  md: 44,
  lg: 56,
} as const;

export default function ItemBadge({
  title,
  image = "/bg1.png",
  className,
  size = "md",
  active = false,
  onClick,
}: ItemBadgeProps) {
  const avatar = sizeMap[size];
  const clickable = typeof onClick === "function";

  const Wrapper = clickable ? "button" : "div";

  return (
    <Wrapper
      type={clickable ? "button" : undefined} // ✅ prevent form submit issues
      className={cn(
        "inline-flex items-center gap-3 rounded-full pr-8 pl-1.5  py-2.5 border-2 transition-colors select-none",
        active
          ? "bg-secondary/20 text-secondary-foreground border-secondary shadow-sm"
          : "bg-[#F5F5F5] text-secondary border-secondary hover:bg-secondary/30",
        clickable && "cursor-pointer",
        className
      )}
      aria-label={title}
      aria-pressed={clickable ? active : undefined}
      onClick={onClick}
    >
      <div
        className="relative shrink-0  overflow-hidden rounded-full"
        style={{ width: avatar, height: avatar }}
      >
        <Image
          src={image || "/bg1.png"}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <p className="text-sm font-semibold">{title}</p>
    </Wrapper>
  );
}

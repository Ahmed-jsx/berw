import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ItemBadgeProps {
  title: string;
  image: string;
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
  image,
  className,
  size = "md",
  active = false,
  onClick,
}: ItemBadgeProps) {
  const avatar = sizeMap[size];
  const clickable = typeof onClick === "function";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-full pl-2.5 pr-5 py-2.5 border-2 transition-colors select-none",
        active
          ? "bg-secondary text-secondary-foreground border-secondary shadow-sm"
          : "bg-secondary/20 text-foreground border-secondary hover:bg-secondary/30",
        clickable && "cursor-pointer",
        className
      )}
      aria-label={title}
      role={clickable ? "button" : undefined}
      aria-pressed={clickable ? active : undefined}
      tabIndex={clickable ? 0 : -1}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!clickable) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <div
        className="relative shrink-0 overflow-hidden rounded-full"
        style={{ width: avatar, height: avatar }}
      >
        <Image
          src={image || "/bg1.png"}
          alt={title}
          fill
          sizes={`${avatar}px`}
          className="object-cover"
        />
      </div>
      <p className="text-sm font-semibold">{title}</p>
    </div>
  );
}

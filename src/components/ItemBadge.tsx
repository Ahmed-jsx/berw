import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ItemBadgeProps {
  title: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  active?: boolean;
  onClick?: () => void;
}



export default function ItemBadge({
  title,
  className,
  active = false,
  onClick,
}: ItemBadgeProps) {
  const clickable = typeof onClick === "function";

  const Wrapper = clickable ? "button" : "div";

  return (
    <Wrapper
      type={clickable ? "button" : undefined}
      className={cn(
        "inline-flex items-center justify-center gap-3 rounded-full px-8 py-2.5 border-2 transition-colors select-none",
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
      <p className="text-sm text-center font-semibold whitespace-nowrap">{title}</p>
    </Wrapper>
  );
}

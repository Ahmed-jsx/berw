"use client";
import Logo from "./Logo";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/Const";
import { Button } from "../ui/button";

const Header = () => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const auth = pathname === "/login" || pathname === "/sign-up";

  return (
    <header
      className={cn(
        "fixed top-16 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-[1300px] mx-auto px-4",
        auth && "top-2"
      )}
    >
      <nav className="relative rounded-full px-12 py-4 shadow-xl overflow-hidden">
        {/* Black semi-transparent background layer behind glass */}
        <div className="absolute inset-0 bg-black/25 backdrop-blur-md border border-white/15  rounded-full z-0" />

        <div className="relative z-10 flex items-center justify-between px-6 py-2">
          <div className="flex items-center gap-4">
            <Logo width={50} variant="secondary" />
            <div className="hidden md:flex items-center gap-4">
              {NAV_ITEMS.map((item) => (
                <Link key={item.title} href={item.href}>
                  <span
                    className={cn(
                      "text-white/80 transition-all duration-200 hover:text-white px-4 py-2 rounded-full",
                      isActive(item.href) &&
                        "text-primary border-primary border backdrop-blur-md bg-white/10"
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-full">
            Get Started
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;

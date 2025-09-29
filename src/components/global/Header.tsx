"use client";
import { NAV_ITEMS } from "@/Const";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import Logo from "./Logo";
import CartButton from "./CartButton";
import { Menu, User, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { useState } from "react";

const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = (path: string) => pathname === path;
  const auth = pathname === "/login" || pathname === "/sign-up";
  const isComingSoon = pathname === "/coming-soon";
  const { user, isAuthenticated } = useAuthStore();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-7xl mx-auto",
        "sm:top-8 lg:top-16",
        auth && "top-2 sm:top-4",
        isComingSoon && "hidden"
      )}
    >
      <nav className="relative rounded-2xl px-4 py-3 shadow-2xl overflow-hidden sm:px-6">
        {/* Glass background with better contrast */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl shadow-inner" />

        <div className="relative z-10 flex items-center justify-between">
          {/* Left Section - Logo + Desktop Nav */}
          <div className="flex items-center gap-6">
            <Logo width={40} variant="secondary" className="shrink-0" />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link key={item.title} href={item.href || "#"}>
                  <span
                    className={cn(
                      "text-white/70 transition-all duration-300 hover:text-white px-4 py-2 rounded-xl text-sm font-medium",
                      "hover:bg-white/10 active:scale-95",
                      isActive(item.href) &&
                        "text-white bg-white/15 border border-white/20 shadow-lg backdrop-blur-sm"
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section - Always visible items */}
          <div className="flex items-center gap-6">
            {isAuthenticated && (
              <div className="shrink-0">
                <CartButton />
              </div>
            )}

            {/* Desktop User Menu / Login Button */}
            <div className="hidden sm:flex items-center">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <div className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm flex items-center gap-3 text-white font-medium px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-1.5 shadow-lg">
                      <User className="size-4 text-black" />
                    </div>
                    <span className="text-sm max-w-[120px] truncate">
                      {user?.email}
                    </span>
                  </div>
                </Link>
              ) : (
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-6 py-2.5 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border border-yellow-300/50">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="lg:hidden text-white hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/20 backdrop-blur-sm"
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[280px] px-4 sm:w-[320px] bg-[#FFFFFF4D]/30 backdrop-blur-xl border-white/20 text-white"
              >
                <SheetHeader className="border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="flex items-center gap-3">
                      <Logo width={32} variant="secondary" />
                      <span className="text-white text-lg font-semibold">
                        Menu
                      </span>
                    </SheetTitle>
                  </div>
                </SheetHeader>

                <div className="flex flex-col h-full">
                  {/* Mobile Navigation */}
                  <nav className="mt-6 flex flex-col gap-2">
                    {NAV_ITEMS.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href || "#"}
                        onClick={handleLinkClick}
                      >
                        <div
                          className={cn(
                            "flex items-center px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium border border-transparent",
                            isActive(item.href) &&
                              "bg-white/15 text-white border-white/20 shadow-lg"
                          )}
                        >
                          {item.title}
                        </div>
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Auth Section - Bottom of menu */}
                  <div className="mt-auto pb-6">
                    <div className="border-t border-white/10 pt-6">
                      {isAuthenticated ? (
                        <div className="space-y-3">
                          {/* Mobile User Profile */}
                          <Link href="/dashboard" onClick={handleLinkClick}>
                            <div className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 border border-white/20">
                              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-2 shadow-lg shrink-0">
                                <User className="size-5 text-black" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-white font-medium text-sm">
                                  Dashboard
                                </p>
                                <p className="text-white/60 text-xs truncate">
                                  {user?.email}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ) : (
                        <Link href="/login" onClick={handleLinkClick}>
                          <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 border border-yellow-300/50">
                            Get Started
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Mobile User Section - Only show on small screens when authenticated */}
      {isAuthenticated && (
        <div className="sm:hidden mt-3">
          <Link href="/dashboard">
            <div className="bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-3 shadow-xl">
              <div className="flex items-center gap-3 text-white">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-2 shadow-lg">
                  <User className="size-4 text-black" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-white/60">Welcome back</p>
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;

"use client";

import ItemCard from "@/components/ItemCard";
import MenuCard from "@/components/MenuCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useMerch } from "@/hooks/useMerch";
import {
  Coffee,
  CupSoda,
  Gift,
  Package,
  Search,
  Shirt,
  ShoppingBag,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import MerchCard from "./MerchCard";

const MerchPage = () => {
  const { all } = useMerch();
  const { data: merch, isLoading, error } = all;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const router = useRouter();

  // ☕ Define shop-related categories
  const categoryMap = {
    "coffee beans": Coffee,
    mugs: Coffee,
    tumblers: CupSoda,
    apparel: Shirt,
    gifts: Gift,
    accessories: Package,
  };

  // 🪄 Get category icon dynamically
  const getCategoryIcon = (category: string | null | undefined) => {
    if (!category) return ShoppingBag;
    const lower = category.toLowerCase();
    for (const key in categoryMap) {
      if (lower.includes(key))
        return categoryMap[key as keyof typeof categoryMap];
    }
    return ShoppingBag;
  };

  // 🧭 Create pseudo-categories from merchant descriptions or names
  const categories = useMemo(() => {
    if (!merch) return [];
    return [
      "coffee beans",
      "mugs",
      "tumblers",
      "apparel",
      "gifts",
      "accessories",
    ];
  }, [merch]);

  // 🧩 Filter + sort logic
  const filteredMerch = useMemo(() => {
    if (!merch) return [];
    let filtered = merch.filter((item) => {
      const matchesSearch =
        item.merchant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false;
      const matchesCategory =
        selectedCategory === "all" ||
        item.merchant_description?.toLowerCase().includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.merchant_price - b.merchant_price;
        case "price-high":
          return b.merchant_price - a.merchant_price;
        default:
          return a.merchant_name.localeCompare(b.merchant_name);
      }
    });

    return filtered;
  }, [merch, searchQuery, selectedCategory, sortBy]);

  // 🌀 Loading Skeleton
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="w-full h-[350px] rounded-2xl" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  // ❌ Error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <ShoppingBag className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-semibold mb-2">Failed to load merch</h2>
        <p className="text-muted-foreground mb-4 text-sm">
          Please refresh or try again later.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ☕ Hero Section */}
      <section className="bg-secondary  text-white py-24 text-center px-4">
        <h1 className="text-4xl mt-24 md:text-6xl font-bold mb-3">
          Coffee Shop Merch
        </h1>
        <p className="text-white/80 max-w-2xl mx-auto">
          From freshly roasted beans to cozy mugs and coffee-lover apparel —
          bring the café vibes home.
        </p>
      </section>

      {/* 🔍 Mobile Search */}
      <div className="lg:hidden sticky top-0 bg-background border-b border-border px-4 py-3 z-20">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search merch..."
              className="pl-9 h-10 text-sm"
            />
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex">
        {/* 🧭 Sidebar (Desktop) */}
        <aside className="hidden lg:block w-72 border-r border-border p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              Search
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              <Button
                variant={selectedCategory === "all" ? "default" : "ghost"}
                onClick={() => setSelectedCategory("all")}
                className="w-full justify-start"
              >
                All Merch
              </Button>
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat);
                return (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "ghost"}
                    onClick={() => setSelectedCategory(cat)}
                    className="w-full justify-start"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-3">
              Sort By
            </h3>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="min-w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </aside>

        {/* ☕ Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold capitalize">
              {selectedCategory === "all" ? "All Merch" : selectedCategory}
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredMerch.length} item{filteredMerch.length !== 1 ? "s" : ""}{" "}
              found
            </p>
          </div>

          {/* ☕ Product Grid */}
          {filteredMerch.length === 0 ? (
            <div className="text-center py-16">
              <Coffee className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No merch found</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Try adjusting your filters or search term.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMerch.map((item) => (
                <Link key={item.merchant_id} href={`/merch/${item.merchant_id}`}>
                  <MerchCard merch={item} />
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MerchPage;

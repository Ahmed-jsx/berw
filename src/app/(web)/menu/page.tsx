"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Coffee,
  Cookie,
  Filter,
  Loader2,
  Search,
  Soup,
  UtensilsCrossed,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ItemCard from "@/components/ItemCard";
import MenuCard from "@/components/MenuCard";
import { useProducts } from "@/hooks/useProducts";

const MenuPage = () => {
  const { data: products, isLoading, error } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // ✅ Safe unique category extraction (ignore null)
  const categories = useMemo(() => {
    if (!products) return [];
    const valid = products
      .map((p) => p.product_category || "Uncategorized")
      .filter(Boolean);
    return [...new Set(valid)];
  }, [products]);

  // ✅ Category icon map
  const getCategoryIcon = (category: string | null | undefined) => {
    const c = (category || "Uncategorized").toLowerCase();
    if (c.includes("coffee") || c.includes("drink")) return Coffee;
    if (c.includes("main") || c.includes("meal")) return UtensilsCrossed;
    if (c.includes("dessert") || c.includes("sweet")) return Cookie;
    if (c.includes("soup") || c.includes("starter")) return Soup;
    return UtensilsCrossed;
  };

  // ✅ Filter + sort
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let list = products.filter((p) => {
      const matchesSearch =
        p.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.product_components?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        (p.product_category || "Uncategorized") === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return +a.product_price - +b.product_price;
        case "price-high":
          return +b.product_price - +a.product_price;
        case "featured":
          return b.is_featured ? 1 : -1;
        default:
          return a.product_name.localeCompare(b.product_name);
      }
    });

    return list;
  }, [products, searchQuery, selectedCategory, sortBy]);

 

  // ✅ Skeleton Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col gap-6 p-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-5 w-1/4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden rounded-2xl">
              <Skeleton className="h-48 w-full" />
              <CardContent className="space-y-2 p-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-3 text-center">
        <UtensilsCrossed className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Failed to load menu</h2>
        <p className="text-sm text-muted-foreground">Please try again later.</p>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <div className="relative bg-secondary text-primary-foreground py-20  px-6 text-center">
        <h1 className="text-4xl md:text-6xl mt-24 font-bold mb-2">Our Menu</h1>
        <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-lg">
          Discover our handcrafted creations made with love and the finest
          ingredients.
        </p>
      </div>

      {/* Mobile Search */}
      <div className="lg:hidden sticky top-0 z-30 bg-background border-b px-4 py-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu..."
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowMobileFilters(true)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-6">
            {/* Categories */}
            <div>
              <h4 className="text-sm font-medium mb-3">Categories</h4>
              <div className="space-y-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Items
                </Button>
                {categories.map((cat) => {
                  const Icon = getCategoryIcon(cat);
                  return (
                    <Button
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      className="w-full justify-start gap-2"
                      onClick={() => setSelectedCategory(cat)}
                    >
                      <Icon className="h-4 w-4" />
                      {cat}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h4 className="text-sm font-medium mb-3">Sort By</h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-muted rounded-lg px-3 py-2 text-sm"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="featured">Featured</option>
              </select>
            </div>

            <Button
              onClick={() => setShowMobileFilters(false)}
              className="w-full"
            >
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block w-72 border-r border-border p-6 space-y-8">
          <div>
            <h3 className="text-sm font-medium mb-2">Search</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu..."
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedCategory("all")}
              >
                All Items
              </Button>
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat);
                return (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <Icon className="h-4 w-4" />
                    {cat}
                  </Button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Products */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {selectedCategory === "all" ? "All Items" : selectedCategory}
              </h2>
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} items found
              </p>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-4" />
              <p>No items found. Try adjusting your search or filters.</p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link
                  key={product.product_id}
                  href={`/menu/${product.product_id}`}
                >
                  <ItemCard
                    id={product.product_id}
                    name={product.product_name}
                    description={product.product_components}
                    price={parseFloat(product.product_price)}
                    product_photo={product.product_photo}
                    isFeatured={product.is_featured}
                  />
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MenuPage;

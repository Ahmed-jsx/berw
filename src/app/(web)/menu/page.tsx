"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  UtensilsCrossed,
  LayoutGrid,
  List,
  X,
} from "lucide-react";
import { useQueryStates, parseAsString, parseAsStringLiteral } from "nuqs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ItemCard from "@/components/ItemCard";
import ItemCardList from "@/components/ItemCardList";
import ItemBadge from "@/components/ItemBadge";
import { useProducts } from "@/hooks/useProducts";

// Define the valid sort options and view modes
const sortOptions = ["name", "price-low", "price-high"] as const;
const viewModes = ["grid", "list"] as const;

const MenuPage = () => {
  const { data: products, isLoading, error } = useProducts();

  // ✅ Replace useState with nuqs - syncs with URL
  const [params, setParams] = useQueryStates(
    {
      q: parseAsString.withDefault(""),
      category: parseAsString,
      sort: parseAsStringLiteral(sortOptions).withDefault("name"),
      view: parseAsStringLiteral(viewModes).withDefault("grid"),
    },
    {
      history: "push",
      shallow: false,
    }
  );

  // Extract values from params
  const searchQuery = params.q;
  const selectedCategory = params.category;
  const sortBy = params.sort;
  const viewMode = params.view;

  // ✅ Keep visibleCount as local state (no need in URL)
  const [visibleCount, setVisibleCount] = useState(12);

  // ✅ Safe unique category extraction (ignore null)
  const categories = useMemo(() => {
    if (!products) return [];
    const valid = products
      .map((p) => p.product_category || "Uncategorized")
      .filter(Boolean);
    return [...new Set(valid)];
  }, [products]);

  // ✅ Auto-select first category when categories load (only if not set via URL)
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setParams({ category: categories[0] });
    }
  }, [categories, selectedCategory, setParams]);

  // ✅ Filter by selected category + search (global search when query exists)
  const filteredProducts = useMemo(() => {
    if (!products || !selectedCategory) return [];
    
    let list = products.filter((p) => {
      // If there's a search query, search globally across all products
      if (searchQuery) {
        const matchesSearch =
          p.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.product_components?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      }
      
      // If no search query, filter by selected category only
      const matchesCategory = (p.product_category || "Uncategorized") === selectedCategory;
      return matchesCategory;
    });

    // Sort products
    list.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return +a.product_price - +b.product_price;
        case "price-high":
          return +b.product_price - +a.product_price;
        default:
          return a.product_name.localeCompare(b.product_name);
      }
    });

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  // ✅ Group products by category when searching
  const groupedProducts = useMemo(() => {
    if (!searchQuery || !products) return null;
    
    const grouped: Record<string, typeof filteredProducts> = {};
    filteredProducts.forEach(product => {
      const category = product.product_category || "Uncategorized";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  }, [filteredProducts, searchQuery, products]);

  // ✅ Count total categories with results
  const categoriesWithResults = groupedProducts 
    ? Object.keys(groupedProducts).length 
    : 0;

  // ✅ Visible products for category view (Load More)
  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // ✅ Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(12);
  }, [searchQuery, selectedCategory, sortBy]);

 

  // ✅ Skeleton Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col gap-6 p-6 pt-32">
        <div className="max-w-6xl mx-auto w-full space-y-6">
          {/* Category skeleton */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-32 rounded-full flex-none" />
            ))}
          </div>
          {/* Products skeleton */}
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
      <div className="relative bg-secondary text-primary-foreground py-20 px-6 text-center">
        <h1 className="text-4xl md:text-6xl mt-24 font-bold mb-2">Our Menu</h1>
        <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-lg">
          Discover our handcrafted creations made with love and the finest
          ingredients.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Search Bar + View Toggle + Sort */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setParams({ q: e.target.value || null })}
              placeholder="Search all products..."
              className="pl-9 pr-9 rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setParams({ q: null })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* View Toggle + Sort */}
          <div className="flex items-center gap-3">
            {/* View Toggle Buttons */}
            <div className="flex lg:hidden items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setParams({ view: "grid" })}
                className={viewMode === "grid" ? "bg-white shadow-sm" : ""}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setParams({ view: "list" })}
                className={viewMode === "list" ? "bg-white shadow-sm" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Sort Dropdown */}
            <Select 
              value={sortBy} 
              onValueChange={(value) => setParams({ sort: value as typeof sortBy })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Results Summary - Show when searching */}
        {searchQuery && (
          <div className="mb-6 p-4 bg-secondary/10 rounded-xl border border-secondary/20">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-secondary">
                Found <span className="font-bold">{filteredProducts.length}</span> products
                {categoriesWithResults > 0 && (
                  <> in <span className="font-bold">{categoriesWithResults}</span> {categoriesWithResults === 1 ? 'category' : 'categories'}</>
                )}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setParams({ q: null })}
                className="text-secondary hover:text-secondary/80"
              >
                Clear search
              </Button>
            </div>
          </div>
        )}

        {/* Category Badges - Hide when searching */}
        {!searchQuery && (
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide snap-x snap-mandatory mb-8">
            <div className="flex flex-nowrap gap-3 min-w-max">
              {categories.map((cat) => (
                <div key={cat} className="flex-none snap-center">
                  <ItemBadge
                    title={cat}
                    active={selectedCategory === cat}
                    onClick={() => setParams({ category: cat })}
                    size="md"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Category Title - Hide when searching */}
        {!searchQuery && selectedCategory && (
          <h2 className="text-3xl font-bold text-secondary mb-6">
            {selectedCategory}
          </h2>
        )}

        {/* Products Display */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="h-10 w-10 mx-auto mb-4" />
            <p>No items found.</p>
            {searchQuery && (
              <Button
                onClick={() => setParams({ q: null })}
                className="mt-4"
                variant="outline"
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : searchQuery && groupedProducts ? (
          // ✅ Categorized Search Results
          <div className="space-y-10 ">
            {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
              <div key={category} className="space-y-4">
                {/* Category Header */}
                <div className="flex items-center flex-col lg:flex-row gap-2 lg:gap-0 justify-between border-b border-gray-200 pb-3">
                  <h3 className="text-2xl font-bold text-secondary">
                    {category}
                    <span className="text-base font-normal text-muted-foreground ml-2">
                      ({categoryProducts.length} {categoryProducts.length === 1 ? 'item' : 'items'})
                    </span>
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setParams({ category: category, q: null });
                    }}
                    className="text-secondary  border-secondary hover:bg-secondary hover:text-white"
                  >
                    View all in {category}
                  </Button>
                </div>
                
                {/* Category Products - Show max 6 */}
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProducts.slice(0, 6).map((product) => (
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
                ) : (
                  <div className="space-y-4">
                    {categoryProducts.slice(0, 6).map((product) => (
                      <Link
                        key={product.product_id}
                        href={`/menu/${product.product_id}`}
                        className="block"
                      >
                        <ItemCardList
                          id={product.product_id}
                          name={product.product_name}
                          description={product.product_components}
                          price={parseFloat(product.product_price)}
                          product_photo={product.product_photo}
                        />
                      </Link>
                    ))}
                  </div>
                )}
                
                {/* Show more link if there are more products */}
                {categoryProducts.length > 6 && (
                  <div className="text-center pt-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setParams({ category: category, q: null });
                      }}
                      className="text-secondary hover:text-secondary/80"
                    >
                      +{categoryProducts.length - 6} more items in {category}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // ✅ Regular Category View with Load More
          <>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleProducts.map((product) => (
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
            ) : (
              <div className="space-y-4">
                {visibleProducts.map((product) => (
                  <Link
                    key={product.product_id}
                    href={`/menu/${product.product_id}`}
                    className="block"
                  >
                    <ItemCardList
                      id={product.product_id}
                      name={product.product_name}
                      description={product.product_components}
                      price={parseFloat(product.product_price)}
                      product_photo={product.product_photo}
                    />
                  </Link>
                ))}
              </div>
            )}

            {/* Load More Button - Replace pagination */}
            {filteredProducts.length > visibleCount && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="px-8 py-6 text-base"
                >
                  Load More ({filteredProducts.length - visibleCount} remaining)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MenuPage;

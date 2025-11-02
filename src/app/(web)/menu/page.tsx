"use client";

import { useState, useMemo } from "react";
import { useOrderStore } from "@/store/orderStore";
import { useAuthStore } from "@/store/auth-store";
import ItemCard from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Search,
  Filter,
  Loader2,
  ShoppingCart,
  Star,
  Coffee,
  UtensilsCrossed,
  Cookie,
  Soup,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Product } from "@/types/Product";
import { useProducts } from "@/hooks/useProducts";
import { useExtras } from "@/hooks/useExtras";
import { Extra } from "@/types/extras";
import { useRouter } from "next/navigation";

const MenuPage = () => {
  const { data: products, isLoading, error } = useProducts();
  const { data: extras = [] } = useExtras();
  const { addToCart, getCartItemsCount } = useOrderStore();
  const { isAuthenticated } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const router = useRouter();

  // Get unique categories from products
  const categories = useMemo(() => {
    if (!products) return [];
    const uniqueCategories = [
      ...new Set(products.map((p) => p.product_category)),
    ];
    return uniqueCategories;
  }, [products]);

  // Category icons mapping
  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes("coffee") || lowerCategory.includes("drink"))
      return Coffee;
    if (lowerCategory.includes("main") || lowerCategory.includes("meal"))
      return UtensilsCrossed;
    if (lowerCategory.includes("dessert") || lowerCategory.includes("sweet"))
      return Cookie;
    if (lowerCategory.includes("soup") || lowerCategory.includes("starter"))
      return Soup;
    return UtensilsCrossed;
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = products.filter((product) => {
      const matchesSearch =
        product.product_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        product
          .product_components!.toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        product.product_category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return parseFloat(a.product_price) - parseFloat(b.product_price);
        case "price-high":
          return parseFloat(b.product_price) - parseFloat(a.product_price);
        case "featured":
          return b.is_featured ? 1 : -1;
        case "name":
        default:
          return a.product_name.localeCompare(b.product_name);
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

  // Featured products
  const featuredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => product.is_featured).slice(0, 6);
  }, [products]);

  // Handle adding item to cart
  const handleAddToCart = (product: Product) => {
    const cartItem = {
      product_id: product.product_id,
      product_name: product.product_name,
      product_price: parseFloat(product.product_price),
      product_photo: product.product_photo,
      product_category: product.product_category,
      quantity: 1,
      extras: [],
    };

    if (!isAuthenticated) {
      toast.error("Please login to add items");
      router.push("/login");
    }

    if (isAuthenticated) {
      addToCart(cartItem, extras as Extra[]);
      toast.success(`${product.product_name} added to cart!`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Loading Menu
          </h2>
          <p className="text-muted-foreground">
            Please wait while we fetch our delicious items...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-destructive/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <UtensilsCrossed className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Unable to Load Menu
          </h2>
          <p className="text-muted-foreground mb-4">
            We're having trouble loading our menu. Please try again later.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-secondary text-white pt-48 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Discover our carefully crafted dishes made with the finest
            ingredients
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Featured Products Section */}

        {/* Search and Filter Section */}
        <Card className="p-6 mb-8 bg-card border border-border">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for dishes, ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-input"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-background border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border border-input rounded-md px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="featured">Featured First</option>
            </select>
          </div>
        </Card>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => setSelectedCategory("all")}
            className="rounded-full"
          >
            All Items
          </Button>
          {categories.map((category) => {
            const IconComponent = getCategoryIcon(category);
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {category}
              </Button>
            );
          })}
        </div>
        {/* {featuredProducts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Star className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Featured Items
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ItemCard
                  key={product.product_id}
                  id={product.product_id}
                  name={product.product_name}
                  description={product.product_components}
                  price={parseFloat(product.product_price)}
                  isFeatured={product.is_featured}
                  product_photo={product.product_photo}
                />
              ))}
            </div>
          </section>
        )} */}

        {/* Products Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              {selectedCategory === "all" ? "All Items" : selectedCategory}
            </h2>
            <p className="text-muted-foreground">
              {filteredAndSortedProducts.length} item
              {filteredAndSortedProducts.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-muted rounded-full p-8 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No items found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product) => (
                <Link
                  href={`/menu/${product.product_id}`}
                  key={product.product_id}
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
        </section>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-muted rounded-3xl p-12">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Can't find what you're looking for?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our menu is constantly evolving. Contact us for special requests or
            dietary accommodations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Contact Us
            </Button>
            <Button variant="outline">View Full Menu PDF</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;

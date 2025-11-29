"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useUsers } from "@/hooks/useUsers";
import { useProducts } from "@/hooks/useProducts";
import { useExtras, type Extra } from "@/hooks/useExtras";
import { useCheckoutOrder } from "@/hooks/useOrderQueries";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { Plus, Minus, X, Check, Loader2, Search, ShoppingCart, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Form schema
const createOrderSchema = z.object({
  user_id: z.number().min(1, "Please select a customer"),
  items: z
    .array(
      z.object({
        product_id: z.number(),
        quantity: z.number().min(1),
        extras: z.record(z.number(), z.number()), // Map of extra ID to quantity
      })
    )
    .min(1, "Please add at least one product"),
});

type CreateOrderFormData = z.infer<typeof createOrderSchema>;

interface OrderItem {
  product_id: number;
  quantity: number;
  extras: { [extraId: number]: number }; // Map of extra ID to quantity
}

export default function CreateOrderForm() {
  const router = useRouter();
  const role = useAuthStore((s) => s.role);
  const { data: usersData, isLoading: usersLoading, error: usersError } = useUsers();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: extras, isLoading: extrasLoading } = useExtras();
  const checkoutMutation = useCheckoutOrder();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [openCustomerPopover, setOpenCustomerPopover] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      user_id: 0,
      items: [],
    },
  });

  // Sync orderItems with form state
  useEffect(() => {
    setValue("items", orderItems);
    if (orderItems.length > 0) {
      trigger("items");
    }
  }, [orderItems, setValue, trigger]);

  // Get unique categories
  const categories = useMemo(() => {
    if (!products) return [];
    const categorySet = new Set<string>();
    products.forEach((p) => {
      if (p.product_category) {
        categorySet.add(p.product_category);
      }
    });
    return Array.from(categorySet).sort();
  }, [products]);

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    if (!usersData?.users) return [];
    const users = usersData.users;
    if (!customerSearch.trim()) return users;
    const searchLower = customerSearch.toLowerCase();
    return users.filter(
      (user: any) => {
        const name = user.name || user.user_name || '';
        const email = user.email || user.user_email || '';
        const number = user.number || user.user_number || '';
        return (
          name.toLowerCase().includes(searchLower) ||
          email.toLowerCase().includes(searchLower) ||
          number.toLowerCase().includes(searchLower)
        );
      }
    );
  }, [usersData?.users, customerSearch]);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = products;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.product_category === selectedCategory);
    }

    // Filter by search
    if (productSearch.trim()) {
      const searchLower = productSearch.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.product_name?.toLowerCase().includes(searchLower) ||
          product.product_category?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [products, selectedCategory, productSearch]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!products || !extras) return 0;
    return orderItems.reduce((total, item) => {
      const product = products.find((p) => p.product_id === item.product_id);
      if (!product) return total;
      const productPrice = parseFloat(product.product_price) * item.quantity;
      // Extras price = sum of (extra price * extra quantity)
      const extrasPrice = Object.entries(item.extras).reduce((sum, [extraId, quantity]) => {
        const extra = extras.find((e) => e.id === Number(extraId));
        return sum + (extra ? extra.price * quantity : 0);
      }, 0);
      return total + productPrice + extrasPrice;
    }, 0);
  }, [orderItems, products, extras]);

  // Get selected customer
  const selectedCustomer = useMemo(() => {
    if (!selectedUserId || !usersData?.users) return null;
    return (usersData.users.find((u) => u.id === selectedUserId) || null) as any;
  }, [selectedUserId, usersData]);

  // Add product to order
  const handleAddProduct = (productId: number) => {
    const product = products?.find((p) => p.product_id === productId);
    if (!product) {
      toast.error("Product not found");
      return;
    }

    // Check if product already exists in order
    const existingIndex = orderItems.findIndex((item) => item.product_id === productId);
    
    if (existingIndex >= 0) {
      // Increment quantity if product already exists
      setOrderItems((prev) =>
        prev.map((item, i) => {
          if (i === existingIndex) {
            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }
          return item;
        })
      );
      toast.success(`${product.product_name} quantity increased`);
    } else {
      // Add new product
      const newItem = {
        product_id: productId,
        quantity: 1,
        extras: {},
      };
      setOrderItems((prev) => [...prev, newItem]);
      toast.success(`${product.product_name} added to order`);
    }
  };

  // Remove product from order
  const handleRemoveProduct = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
    if (editingItemIndex === index) {
      setEditingItemIndex(null);
    }
  };

  // Update product quantity
  const handleQuantityChange = (index: number, change: number) => {
    setOrderItems((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const newQuantity = item.quantity + change;
          return {
            ...item,
            quantity: newQuantity >= 1 ? newQuantity : 1,
          };
        }
        return item;
      })
    );
  };

  // Add extra to a product (or increment quantity)
  const handleAddExtra = (itemIndex: number, extraId: number) => {
    setOrderItems((prev) =>
      prev.map((item, i) => {
        if (i === itemIndex) {
          const currentQuantity = item.extras[extraId] || 0;
          return {
            ...item,
            extras: {
              ...item.extras,
              [extraId]: currentQuantity + 1,
            },
          };
        }
        return item;
      })
    );
  };

  // Remove extra from a product (or decrement quantity)
  const handleRemoveExtra = (itemIndex: number, extraId: number) => {
    setOrderItems((prev) =>
      prev.map((item, i) => {
        if (i === itemIndex) {
          const currentQuantity = item.extras[extraId] || 0;
          if (currentQuantity <= 1) {
            // Remove extra if quantity is 1 or less
            const { [extraId]: _, ...restExtras } = item.extras;
            return {
              ...item,
              extras: restExtras,
            };
          } else {
            // Decrement quantity
            return {
              ...item,
              extras: {
                ...item.extras,
                [extraId]: currentQuantity - 1,
              },
            };
          }
        }
        return item;
      })
    );
  };

  // Update extra quantity
  const handleExtraQuantityChange = (itemIndex: number, extraId: number, change: number) => {
    setOrderItems((prev) =>
      prev.map((item, i) => {
        if (i === itemIndex) {
          const currentQuantity = item.extras[extraId] || 0;
          const newQuantity = currentQuantity + change;
          
          if (newQuantity <= 0) {
            // Remove extra if quantity is 0 or less
            const { [extraId]: _, ...restExtras } = item.extras;
            return {
              ...item,
              extras: restExtras,
            };
          } else {
            // Update quantity
            return {
              ...item,
              extras: {
                ...item.extras,
                [extraId]: newQuantity,
              },
            };
          }
        }
        return item;
      })
    );
  };

  // Get product details
  const getProductDetails = (productId: number) => {
    return products?.find((p) => p.product_id === productId);
  };

  // Get extra details
  const getExtraDetails = (extraId: number) => {
    return extras?.find((e) => e.id === extraId);
  };

  // Calculate item total
  const getItemTotal = (item: OrderItem) => {
    const product = getProductDetails(item.product_id);
    if (!product) return 0;
    const productPrice = parseFloat(product.product_price) * item.quantity;
    // Extras price = sum of (extra price * extra quantity)
    const extrasPrice = Object.entries(item.extras).reduce((sum, [extraId, quantity]) => {
      const extra = getExtraDetails(Number(extraId));
      return sum + (extra ? extra.price * quantity : 0);
    }, 0);
    return productPrice + extrasPrice;
  };

  // Handle form submission
  const onSubmit = async (data: CreateOrderFormData) => {
    // Validate customer
    if (!selectedUserId) {
      toast.error("Please select a customer");
      setValue("user_id", 0);
      trigger("user_id");
      return;
    }

    // Validate products
    if (orderItems.length === 0) {
      toast.error("Please add at least one product");
      setValue("items", []);
      trigger("items");
      return;
    }

    // Validate each item has valid quantity
    const invalidItems = orderItems.filter((item) => item.quantity < 1);
    if (invalidItems.length > 0) {
      toast.error("All products must have a quantity of at least 1");
      return;
    }

    // Format checkout payload to match the checkout process structure
    // Convert extras map to array format (repeat IDs based on quantity)
    const checkoutData = {
      user_id: selectedUserId,
      items: orderItems.map((item) => {
        const extrasArray: number[] = [];
        if (item.extras) {
          Object.entries(item.extras).forEach(([id, quantity]) => {
            for (let i = 0; i < quantity; i++) {
              extrasArray.push(Number(id));
            }
          });
        }
        return {
          type: "product" as const,
          product_id: item.product_id,
          quantity: item.quantity,
          extras: extrasArray,
        };
      }),
    };

    try {
      const result = await checkoutMutation.mutateAsync(checkoutData);
      toast.success(`Order created successfully! Order Code: ${result.order_code}`);
      
      // Redirect based on user role
      if (role === "cashier") {
        router.push("/cashier/orders");
      } else {
        router.push("/dashboard/orders");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to create order");
    }
  };

  // Get item quantity in cart for a product
  const getProductQuantityInCart = (productId: number) => {
    const item = orderItems.find((item) => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  if (productsLoading || extrasLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Customer Selection - Compact Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Customer:</span>
            </div>
            <Popover open={openCustomerPopover} onOpenChange={setOpenCustomerPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="flex-1 justify-between max-w-md"
                  disabled={usersLoading}
                >
                  {usersLoading
                    ? "Loading customers..."
                    : selectedCustomer
                    ? `${selectedCustomer.name || selectedCustomer.user_name} (${selectedCustomer.email || selectedCustomer.user_email})`
                    : "Select customer..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput
                    placeholder="Search customers..."
                    value={customerSearch}
                    onValueChange={setCustomerSearch}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {usersLoading
                        ? "Loading..."
                        : filteredCustomers.length === 0
                        ? "No customers found."
                        : "No results found."}
                    </CommandEmpty>
                    {filteredCustomers.length > 0 && (
                      <CommandGroup>
                        {filteredCustomers.map((user: any) => (
                          <CommandItem
                            key={user.id}
                            value={`${user.name || user.user_name} ${user.email || user.user_email} ${user.number || user.user_number}`}
                            onSelect={() => {
                              setSelectedUserId(user.id);
                              setValue("user_id", user.id);
                              setOpenCustomerPopover(false);
                              setCustomerSearch("");
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedUserId === user.id ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium">{user.name || user.user_name}</span>
                              <span className="text-sm text-muted-foreground">
                                {user.email || user.user_email} • {user.number || user.user_number}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.user_id && (
              <p className="text-sm text-red-500">{errors.user_id.message}</p>
            )}
            {selectedCustomer && (
              <Badge variant="secondary" className="ml-auto">
                {orderItems.length} {orderItems.length === 1 ? "item" : "items"}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Products (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Category Filter */}
          <Card>
            <CardContent className="p-4 ">
              <div className="flex flex-col  gap-4">
                {/* Search */}
                <div className="relative  flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  <Button
                    type="button"
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      type="button"
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const quantityInCart = getProductQuantityInCart(product.product_id);
              const imageSrc = product.product_photo && product.product_photo.trim() !== ""
                ? product.product_photo
                : "/bg1.png";

              return (
                <Card
                  key={product.product_id}
                  className="overflow-hidden p-0 hover:shadow-lg transition-shadow cursor-pointer group"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={imageSrc}
                      alt={product.product_name}
                      fill
                      className="object-cover"
                    />
                    {quantityInCart > 0 && (
                      <Badge className="absolute top-2 right-2 bg-primary">
                        {quantityInCart}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-semibold text-sm mb-1 line-clamp-1">
                      {product.product_name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      {parseFloat(product.product_price).toFixed(2)} EGP
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddProduct(product.product_id)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {quantityInCart > 0 ? "Add More" : "Add"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  {productSearch || selectedCategory
                    ? "No products found matching your filters."
                    : "No products available."}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Order Summary (1/3 width) */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-0">
              <div className="p-4 border-b flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <h3 className="font-semibold">Order Summary</h3>
                {orderItems.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {orderItems.length}
                  </Badge>
                )}
              </div>

              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                {orderItems.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No items in order</p>
                    <p className="text-xs mt-1">Add products to get started</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {orderItems.map((item, index) => {
                      const product = getProductDetails(item.product_id);
                      if (!product) return null;

                      const isEditing = editingItemIndex === index;

                      return (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-3">
                            <div className="space-y-3">
                              {/* Product Header */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm line-clamp-1">
                                    {product.product_name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    {parseFloat(product.product_price).toFixed(2)} EGP each
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 flex-shrink-0"
                                  onClick={() => handleRemoveProduct(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Quantity:</span>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => handleQuantityChange(index, -1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center text-sm font-medium">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => handleQuantityChange(index, 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              {/* Extras - Collapsible */}
                              {extras && extras.length > 0 && (
                                <div className="space-y-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-between h-7 text-xs"
                                    onClick={() => setEditingItemIndex(isEditing ? null : index)}
                                  >
                                    <span>Extras</span>
                                    <span className="text-muted-foreground">
                                      {Object.keys(item.extras).length > 0
                                        ? `${Object.values(item.extras).reduce((a, b) => a + b, 0)} selected`
                                        : "None"}
                                    </span>
                                  </Button>
                                  {isEditing && (
                                    <div className="space-y-1 pl-2 border-l-2">
                                      {extras.map((extra) => {
                                        const extraQuantity = item.extras[extra.id] || 0;
                                        const hasExtra = extraQuantity > 0;
                                        
                                        return (
                                          <div
                                            key={extra.id}
                                            className="flex items-center justify-between py-1"
                                          >
                                            <div className="flex items-center space-x-2 flex-1 min-w-0">
                                              <Checkbox
                                                id={`extra-${index}-${extra.id}`}
                                                checked={hasExtra}
                                                onCheckedChange={(checked) => {
                                                  if (checked) {
                                                    handleAddExtra(index, extra.id);
                                                  } else {
                                                    handleRemoveExtra(index, extra.id);
                                                  }
                                                }}
                                                className="h-3 w-3"
                                              />
                                              <Label
                                                htmlFor={`extra-${index}-${extra.id}`}
                                                className="text-xs font-normal cursor-pointer flex-1 truncate"
                                              >
                                                {extra.name}
                                              </Label>
                                            </div>
                                            {hasExtra && (
                                              <div className="flex items-center gap-1 ml-2">
                                                <Button
                                                  type="button"
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-5 w-5"
                                                  onClick={() => handleExtraQuantityChange(index, extra.id, -1)}
                                                >
                                                  <Minus className="h-2.5 w-2.5" />
                                                </Button>
                                                <span className="w-6 text-center text-xs font-medium">
                                                  {extraQuantity}
                                                </span>
                                                <Button
                                                  type="button"
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-5 w-5"
                                                  onClick={() => handleExtraQuantityChange(index, extra.id, 1)}
                                                >
                                                  <Plus className="h-2.5 w-2.5" />
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Item Total */}
                              <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-xs text-muted-foreground">Item Total:</span>
                                <span className="text-sm font-semibold">
                                  {getItemTotal(item).toFixed(2)} EGP
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Order Total and Actions */}
              {orderItems.length > 0 && (
                <>
                  <Separator />
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">
                        {totalPrice.toFixed(2)} EGP
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setOrderItems([]);
                          setEditingItemIndex(null);
                        }}
                        className="flex-1"
                        disabled={orderItems.length === 0}
                      >
                        Clear
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          !selectedUserId ||
                          orderItems.length === 0 ||
                          checkoutMutation.isPending
                        }
                        className="flex-1"
                      >
                        {checkoutMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Order"
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Global form errors */}
      {errors.items && orderItems.length === 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3">
            <p className="text-sm text-red-600 font-medium">
              {errors.items.message}
            </p>
          </CardContent>
        </Card>
      )}
    </form>
  );
}

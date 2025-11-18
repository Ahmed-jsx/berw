"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { Plus, Minus, X, Check, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Form schema
const createOrderSchema = z.object({
  user_id: z.number().min(1, "Please select a customer"),
  items: z
    .array(
      z.object({
        product_id: z.number(),
        quantity: z.number().min(1),
        extras: z.array(z.number()),
      })
    )
    .min(1, "Please add at least one product"),
});

type CreateOrderFormData = z.infer<typeof createOrderSchema>;

interface OrderItem {
  product_id: number;
  quantity: number;
  extras: number[];
}

export default function CreateOrderForm() {
  const router = useRouter();
  const { data: usersData, isLoading: usersLoading, error: usersError } = useUsers();
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: extras, isLoading: extrasLoading } = useExtras();
  const checkoutMutation = useCheckoutOrder();


  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [openCustomerPopover, setOpenCustomerPopover] = useState(false);
  const [openProductPopover, setOpenProductPopover] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

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

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!productSearch.trim()) return products;
    const searchLower = productSearch.toLowerCase();
    return products.filter(
      (product) =>
        product.product_name?.toLowerCase().includes(searchLower) ||
        product.product_category?.toLowerCase().includes(searchLower)
    );
  }, [products, productSearch]);

  // Get available products (not already added)
  const availableProducts = useMemo(() => {
    if (!products) return [];
    const addedProductIds = new Set(orderItems.map((item) => item.product_id));
    return products.filter((p) => !addedProductIds.has(p.product_id));
  }, [products, orderItems]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!products || !extras) return 0;
    return orderItems.reduce((total, item) => {
      const product = products.find((p) => p.product_id === item.product_id);
      if (!product) return total;
      const productPrice = parseFloat(product.product_price) * item.quantity;
      // Extras are NOT multiplied by quantity (same as menu page)
      const extrasPrice = item.extras.reduce((sum, extraId) => {
        const extra = extras.find((e) => e.id === extraId);
        return sum + (extra ? extra.price : 0);
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

    const newItem = {
      product_id: productId,
      quantity: 1,
      extras: [],
    };

    setOrderItems((prev) => [...prev, newItem]);
    setOpenProductPopover(false);
    setProductSearch("");
    toast.success(`${product.product_name} added to order`);
  };

  // Remove product from order
  const handleRemoveProduct = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
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

  // Toggle extra for a product
  const handleToggleExtra = (itemIndex: number, extraId: number) => {
    setOrderItems((prev) =>
      prev.map((item, i) => {
        if (i === itemIndex) {
          const hasExtra = item.extras.includes(extraId);
          return {
            ...item,
            extras: hasExtra
              ? item.extras.filter((id) => id !== extraId)
              : [...item.extras, extraId],
          };
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
    // Extras are NOT multiplied by quantity (same as menu page)
    const extrasPrice = item.extras.reduce((sum, extraId) => {
      const extra = getExtraDetails(extraId);
      return sum + (extra ? extra.price : 0);
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
    const checkoutData = {
      user_id: selectedUserId,
      items: orderItems.map((item) => ({
        type: "product" as const,
        product_id: item.product_id,
        quantity: item.quantity,
        extras: item.extras || [],
      })),
    };

    try {
      const result = await checkoutMutation.mutateAsync(checkoutData);
      toast.success(`Order created successfully! Order Code: ${result.order_code}`);
      router.push("/dashboard/orders");
    } catch (error: any) {
      toast.error(error?.message || "Failed to create order");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Customer Selection */}
      <div className="space-y-2">
        <Label htmlFor="customer">Customer *</Label>
        {usersError && (
          <p className="text-sm text-red-500">
            Error loading customers: {usersError.message}
          </p>
        )}
        <Popover open={openCustomerPopover} onOpenChange={setOpenCustomerPopover}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
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
      </div>

      {/* Add Product */}
      <div className="space-y-2">
        <Label>Products *</Label>
        <Popover open={openProductPopover} onOpenChange={setOpenProductPopover}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start"
              disabled={productsLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              {productsLoading ? "Loading products..." : "Add Product"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search products..."
                value={productSearch}
                onValueChange={setProductSearch}
              />
              <CommandList>
                <CommandEmpty>
                  {productsLoading
                    ? "Loading products..."
                    : availableProducts.length === 0
                    ? orderItems.length > 0
                      ? "All available products have been added"
                      : "No products available"
                    : "No products found."}
                </CommandEmpty>
                {(() => {
                  const productsToShow = productSearch.trim()
                    ? filteredProducts.filter((p) =>
                        availableProducts.some((ap) => ap.product_id === p.product_id)
                      )
                    : availableProducts;

                  return productsToShow.length > 0 ? (
                    <CommandGroup>
                      {productsToShow.map((product) => (
                        <CommandItem
                          key={product.product_id}
                          value={product.product_name}
                          onSelect={() => handleAddProduct(product.product_id)}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {product.product_name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {product.product_category} •{" "}
                              {parseFloat(product.product_price).toFixed(2)} EGP
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : null;
                })()}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {orderItems.length === 0 && (
          <p className="text-sm text-amber-600">
            Please add at least one product to create an order
          </p>
        )}
        {errors.items && (
          <p className="text-sm text-red-500">{errors.items.message}</p>
        )}
      </div>

      {/* Order Items */}
      {orderItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Order Items ({orderItems.length})</Label>
            <span className="text-sm text-muted-foreground">
              {orderItems.length} {orderItems.length === 1 ? "item" : "items"} added
            </span>
          </div>
          <div className="space-y-3">
            {orderItems.map((item, index) => {
              const product = getProductDetails(item.product_id);
              if (!product) return null;

              return (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Product Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{product.product_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {product.product_category} •{" "}
                            {parseFloat(product.product_price).toFixed(2)} EGP
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveProduct(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <Label className="text-sm">Quantity:</Label>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(index, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(index, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Extras Selection */}
                      {extras && extras.length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm">Extras:</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {extras.map((extra) => (
                              <div
                                key={extra.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`extra-${index}-${extra.id}`}
                                  checked={item.extras.includes(extra.id)}
                                  onCheckedChange={(checked) =>
                                    handleToggleExtra(index, extra.id)
                                  }
                                />
                                <Label
                                  htmlFor={`extra-${index}-${extra.id}`}
                                  className="text-sm font-normal cursor-pointer flex-1"
                                >
                                  {extra.name} (+{extra.price.toFixed(2)} EGP)
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Item Total */}
                      <div className="flex justify-end pt-2 border-t">
                        <span className="font-semibold">
                          Item Total: {getItemTotal(item).toFixed(2)} EGP
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Summary */}
      {orderItems.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold">
                {totalPrice.toFixed(2)} EGP
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
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

      {/* Global form errors */}
      {errors.items && orderItems.length === 0 && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200">
          <p className="text-sm text-red-600 font-medium">
            {errors.items.message}
          </p>
        </div>
      )}
    </form>
  );
}


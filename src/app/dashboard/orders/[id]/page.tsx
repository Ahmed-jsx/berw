"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOrderDetails } from "@/hooks/useOrderQueries";
import axios from "axios";
import {
  Calendar,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Loader2,
  Mail,
  Phone,
  User,
  Percent,
  Tag,
} from "lucide-react";
import { useState, use } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { orderKeys } from "@/hooks/useOrderQueries";

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "complete":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OrderPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const orderId = id;
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useAdminOrderDetails(Number(orderId));
  const [isUpdating, setIsUpdating] = useState(false);
  const [discountType, setDiscountType] = useState<"percentage" | "amount" | "">("");
  const [discountValue, setDiscountValue] = useState<string>("");
  const [showDiscountFields, setShowDiscountFields] = useState(false);

  const updateOrderStatus = async (newStatus: string) => {
    if (isUpdating) return;

    // Prevent status changes if order is already complete
    const currentStatus = order?.order_status?.toLowerCase();
    if (currentStatus === "complete" || currentStatus === "completed") {
      toast.error("Cannot change status", {
        description: "Completed orders cannot be modified",
      });
      return;
    }

    if (currentStatus === newStatus.toLowerCase()) {
      toast.info("Order is already in this status");
      return;
    }

    // Handle cancellation with DELETE request
    if (newStatus.toLowerCase() === "cancelled") {
      setIsUpdating(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://monkey-dc6r.onrender.com";
        
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        // DELETE request to cancel/delete order
        await axios.delete(`${apiUrl}/orders/${orderId}`, {
          headers,
        });

        // Invalidate and refetch orders list
        await queryClient.invalidateQueries({ 
          queryKey: orderKeys.admin.all() 
        });
        await queryClient.invalidateQueries({ 
          queryKey: orderKeys.lists() 
        });

        toast.success("Order cancelled successfully", {
          description: `Order #${order?.order_code || orderId} has been cancelled and deleted`,
        });

        // Redirect to orders list after successful deletion
        setTimeout(() => {
          router.push("/dashboard/orders");
        }, 1500);
      } catch (err: any) {
        console.error("Failed to cancel order:", err);
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to cancel order";
        toast.error("Cancellation Failed", {
          description: errorMessage,
        });
        setIsUpdating(false);
      }
      return;
    }

    // Validate discount if completing order with discount fields shown
    if (newStatus.toLowerCase() === "complete" && showDiscountFields) {
      if (discountType && !discountValue) {
        toast.error("Discount value required", {
          description: "Please enter a discount value or clear the discount type",
        });
        return;
      }
      if (discountValue && !discountType) {
        toast.error("Discount type required", {
          description: "Please select a discount type",
        });
        return;
      }
      if (discountValue && discountType) {
        const numValue = Number(discountValue);
        if (isNaN(numValue) || numValue <= 0) {
          toast.error("Invalid discount value", {
            description: "Discount value must be a positive number",
          });
          return;
        }
        if (discountType === "percentage" && numValue > 100) {
          toast.error("Invalid discount percentage", {
            description: "Percentage cannot exceed 100%",
          });
          return;
        }
        if (discountType === "amount" && numValue <= 0) {
          toast.error("Invalid discount amount", {
            description: "Discount amount must be greater than 0",
          });
          return;
        }
      }
    }

    setIsUpdating(true);

    try {
      const requestBody: { discount_type?: string; discount_value?: number } = {};
      
      // Include discount in body only when completing order and discount is provided
      if (newStatus.toLowerCase() === "complete" && discountType && discountValue) {
        requestBody.discount_type = discountType;
        requestBody.discount_value = Number(discountValue);
      }

      await axios.post(
        `https://monkey-dc6r.onrender.com/api/orders/${orderId}/${newStatus}`,
        Object.keys(requestBody).length > 0 ? requestBody : {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Invalidate and refetch relevant queries
      await queryClient.invalidateQueries({ 
        queryKey: orderKeys.admin.details(Number(orderId)) 
      });
      await queryClient.invalidateQueries({ 
        queryKey: orderKeys.admin.all() 
      });
      await queryClient.invalidateQueries({ 
        queryKey: orderKeys.lists() 
      });
      
      // Also refetch current order details
      await refetch();

      // Reset discount fields after successful update
      if (newStatus.toLowerCase() === "complete") {
        setDiscountType("");
        setDiscountValue("");
        setShowDiscountFields(false);
      }

      toast.success(`Order status updated to ${newStatus}`, {
        description: `Order #${order?.order_code || orderId} is now ${newStatus}`,
      });
    } catch (err: any) {
      console.error("Failed to update order:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update order status";
      toast.error("Update Failed", {
        description: errorMessage,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <Package className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Order Not Found
          </h3>
              <p className="text-gray-500 mb-4">
            The requested order could not be found or an error occurred.
          </p>
              <Button onClick={() => router.back()} variant="outline">
                Go Back
              </Button>
        </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orderStatusOptions = ["complete", "cancelled"];
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Check if order is complete (cannot change status)
  const isComplete = 
    order.order_status.toLowerCase() === "complete" || 
    order.order_status.toLowerCase() === "completed";
  
  // Calculate items_subtotal from items array
  const itemsSubtotal = order.items.reduce(
    (sum, item) => sum + Number(item.item_total || 0),
    0
  );
  
  // Calculate extras_subtotal from items extras
  const extrasSubtotal = order.items.reduce((sum, item) => {
    if (item.extras && Array.isArray(item.extras)) {
      const itemExtrasTotal = item.extras.reduce(
        (extraSum, extra) => extraSum + Number(extra.extra_price || 0),
        0
      );
      return sum + itemExtrasTotal;
    }
    return sum;
  }, 0);

  // Calculate discount amount if applied (from order data)
  // Check both discount_type/discount_value and also order.discount if it exists
  const orderDiscountType = (order as any).discount_type || (order as any).discount?.discount_type;
  const orderDiscountValue = (order as any).discount_value ?? (order as any).discount?.discount_value;
  const hasDiscount = orderDiscountType && orderDiscountValue !== undefined && orderDiscountValue !== null && orderDiscountValue !== 0;
  
  const subtotalBeforeDiscount = itemsSubtotal + extrasSubtotal;
  
  // Calculate discount amount
  const discountAmount = hasDiscount
    ? orderDiscountType === "percentage"
      ? (subtotalBeforeDiscount * Number(orderDiscountValue)) / 100
      : Number(orderDiscountValue)
    : 0;

  // Verify calculation matches total_price
  const expectedTotal = subtotalBeforeDiscount - discountAmount;
  const totalPrice = Number(order.total_price);
  
  // If there's a discount but the math doesn't match, use the difference as discount
  const finalDiscountAmount = hasDiscount 
    ? discountAmount 
    : (Math.abs(expectedTotal - totalPrice) > 0.01 && subtotalBeforeDiscount > totalPrice 
        ? subtotalBeforeDiscount - totalPrice 
        : 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <Card className="overflow-hidden">
        <CardContent className="relative pt-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  Order #{order.order_code || order.order_id}
                </h1>
                <Badge className={getStatusColor(order.order_status)}>
                  {order.order_status.charAt(0).toUpperCase() +
                    order.order_status.slice(1)}
                </Badge>
                {hasDiscount && (
                  <Badge 
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1.5"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {orderDiscountType === "percentage" 
                      ? `${orderDiscountValue}% OFF`
                      : `$${orderDiscountValue} OFF`}
                  </Badge>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {order.created_at
                      ? `Placed on ${formatDate(order.created_at)}`
                      : "N/A"}
                  </span>
                </div>
                {order.updated_at && order.updated_at !== order.created_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {formatDate(order.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {isComplete ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Order completed - Status cannot be changed</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDiscountFields(true)}
                    disabled={isUpdating}
                    className="flex-1 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      "Complete Order"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => updateOrderStatus("cancelled")}
                    disabled={isUpdating}
                    className="flex-1 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Cancelling...
                      </>
                    ) : (
                      "Cancel Order"
                    )}
                  </Button>
                </div>

                {/* Discount Fields - Only show when completing order */}
                {showDiscountFields && (
                  <Card className="border-2 border-primary/20 bg-primary/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Percent className="h-4 w-4 text-primary" />
                        Discount (Optional)
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Add discount when completing this order
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Discount Type
                          </label>
                          <Select
                            value={discountType}
                            onValueChange={(value: "percentage" | "amount" | "") =>
                              setDiscountType(value)
                            }
                            disabled={isUpdating}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="percentage">Percentage (%)</SelectItem>
                              <SelectItem value="amount">Fixed Amount ($)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Discount Value
                          </label>
                          <div className="relative">
                            {discountType === "percentage" ? (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                                %
                              </span>
                            ) : (
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                $
                              </span>
                            )}
                            <Input
                              type="number"
                              placeholder={discountType === "percentage" ? "10" : "20"}
                              value={discountValue}
                              onChange={(e) => setDiscountValue(e.target.value)}
                              disabled={isUpdating || !discountType}
                              className={
                                discountType === "percentage"
                                  ? "pr-8"
                                  : "pl-8"
                              }
                              min="0"
                              max={discountType === "percentage" ? "100" : undefined}
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => updateOrderStatus("complete")}
                          disabled={isUpdating}
                          className="flex-1"
                        >
                          Complete Order
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowDiscountFields(false);
                            setDiscountType("");
                            setDiscountValue("");
                          }}
                          disabled={isUpdating}
                        >
                          Cancel
                        </Button>
                      </div>
                      {(discountType || discountValue) && (
                        <p className="text-xs text-gray-500">
                          {discountType === "percentage" && discountValue
                            ? `${discountValue}% discount will be applied`
                            : discountType === "amount" && discountValue
                            ? `$${discountValue} discount will be applied`
                            : "Please complete discount fields"}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Amount */}
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardDescription>Total Amount</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              ${Number(order.total_price).toFixed(2)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <DollarSign className="size-4" />
                Total
              </Badge>
              {hasDiscount && (
                <Badge 
                  variant="outline" 
                  className="ml-2 bg-green-50 text-green-700 border-green-200 text-xs"
                >
                  <Tag className="size-3 mr-1" />
                  Discount
                </Badge>
              )}
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Final charge <DollarSign className="size-4" />
            </div>
            <div className="text-muted-foreground">
              {hasDiscount 
                ? `After ${orderDiscountType === "percentage" ? `${orderDiscountValue}%` : `$${orderDiscountValue}`} discount`
                : "Includes items and extras"}
            </div>
          </CardFooter>
        </Card>

        {/* Items Count */}
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardDescription>Items Count</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {totalItems}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <ShoppingCart className="size-4" />
                Items
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Total quantity <ShoppingCart className="size-4" />
            </div>
            <div className="text-muted-foreground">
              {order.items.length} products in order
            </div>
          </CardFooter>
        </Card>

        {/* Items Subtotal */}
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardDescription>Items Subtotal</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              ${itemsSubtotal.toFixed(2)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp className="size-4" />
                Subtotal
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Before extras <TrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Items total before add-ons
            </div>
          </CardFooter>
        </Card>

        {/* Extras */}
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardDescription>Extras</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              ${extrasSubtotal.toFixed(2)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Package className="size-4" />
                Add-ons
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Additional items <Package className="size-4" />
            </div>
            <div className="text-muted-foreground">Extras and add-ons total</div>
          </CardFooter>
        </Card>
      </div>

      {/* Order Items */}
      <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Order Items ({order.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <Card
                key={item.order_item_id}
                className="bg-white border-2 border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                    <Badge
                      variant="outline"
                          className="bg-gray-50 text-gray-700 text-xs"
                        >
                          {item.product_category || "Uncategorized"}
                        </Badge>
                      </div>
                      <h5 className="font-semibold text-gray-900">
                        {item.product_name}
                      </h5>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <Badge  className="text-xs">
                          Qty: {item.quantity}
                        </Badge>
                        {item.product_price && (
                          <span className="text-xs">
                            ${item.product_price} each
                          </span>
                        )}
                      </div>
                      {item.extras && item.extras.length > 0 && (
                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-2">Extras:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.extras.map((extra, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs bg-gray-50"
                              >
                                {extra.extra_name} (+${extra.extra_price})
                    </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
                        Total
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        $
                        {item.item_total ||
                          (item.product_price
                            ? (
                                Number(item.product_price) * item.quantity
                              ).toFixed(2)
                            : "0.00")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer & Payment Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order.user_name && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Name</span>
                <span className="font-semibold text-gray-900">
                  {order.user_name}
                </span>
              </div>
            )}
            {order.user_email && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </span>
                <span className="font-semibold text-gray-900 text-sm">
                  {order.user_email}
                </span>
              </div>
            )}
            {order.user_number && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </span>
                <span className="font-semibold text-gray-900">
                  {order.user_number}
                </span>
              </div>
            )}
            {order.user_id && (
              <div className="flex justify-between items-center border-t pt-4">
                <span className="text-gray-600">User ID</span>
                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {order.user_id}
                </span>
              </div>
            )}
            
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Items Subtotal</span>
              <span className="font-semibold text-gray-900">
                ${itemsSubtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-gray-600">Extras Subtotal</span>
              <span className="font-semibold text-gray-900">
                ${extrasSubtotal.toFixed(2)}
              </span>
            </div>
            
            {/* Subtotal Before Discount */}
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-gray-700 font-medium">Subtotal</span>
              <span className={`font-semibold ${(hasDiscount || finalDiscountAmount > 0) ? "text-gray-500 line-through" : "text-gray-900"}`}>
                ${subtotalBeforeDiscount.toFixed(2)}
              </span>
            </div>
            
            {/* Show Discount if Applied */}
            {(hasDiscount || finalDiscountAmount > 0) && (
              <div className="flex justify-between items-center border-t pt-4 bg-green-50/50 rounded-lg p-3 -mx-1">
                <span className="text-gray-700 flex items-center gap-2 font-medium">
                  <Percent className="h-4 w-4 text-green-600" />
                  Discount
                  {hasDiscount && orderDiscountType ? (
                    orderDiscountType === "percentage" ? (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300 font-semibold">
                        {orderDiscountValue}%
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300 font-semibold">
                        Fixed ${orderDiscountValue}
                      </Badge>
                    )
                  ) : (
                    <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300 font-semibold">
                      Applied
                    </Badge>
                  )}
                </span>
                <span className="font-bold text-green-600 text-lg">
                  -${finalDiscountAmount.toFixed(2)}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4 border-t-2 border-gray-200">
              <span className="text-lg font-bold text-gray-900">Total Paid</span>
              <div className="flex flex-col items-end gap-1">
                {(hasDiscount || finalDiscountAmount > 0) && (
                  <span className="text-sm text-gray-500 line-through">
                    ${subtotalBeforeDiscount.toFixed(2)}
                  </span>
                )}
                <span className="text-2xl font-bold text-gray-900">
                  ${Number(order.total_price).toFixed(2)}
                </span>
                {(hasDiscount || finalDiscountAmount > 0) && (
                  <span className="text-xs text-green-600 font-medium">
                    Customer saved ${finalDiscountAmount.toFixed(2)}!
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderPage;


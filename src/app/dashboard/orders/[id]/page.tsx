"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOrderDetails } from "@/hooks/useOrderQueries";
import axios from "axios";
import { Calendar, DollarSign, MoreVertical, Package } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// --- Utility Functions ---

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
  const statusLower = status.toLowerCase();
  if (statusLower === "pending") return "bg-yellow-500/10 text-yellow-500";
  if (statusLower === "processing") return "bg-blue-500/10 text-blue-500";
  if (statusLower === "completed" || statusLower === "complete")
    return "bg-green-500/10 text-green-500";
  if (statusLower === "cancelled") return "bg-red-500/10 text-red-500";
  return "bg-gray-500/10 text-gray-500";
};

// --- Component ---

const OrderPage = ({ params }: { params: { id: string } }) => {
  const orderId = params.id;
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useAdminOrderDetails(orderId);
  const [isUpdating, setIsUpdating] = useState(false);

  // --- Order Status Update Handler ---
  const updateOrderStatus = async (newStatus: string) => {
    // Prevent multiple simultaneous updates
    if (isUpdating) return;

    // Don't update if it's already the current status
    if (order?.order_status?.toLowerCase() === newStatus.toLowerCase()) {
      toast.info("Order is already in this status");
      return;
    }

    setIsUpdating(true);

    try {
      // Use the correct endpoint format: /api/orders/{id}/{status}
      const response = await axios.post(
        `https://monkey-dc6r.onrender.com/api/orders/${orderId}/${newStatus}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Refetch the order data to get updated information
      await refetch();

      // Show success message
      toast.success(`Order status updated to ${newStatus}`, {
        description: `Order #${
          order?.order_code || orderId
        } is now ${newStatus}`,
      });
    } catch (err: any) {
      console.error("Failed to update order:", err);

      // Show detailed error message
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

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  // --- Error/Not Found State ---
  if (error || !order) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <Package className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Order Not Found
          </h3>
          <p className="text-gray-500">
            The requested order could not be found or an error occurred.
          </p>
        </div>
      </div>
    );
  }

  const orderStatusOptions = ["pending", "processing", "complete", "cancelled"];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Order Header */}
      <Card className="overflow-hidden">
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 space-y-2 pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  Order #{order.order_code || order.order_id}
                </h1>
                <Badge
                  className={`${getStatusColor(
                    order.order_status
                  )} text-base font-semibold`}
                >
                  {order.order_status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Placed on {formatDate(order.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Status Update Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                  aria-label="Update Order Status"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Status"}
                  <MoreVertical className="ml-2 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {orderStatusOptions.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => updateOrderStatus(status)}
                    disabled={
                      isUpdating ||
                      order.order_status.toLowerCase() === status.toLowerCase()
                    }
                    className="capitalize"
                  >
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Metrics & Details Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Price */}
        <Card className="@container/card" data-slot="card">
          <CardHeader>
            <CardDescription>Total Order Value</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              ${Number(order.total_price).toFixed(2)}
            </CardTitle>
            <div className="flex items-center text-sm font-medium text-green-700">
              <DollarSign className="size-4 mr-1" />
              Final Charge
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              Includes taxes and delivery fees
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Items List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Order Items ({order.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {order.items.map((item) => (
              <Card
                key={item.order_item_id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardDescription className="text-xs">
                    Category: {item.product_category}
                  </CardDescription>
                  <CardTitle className="text-lg font-bold flex justify-between items-center">
                    {item.product_name}
                    <Badge
                      variant="outline"
                      className="text-base font-semibold"
                    >
                      ${item.item_total}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Quantity:</span>
                    <span className="font-semibold">{item.quantity}</span>
                  </div>
                  {item.notes && (
                    <div className="text-xs text-gray-500 italic">
                      Note: {item.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="@container/card from-primary/5 to-card bg-gradient-to-t shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Payment & Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Items Subtotal</span>
              <span className="font-medium">${order.items_subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Extras Subtotal</span>
              <span className="font-medium">
                ${Number(order.extras_subtotal).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
              <span>Total Paid</span>
              <span className="text-gray-900">
                ${Number(order.total_price).toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderPage;

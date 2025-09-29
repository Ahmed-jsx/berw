"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent, // Added CardContent for layout consistency
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
} from "@/components/ui/dropdown-menu"; // Assuming you have a DropdownMenu component
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminOrderDetails } from "@/hooks/useOrderQueries"; // Assuming this hook is correct
import {
  Calendar,
  DollarSign,
  MoreVertical,
  Package,
  Plus,
} from "lucide-react";
import { useState } from "react";

// --- Utility Functions from Reference Page ---

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
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// --- Order Status Update Handler (Placeholder) ---

// Placeholder for the actual mutation/API call
const updateOrderStatus = (orderId: number, newStatus: string) => {
  console.log(`Order ${orderId}: Updating status to ${newStatus}`);
  // In a real application, you would use a mutation hook here, like:
  // const mutation = useUpdateOrderStatusMutation();
  // mutation.mutate({ id: orderId, status: newStatus });
  alert(`Attempted to change order ${orderId} status to: ${newStatus}`);
};

// --- Component ---

const OrderPage = ({ params }: { params: { id: string } }) => {
  const orderId = parseInt(params.id, 10);
  const { data: order, isLoading, error } = useAdminOrderDetails(orderId);
  const [status, setStatus] = useState(order?.order_status || "pending");

  // --- Loading State (Matching UserDetailsPage Skeleton) ---
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

  // --- Error/Not Found State (Matching UserDetailsPage Design) ---
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

  const orderStatusOptions = [
    "pending",
    "processing",
    "completed",
    "cancelled",
  ];

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
                  {/* <span>Placed on {formatDate(order.created_at)}</span> */}
                </div>
              </div>
            </div>

            {/* Status Update Dropdown/Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                  aria-label="Update Order Status"
                >
                  Update Status <MoreVertical className="ml-2 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {orderStatusOptions.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => updateOrderStatus(order.order_id, status)}
                    disabled={order.order_status === status}
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
      <div
        className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card 
        grid grid-cols-1 gap-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs 
        sm:grid-cols-2 lg:grid-cols-3"
      >
        {/* Total Price */}
        <Card className="@container/card" data-slot="card">
          <CardHeader>
            <CardDescription>Total Order Value</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              ${Number(order.total_price).toFixed(2)}
            </CardTitle>
            {/* Using a regular div instead of CardAction */}
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

        {/* User Details */}
        {/* <Card className="@container/card" data-slot="card">
          <CardHeader>
            <CardDescription>Customer</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {order.user.user_name}
            </CardTitle>
            <div className="flex items-center text-sm font-medium text-blue-700">
              <User className="size-4 mr-1" />
              User ID: {order.user.user_id}
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              <a
                href={`/admin/users/${order.user.user_id}`}
                className="text-blue-500 hover:underline"
              >
                View User Profile
              </a>
            </div>
          </CardFooter>
        </Card> */}
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
                  {item.extras.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <h5 className="font-medium mb-1 flex items-center gap-1 text-gray-700">
                        <Plus className="h-3 w-3" /> Extras:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {item.extras.map((extra) => (
                          <Badge
                            key={extra.extra_id}
                            variant="secondary"
                            className="bg-green-50 text-green-700 text-xs"
                          >
                            {extra.extra_name} (+${extra.extra_price})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary Card */}
        <Card
          className="@container/card from-primary/5 to-card bg-gradient-to-t shadow-xs"
          data-slot="card"
        >
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

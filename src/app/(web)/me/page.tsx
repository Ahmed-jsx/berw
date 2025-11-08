"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserById } from "@/query/users";
import { useAuthStore } from "@/store/auth-store";
import {
  Award,
  Calendar,
  DollarSign,
  Mail,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function Me() {
  const { user, isAuthenticated } = useAuthStore();
  const { data, isLoading } = useUserById(user?.id as number);
  const details = data?.user;
  const recentOrders = data?.recent_orders || [];

  if (!isAuthenticated) {
    redirect("/login");
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Loading state
  if (isLoading || !details) {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero Section Skeleton */}
        <div className="bg-secondary text-white py-24  px-4">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-12 w-64 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-24 w-24 rounded-full mb-4" />
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="pt-6">
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-64 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-secondary text-white py-24  text-center px-4">
        <div className="max-w-7xl my-12 mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-3">My Profile</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-sm md:text-lg">
            Welcome back, {details.user_name}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left Sidebar - User Details */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="rounded-2xl shadow-lg border-0">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src="/avatar-placeholder.png" />
                    <AvatarFallback className="text-2xl">
                      {details.user_name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-xl font-semibold">
                    {details.user_name}
                  </h2>
                  <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {details.user_email}
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Joined {new Date(details.created_at).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="rounded-2xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-base">Account Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Total Orders
                    </span>
                  </div>
                  <span className="text-lg font-semibold">
                    {details.total_orders}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-green-500/10 p-2">
                      <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Total Spent
                    </span>
                  </div>
                  <span className="text-lg font-semibold">
                    ${details.total_spent}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-blue-500/10 p-2">
                      <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Avg Order
                    </span>
                  </div>
                  <span className="text-lg font-semibold">
                    ${details.avg_order_value.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-amber-500/10 p-2">
                      <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Reward Points
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-base">
                    {details.points}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Orders */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="rounded-2xl shadow-lg border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Orders
                      </p>
                      <p className="text-2xl font-bold">
                        {details.total_orders}
                      </p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-lg border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Spent
                      </p>
                      <p className="text-2xl font-bold">
                        ${details.total_spent}
                      </p>
                    </div>
                    <div className="rounded-full bg-green-500/10 p-3">
                      <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-lg border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Avg Order Value
                      </p>
                      <p className="text-2xl font-bold">
                        ${details.avg_order_value.toFixed(2)}
                      </p>
                    </div>
                    <div className="rounded-full bg-blue-500/10 p-3">
                      <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders Table */}
            <Card className="rounded-2xl shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                    You have no recent orders.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.order_id}>
                          <TableCell className="font-medium">
                            #{order.order_code}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {order.items.map((item, i) => (
                                <span
                                  key={i}
                                  className="text-sm text-muted-foreground"
                                >
                                  {item.quantity}× {item.product_name}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ${order.total_price}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


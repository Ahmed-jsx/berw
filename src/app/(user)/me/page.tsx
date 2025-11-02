"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Home,
  LogOut,
  Mail,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";

export default function Me() {
  const { user, clearAuth, isAuthenticated } = useAuthStore();
  const { data } = useUserById(user?.id as number);
  const router = useRouter();
  const details = data?.user;
  const recentOrders = data?.recent_orders || [];

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };
  if (!isAuthenticated) {
    redirect("/login");
  }
  if (!details) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
        Loading user details...
      </div>
    );
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

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">
              Welcome back, {details.user_name}
            </p>
          </div>
          <div className="flex justify-between items-center gap-4">
            <Link href="/">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left Sidebar - User Details */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
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
            <Card>
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
              <Card>
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

              <Card>
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

              <Card>
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
            <Card>
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

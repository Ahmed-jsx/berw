"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useUserById } from "@/query/users";
import {
  Mail,
  Phone,
  ShoppingBag,
  Calendar,
  TrendingUp,
  Star,
  Gift,
  Clock,
  User,
  Shield,
  Coffee,
  Plus,
  DollarSign,
  Activity,
  Award,
  Heart,
  Package,
} from "lucide-react";
import { useParams } from "next/navigation";

export default function UserDetailsPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data, isLoading, error } = useUserById(id);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <User className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            User Not Found
          </h3>
          <p className="text-gray-500">
            The requested user could not be found.
          </p>
        </div>
      </div>
    );
  }

  const {
    user,
    recent_orders,
    favorite_category,
    favorite_extras,
    points_balance,
    points_redeemed,
    has_points,
  } = data;

  const formatDate = (dateString: string) => {
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
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Enhanced Profile Header */}
      <Card className="overflow-hidden">
        <CardContent className="relative pt-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative">
              <div className="h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-t from-primary/5 to-primary/20 shadow-lg text-2xl font-bold text-gray-700 border-4 border-primary/10">
                {user.user_name[0].toUpperCase()}
              </div>
              {user.is_admin && (
                <div className="absolute -top-1 -right-1 h-6 w-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Shield className="h-3 w-3 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.user_name}
                </h1>
                <div className="flex gap-2">
                  {user.is_new && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/20 text-black"
                    >
                      New User
                    </Badge>
                  )}
                  {user.is_admin && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      Admin
                    </Badge>
                  )}
                  {user.is_frequent_visitor && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-800"
                    >
                      Frequent Visitor
                    </Badge>
                  )}
                  {has_points && points_balance > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Points Member
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{user.user_email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{user.user_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {formatDate(user.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Total Orders */}
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {user.total_orders}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <ShoppingBag className="size-4" />
                Orders
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Customer activity level <ShoppingBag className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Total orders placed to date
            </div>
          </CardFooter>
        </Card>

        {/* Total Spent */}
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardDescription>Total Spent</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              ${user.total_spent}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <DollarSign className="size-4" />
                Revenue
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Customer lifetime value <DollarSign className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Total revenue from customer
            </div>
          </CardFooter>
        </Card>

        {/* Avg Order Value */}
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardDescription>Avg Order Value</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              ${user.avg_order_value.toFixed(2)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <TrendingUp className="size-4" />
                AOV
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Purchase behavior metric <TrendingUp className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Average value per transaction
            </div>
          </CardFooter>
        </Card>

        {/* Points Balance */}
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardDescription>Points Balance</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {points_balance}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Star className="size-4" />
                {has_points ? "Active" : "Inactive"}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Loyalty program status <Star className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Available rewards points
            </div>
          </CardFooter>
        </Card>

        {/* Points Redeemed */}
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardDescription>Points Redeemed</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {points_redeemed}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Gift className="size-4" />
                Redeemed
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Rewards utilization <Gift className="size-4" />
            </div>
            <div className="text-muted-foreground">Points used for rewards</div>
          </CardFooter>
        </Card>

        {/* Weekly Visits */}
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardDescription>Weekly Visits</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {user.visits_per_week}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Activity className="size-4" />
                {user.visits_per_week > 2
                  ? "High"
                  : user.visits_per_week > 0
                  ? "Moderate"
                  : "Low"}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Engagement frequency <Activity className="size-4" />
            </div>
            <div className="text-muted-foreground">Average visits per week</div>
          </CardFooter>
        </Card>

        {/* Last Purchase */}
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardDescription>Last Purchase</CardDescription>
            <CardTitle className="text-lg font-semibold tabular-nums">
              {user.last_purchase_date
                ? formatDate(user.last_purchase_date).split(",")[0]
                : "Never"}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Clock className="size-4" />
                Recent
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Purchase recency <Clock className="size-4" />
            </div>
            <div className="text-muted-foreground">Most recent transaction</div>
          </CardFooter>
        </Card>

        {/* Favorite Category */}
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardDescription>Favorite Category</CardDescription>
            <CardTitle className="text-lg font-semibold tabular-nums">
              {favorite_category || "None"}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Coffee className="size-4" />
                Preference
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Purchase preference <Heart className="size-4" />
            </div>
            <div className="text-muted-foreground">Most ordered category</div>
          </CardFooter>
        </Card>
      </div>

      {/* Account Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">User ID</span>
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {user.id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Account Created</span>
              <span className="text-sm">{formatDate(user.created_at)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Updated</span>
              <span className="text-sm">{formatDate(user.updated_at)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Visit</span>
              <span className="text-sm">
                {user.last_visit ? formatDate(user.last_visit) : "Not recorded"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Google Account</span>
              <Badge variant={user.google_id ? "default" : "secondary"}>
                {user.google_id ? "Connected" : "Not connected"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Account Status</span>
              <Badge
                variant={user.is_frequent_visitor ? "default" : "secondary"}
              >
                {user.is_frequent_visitor ? "Frequent Visitor" : "Regular User"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Preferences & Favorites
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-gray-600 block mb-2">
                Favorite Category
              </span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <Coffee className="h-3 w-3 mr-1" />
                {favorite_category || "None yet"}
              </Badge>
            </div>
            <div>
              <span className="text-gray-600 block mb-2">Favorite Extras</span>
              <div className="flex flex-wrap gap-2">
                {favorite_extras && favorite_extras.length > 0 ? (
                  favorite_extras.map((extra, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {extra}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">
                    No favorites yet
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="text-gray-600 block mb-2">Loyalty Status</span>
              <div className="flex gap-2">
                <Badge
                  variant={has_points ? "default" : "secondary"}
                  className={has_points ? "bg-green-600" : ""}
                >
                  {has_points ? "Enrolled" : "Not Enrolled"}
                </Badge>
                {user.is_new && (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    New Member
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Orders */}
      <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Recent Orders ({recent_orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recent_orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
                <ShoppingBag className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No orders yet
              </h3>
              <p className="text-sm text-gray-500">
                Orders will appear here once placed
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recent_orders.map((order) => (
                <Card
                  key={order.order_id}
                  className="bg-white border-2 border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 font-mono"
                          >
                            <Package className="h-3 w-3 mr-1" />#
                            {order.order_code}
                          </Badge>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">
                            Total
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${order.total_price}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Coffee className="h-4 w-4 text-gray-500" />
                        <h5 className="text-sm font-semibold text-gray-700">
                          Items ({order.items.length})
                        </h5>
                      </div>
                      <div className="space-y-1.5">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center text-sm bg-gradient-to-r from-gray-50 to-transparent p-3 rounded-lg hover:from-gray-100 transition-colors"
                          >
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">
                                {item.product_name}
                              </span>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  Qty: {item.quantity}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  ${item.unit_price} each
                                </span>
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <span className="font-semibold text-gray-900">
                                ${item.total_price}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

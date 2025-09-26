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
  TrendingDown,
  Star,
  Gift,
  Clock,
  User,
  Shield,
  MapPin,
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

  // data is already user_details from the API
  const { user, recent_orders, favorite_category, favorite_extras } = data;

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
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 ">
            <div
              className="relative *:data-[slot=avatar]:from-primary/5 *:data-[slot=avatar]:to-avatar dark:*:data-[slot=avatar]:bg-avatar 
  grid grid-cols-1 gap-4 *:data-[slot=avatar]:bg-gradient-to-t *:data-[slot=avatar]"
            >
              <div
                data-slot="avatar"
                className="h-20 w-20 flex items-center  justify-center rounded-full from-primary/5 to-avatar bg-gradient-to-t shadow-xs  text-2xl font-bold text-gray-700 border-4 border-primary/10"
              >
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
                  {user.has_points && user.points > 0 && (
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

      <div
        className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card 
  grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs 
  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {/* Total Orders */}
        <Card
          className="@container/card from-primary/5 to-card bg-gradient-to-t shadow-xs"
          data-slot="card"
        >
          <CardHeader>
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
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
        <Card className="@container/card" data-slot="card">
          <CardHeader>
            <CardDescription>Total Spent</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
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
        <Card className="@container/card" data-slot="card">
          <CardHeader>
            <CardDescription>Avg Order Value</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
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
        <Card className="@container/card" data-slot="card">
          <CardHeader>
            <CardDescription>Points Balance</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data.points_balance}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <Star className="size-4" />
                {data.has_points ? "Active" : "Inactive"}
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
        <Card className="@container/card" data-slot="card">
          <CardHeader>
            <CardDescription>Points Redeemed</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data.points_redeemed}
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
        <Card className="@container/card" data-slot="card">
          <CardHeader>
            <CardDescription>Weekly Visits</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
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
        <Card className="@container/card" data-slot="card">
          <CardHeader>
            <CardDescription>Last Purchase</CardDescription>
            <CardTitle className="text-lg font-semibold tabular-nums @[250px]/card:text-xl">
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
        <Card className="@container/card" data-slot="card">
          <CardHeader>
            <CardDescription>Favorite Category</CardDescription>
            <CardTitle className="text-lg font-semibold tabular-nums @[250px]/card:text-xl">
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
      <div className="grid *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          className="@container/card from-primary/5 to-card bg-gradient-to-t shadow-xs"
          data-slot="card"
        >
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
              <span>{formatDate(user.created_at)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Updated</span>
              <span>{formatDate(user.updated_at)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Visit</span>
              <span>
                {user.last_visit ? formatDate(user.last_visit) : "Not recorded"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Google Account</span>
              <span>{user.google_id ? "Connected" : "Not connected"}</span>
            </div>
          </CardContent>
        </Card>

        <Card
          data-slot="card"
          className="@container/card from-primary/5 to-card bg-gradient-to-t shadow-xs"
        >
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
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Recent Orders ({recent_orders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recent_orders.length === 0 ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recent_orders.map((order) => (
                <div
                  key={order.order_id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">
                          Order #{order.order_code}
                        </h4>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        ${order.total_price}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700">
                      Items:
                    </h5>
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded"
                      >
                        <div>
                          <span className="font-medium">
                            {item.product_name}
                          </span>
                          <span className="text-gray-500 ml-2">
                            × {item.quantity}
                          </span>
                        </div>
                        <span className="font-medium">${item.total_price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

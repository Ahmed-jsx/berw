"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle,
  Coffee,
  Clock,
  MapPin,
  Phone,
  ArrowLeft,
  Home,
  Receipt,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";

interface OrderData {
  orderId: number;
  orderCode: string;
  totalPrice: number;
  timestamp: number;
}

export default function ThankYouPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Get order data from sessionStorage
    const orderSuccess = sessionStorage.getItem("orderSuccess");

    if (!orderSuccess) {
      // No order data found, redirect to menu
      router.push("/menu");
      return;
    }

    try {
      const data = JSON.parse(orderSuccess);

      // Check if the order data is recent (within 10 minutes)
      const now = Date.now();
      const orderTime = data.timestamp;
      const timeDiff = now - orderTime;
      const tenMinutes = 10 * 60 * 1000;

      if (timeDiff > tenMinutes) {
        // Order data is too old, remove it and redirect
        sessionStorage.removeItem("orderSuccess");
        router.push("/menu");
        return;
      }

      setOrderData(data);
    } catch (error) {
      // Invalid data, redirect to menu
      sessionStorage.removeItem("orderSuccess");
      router.push("/menu");
      return;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  // Clean up sessionStorage when component unmounts
  useEffect(() => {
    // Clean up after 30 seconds to prevent accidental revisits
    const timer = setTimeout(() => {
      sessionStorage.removeItem("orderSuccess");
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!orderData) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-secondary p-4 pt-32">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="bg-green-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Thank You!</h1>
          <p className="text-white/70 text-lg">
            Your order has been placed successfully
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="bg-white/10 border-0 rounded-3xl p-6 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">
              Order Confirmed
            </h2>
            <div className="bg-primary/20 rounded-full px-4 py-2 inline-block">
              <span className="text-primary font-mono text-lg font-bold">
                #{orderData.orderCode}
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <span className="text-white/70">Order ID</span>
              <span className="text-white font-medium">
                #{orderData.orderId}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <span className="text-white/70">Total Amount</span>
              <span className="text-white font-bold text-xl">
                {orderData.totalPrice.toFixed(2)} EGP
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <span className="text-white/70">Order Time</span>
              <span className="text-white font-medium">
                {new Date(orderData.timestamp).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white/5 rounded-2xl p-4 mb-6">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Order Status
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-white">Order Received</span>
                <span className="text-white/50 text-sm ml-auto">Just now</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-white">Preparing Your Order</span>
                <span className="text-white/50 text-sm ml-auto">
                  In progress
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-white/50">Ready for Pickup</span>
                <span className="text-white/30 text-sm ml-auto">
                  Estimated 15-20 min
                </span>
              </div>
            </div>
          </div>

          {/* Pickup Information */}
          <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
            <h3 className="text-primary font-medium mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Pickup Information
            </h3>

            <div className="space-y-2 text-sm">
              <p className="text-white/80">
                <strong>Location:</strong> Coffee Shop Main Branch
              </p>
              <p className="text-white/80">
                <strong>Address:</strong> 123 Coffee Street, Downtown
              </p>
              <p className="text-white/80 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <strong>Phone:</strong> +20 123 456 7890
              </p>
              <p className="text-white/80">
                <strong>Estimated pickup time:</strong> 15-20 minutes
              </p>
            </div>
          </div>
        </Card>

        {/* What's Next */}
        <Card className="bg-white/10 border-0 rounded-3xl p-6 mb-8">
          <h3 className="text-white font-medium mb-4 flex items-center gap-2">
            <Coffee className="h-5 w-5 text-primary" />
            What's Next?
          </h3>

          <div className="space-y-3 text-white/80 text-sm">
            <p>• We'll start preparing your order right away</p>
            <p>• You'll receive updates on your order status</p>
            <p>
              • Please arrive at the pickup location within the estimated time
            </p>
            <p>
              • Show your order code <strong>#{orderData.orderCode}</strong>{" "}
              when collecting
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/menu" className="flex-1">
            <Button className="w-full bg-white/10 text-white hover:bg-white/20 rounded-full py-3 border border-white/20">
              <Coffee className="h-4 w-4 mr-2" />
              Order More
            </Button>
          </Link>

          <Link href="/orders" className="flex-1">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-full py-3">
              <Receipt className="h-4 w-4 mr-2" />
              View My Orders
            </Button>
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-white/60 hover:text-white/80 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

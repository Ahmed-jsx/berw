"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import Image from "next/image";

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
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const orderSuccess = sessionStorage.getItem("orderSuccess");

    if (!orderSuccess) {
      router.push("/menu");
      return;
    }

    try {
      const data = JSON.parse(orderSuccess);
      const now = Date.now();
      const orderTime = data.timestamp;
      const timeDiff = now - orderTime;
      const tenMinutes = 10 * 60 * 1000;

      if (timeDiff > tenMinutes) {
        sessionStorage.removeItem("orderSuccess");
        router.push("/menu");
        return;
      }

      setOrderData(data);
    } catch (error) {
      sessionStorage.removeItem("orderSuccess");
      router.push("/menu");
      return;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.removeItem("orderSuccess");
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen max-w-[calc(100vw-6rem)] my-4 mx-auto rounded-[40px] bg-primary p-6 pt-40">
      <div className="max-w-6xl mx-auto">
        {/* Top Actions */}
        <div className="flex items-center justify-end md:mb-12">
          <Link href="/menu">
            <Button className="bg-secondary text-white hover:bg-secondary/90 rounded-full px-6 py-2">
              Order Again
            </Button>
          </Link>
        </div>
        <div className="relative flex items-center justify-center mb-8">
          <div className="relative z-10">
            <div className=" rounded-3xl p-4 md:p-6">
              <Image
                src="/bro.svg"
                alt="Order Success"
                width={200}
                height={200}
                className="w-32 h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain"
              />
            
            </div>
          </div>

          {/* Right Clouds */}
          <div className="absolute right-0 md:right-8 top-1/4 -translate-y-1/2">
            <Image
              src="/cloud.svg"
              alt="cloud"
              width={400}
              height={400}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            Enjoy Your Time!
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium mb-4">
            Your order has been placed.
          </p>
          
        </div>

        {/* Order Number Card */}
        <div className="text-center mb-6">
          <p className="text-secondary text-xl md:text-2xl mb-3">
            Your Order Number
          </p>
          <div className="bg-white rounded-full px-8 py-4 inline-block shadow-sm">
            <span className="text-primary font-bold text-2xl md:text-3xl tracking-wider">
              {orderData.orderCode}
            </span>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-white text-sm md:text-base max-w-md mx-auto">
          Thank you for choosing us!
        </p>
      </div>
    </div>
  );
}
"use client";

import CreateOrderForm from "@/components/orders/CreateOrderForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Plus, ShoppingCart } from "lucide-react";

export default function CreateOrderPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <Card className="overflow-hidden">
        <CardContent className="relative pt-6 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="h-5 w-5 text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Create New Order
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <ShoppingCart className="h-4 w-4" />
                <span>Manually create an order for a customer</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Form Section */}
      <Card className="bg-gradient-to-t from-primary/5 to-card shadow-xs">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CreateOrderForm />
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import CreateOrderForm from "@/components/orders/CreateOrderForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Plus, ShoppingCart } from "lucide-react";

export default function CashierCreateOrderPage() {
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
              <p className="text-gray-600">
                Add a new order to the system. Fill in the details below.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create Order Form */}
      <CreateOrderForm />
    </div>
  );
}


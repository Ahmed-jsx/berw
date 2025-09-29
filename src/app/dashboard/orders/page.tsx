"use client";

import React, { useState, useMemo } from "react";
import { DataTable } from "./data-table";
import { orderColumns } from "./columns";
import { useOrderManagement } from "@/hooks/useOrderQueries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const { orders, isLoading, error, refetch } = useOrderManagement();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    return orders.filter(
      (order) =>
        order.order_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex space-x-2">
          <Input
            placeholder="Search by code or user"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={refetch}>Refresh</Button>
        </div>
      </div>

      {error && (
        <div className="text-red-500">
          Error loading orders: {error.message}
        </div>
      )}

      <DataTable
        columns={orderColumns}
        data={filteredOrders}
        isLoading={isLoading}
      />
    </div>
  );
}

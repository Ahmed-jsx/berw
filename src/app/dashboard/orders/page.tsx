"use client";

import { Button } from "@/components/ui/button";
import { useOrderManagement } from "@/hooks/useOrderQueries";
import { useOrderStore } from "@/store/orderStore";
import { useEffect, useMemo, useState } from "react";
import { orderColumns } from "./columns";
import { DataTable } from "./data-table";
import { toast } from "sonner";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function OrdersPage() {
  const { setOrderFilters } = useOrderStore();
  const { orders, isLoading, error, refetch } = useOrderManagement();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 🧠 Debounce effect — only update search after 300ms of inactivity
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Update store filters only when debounced search changes
  useEffect(() => {
    setOrderFilters({ searchTerm: debouncedSearch });
  }, [debouncedSearch, setOrderFilters]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (!debouncedSearch.trim()) return orders;

    const searchLower = debouncedSearch.toLowerCase();

    return orders.filter((order) => {
      const orderCode = order.order_code?.toLowerCase() || "";
      const userName = order.user_name?.toLowerCase() || "";
      const userEmail = order.user_email?.toLowerCase() || "";
      const userPhone = order.user_number?.toLowerCase() || "";

      return (
        orderCode.includes(searchLower) ||
        userName.includes(searchLower) ||
        userEmail.includes(searchLower) ||
        userPhone.includes(searchLower)
      );
    });
  }, [orders, debouncedSearch]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex space-x-2">
          <Link href="/dashboard/orders/create">
            <Button className="py-2">
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Button>
          </Link>
          <Button disabled={isLoading} className="ml-2 py-2" onClick={
            () => {
              refetch();
              toast.success("Orders refreshed successfully");
            }
          }>
            Refresh
          </Button>
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
        enableStatusFilter={true}
        statusKey="order_status"
        pageSize={10}
      />
    </div>
  );
}

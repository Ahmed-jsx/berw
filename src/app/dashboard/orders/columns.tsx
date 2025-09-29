"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "order_code",
    header: "Order Code",
  },
  {
    accessorFn: (row: Order) => row.user_name || row.user_email || "Guest",
    id: "user",
    header: "User",
  },
  {
    accessorKey: "order_status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue<Order["order_status"]>();
      const color =
        status === "pending"
          ? "orange"
          : status === "processing"
          ? "blue"
          : status === "completed"
          ? "green"
          : "red";
      return (
        <Badge
          variant="outline"
          className={`bg-${color}-100 text-${color}-800`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorFn: (row: Order) => {
      const price =
        typeof row.total_price === "string"
          ? parseFloat(row.total_price)
          : row.total_price;
      return `$${price.toFixed(2)}`;
    },
    id: "total_price",
    header: "Total Price",
  },
  {
    accessorFn: (row: Order) =>
      row.created_at ? new Date(row.created_at).toLocaleString() : "-",
    id: "created_at",
    header: "Created At",
  },
  {
    id: "actions",
    header: "Actions",
    cell: (info) => {
      const order = info.row.original;
      return (
        <Link href={`orders/${order.order_id}`} passHref>
          <Button size="sm">View</Button>
        </Link>
      );
    },
  },
];

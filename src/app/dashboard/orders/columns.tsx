"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  RowData,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Data Table Component
interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  pageSize?: number;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  isLoading,
  pageSize = 10,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true }, // Sort by latest first
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter data based on status tab
  const filteredData = useMemo(() => {
    if (statusFilter === "all") return data;
    return data.filter(
      (item: any) =>
        item.order_status?.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [data, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const statusTabs = [
    { label: "All Orders", value: "all", count: data.length },
    {
      label: "Pending",
      value: "pending",
      count: data.filter(
        (d: any) => d.order_status?.toLowerCase() === "pending"
      ).length,
    },
    {
      label: "Processing",
      value: "processing",
      count: data.filter(
        (d: any) => d.order_status?.toLowerCase() === "processing"
      ).length,
    },
    {
      label: "Completed",
      value: "complete",
      count: data.filter(
        (d: any) =>
          d.order_status?.toLowerCase() === "complete" ||
          d.order_status?.toLowerCase() === "completed"
      ).length,
    },
    {
      label: "Cancelled",
      value: "cancelled",
      count: data.filter(
        (d: any) => d.order_status?.toLowerCase() === "cancelled"
      ).length,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Status Filter Tabs */}
      <div className="flex space-x-2 border-b pb-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
              statusFilter === tab.value
                ? "bg-blue-100 text-blue-700 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-md">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2 text-gray-600">Loading orders...</p>
          </div>
        ) : (
          <>
            <table className="w-full min-w-max">
              <thead className="bg-gray-50 border-b">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-sm font-semibold text-gray-700"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? "cursor-pointer select-none flex items-center gap-2 hover:text-gray-900"
                                : ""
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getCanSort() && (
                              <ArrowUpDown className="h-4 w-4" />
                            )}
                            {header.column.getIsSorted() === "asc" && " 🔼"}
                            {header.column.getIsSorted() === "desc" && " 🔽"}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-3 text-sm text-gray-700"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {table.getRowModel().rows.length > 0 && (
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <span>
                    Showing{" "}
                    {table.getState().pagination.pageIndex * pageSize + 1} to{" "}
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * pageSize,
                      filteredData.length
                    )}{" "}
                    of {filteredData.length} orders
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <span className="text-sm text-gray-700 px-2">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Column Definitions
export const orderColumns: ColumnDef<any>[] = [
  {
    accessorKey: "order_code",
    header: "Order Code",
    enableSorting: true,
    cell: (info) => (
      <span className="font-medium text-gray-900">
        {info.getValue() as string}
      </span>
    ),
  },
  {
    accessorFn: (row) => row.user_name || row.user_email || "Guest",
    id: "user",
    header: "Customer",
    enableSorting: true,
    cell: (info) => (
      <div className="flex flex-col">
        <span className="font-medium text-gray-900">
          {info.row.original.user_name || "Guest"}
        </span>
        {info.row.original.user_email && (
          <span className="text-xs text-gray-500">
            {info.row.original.user_email}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "order_status",
    header: "Status",
    enableSorting: true,
    cell: (info) => {
      const status = (info.getValue() as string)?.toLowerCase();

      const getStatusStyle = () => {
        switch (status) {
          case "pending":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
          case "processing":
            return "bg-blue-100 text-blue-800 border-blue-200";
          case "complete":
          case "completed":
            return "bg-green-100 text-green-800 border-green-200";
          case "cancelled":
            return "bg-red-100 text-red-800 border-red-200";
          default:
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
      };

      return (
        <Badge variant="outline" className={`${getStatusStyle()} font-medium`}>
          {status?.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "total_price",
    header: "Total",
    enableSorting: true,
    cell: (info) => {
      const order = info.row.original;
      const price =
        typeof info.getValue() === "string"
          ? parseFloat(info.getValue() as string)
          : (info.getValue() as number);
      
      // Show discount badge if discount is applied
      const hasDiscount = (order as any).discount_type && (order as any).discount_value;
      
      return (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-gray-900">${price.toFixed(2)}</span>
          {hasDiscount && (
            <Badge 
              variant="outline" 
              className="text-xs w-fit bg-green-50 text-green-700 border-green-200"
            >
              {(order as any).discount_type === "percentage" 
                ? `${(order as any).discount_value}% off`
                : `$${(order as any).discount_value} off`}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Order Date",
    enableSorting: true,
    cell: (info) => {
      const date = info.getValue() as string;
      if (!date) return "-";

      const orderDate = new Date(date);
      return (
        <div className="flex flex-col">
          <span className="text-gray-900">
            {orderDate.toLocaleDateString()}
          </span>
          <span className="text-xs text-gray-500">
            {orderDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: (info) => {
      const order = info.row.original;
      return (
        <Link href={`/dashboard/orders/${order.order_id}`}>
          <Button size="sm" variant="outline" className="hover:bg-blue-50">
            View Details
          </Button>
        </Link>
      );
    },
  },
];

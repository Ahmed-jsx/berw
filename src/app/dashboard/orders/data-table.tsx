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

// Enhanced Data Table Component
interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  pageSize?: number;
  enableStatusFilter?: boolean;
  statusKey?: string;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  isLoading,
  pageSize = 10,
  enableStatusFilter = false,
  statusKey = "order_status",
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created_at", desc: true }, // Sort by latest first
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter data based on status tab
  const filteredData = useMemo(() => {
    if (!enableStatusFilter || statusFilter === "all") return data;
    return data.filter(
      (item: any) =>
        item[statusKey]?.toLowerCase() === statusFilter.toLowerCase()
    );
  }, [data, statusFilter, enableStatusFilter, statusKey]);

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

  // Calculate status counts for tabs
  const statusTabs = useMemo(() => {
    if (!enableStatusFilter) return [];

    return [
      { label: "All Orders", value: "all", count: data.length },
      {
        label: "Pending",
        value: "pending",
        count: data.filter(
          (d: any) => d[statusKey]?.toLowerCase() === "pending"
        ).length,
      },
      {
        label: "Processing",
        value: "processing",
        count: data.filter(
          (d: any) => d[statusKey]?.toLowerCase() === "processing"
        ).length,
      },
      {
        label: "Completed",
        value: "completed",
        count: data.filter((d: any) => {
          const status = d[statusKey]?.toLowerCase();
          return status === "completed" || status === "completed";
        }).length,
      },
      {
        label: "Cancelled",
        value: "cancelled",
        count: data.filter(
          (d: any) => d[statusKey]?.toLowerCase() === "cancelled"
        ).length,
      },
    ];
  }, [data, enableStatusFilter, statusKey]);

  return (
    <div className="space-y-4">
      {/* Status Filter Tabs - Only show if enabled */}
      {enableStatusFilter && statusTabs.length > 0 && (
        <div className="flex space-x-2 border-b pb-2 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap ${
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
      )}

      {/* Table */}
      <div className="overflow-x-auto border rounded-md">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
            <p className="mt-2 text-gray-600">Loading data...</p>
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
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination - Only show if there are rows */}
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
                    of {filteredData.length} results
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

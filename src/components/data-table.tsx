"use client";

import * as React from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle,
  MoreVertical,
  Mail,
  Phone,
  ShoppingBag,
  Star,
  Eye,
  Edit,
  Trash2,
  Search,
  X,
  Filter,
} from "lucide-react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useUsers } from "@/hooks/useUsers";

// ---------------- SCHEMA ----------------
export const schema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  orderCount: z.number().default(0),
  is_frequent_visitor: z.boolean(),
  joinDate: z.string(),
});

// ---------------- SKELETON ----------------
function TableSkeleton() {
  return (
    <div className="w-full space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="animate-pulse">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: 8 }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b">
                <td className="px-4 py-4">
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-28"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------- ACTION DROPDOWN ----------------
function ActionDropdown({ userId }: { userId: number }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleViewDetails = () => {
    router.push(`/dashboard/users/${userId}`);
    setIsOpen(false);
  };

  const handleEdit = () => {
    console.log("Edit user", userId);
    setIsOpen(false);
  };

  const handleDelete = () => {
    console.log("Delete user", userId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="More actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <button
              onClick={handleViewDetails}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-4 w-4" /> View Details
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit className="h-4 w-4" /> Edit User
            </button>
            <hr className="my-1 border-gray-100" />
            <button
              onClick={handleDelete}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Delete User
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------- FREQUENT VISITOR FILTER ----------------
function FrequentVisitorFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const options = ["All", "Frequent", "Not Frequent"];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
      >
        <Filter className="h-4 w-4" />
        <span>Frequent Visitor: {value || "All"}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option === "All" ? "" : option);
                  setIsOpen(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ---------------- MAIN COMPONENT ----------------
export function DataTable() {
  const { data, isLoading } = useUsers();
  const router = useRouter();

  const users = React.useMemo(() => {
    if (!data?.users) return [];
    return data.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.number,
      orderCount: u.total_orders,

      is_frequent_visitor: u.is_frequent_visitor,
      joinDate: u.created_at,
    }));
  }, [data?.users]);

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [visitorFilter, setVisitorFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "orderCount", desc: true }, // ✅ Default: highest orders first
  ]);

  const table = useReactTable({
    data: users,
    columns: [
      {
        accessorKey: "name",
        header: "User",
        cell: ({ row }) => {
          const user = row.original;
          const initials = user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
          return (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-600">
                {initials}
              </div>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">ID: {user.id}</div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Contact",
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" /> {row.original.email}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" /> {row.original.phone}
            </div>
          </div>
        ),
      },
      {
        accessorKey: "orderCount",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-2"
          >
            Orders
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                column.getIsSorted() === "asc" ? "rotate-180" : ""
              }`}
            />
          </button>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-blue-500" />
            <span className="text-sm">{row.original.orderCount}</span>
          </div>
        ),
      },

      {
        accessorKey: "is_frequent_visitor",
        header: "Frequent Visitor",
        cell: ({ row }) => {
          const isFrequent = row.original.is_frequent_visitor;
          return (
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                isFrequent
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {isFrequent ? (
                <>
                  <CheckCircle className="h-3 w-3" /> Frequent
                </>
              ) : (
                "Not Frequent"
              )}
            </span>
          );
        },
      },
      {
        accessorKey: "joinDate",
        header: "Join Date",
        cell: ({ row }) => new Date(row.original.joinDate).toLocaleDateString(),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ActionDropdown userId={row.original.id} />,
      },
    ],
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Filter logic
  React.useEffect(() => {
    if (visitorFilter) {
      table
        .getColumn("is_frequent_visitor")
        ?.setFilterValue(visitorFilter === "Frequent");
    } else {
      table.getColumn("is_frequent_visitor")?.setFilterValue(undefined);
    }
  }, [visitorFilter, table]);

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="w-full space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex-1 w-full sm:max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            {globalFilter && (
              <button
                onClick={() => setGlobalFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <FrequentVisitorFilter
            value={visitorFilter}
            onChange={setVisitorFilter}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-900 cursor-pointer select-none"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-4">
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
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center text-gray-500"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Rows per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-700">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

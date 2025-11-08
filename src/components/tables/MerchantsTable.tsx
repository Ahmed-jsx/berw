"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useMerchantMutations } from "@/hooks/useMerchantMutations";
import { useMerchants } from "@/hooks/useMerch";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  DollarSign,
  Edit,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Merchant } from "@/lib/api";
import { Button } from "../ui/button";

// --- Skeleton Loader ---
function TableSkeleton() {
  return (
    <div className="w-full space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="h-10 bg-gray-200 rounded w-1/3 mb-4 animate-pulse"></div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b py-4 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            <div className="h-4 bg-gray-200 rounded w-1/12"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Actions Dropdown ---
const ActionDropdown = React.memo(({ id }: { id: number }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const { remove } = useMerchantMutations();

  const handleDelete = async () => {
    try {
      await remove.mutateAsync(id);
      setConfirmOpen(false);
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <button
              onClick={() => router.push(`/dashboard/merch/${id}`)}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" /> Edit
            </button>
            <hr className="my-1 border-gray-100" />
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogTrigger asChild>
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Merchant</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this merchant? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      )}
    </div>
  );
});

ActionDropdown.displayName = "ActionDropdown";

// --- Columns ---
const columns: ColumnDef<Merchant>[] = [
  {
    accessorKey: "merchant_name",
    header: "Merchant",
    cell: ({ row }) => {
      const { merchant_photo, merchant_name, merchant_category } = row.original;
      return (
        <div className="flex items-center gap-3">
          {merchant_photo ? (
            <Image
              src={merchant_photo}
              alt={merchant_name}
              width={40}
              height={40}
              className="rounded-md h-10 w-10 object-cover border"
            />
          ) : (
            <div className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
              N/A
            </div>
          )}
          <div>
            <div className="font-medium">{merchant_name}</div>
            <div className="text-xs text-gray-500">
              {merchant_category || "Uncategorized"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "merchant_price",
    header: "Price",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-gray-700">
        <DollarSign className="h-4 w-4 text-gray-400" />
        <span>LE {parseFloat(row.original.merchant_price).toFixed(2)}</span>
      </div>
    ),
  },
  {
    accessorKey: "merchant_category",
    header: "Category",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-gray-700">
        <span>{row.original.merchant_category || "—"}</span>
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600">
        {new Date(row.original.created_at).toLocaleDateString()}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionDropdown id={row.original.merchant_id} />,
  },
];

// --- Main Component ---
export function MerchantsTable() {
  const { data, isLoading } = useMerchants();
  const merchants = data ?? [];
  const router = useRouter();

  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "created_at", desc: true }, // Sort by newest first
  ]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Filter merchants based on search
  const filteredData = React.useMemo(() => {
    if (!globalFilter) return merchants;
    return merchants.filter((m) =>
      m.merchant_name.toLowerCase().includes(globalFilter.toLowerCase())
    );
  }, [merchants, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="w-full space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Search & Actions */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search merchants..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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

        {/* Create Merchant Button */}
        <Button
          onClick={() => router.push("/dashboard/merch/create")}
          className="w-full sm:w-auto flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white"
        >
          <Plus className="h-4 w-4" />
          Create Merchant
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-medium text-gray-600"
                    >
                      {flexRender(
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
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-4 align-middle">
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
                    className="text-center py-8 text-gray-500"
                  >
                    No merchants found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-700">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


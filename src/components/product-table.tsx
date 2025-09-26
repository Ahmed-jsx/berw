"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle,
  MoreVertical,
  GripVertical,
  Columns,
  Loader,
  Plus,
  Package,
  DollarSign,
  TrendingUp,
  Star,
  Eye,
  Edit,
  Trash2,
  ShoppingCart,
} from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";

// Updated schema for products
export const productSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  category: z.string().optional(),

  image: z.string().optional(),

  createdAt: z.string(),
});

type Product = z.infer<typeof productSchema>;

// Create a separate component for the drag handle
function DragHandle({ id }: { id: string | number }) {
  const { attributes, listeners } = useSortable({
    id: id.toString(),
  });

  return (
    <button
      {...attributes}
      {...listeners}
      className="p-2 text-gray-500 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
    >
      <GripVertical className="h-4 w-4" />
      <span className="sr-only">Drag to reorder</span>
    </button>
  );
}

const columns: ColumnDef<Product>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(!!e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100 border">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <Package className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{product.name}</span>
            <span className="text-sm text-gray-500">ID: {product.id}</span>
            {product.description && (
              <span className="text-xs text-gray-400 max-w-xs truncate">
                {product.description}
              </span>
            )}
          </div>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;
      if (!category) return <span className="text-gray-400">-</span>;

      return (
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">
          {category}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-center">Price</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <DollarSign className="h-4 w-4 text-green-600" />
        <span className="font-semibold text-green-600">
          {row.original.price.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-center">Stock</div>,
    cell: ({ row }) => {
      const stock = row.original.stock;
      if (stock === undefined) return <span className="text-gray-400">-</span>;

      const getStockClass = () => {
        if (stock === 0) return "bg-red-100 text-red-800";
        if (stock < 10) return "bg-yellow-100 text-yellow-800";
        return "bg-green-100 text-green-800";
      };

      return (
        <div className="flex items-center justify-center">
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStockClass()}`}
          >
            {stock === 0 ? "Out of Stock" : `${stock} units`}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: () => <div className="text-center">Rating</div>,
    cell: ({ row }) => {
      const rating = row.original.rating;
      if (rating === undefined) return <span className="text-gray-400">-</span>;

      return (
        <div className="flex items-center justify-center gap-1">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "sales",
    header: () => <div className="text-center">Sales</div>,
    cell: ({ row }) => {
      const sales = row.original.sales;
      if (sales === undefined) return <span className="text-gray-400">-</span>;

      return (
        <div className="flex items-center justify-center gap-1">
          <TrendingUp className="h-4 w-4 text-purple-500" />
          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800">
            {sales}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusClass = () => {
        switch (status.toLowerCase()) {
          case "active":
          case "published":
            return "bg-green-100 text-green-800";
          case "inactive":
          case "draft":
            return "bg-yellow-100 text-yellow-800";
          case "discontinued":
            return "bg-red-100 text-red-800";
          default:
            return "border border-gray-300 bg-transparent text-gray-700";
        }
      };

      const getStatusIcon = () => {
        switch (status.toLowerCase()) {
          case "active":
          case "published":
            return <CheckCircle className="h-3 w-3" />;
          case "inactive":
          case "draft":
            return <Loader className="h-3 w-3" />;
          default:
            return null;
        }
      };

      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium gap-1 ${getStatusClass()}`}
        >
          {getStatusIcon()}
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">
        {new Date(row.original.createdAt).toLocaleDateString()}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [isOpen, setIsOpen] = React.useState(false);

      return (
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </button>
          {isOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-md border bg-white shadow-lg">
              <button className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 gap-2">
                <Eye className="h-4 w-4" />
                View Details
              </button>
              <button className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 gap-2">
                <Edit className="h-4 w-4" />
                Edit Product
              </button>
              <button className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 gap-2">
                <ShoppingCart className="h-4 w-4" />
                View Orders
              </button>
              <hr className="my-1" />
              <button className="flex items-center w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      );
    },
  },
];

function DraggableRow({ row }: { row: Row<Product> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id.toString(),
  });

  return (
    <tr
      ref={setNodeRef}
      className={`border-b hover:bg-gray-50 ${
        row.getIsSelected() ? "bg-blue-50" : ""
      } ${isDragging ? "opacity-50 z-10" : ""}`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="px-4 py-4">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

// Sample data for products
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "Premium Laptop",
    description: "High-performance laptop with 16GB RAM and SSD storage",
    price: 1299.99,
    category: "Electronics",
    stock: 25,
    status: "Active",
    rating: 4.5,
    sales: 152,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Wireless Headphones",
    description: "Noise-canceling bluetooth headphones",
    price: 199.99,
    category: "Electronics",
    stock: 0,
    status: "Active",
    rating: 4.2,
    sales: 89,
    createdAt: "2024-02-10",
  },
  {
    id: 3,
    name: "Coffee Maker",
    description: "Automatic drip coffee maker with programmable timer",
    price: 89.99,
    category: "Kitchen",
    stock: 15,
    status: "Active",
    rating: 4.7,
    sales: 234,
    createdAt: "2023-12-05",
  },
  {
    id: 4,
    name: "Running Shoes",
    description: "Comfortable athletic shoes for running and training",
    price: 129.99,
    category: "Sports",
    stock: 42,
    status: "Active",
    rating: 4.3,
    sales: 78,
    createdAt: "2024-03-01",
  },
  {
    id: 5,
    name: "Desk Organizer",
    description: "Bamboo desk organizer with multiple compartments",
    price: 34.99,
    category: "Office",
    stock: 5,
    status: "Draft",
    rating: 4.1,
    sales: 12,
    createdAt: "2024-04-12",
  },
];

export function ProductsDataTable({
  data: initialData = sampleProducts,
}: {
  data?: Product[];
}) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id.toString()) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  // Calculate stats
  const totalValue = data.reduce(
    (sum, product) => sum + product.price * (product.stock || 0),
    0
  );
  const totalStock = data.reduce(
    (sum, product) => sum + (product.stock || 0),
    0
  );
  const activeProducts = data.filter(
    (product) => product.status.toLowerCase() === "active"
  ).length;
  const outOfStock = data.filter(
    (product) => (product.stock || 0) === 0
  ).length;

  return (
    <div className="w-full space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold">{data.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Products</p>
              <p className="text-2xl font-bold">{activeProducts}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Stock</p>
              <p className="text-2xl font-bold">{totalStock}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold">
                ${totalValue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            placeholder="Search products..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={
              (table.getColumn("category")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("category")
                ?.setFilterValue(event.target.value || undefined)
            }
            className="h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Sports">Sports</option>
            <option value="Office">Office</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 gap-2">
            <Columns className="h-4 w-4" />
            Columns
          </button>
          <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-900"
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
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="h-24 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </DndContext>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white rounded-lg border">
        <div className="text-sm text-gray-700">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Rows per page</label>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="h-8 px-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

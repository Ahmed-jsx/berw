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
  User,
  Mail,
  Phone,
  ShoppingBag,
  Star,
  Eye,
  Edit,
  Trash2,
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
import { useRouter } from "next/navigation";

import { useUsers } from "@/hooks/useUsers";

// Schema adapted to API
export const schema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  orderCount: z.number().default(0),
  points: z.number().default(0),
  status: z.string().default("Active"),
  joinDate: z.string(),
});

// --- Skeleton Components ---
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
                <td className="px-4 py-4">
                  <div className="flex justify-center">
                    <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-center">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-center">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
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

// --- Action Dropdown Component ---
function ActionDropdown({ userId }: { userId: number }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleViewDetails = () => {
    router.push(`/dashboard/users/${userId}`);
    setIsOpen(false);
  };

  const handleEdit = () => {
    // Add edit functionality here
    console.log("Edit user", userId);
    setIsOpen(false);
  };

  const handleDelete = () => {
    // Add delete functionality here
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
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            <button
              onClick={handleViewDetails}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Edit User
            </button>
            <hr className="my-1 border-gray-100" />
            <button
              onClick={handleDelete}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete User
            </button>
          </div>
        </>
      )}
    </div>
  );
}
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id });

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

// --- Columns ---
const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
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
          <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
            <div className="flex h-full w-full items-center justify-center text-gray-600 font-medium">
              {initials}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-sm text-gray-500">ID: {user.id}</span>
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
          <Mail className="h-4 w-4 text-gray-400" />
          <span>{row.original.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>{row.original.phone}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "orderCount",
    header: () => <div className="text-center">Orders</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <ShoppingBag className="h-4 w-4 text-blue-500" />
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border border-gray-300 bg-transparent text-gray-700">
          {row.original.orderCount}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "points",
    header: () => <div className="text-center">Points</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2">
        <Star className="h-4 w-4 text-yellow-500 fill-current" />
        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
          {row.original.points.toLocaleString()}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusClass = () => {
        switch (status) {
          case "Active":
            return "bg-green-100 text-green-800";
          case "Inactive":
            return "bg-yellow-100 text-yellow-800";
          case "Pending":
            return "bg-blue-100 text-blue-800";
          default:
            return "border border-gray-300 bg-transparent text-gray-700";
        }
      };

      return (
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium gap-1 ${getStatusClass()}`}
        >
          {status === "Active" && <CheckCircle className="h-3 w-3" />}
          {status === "Pending" && <Loader className="h-3 w-3 animate-spin" />}
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "joinDate",
    header: "Join Date",
    cell: ({ row }) => (
      <div className="text-sm">
        {new Date(row.original.joinDate).toLocaleDateString()}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <ActionDropdown userId={row.original.id} />,
    enableSorting: false,
  },
];

// --- Draggable Row ---
function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <tr
      ref={setNodeRef}
      className={`border-b hover:bg-gray-50 ${
        row.getIsSelected() ? "bg-blue-50" : ""
      } ${isDragging ? "opacity-50 z-10" : ""}`}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="px-4 py-4">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

// --- Main Component ---
export function DataTable() {
  const { data, isLoading } = useUsers();
  const router = useRouter();

  // ✅ Memoize the transformed users data to prevent infinite re-renders
  const users = React.useMemo(() => {
    if (!data?.users) return [];

    return data.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.number, // API gives "number"
      orderCount: 0, // placeholder until backend supports
      points: 0, // placeholder
      status: "Active", // default status
      joinDate: u.created_at,
    }));
  }, [data?.users]);

  const [tableData, setTableData] = React.useState<typeof users>([]);

  // ✅ Fixed: Now users is memoized, so this won't cause infinite re-renders
  React.useEffect(() => {
    if (users.length > 0) {
      setTableData(users);
    }
  }, [users]);

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
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => tableData.map(({ id }) => id),
    [tableData]
  );

  const table = useReactTable({
    data: tableData,
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
      setTableData((old) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(old, oldIndex, newIndex);
      });
    }
  }

  // ✅ Show skeleton loading state instead of plain text
  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="w-full space-y-6 p-6 bg-gray-50 min-h-screen">
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
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </DndContext>
    </div>
  );
}

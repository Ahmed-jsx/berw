"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import {
  Edit,
  GripVertical,
  MoreVertical,
  Trash2,
  Eye,
  Search,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Extra,
  useExtras,
  UseDeleteExtra,
  UseUpdateExtra,
} from "@/hooks/useExtras";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// --- Skeleton ---
function TableSkeleton() {
  return (
    <div className="w-full space-y-6 p-6 bg-gray-50 min-h-screen">
      <div className="animate-pulse">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: 5 }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b">
                {Array.from({ length: 5 }).map((_, j) => (
                  <td key={j} className="px-4 py-4">
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Action Dropdown ---
function ActionDropdown({ extraId }: { extraId: number }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const { mutateAsync: deleteExtra } = UseDeleteExtra();

  const handleView = () => {
    router.push(`/dashboard/extras/${extraId}`);
    setIsOpen(false);
  };

  const handleEdit = () => {
    router.push(`/dashboard/extras/${extraId}?edit=true`);
    setIsOpen(false);
  };

  const handleDelete = () => {
    deleteExtra(extraId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
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
              onClick={handleView}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-50"
            >
              <Eye className="h-4 w-4" /> View
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-50"
            >
              <Edit className="h-4 w-4" /> Edit
            </button>
            <hr className="my-1 border-gray-100" />
            <button
              onClick={handleDelete}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// --- Drag handle ---
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <button
      {...attributes}
      {...listeners}
      className="p-2 text-gray-500 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
    >
      <GripVertical className="h-4 w-4" />
    </button>
  );
}

// --- Columns ---
const columns: ColumnDef<Extra>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <span className="text-sm text-gray-600 truncate max-w-[250px] block">
        {row.original.description || "-"}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <span>${row.original.price.toFixed(2)}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionDropdown extraId={row.original.id} />,
    enableSorting: false,
  },
];

// --- Draggable Row ---
function DraggableRow({ row }: { row: Row<Extra> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <tr
      ref={setNodeRef}
      className={cn(
        "border-b hover:bg-gray-50 transition",
        isDragging && "opacity-50"
      )}
      style={{ transform: CSS.Transform.toString(transform), transition }}
    >
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="px-4 py-3">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

// --- Main Component ---
export function ExtrasTable() {
  const { data, isLoading } = useExtras();
  const [tableData, setTableData] = React.useState<Extra[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pageSize, setPageSize] = React.useState(10);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  React.useEffect(() => {
    if (data) setTableData(data);
  }, [data]);

  const dataIds = React.useMemo(() => tableData.map((e) => e.id), [tableData]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      globalFilter,
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setTableData((old) => {
        const oldIndex = dataIds.indexOf(active.id as number);
        const newIndex = dataIds.indexOf(over.id as number);
        return arrayMove(old, oldIndex, newIndex);
      });
    }
  }

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="w-full space-y-4 p-6 bg-gray-50 min-h-screen">
      {/* --- Header + Filters --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search extras..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={pageSize.toString()}
            onValueChange={(val) => setPageSize(Number(val))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- Table --- */}
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <table className="w-full bg-white rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-900 select-none"
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
                  No extras found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </DndContext>

      {/* --- Pagination --- */}
      <div className="flex items-center justify-between pt-4">
        <div className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

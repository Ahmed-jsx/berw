"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCategories, useDeleteCategory } from "@/query/useCategories";
import { createCategoryColumns } from "./columns";
import { DataTable } from "./data-table";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function CategoriesPage() {
  const { data: categories, isLoading, error, refetch } = useCategories();
  const deleteCategory = useDeleteCategory();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteCategory.mutate(categoryToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setCategoryToDelete(null);
        },
        onError: () => {
          setDeleteDialogOpen(false);
          setCategoryToDelete(null);
        },
      });
    }
  };

  const categoryToDeleteName = categories?.find(
    (c) => c.category_id === categoryToDelete
  )?.category_name;

  const columns = createCategoryColumns(handleDeleteClick);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your product categories
          </p>
        </div>
        <div className="flex space-x-2">
          <Link href="/dashboard/catogrey/create">
            <Button className="py-2">
              <Plus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
          </Link>
          <Button
            disabled={isLoading}
            variant="outline"
            className="ml-2 py-2"
            onClick={() => {
              refetch();
              toast.success("Categories refreshed successfully");
            }}
          >
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
          Error loading categories: {error.message}
        </div>
      )}

      <DataTable
        columns={columns}
        data={categories || []}
        isLoading={isLoading}
        pageSize={10}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category{" "}
              <span className="font-semibold">"{categoryToDeleteName}"</span>?
              This action cannot be undone. All products in this category will
              need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setCategoryToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteCategory.isPending}
            >
              {deleteCategory.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


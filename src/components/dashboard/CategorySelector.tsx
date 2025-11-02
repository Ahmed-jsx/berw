"use client";

import { useState } from "react";
import { useCategories, useCreateCategory } from "@/query/useCategories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";

// -------------------- SCHEMA --------------------
const categorySchema = z.object({
  category_name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CategorySelector({
  value,
  onChange,
}: CategorySelectorProps) {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createCategory = useCreateCategory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category_name: "",
      description: "",
    },
  });

  // -------------------- CREATE CATEGORY --------------------
  const handleCreateCategory = async (values: CategoryFormValues) => {
    setIsCreatingCategory(true);
    try {
      const newCategory = await createCategory({
        category_name: values.category_name,
        description: values.description || "",
      });

      toast.success("Category created successfully!");
      onChange(newCategory.category_name);
      setIsDialogOpen(false);
      categoryForm.reset();
    } catch (error) {
      toast.error("Failed to create category");
      console.error(error);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  // -------------------- UI --------------------
  return (
    <>
      <Select
        onValueChange={onChange}
        value={value}
        disabled={categoriesLoading}
      >
        <FormControl>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {categories?.map((category) => (
            <SelectItem
              key={category.category_id}
              value={category.category_name}
            >
              {category.category_name}
            </SelectItem>
          ))}
          <div className="border-t mt-1 pt-1">
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start text-teal-600 hover:text-teal-700 hover:bg-teal-50"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Category
            </Button>
          </div>
        </SelectContent>
      </Select>

      {/* Create Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category for your products
            </DialogDescription>
          </DialogHeader>
          <Form {...categoryForm}>
            <form
              onSubmit={categoryForm.handleSubmit(handleCreateCategory)}
              className="space-y-4"
            >
              <FormField
                control={categoryForm.control}
                name="category_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g. Hot Drinks"
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={categoryForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe this category..."
                        className="min-h-20 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    categoryForm.reset();
                  }}
                  disabled={isCreatingCategory}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700"
                  disabled={isCreatingCategory}
                >
                  {isCreatingCategory ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Category"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

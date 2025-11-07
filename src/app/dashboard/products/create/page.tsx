"use client";

import ImageUpload from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCategories, useCreateCategory } from "@/query/useCategories";
import { useProductMutations } from "@/hooks/useProductMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// -------------------- SCHEMAS --------------------
const productSchema = z.object({
  product_name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  product_components: z.string().optional(),
  is_featured: z.boolean(),
});

const categorySchema = z.object({
  category_name: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;
type CategoryFormValues = z.infer<typeof categorySchema>;

// -------------------- COMPONENT --------------------
export default function CreateProductPage() {
  const { create } = useProductMutations();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createCategory = useCreateCategory();
  const router = useRouter();

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product_name: "",
      category: "",
      price: "",
      product_components: "",
      is_featured: false,
    },
  });

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category_name: "",
      description: "",
    },
  });

  // -------------------- HANDLE SUBMIT --------------------
  // ... (previous imports remain the same)

  // -------------------- HANDLE SUBMIT --------------------
  const handleSubmit = (values: ProductFormValues) => {
    if (!uploadedImage) {
      toast.error("Please upload a product image");
      return;
    }

    create.mutate(
      {
        product_name: values.product_name,
        has_points: false,
        category: values.category, // This should match your API's expected field name
        price: parseFloat(values.price),
        product_components: values.product_components || "",
        is_featured: values.is_featured,
        product_photo: uploadedImage,
      },
      {
        onSuccess: () => {
          toast.success("Product created successfully!");
          router.push("/dashboard/products");
        },
        onError: (error) => {
          console.error("Error creating product:", error);
          toast.error("Failed to create product. Please try again.");
        },
      }
    );
  };

  // -------------------- CREATE CATEGORY --------------------
  const handleCreateCategory = async (values: CategoryFormValues) => {
    setIsCreatingCategory(true);
    try {
      const newCategory = await createCategory({
        category_name: values.category_name,
        description: values.description || "",
      });

      toast.success("Category created successfully!");
      form.setValue("category", newCategory.category_name);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Product
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new product to your coffee menu
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-8"
              >
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-lg font-semibold">
                    Product Image
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Upload a product image (max 2MB)
                  </p>
                  <div className="mt-4">
                    <ImageUpload
                      maxSize={2 * 1024 * 1024}
                      onImageChange={(image) => {
                        if (image && image.status === "completed") {
                          setUploadedImage(image.file);
                        } else {
                          setUploadedImage(null);
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="product_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Caramel Macchiato"
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* ✅ Category Field (updated to match EditProductPage) */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (EGP)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                            LE
                          </span>
                          <Input
                            type="number"
                            {...field}
                            placeholder="0.00"
                            className="h-11 pl-12"
                            step="0.01"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="product_components"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormDescription>
                        Describe the ingredients and what makes this product
                        special
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="e.g. Rich espresso with steamed milk and vanilla syrup..."
                          className="min-h-24 resize-none"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Product Options */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold text-lg">Product Options</h3>
                  <FormField
                    control={form.control}
                    name="is_featured"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium cursor-pointer">
                            Featured Product
                          </FormLabel>
                          <FormDescription>
                            Display this product on the homepage
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                    disabled={create.isPending || !uploadedImage}
                  >
                    {create.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Product"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

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
    </div>
  );
}

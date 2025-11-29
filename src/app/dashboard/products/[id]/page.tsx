"use client";

import { useParams, useRouter } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { useProductMutations } from "@/hooks/useProductMutations";
import { useCategories, useCreateCategory } from "@/query/useCategories";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Loader2, Plus, ArrowLeft, X } from "lucide-react";
import Image from "next/image";
import ImageUpload from "@/components/image-upload";

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

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createCategory = useCreateCategory();
  const { update } = useProductMutations();
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Use isPending from mutation for loading state
  const isCreating = isCreatingCategory || createCategory.isPending;
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [hasNewImage, setHasNewImage] = useState(false);

  const product = products?.find((p) => String(p.product_id) === id);

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

  // Update form when product data loads
  useEffect(() => {
    if (product && categories && categories.length > 0) {
      // Find the exact category name that matches the product's category
      // This ensures the Select component can properly match and display the selected value
      const productCategory = product.product_category || "";
      const matchingCategory = categories.find(
        (cat) => cat.category_name === productCategory
      );
      const categoryValue = matchingCategory
        ? matchingCategory.category_name
        : productCategory;

      form.reset({
        product_name: product.product_name,
        category: categoryValue || "",
        price: product.product_price,
        product_components: product.product_components || "",
        is_featured: product.is_featured,
      });
    }
  }, [product, categories, form]);

  const handleCreateCategory = async (values: CategoryFormValues) => {
    setIsCreatingCategory(true);
    try {
      const newCategory = await createCategory.mutateAsync({
        category_name: values.category_name,
        description: values.description || "",
      });
      form.setValue("category", newCategory.category_name);
      setIsDialogOpen(false);
      categoryForm.reset();
    } catch (error) {
      console.error(error);
      // Error toast is handled by the mutation
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleUpdate = (values: ProductFormValues) => {
    if (!product) return;

    update.mutate(
      {
        id: product.product_id,
        body: {
          product_name: values.product_name,
          category: values.category,
          price: parseFloat(values.price),
          product_components: values.product_components || "",
          is_featured: values.is_featured,
          ...(uploadedImage && { product_photo: uploadedImage }),
        } as any, // Type assertion needed because API accepts File for product_photo
      },
      {
        onSuccess: () => {
          toast.success("Product updated successfully!");
          router.push("/dashboard/products");
        },
        onError: (error) => {
          toast.error("Failed to update product");
          console.error(error);
        },
      }
    );
  };

  if (productsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">Product not found</p>
              <Button onClick={() => router.push("/dashboard/products")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">
            Update product information for {product.product_name}
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdate)}
                className="space-y-8"
              >
                {/* Image Upload Section */}
                <div className="space-y-4">
                  <div>
                    <label className="text-lg font-semibold text-gray-900">
                      Product Image
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      {hasNewImage
                        ? "New image will replace the current one"
                        : "Update image (optional - leave unchanged to keep current image)"}
                    </p>
                  </div>

                  {/* Current Image Preview */}
                  {product.product_photo && !hasNewImage && (
                    <div className="relative w-full max-w-md h-64 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm bg-gray-50">
                      <Image
                        src={product.product_photo}
                        alt={product.product_name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="opacity-0 hover:opacity-100 transition-opacity text-white text-sm font-medium">
                          Current Image
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Image Upload Component */}
                  <div className="mt-4">
                    <ImageUpload
                      maxSize={2 * 1024 * 1024}
                      onImageChange={(image) => {
                        if (image && image.status === "completed") {
                          setUploadedImage(image.file);
                          setHasNewImage(true);
                        } else {
                          setUploadedImage(null);
                          setHasNewImage(false);
                        }
                      }}
                    />
                  </div>

                  {/* Cancel Image Update Button */}
                  {hasNewImage && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUploadedImage(null);
                        setHasNewImage(false);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel Image Update
                    </Button>
                  )}
                </div>

                <div className="border-t pt-6"></div>

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

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          defaultValue={product.product_category || undefined}
                          onValueChange={field.onChange}
                          value={field.value || undefined}
                          disabled={categoriesLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue 
                                placeholder={
                                  categoriesLoading 
                                    ? "Loading categories..." 
                                    : product.product_category || "Select a category"
                                }
                              >
                                {product.product_category || "Select a category"}
                              </SelectValue>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories && categories.length > 0 ? (
                              <>
                                {categories.map((category) => (
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
                              </>
                            ) : (
                              <div className="p-4 text-center text-sm text-gray-500">
                                No categories available
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        {field.value && (
                          <p className="text-xs text-gray-500 mt-1">
                            Selected: <span className="font-medium">{field.value}</span>
                          </p>
                        )}
                      </FormItem>
                    )}
                  />
                </div>

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
                    disabled={update.isPending}
                  >
                    {update.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Product"
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
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700"
                  disabled={isCreating}
                >
                  {isCreating ? (
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
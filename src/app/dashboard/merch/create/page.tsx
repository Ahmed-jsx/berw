"use client";

import ImageUpload from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useMerchantMutations } from "@/hooks/useMerchantMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// -------------------- SCHEMAS --------------------
const merchantSchema = z.object({
  merchant_name: z.string().min(1, "Name is required"),
  merchant_description: z.string().min(1, "Description is required"),
  merchant_price: z.string().min(1, "Price is required"),
  merchant_category: z.string().optional(),
});

type MerchantFormValues = z.infer<typeof merchantSchema>;

// -------------------- COMPONENT --------------------
export default function CreateMerchantPage() {
  const { create } = useMerchantMutations();
  const router = useRouter();

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const form = useForm<MerchantFormValues>({
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      merchant_name: "",
      merchant_description: "",
      merchant_price: "",
      merchant_category: "",
    },
  });

  // -------------------- HANDLE SUBMIT --------------------
  const handleSubmit = (values: MerchantFormValues) => {
    if (!uploadedImage) {
      toast.error("Please upload a merchant image");
      return;
    }

    create.mutate(
      {
        merchant_name: values.merchant_name,
        merchant_description: values.merchant_description,
        merchant_price: parseFloat(values.merchant_price),
        merchant_category: values.merchant_category || undefined,
        merchant_photo: uploadedImage,
      },
      {
        onSuccess: () => {
          toast.success("Merchant created successfully!");
          router.push("/dashboard/merch");
        },
        onError: (error) => {
          console.error("Error creating merchant:", error);
          toast.error("Failed to create merchant. Please try again.");
        },
      }
    );
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
            Create New Merchant
          </h1>
          <p className="text-gray-600 mt-2">
            Add a new merchant item to your store
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
                    Merchant Image
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Upload a merchant image (max 2MB)
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

                {/* Merchant Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="merchant_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Merchant Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Monkey Bag"
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="merchant_category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g. Bags, Mugs, Accessories"
                            className="h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Price */}
                <FormField
                  control={form.control}
                  name="merchant_price"
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
                  name="merchant_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormDescription>
                        Describe the merchant item and its features
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="e.g. Premium coffee bag made with high-quality materials..."
                          className="min-h-24 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                      "Create Merchant"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


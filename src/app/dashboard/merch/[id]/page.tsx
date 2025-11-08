"use client";

import { useParams, useRouter } from "next/navigation";
import { useMerchants } from "@/hooks/useMerch";
import { useMerchantMutations } from "@/hooks/useMerchantMutations";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import ImageUpload from "@/components/image-upload";

const merchantSchema = z.object({
  merchant_name: z.string().min(1, "Name is required"),
  merchant_description: z.string().min(1, "Description is required"),
  merchant_price: z.string().min(1, "Price is required"),
  merchant_category: z.string().optional(),
});

type MerchantFormValues = z.infer<typeof merchantSchema>;

export default function EditMerchantPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: merchants, isLoading: merchantsLoading } = useMerchants();
  const { update } = useMerchantMutations();
  const router = useRouter();

  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [hasNewImage, setHasNewImage] = useState(false);

  const merchant = merchants?.find((m) => String(m.merchant_id) === id);

  const form = useForm<MerchantFormValues>({
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      merchant_name: "",
      merchant_description: "",
      merchant_price: "",
      merchant_category: "",
    },
  });

  // Update form when merchant data loads
  useEffect(() => {
    if (merchant) {
      form.reset({
        merchant_name: merchant.merchant_name,
        merchant_description: merchant.merchant_description || "",
        merchant_price: merchant.merchant_price,
        merchant_category: merchant.merchant_category || "",
      });
    }
  }, [merchant, form]);

  const handleUpdate = (values: MerchantFormValues) => {
    if (!merchant) return;

    const updateData: {
      merchant_name: string;
      merchant_description: string;
      merchant_price: number;
      merchant_category?: string;
      merchant_photo?: File;
    } = {
      merchant_name: values.merchant_name,
      merchant_description: values.merchant_description,
      merchant_price: parseFloat(values.merchant_price),
    };

    if (values.merchant_category) {
      updateData.merchant_category = values.merchant_category;
    }

    if (hasNewImage && uploadedImage) {
      updateData.merchant_photo = uploadedImage;
    }

    update.mutate(
      {
        id: merchant.merchant_id,
        body: updateData,
      },
      {
        onSuccess: () => {
          toast.success("Merchant updated successfully!");
          router.push("/dashboard/merch");
        },
        onError: (error) => {
          toast.error("Failed to update merchant");
          console.error(error);
        },
      }
    );
  };

  if (merchantsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-0">
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">Merchant not found</p>
              <Button onClick={() => router.push("/dashboard/merch")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Merchants
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Merchant</h1>
          <p className="text-gray-600 mt-2">
            Update merchant information for {merchant.merchant_name}
          </p>
        </div>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6 md:p-8">
            {/* Merchant Image Preview */}
            {merchant.merchant_photo && !hasNewImage && (
              <div className="mb-6">
                <label className="text-lg font-semibold mb-2 block">
                  Current Image
                </label>
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                  <Image
                    src={merchant.merchant_photo}
                    alt={merchant.merchant_name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleUpdate)}
                className="space-y-8"
              >
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-lg font-semibold">
                    {hasNewImage ? "New Merchant Image" : "Update Image (Optional)"}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Upload a new merchant image (max 2MB)
                  </p>
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
                  {hasNewImage && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUploadedImage(null);
                        setHasNewImage(false);
                      }}
                    >
                      Cancel Image Update
                    </Button>
                  )}
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
                    disabled={update.isPending}
                  >
                    {update.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Merchant"
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


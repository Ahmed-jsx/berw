"use client";

import type React from "react";

import {
  useExtraById,
  UseUpdateExtra,
  UseDeleteExtra,
} from "@/hooks/useExtras";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Edit, Trash2, DollarSign, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function ExtraDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: extra, isLoading, error } = useExtraById(Number(id));
  const { mutateAsync: updateExtra, isPending: isUpdating } = UseUpdateExtra();
  const { mutateAsync: deleteExtra, isPending: isDeleting } = UseDeleteExtra();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-32" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !extra) {
    return (
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
              <CardDescription>
                {error ? error.message : "Extra not found"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/dashboard/extras")}
                variant="outline"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {"Back to Extras"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleEditClick = () => {
    setFormData({
      name: extra.name,
      description: extra.description || "",
      price: extra.price.toString(),
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (
      !formData.price ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      await updateExtra({
        extraId: extra.id,
        extraName: formData.name,
        extra_description: formData.description || null,
        extraPrice: Number(formData.price),
      });

      toast.success("Extra updated successfully");

      setIsEditOpen(false);
    } catch (error) {
      toast.error("Failed to update extra");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteExtra(extra.id);

      toast.success("Extra deleted successfully");

      router.push("/dashboard/extras");
    } catch (error) {
      toast.error("Failed to delete extra");
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/extras")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {"Back"}
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">Extra Details</span>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold text-balance">
                  {extra.name}
                </CardTitle>
                <CardDescription className="text-base">
                  {"View and manage extra details"}
                </CardDescription>
              </div>
              <Badge
                variant="secondary"
                className="text-lg text-white px-4 py-2"
              >
                <DollarSign className="h-4 w-4 mr-1" />
                {extra.price.toFixed(2)}
              </Badge>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6 space-y-6">
            {/* Description Section */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Description</Label>
              <p className="text-muted-foreground leading-relaxed">
                {extra.description || (
                  <span className="italic">{"No description provided"}</span>
                )}
              </p>
            </div>

            {/* Metadata Section */}
            {(extra.createdAt || extra.updatedAt) && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {extra.createdAt && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {"Created: "}
                        {extra.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {extra.updatedAt && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {"Updated: "}
                        {extra.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleEditClick}
                variant="default"
                size="lg"
                className="flex-1 sm:flex-none"
              >
                <Edit className="mr-2 h-4 w-4" />
                {"Edit Extra"}
              </Button>
              <Button
                onClick={() => setIsDeleteOpen(true)}
                variant="destructive"
                size="lg"
                disabled={isDeleting}
                className="flex-1 sm:flex-none"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete Extra"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleEditSubmit}>
              <DialogHeader>
                <DialogTitle>Edit Extra</DialogTitle>
                <DialogDescription>
                  {"Make changes to the extra details below"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter extra name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter extra description"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="0.00"
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditOpen(false)}
                  disabled={isUpdating}
                >
                  {"Cancel"}
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                {'Are you sure you want to delete "'}
                {extra.name}
                {'"? This action cannot be undone.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
              >
                {"Cancel"}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

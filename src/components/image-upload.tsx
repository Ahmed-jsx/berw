"use client";

import { useCallback, useState } from "react";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CircleX,
  CloudUpload,
  ImageIcon,
  TriangleAlert,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

interface ImageUploadProps {
  maxSize?: number;
  accept?: string;
  className?: string;
  onImageChange?: (image: ImageFile | null) => void;
  onUploadComplete?: (image: ImageFile) => void;
}

export default function ImageUpload({
  maxSize = 2 * 1024 * 1024, // 2MB
  accept = "image/*",
  className,
  onImageChange,
  onUploadComplete,
}: ImageUploadProps) {
  const [image, setImage] = useState<ImageFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) {
      return "File must be an image";
    }
    if (file.size > maxSize) {
      return `File size must be less than ${(maxSize / 1024 / 1024).toFixed(
        1
      )}MB`;
    }
    return null;
  };

  const addImage = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);

      // Clean up previous image preview
      if (image) {
        URL.revokeObjectURL(image.preview);
      }

      const imageFile: ImageFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: "uploading",
      };

      setImage(imageFile);
      onImageChange?.(imageFile);

      // Simulate upload progress
      simulateUpload(imageFile);
    },
    [maxSize, onImageChange, image]
  );

  const simulateUpload = (imageFile: ImageFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        const completedImage = {
          ...imageFile,
          progress: 100,
          status: "completed" as const,
        };

        setImage(completedImage);
        onImageChange?.(completedImage);
        onUploadComplete?.(completedImage);
      } else {
        setImage((prev) => (prev ? { ...prev, progress } : null));
      }
    }, 100);
  };

  const removeImage = useCallback(() => {
    if (image) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
    onImageChange?.(null);
  }, [image, onImageChange]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        addImage(files[0]); // Only take first file
      }
    },
    [addImage]
  );

  const openFileDialog = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        addImage(target.files[0]);
      }
    };
    input.click();
  }, [accept, addImage]);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Image Preview */}
      {image && (
        <div className="mb-4">
          <Card className="flex items-center justify-center rounded-md bg-accent/50 shadow-none relative group overflow-hidden">
            <img
              src={image.preview}
              className="h-[200px] w-full object-cover rounded-md"
              alt="Product image"
            />

            {/* Remove Button Overlay */}
            <Button
              onClick={removeImage}
              variant="outline"
              size="icon"
              type="button"
              className="shadow-sm absolute top-2 right-2 size-8 opacity-0 group-hover:opacity-100 rounded-full transition-opacity"
            >
              <XIcon className="size-4" />
            </Button>
          </Card>
        </div>
      )}

      {/* Upload Area */}
      {!image && (
        <Card
          className={cn(
            "border-dashed shadow-none rounded-md transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <CardContent className="text-center py-12">
            <div className="flex items-center justify-center size-12 rounded-full border border-border mx-auto mb-4">
              <CloudUpload className="size-6" />
            </div>
            <h3 className="text-sm text-foreground font-semibold mb-1">
              Choose a file or drag & drop here
            </h3>
            <span className="text-xs text-muted-foreground font-normal block mb-4">
              JPEG, PNG, up to {formatBytes(maxSize)}
            </span>
            <Button type="button" size="sm" onClick={openFileDialog}>
              Browse File
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {image && image.status === "uploading" && (
        <Card className="shadow-none rounded-md mt-4">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex items-center justify-center size-10 rounded-md border border-border shrink-0">
              <ImageIcon className="size-5 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground font-medium">
                    {image.file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatBytes(image.file.size)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {Math.round(image.progress)}%
                </p>
              </div>
              <Progress
                value={image.progress}
                className="h-1.5 transition-all duration-300"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" appearance="light" className="mt-4">
          <AlertIcon>
            <TriangleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>Upload error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </AlertContent>
        </Alert>
      )}
    </div>
  );
}

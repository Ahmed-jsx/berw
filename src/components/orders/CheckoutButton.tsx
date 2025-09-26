"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks/useProducts";
import { useOrderStore } from "@/store/orderStore";

export default function ProductDetails() {
  const params = useParams(); // assuming route like /products/[id]
  const productId = params?.id as string;

  const { data: product, isLoading, error } = useProduct(productId);
  const { addToCart } = useOrderStore();

  if (isLoading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!product) return <p>No product found</p>;

  const handleAddToCart = () => {
    addToCart({
      product_id: Number(product.product_id),
      quantity: 1,
      extras: [], // if you have extras, you can wire them here
      product_name: product.product_name,
      product_price: Number(product.product_price),
      product_category: product.product_category,
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{product.product_name}</h1>
      <p className="text-gray-600">${product.product_price}</p>
      <Button onClick={handleAddToCart}>Add to Cart</Button>
    </div>
  );
}

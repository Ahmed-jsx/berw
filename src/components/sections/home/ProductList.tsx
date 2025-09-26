"use client";

import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/Product";

export default function ProductList() {
  const { data: products, isLoading, error, isError } = useProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-800">Error loading products: {error?.message}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">No products found</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {products.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {product.product_photo && (
        <img
          src={product.product_photo}
          alt={product.product_name}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <h3 className="text-lg font-semibold mb-2">{product.product_name}</h3>
      <p className="text-2xl font-bold text-green-600 mb-2">
        ${product.product_price}
      </p>
      {product.product_components && (
        <p className="text-gray-600 text-sm">{product.product_components}</p>
      )}
    </div>
  );
}

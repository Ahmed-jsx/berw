import { getQueryClient } from "@/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { fetchExtras } from "@/lib/fetchers/extras";
import ProductClient from "./ProductClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SingleProductPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);
  const queryClient = getQueryClient();

  // Prefetch all data on the server in parallel
  await Promise.all([
    // Prefetch product data
    queryClient.prefetchQuery({
      queryKey: ["products", productId],
      queryFn: () => api.products.getById(productId),
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
    // Prefetch extras data
    queryClient.prefetchQuery({
      queryKey: ["extras"],
      queryFn: fetchExtras,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductClient id={productId} />
    </HydrationBoundary>
  );
}

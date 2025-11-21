import { getQueryClient } from "@/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { api } from "@/lib/api";
import MerchClient from "./MerchClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SingleMerchPage({ params }: PageProps) {
  const { id } = await params;
  const merchId = Number(id);
  const queryClient = getQueryClient();

  // Prefetch all data on the server in parallel
  await Promise.all([
    // Prefetch merchant data
    queryClient.prefetchQuery({
      queryKey: ["merchants", merchId],
      queryFn: () => api.merchants.getById(merchId),
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
    // Prefetch all merchants data for "You may also like" section
    queryClient.prefetchQuery({
      queryKey: ["merchants"],
      queryFn: api.merchants.getAll,
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MerchClient id={merchId} />
    </HydrationBoundary>
  );
}

import { getQueryClient } from "@/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getHeroData } from "@/sanity/lib/queries/hero";
import { api } from "@/lib/api";
import HomeClient from "./HomeClient";

export default async function Home() {
  const queryClient = getQueryClient();

  // Prefetch all data on the server in parallel
  await Promise.all([
    // Prefetch hero data
    queryClient.prefetchQuery({
      queryKey: ["heroSection"],
      queryFn: getHeroData,
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    }),
    // Prefetch products data
    queryClient.prefetchQuery({
      queryKey: ["products"],
      queryFn: api.products.getAll,
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    }),
    // Prefetch merchants data
    queryClient.prefetchQuery({
      queryKey: ["merchants"],
      queryFn: api.merchants.getAll,
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeClient />
    </HydrationBoundary>
  );
}

'use client'

import { useQuery } from '@tanstack/react-query'
import { getHeroData, type HeroSection } from '@/sanity/lib/queries/hero'

export function useHeroData() {
  return useQuery<HeroSection | null>({
    queryKey: ['heroSection'],
    queryFn: getHeroData,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - data doesn't change often
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days - keep in cache for a week
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch on mount if we have prefetched data
    refetchOnReconnect: false,
    retry: 2,
  })
}

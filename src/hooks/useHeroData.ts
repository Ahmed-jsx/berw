'use client'

import { useQuery } from '@tanstack/react-query'
import { getHeroData, type HeroSection } from '@/sanity/lib/queries/hero'

export function useHeroData() {
  return useQuery<HeroSection | null>({
    queryKey: ['heroSection'],
    queryFn: getHeroData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
    refetchOnWindowFocus: false,
    retry: 2,
  })
}

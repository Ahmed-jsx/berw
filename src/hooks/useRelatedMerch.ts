"use client";

import { useQuery } from "@tanstack/react-query";

export const useRelatedMerch = (category?: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useQuery({
    queryKey: ["related-merch", category],
    queryFn: async () => {
      if (!category) return [];
      const res = await fetch(`${apiUrl}/merch?category=${category}`);
      if (!res.ok) throw new Error("Failed to fetch related merch");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!category,
  });
};

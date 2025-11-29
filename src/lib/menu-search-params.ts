import {
  createSearchParamsCache,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

// Define the valid sort options
export const sortOptions = ["name", "price-low", "price-high"] as const;
export type SortOption = (typeof sortOptions)[number];

// Define view modes
export const viewModes = ["grid", "list"] as const;
export type ViewMode = (typeof viewModes)[number];

// Parser definitions (used by both client and server)
export const menuSearchParams = {
  q: parseAsString.withDefault(""),
  category: parseAsString,
  sort: parseAsStringLiteral(sortOptions).withDefault("name"),
  view: parseAsStringLiteral(viewModes).withDefault("grid"),
};

// Server-side cache for search params (optional - for SSR)
export const searchParamsCache = createSearchParamsCache(menuSearchParams);


/**
 * URL utility functions for product pages
 */

/**
 * Convert product name to URL-friendly slug
 * @param name - Product name
 * @returns URL-friendly slug
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate full product URL with slug
 * @param id - Product ID
 * @param name - Product name
 * @returns Full product URL path
 */
export function getProductUrl(id: number, name: string): string {
  const slug = generateSlug(name);
  return `/menu/${id}/${slug}`;
}

/**
 * Extract product ID from slug-based URL
 * @param slug - URL slug segment
 * @returns Product ID if found, null otherwise
 */
export function parseProductSlug(slug: string): number | null {
  // If slug contains ID (format: "123-product-name"), extract it
  const match = slug.match(/^(\d+)/);
  return match ? Number(match[1]) : null;
}

/**
 * Get absolute URL for product (for meta tags and sharing)
 * @param id - Product ID
 * @param name - Product name
 * @returns Absolute URL
 */
export function getAbsoluteProductUrl(id: number, name: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.monkeybrew.net';
  const path = getProductUrl(id, name);
  return `${siteUrl}${path}`;
}


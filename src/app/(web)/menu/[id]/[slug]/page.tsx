import { getQueryClient } from "@/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { fetchExtras } from "@/lib/fetchers/extras";
import ProductClient from "../ProductClient";
import { generateSlug, getAbsoluteProductUrl } from "@/lib/utils/url";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    id: string;
    slug: string;
  }>;
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = Number(id);
  
  try {
    const productResponse = await api.products.getById(productId);
    const product = Array.isArray(productResponse) ? productResponse[0] : productResponse;
    
    if (!product) {
      return {
        title: "Product Not Found | Monkey Brew",
      };
    }

    const productPrice = parseFloat(product.product_price);
    const productImage = product.product_photo || "/bg1.png";
    const productUrl = getAbsoluteProductUrl(product.product_id, product.product_name);
    const description = product.product_components || `Order ${product.product_name} for ${productPrice.toFixed(2)} EGP at Monkey Brew`;
    
    return {
      title: `${product.product_name} | Monkey Brew`,
      description,
      openGraph: {
        title: `${product.product_name} | Monkey Brew`,
        description,
        url: productUrl,
        siteName: "Monkey Brew",
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: product.product_name,
          },
        ],
        locale: "en_US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.product_name} | Monkey Brew`,
        description,
        images: [productImage],
      },
      alternates: {
        canonical: productUrl,
      },
      other: {
        "product:price:amount": productPrice.toFixed(2),
        "product:price:currency": "EGP",
        "product:availability": "in stock",
        "product:category": product.product_category || "Coffee",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product | Monkey Brew",
    };
  }
}

export default async function SingleProductPage({ params }: PageProps) {
  const { id, slug } = await params;
  const productId = Number(id);
  const queryClient = getQueryClient();

  // Fetch product to validate slug
  const productResponse = await api.products.getById(productId);
  const product = Array.isArray(productResponse) ? productResponse[0] : productResponse;
  
  if (!product) {
    notFound();
  }

  // Validate slug matches product name
  const expectedSlug = generateSlug(product.product_name);
  if (slug !== expectedSlug) {
    // Redirect to correct URL with proper slug
    redirect(`/menu/${productId}/${expectedSlug}`);
  }

  // Prefetch all data on the server in parallel
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["products", productId],
      queryFn: () => api.products.getById(productId),
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
    queryClient.prefetchQuery({
      queryKey: ["extras"],
      queryFn: fetchExtras,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
  ]);

  // Generate structured data (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.product_name,
    description: product.product_components || `Order ${product.product_name} at Monkey Brew`,
    image: product.product_photo || "/bg1.png",
    brand: {
      "@type": "Brand",
      name: "Monkey Brew",
    },
    offers: {
      "@type": "Offer",
      price: parseFloat(product.product_price),
      priceCurrency: "EGP",
      availability: "https://schema.org/InStock",
      url: getAbsoluteProductUrl(product.product_id, product.product_name),
    },
    category: product.product_category || "Coffee",
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_SITE_URL || "https://www.monkeybrew.net",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Menu",
        item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.monkeybrew.net"}/menu`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.product_name,
        item: getAbsoluteProductUrl(product.product_id, product.product_name),
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProductClient id={productId} />
      </HydrationBoundary>
    </>
  );
}


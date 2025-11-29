import { getQueryClient } from "@/lib/queryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { fetchExtras } from "@/lib/fetchers/extras";
import ProductClient from "./ProductClient";
import { redirect } from "next/navigation";
import { generateSlug, getAbsoluteProductUrl } from "@/lib/utils/url";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    id: string;
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
  const { id } = await params;
  const productId = Number(id);
  
  try {
    // Fetch product to generate slug and redirect
    const productResponse = await api.products.getById(productId);
    const product = Array.isArray(productResponse) ? productResponse[0] : productResponse;
    
    if (!product) {
      redirect("/menu");
    }

    // Redirect to slug-based URL
    const slug = generateSlug(product.product_name);
    redirect(`/menu/${productId}/${slug}`);
  } catch (error) {
    console.error("Error fetching product:", error);
    redirect("/menu");
  }
}

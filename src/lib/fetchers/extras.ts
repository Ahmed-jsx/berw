// Server-side fetcher for extras
import { Extra } from "@/hooks/useExtras";

export interface ExtraApiResponse {
  extra_id: number;
  extra_name: string;
  extra_description: string | null;
  extra_price: string;
  created_at: string;
  updated_at: string;
}

function mapExtra(api: ExtraApiResponse): Extra {
  return {
    id: api.extra_id,
    name: api.extra_name,
    description: api.extra_description,
    price: Number.parseFloat(api.extra_price),
    createdAt: new Date(api.created_at),
    updatedAt: new Date(api.updated_at),
  };
}

export async function fetchExtras(): Promise<Extra[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const res = await fetch(`${API_URL}/extras`, {
    cache: "default",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch extras");
  }

  const data = await res.json() as ExtraApiResponse[];
  return data.map(mapExtra);
}


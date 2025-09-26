import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Raw API type
export interface ExtraApiResponse {
  extra_id: number;
  extra_name: string;
  extra_description: string | null;
  extra_price: string;
  created_at: string;
  updated_at: string;
}

export interface Extra {
  id: number;
  name: string;
  description: string | null;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

// 
function mapExtra(api: ExtraApiResponse): Extra {
  return {
    id: api.extra_id,
    name: api.extra_name,
    description: api.extra_description,
    price: parseFloat(api.extra_price),
    createdAt: new Date(api.created_at),
    updatedAt: new Date(api.updated_at),
  };
}

// Fetcher
async function fetchExtras(): Promise<Extra[]> {
  const { data } = await axios.get<ExtraApiResponse[]>(`${process.env.NEXT_PUBLIC_API_URL}/extras`);
  return data.map(mapExtra);
}

// Hook
export function useExtras() {
  return useQuery<Extra[], Error>({
    queryKey: ["extras"],
    queryFn: fetchExtras,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
}

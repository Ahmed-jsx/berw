import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ExtraCreate {
  extraName: string;
  extra_description: string | null;
  extraPrice: number;
}
export interface ExtraUpdate {
  extraId: number;
  extraName: string;
  extra_description: string | null;
  extraPrice: number;
}
//
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

// Fetcher
async function fetchExtras(): Promise<Extra[]> {
  const { data } = await axios.get<ExtraApiResponse[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/extras`
  );
  return data.map(mapExtra);
}
async function fetchExtraById(id: number): Promise<Extra> {
  const { data } = await axios.get<ExtraApiResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/extras/${id}`
  );
  return mapExtra(data);
}

async function createExtra(extra: ExtraCreate): Promise<Extra> {
  const { data } = await axios.post<ExtraApiResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/extras`,
    extra
  );
  return mapExtra(data);
}

async function updateExtra(extra: ExtraUpdate): Promise<Extra> {
  const { data } = await axios.put<ExtraApiResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/extras/${extra.extraId}`,
    extra
  );
  return mapExtra(data);
}

async function deleteExtra(id: number): Promise<void> {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/extras/${id}`);
}

// Hook
export function useExtras() {
  return useQuery<Extra[], Error>({
    queryKey: ["extras"],
    queryFn: fetchExtras,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
}
export function useExtraById(id: number) {
  return useQuery<Extra, Error>({
    queryKey: ["extra", id],
    queryFn: () => fetchExtraById(id),
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    enabled: !!id, // only fetch if id exists
  });
}

export function UseCreateExtra() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExtra,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extras"] });
    },
  });
}
export function UseUpdateExtra() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExtra,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["extras"] });
      queryClient.invalidateQueries({ queryKey: ["extra", data.id] });
    },
  });
}
export function UseDeleteExtra() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExtra,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extras"] });
    },
  });
}

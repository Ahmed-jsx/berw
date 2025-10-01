import { apiFetch } from "@/lib/api";
import { UserDetails, UsersResponse } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

// Fetcher function
export async function fetchUsers(): Promise<UsersResponse> {
  return apiFetch<UsersResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/all`
  );
}

export async function fetchUserById(id: number): Promise<UserDetails> {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/user-details/${id}`
    );
    if (!res.ok) throw new Error("Failed to fetch user");
    const json = await res.json();
    return json.user_details;
  }
  
  export function useUserById(id: number) {
    return useQuery<UserDetails>({
      queryKey: ["user", id],
      queryFn: () => fetchUserById(id),
      enabled: !!id,
    });
  }


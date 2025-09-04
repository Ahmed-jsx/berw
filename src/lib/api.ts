import { useAuthStore } from "@/store/auth-store";

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = useAuthStore.getState().token;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) throw new Error("API error");
  return res.json();
};

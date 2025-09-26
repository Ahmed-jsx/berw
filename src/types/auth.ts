// types/auth.ts
export interface User {
  id: number;
  name: string;
  email: string;
  number: string;
  role: "user" | "admin"; // add more roles if needed
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  number: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string[]>;
}

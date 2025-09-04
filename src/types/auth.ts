// types/auth.ts
export interface User {
    id: string;
    user_email: string;
    user_name: string;
    user_number: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface LoginRequest {
    user_email: string; // Based on your Postman request
    password: string;
  }
  
  export interface RegisterRequest {
    user_email: string;
    password: string;
    user_name: string;
    user_number: string;
  }
  
  export interface AuthResponse {
    message: string;
    token: string; // JWT token from backend (main field from your API)
    user?: User; // Optional - if backend sends user data
  }
  
  export interface ApiError {
    message: string;
    code: string;
    details?: Record<string, string[]>;
  }
// types/auth.ts
export interface User {
    user_id: string;
    user_email: string;
    user_name: string;
    user_number: string;
    role: 'user' | 'admin';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface LoginRequest {
    user_email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    user_email: string;
    password: string;
    user_name: string;
    user_number: string;
  }
  
  export interface AuthResponse {
    user: User;
    csrfToken: string;
  }
  
  export interface ApiError {
    message: string;
    code: string;
    details?: Record<string, string[]>;
  }
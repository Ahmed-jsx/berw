// types/auth.ts
export interface User {
    id: number;
    name: string;
    email: string;
    number: string;
    role: "user" | "admin"; // add more roles if needed
    created_at?: string;
    updated_at?: string;
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
  export interface UsersResponse {
    message: string;
    users: User[];
  }  
  export interface OrderItem {
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }
  
  export interface Order {
    order_id: number;
    order_code: string;
    total_price: number;
    created_at: string;
    status: string;
    items: OrderItem[];
  }
  export interface UserDetail {
    id: number;
    user_name: string;
    user_email: string;
    user_number: string;
    is_new: boolean;
    has_points: boolean;
    created_at: string;
    updated_at: string;
    is_admin: boolean;
    points: number;
    points_redeemed: number;
    visits_per_week: number;
    total_orders: number;
    total_spent: number;
    avg_order_value: number;
    preferred_products: string[] | null;
    preferred_categories: string[] | null;
    preferred_extras: string[] | null;
    last_purchase_date: string | null;
    last_visit: string | null;
    google_id: string | null;
  }
  export interface UserDetails {
    user: UserDetail;
    orders_count: number;
    last_order_date: string | null;
    avg_order_value: number;
    total_spent: number;
    favorite_category: string | null;
    favorite_extras: string[];
    recent_orders: Order[];
    last_visit: string | null;
    preferred_categories: string[];
    preferred_extras: string[];
    points_balance: number;
    points_redeemed: number;
    has_points: boolean;
  }
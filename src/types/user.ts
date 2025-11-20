export interface User {
  is_frequent_visitor: any;
  id: number;
  user_name: string;
  user_email: string;
  user_number: string;
  is_new: boolean;
  has_points: boolean;
  created_at: string;
  updated_at: string;
  google_id: string | null;
  is_admin: boolean;
  is_cashier: boolean;
  points: number;
  points_redeemed: number;
  visits_per_week: number;
  role: "user" | "admin" | "cashier";
  total_orders: number;
  total_spent: number;
  avg_order_value: number;
  preferred_products: string[] | null;
  last_purchase_date: string | null;
  preferred_categories: string[] | null;
  preferred_extras: string[] | null;
  last_visit: string | null;
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
  status: 'pending' | 'completed' | 'cancelled' | 'processing';
  items: OrderItem[];
}

export interface UserDetails {
  user: User;
  orders_count: number;
  last_order_date: string | null;
  avg_order_value: number;
  total_spent: number;
  favorite_products: string[];
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

export interface UsersResponse {
  message: string;
  users: User[];
}

export interface UserDetailsResponse {
  message: string;
  user_details: UserDetails;
}
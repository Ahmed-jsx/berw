// types/order.ts

export interface OrderExtra {
  extra_id: number;
  extra_name: string;
  extra_price: number;
}

export interface OrderItem {
  order_item_id?: number;
  product_id: number;
  product_name?: string;
  product_category?: string;
  quantity: number;
  product_price?: number;
  item_total?: number;
  extras: OrderExtra[];
}

export interface CheckoutItem {
  product_id: number;
  quantity: number;
  extras: number[]; 
}

export interface Order {
  order_id: number;
  order_status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  total_price: number;
  points_earned: number;
  points_redeemed: number;
  order_code: string;
  user_id?: number;
  user_name?: string;
  user_email?: string;
  user_number?: string;
  user_points?: number;
  can_redeem_points?: boolean;
  items: OrderItem[];
  items_subtotal?: number;
  extras_subtotal?: number;
  discount_type?: 'percentage' | 'amount';
  discount_value?: number;
}

export interface CheckoutRequest {
  user_id: number;
  items: CheckoutItem[];
}

export interface CheckoutResponse {
  message: string;
  order_id: number;
  order_code: string;
  total_price: number | string; // Can be string from API, will be converted
}

export interface OrderSearchParams {
  code?: string;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
export interface Product {
  product_id: number;
  product_name: string;
  product_components: string;
  product_price: string; // comes as string from API
  product_category: string;
  product_photo: string;
  is_featured: boolean;
  has_points: boolean;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
    message: string;
    products: Product[];
  }
  
  export interface ProductResponse {
    message: string;
    product: Product;
  }
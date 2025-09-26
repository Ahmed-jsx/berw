export interface ExtraApiResponse {
    extra_id: number;
    extra_name: string;
    extra_description: string | null;
    extra_price: string;
    created_at: string;
    updated_at: string;
  }
  
  // Transformed type for app usage
  export interface Extra {
    id: number;
    name: string;
    description: string | null;
    price: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Mapper
  export function mapExtra(api: ExtraApiResponse): Extra {
    return {
      id: api.extra_id,
      name: api.extra_name,
      description: api.extra_description,
      price: parseFloat(api.extra_price),
      createdAt: new Date(api.created_at),
      updatedAt: new Date(api.updated_at),
    };
  }
export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  FOOD = 'food',
  HOME = 'home',
  BEAUTY = 'beauty',
  SPORTS = 'sports',
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
  OUT_OF_STOCK = 'out_of_stock',
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  rating: number; // 0-5
  reviewCount: number;
  imageUrl: string;
  status: ProductStatus;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: ProductCategory;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  outOfStock: number;
  averageRating: number;
  totalRevenue: number;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  imageUrl: string;
  sku: string;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  category?: ProductCategory;
  price?: number;
  stock?: number;
  imageUrl?: string;
  status?: ProductStatus;
}

// API Response types
export type ProductListResponse = {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
};

export type ProductDetailResponse = Product;

import type { Product } from 'domain/products/types';
import { ProductCategory, ProductStatus } from 'domain/products/types';

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop',
    price: 1200,
    category: ProductCategory.ELECTRONICS,
    stock: 15,
    imageUrl: '/assets/products/laptop.jpg',
    status: ProductStatus.ACTIVE,
    rating: 4.5,
    reviewCount: 128,
    sku: 'LAPTOP-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Headphones',
    description: 'Wireless headphones',
    price: 150,
    category: ProductCategory.ELECTRONICS,
    stock: 50,
    imageUrl: '/assets/products/headphones.jpg',
    status: ProductStatus.ACTIVE,
    rating: 4.2,
    reviewCount: 95,
    sku: 'HEAD-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Monitor',
    description: '4K Monitor',
    price: 400,
    category: ProductCategory.ELECTRONICS,
    stock: 20,
    imageUrl: '/assets/products/monitor.jpg',
    status: ProductStatus.ACTIVE,
    rating: 4.7,
    reviewCount: 64,
    sku: 'MONITOR-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface ProductFilters {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const mockProductsService = {
  getProducts: (filters: ProductFilters) => {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;

    let filtered = mockProducts;

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const items = filtered.slice(start, end);

    return {
      items,
      total,
      page,
      pageSize,
    };
  },

  getProductById: (id: string): Product => {
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Product not found');
    return product;
  },

  createProduct: (data: Partial<Product>): Product => {
    const product: Product = {
      id: `prod_${Date.now()}`,
      name: data.name || 'New Product',
      description: data.description || '',
      price: data.price || 0,
      category: data.category || ProductCategory.ELECTRONICS,
      stock: data.stock || 0,
      imageUrl: data.imageUrl || '',
      status: data.status || ProductStatus.ACTIVE,
      rating: data.rating || 0,
      reviewCount: data.reviewCount || 0,
      sku: data.sku || `SKU_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockProducts.push(product);
    return product;
  },

  updateProduct: (id: string, data: Partial<Product>): Product => {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    mockProducts[index] = {
      ...mockProducts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockProducts[index];
  },

  deleteProduct: (id: string) => {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    mockProducts.splice(index, 1);
    return { success: true };
  },
};

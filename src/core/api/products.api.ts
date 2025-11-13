import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from 'domain/products/types';
import { mockProductsService } from './mock/products-service';

interface ProductsListResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}

interface ProductFilters {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsListResponse, ProductFilters>({
      queryFn: (filters) => {
        const data = mockProductsService.getProducts(filters);
        return { data };
      },
      providesTags: ['Products'],
    }),

    getProductById: builder.query<{ data: Product }, string>({
      queryFn: (id) => {
        const data = mockProductsService.getProductById(id);
        return { data: { data } };
      },
      providesTags: (_, __, id) => [{ type: 'Products', id }],
    }),

    createProduct: builder.mutation<{ data: Product }, Partial<Product>>({
      queryFn: (data) => {
        const result = mockProductsService.createProduct(data);
        return { data: { data: result } };
      },
      invalidatesTags: ['Products'],
    }),

    updateProduct: builder.mutation<{ data: Product }, { id: string; data: Partial<Product> }>({
      queryFn: ({ id, data }) => {
        const result = mockProductsService.updateProduct(id, data);
        return { data: { data: result } };
      },
      invalidatesTags: (_, __, { id }) => [{ type: 'Products', id }, 'Products'],
    }),

    deleteProduct: builder.mutation<{ success: boolean }, string>({
      queryFn: (id) => {
        const data = mockProductsService.deleteProduct(id);
        return { data };
      },
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;

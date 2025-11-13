import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product } from 'domain/products/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/products`,
    credentials: 'include',
  }),
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsListResponse, ProductFilters>({
      query: (filters) => ({
        url: '/list',
        params: filters,
      }),
      providesTags: ['Products'],
    }),

    getProductById: builder.query<{ data: Product }, string>({
      query: (id) => `/${id}`,
      providesTags: (_, __, id) => [{ type: 'Products', id }],
    }),

    createProduct: builder.mutation<{ data: Product }, Partial<Product>>({
      query: (data) => ({
        url: '/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),

    updateProduct: builder.mutation<{ data: Product }, { id: string; data: Partial<Product> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: 'Products', id }, 'Products'],
    }),

    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
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

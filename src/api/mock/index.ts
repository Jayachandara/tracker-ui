/**
 * Mock data for transactions
 * Used during development and testing when API is not available
 *
 * This mirrors the structure used in api/endpoints/transactions.api.ts
 * but returns mock data instead of making real HTTP calls.
 */

import { Transaction } from 'domain/transactions/types';
import { TransactionType, TransactionCategory } from 'core/types';

export const transactionsMockData: Transaction[] = [
  {
    id: '1',
    userId: 'user-1',
    type: TransactionType.INCOME,
    category: TransactionCategory.SALARY,
    amount: 5000,
    currency: 'USD',
    description: 'Monthly salary',
    date: '2024-01-15',
    account: 'Checking',
    status: 'completed',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    userId: 'user-1',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.FOOD,
    amount: 250,
    currency: 'USD',
    description: 'Weekly groceries',
    date: '2024-01-16',
    account: 'Checking',
    status: 'completed',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: '3',
    userId: 'user-1',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.UTILITIES,
    amount: 120,
    currency: 'USD',
    description: 'Electricity bill',
    date: '2024-01-17',
    account: 'Checking',
    status: 'completed',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
  {
    id: '4',
    userId: 'user-1',
    type: TransactionType.INCOME,
    category: TransactionCategory.OTHER,
    amount: 1500,
    currency: 'USD',
    description: 'Freelance project payment',
    date: '2024-01-18',
    account: 'Checking',
    status: 'completed',
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
  },
  {
    id: '5',
    userId: 'user-1',
    type: TransactionType.EXPENSE,
    category: TransactionCategory.ENTERTAINMENT,
    amount: 80,
    currency: 'USD',
    description: 'Movie tickets',
    date: '2024-01-19',
    account: 'Checking',
    status: 'completed',
    createdAt: '2024-01-19T18:20:00Z',
    updatedAt: '2024-01-19T18:20:00Z',
  },
];

/**
 * Mock data for products
 * Used during development and testing
 */

import { Product, ProductStatus, ProductCategory } from 'domain/products/types';

export const productsMockData: Product[] = [
  {
    id: '1',
    name: 'Laptop Pro',
    description: 'High-performance laptop for professionals',
    category: ProductCategory.ELECTRONICS,
    price: 1299.99,
    stock: 15,
    rating: 4.8,
    reviewCount: 324,
    imageUrl: '/assets/products/laptop.jpg',
    status: ProductStatus.ACTIVE,
    sku: 'LAPTOP-001',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-19T15:30:00Z',
  },
  {
    id: '2',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with silent clicks',
    category: ProductCategory.ELECTRONICS,
    price: 49.99,
    stock: 120,
    rating: 4.5,
    reviewCount: 156,
    imageUrl: '/assets/products/mouse.jpg',
    status: ProductStatus.ACTIVE,
    sku: 'MOUSE-001',
    createdAt: '2024-01-02T11:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z',
  },
  {
    id: '3',
    name: 'Winter Jacket',
    description: 'Warm and stylish winter jacket',
    category: ProductCategory.CLOTHING,
    price: 199.99,
    stock: 0,
    rating: 4.3,
    reviewCount: 89,
    imageUrl: '/assets/products/jacket.jpg',
    status: ProductStatus.OUT_OF_STOCK,
    sku: 'JACKET-001',
    createdAt: '2024-01-03T09:00:00Z',
    updatedAt: '2024-01-19T08:30:00Z',
  },
];

/**
 * Mock data for users
 * Used during development and testing
 */

import { User, UserRole, UserStatus } from 'domain/users/types';

export const usersMockData: User[] = [
  {
    id: 'user-1',
    email: 'admin@tracker.app',
    firstName: 'Admin',
    lastName: 'User',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    phone: '+1-555-0100',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001',
    },
    metadata: {
      loginCount: 342,
      lastLogin: '2024-01-19T20:15:00Z',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-19T20:15:00Z',
  },
  {
    id: 'user-2',
    email: 'john@tracker.app',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    phone: '+1-555-0101',
    metadata: {
      loginCount: 156,
    },
    createdAt: '2024-01-05T10:30:00Z',
    updatedAt: '2024-01-18T14:22:00Z',
  },
  {
    id: 'user-3',
    email: 'jane@tracker.app',
    firstName: 'Jane',
    lastName: 'Smith',
    role: UserRole.MODERATOR,
    status: UserStatus.ACTIVE,
    metadata: {
      loginCount: 98,
    },
    createdAt: '2024-01-10T15:45:00Z',
    updatedAt: '2024-01-19T11:30:00Z',
  },
];

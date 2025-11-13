export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  PENDING = 'pending',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  metadata?: {
    lastLogin?: string;
    loginCount: number;
    preferences?: Record<string, unknown>;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string; // search by email or name
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminCount: number;
  userCount: number;
}

export interface CreateUserDTO {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  status?: UserStatus;
  role?: UserRole;
  address?: User['address'];
  preferences?: Record<string, unknown>;
}

export interface AuthDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

// API Response types
export type UserListResponse = {
  items: User[];
  total: number;
  page: number;
  pageSize: number;
};

export type UserDetailResponse = User;

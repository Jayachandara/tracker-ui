import type { User } from 'domain/users/types';
import { UserRole, UserStatus } from 'domain/users/types';

const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    avatar: '/assets/avatar/user1.jpg',
    phone: '+1234567890',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    avatar: '/assets/avatar/user2.jpg',
    phone: '+0987654321',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'bob@example.com',
    firstName: 'Bob',
    lastName: 'Johnson',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    avatar: '/assets/avatar/user3.jpg',
    phone: '+1122334455',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface UserFilters {
  role?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const mockUsersService = {
  getUsers: (filters: UserFilters) => {
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 10;

    let filtered = mockUsers;

    if (filters.role) {
      filtered = filtered.filter(u => u.role === filters.role);
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        u =>
          `${u.firstName} ${u.lastName}`.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
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

  getUserById: (id: string): User => {
    const user = mockUsers.find(u => u.id === id);
    if (!user) throw new Error('User not found');
    return user;
  },

  getCurrentUser: (): User => {
    return mockUsers[0];
  },

  updateUser: (id: string, data: Partial<User>): User => {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers[index] = {
      ...mockUsers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return mockUsers[index];
  },

  deleteUser: (id: string) => {
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers.splice(index, 1);
    return { success: true };
  },
};

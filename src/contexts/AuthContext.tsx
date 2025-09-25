import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Admin',
    email: 'admin@bakery.com',
    role: 'admin',
    createdAt: '2024-01-01',
    isActive: true,
  },
  {
    id: '2',
    name: 'Sarah Manager',
    email: 'manager@bakery.com',
    role: 'manager',
    createdAt: '2024-01-01',
    isActive: true,
  },
  {
    id: '3',
    name: 'Mike Staff',
    email: 'staff@bakery.com',
    role: 'staff',
    createdAt: '2024-01-01',
    isActive: true,
  },
];

const rolePermissions = {
  admin: ['manage_users', 'manage_company', 'manage_items', 'view_reports', 'manage_sales', 'view_all_sales'],
  manager: ['manage_items', 'view_reports', 'manage_sales', 'view_all_sales', 'manage_bulk_orders'],
  staff: ['make_sales', 'view_stock', 'view_own_sales'],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('bakery_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - in real app, this would call an API
    const foundUser = mockUsers.find(u => u.email === email);
    
    // Simple password check (password is same as role for demo)
    if (foundUser && password === foundUser.role) {
      setUser(foundUser);
      localStorage.setItem('bakery_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bakery_user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
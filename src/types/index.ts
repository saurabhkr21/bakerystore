export type UserRole = 'admin' | 'manager' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  isActive: boolean;
}

export interface BakeryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  description: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  discount: number;
  finalTotal: number;
  customerName?: string;
  customerPhone?: string;
  staffId: string;
  staffName: string;
  createdAt: string;
  paymentMethod: 'cash' | 'card' | 'upi';
}

export interface SaleItem {
  itemId: string;
  itemName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface BulkOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  items: SaleItem[];
  total: number;
  advancePaid: number;
  balanceAmount: number;
  deliveryDate: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  todaySales: number;
  weeklySales: number;
  monthlySales: number;
  totalItems: number;
  lowStockItems: number;
  totalStaff: number;
  dailySalesData: { date: string; sales: number }[];
  topSellingItems: { name: string; quantity: number; revenue: number }[];
}

export interface StockMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'in' | 'out' | 'sale' | 'waste';
  quantity: number;
  reason: string;
  staffId: string;
  staffName: string;
  createdAt: string;
}

export interface Company {
  name: string;
  address: string;
  phone: string;
  email: string;
  gst?: string;
  logo?: string;
}
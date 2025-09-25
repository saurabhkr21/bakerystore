import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  Store,
  ClipboardList,
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
    permissions: ['manage_items', 'make_sales'],
  },
  {
    title: 'Inventory',
    url: '/inventory',
    icon: Package,
    permissions: ['manage_items'],
  },
  {
    title: 'Sales/POS',
    url: '/sales',
    icon: ShoppingCart,
    permissions: ['make_sales', 'manage_sales'],
  },
  {
    title: 'Bulk Orders',
    url: '/bulk-orders',
    icon: ClipboardList,
    permissions: ['manage_bulk_orders', 'manage_sales'],
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: BarChart3,
    permissions: ['view_reports'],
  },
  {
    title: 'User Management',
    url: '/users',
    icon: Users,
    permissions: ['manage_users'],
  },
  {
    title: 'Company Settings',
    url: '/settings',
    icon: Settings,
    permissions: ['manage_company', 'manage_items'],
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasPermission } = useAuth();
  const { state } = useSidebar();

  const filteredItems = navigationItems.filter(item =>
    item.permissions.some(permission => hasPermission(permission))
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
          {state === 'expanded' && (
            <div>
              <h2 className="text-lg font-semibold">Sweet Bakery</h2>
              <p className="text-sm text-muted-foreground">{user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    isActive={isActive(item.url)}
                    className="w-full justify-start"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, UserRole } from '@/types';
import { Plus, Users, Shield, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const mockUsers: User[] = [
  { id: '1', name: 'John Admin', email: 'admin@bakery.com', role: 'admin', createdAt: '2024-01-01', isActive: true },
  { id: '2', name: 'Sarah Manager', email: 'manager@bakery.com', role: 'manager', createdAt: '2024-01-01', isActive: true },
  { id: '3', name: 'Mike Staff', email: 'staff@bakery.com', role: 'staff', createdAt: '2024-01-01', isActive: true },
];

export default function UserManagement() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const canManageUsers = hasPermission('manage_users');

  if (!canManageUsers) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Access Restricted</h2>
        <p className="text-muted-foreground">Only administrators can manage users.</p>
      </div>
    );
  }

  const getRoleBadge = (role: UserRole) => {
    const variants = {
      admin: 'destructive' as const,
      manager: 'default' as const,
      staff: 'secondary' as const,
    };
    
    return <Badge variant={variants[role]} className="capitalize">{role}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage system users and their permissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label>Name</Label><Input placeholder="Enter name" /></div>
              <div><Label>Email</Label><Input type="email" placeholder="Enter email" /></div>
              <div>
                <Label>Role</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getRoleBadge(user.role)}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Edit2 className="w-3 h-3" /></Button>
                    <Button variant="outline" size="sm" className="text-destructive"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
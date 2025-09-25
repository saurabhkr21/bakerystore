import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { mockBulkOrders, mockItems } from '@/data/mockData';
import { BulkOrder, SaleItem } from '@/types';
import {
  Plus,
  Search,
  Calendar as CalendarIcon,
  Package,
  IndianRupee,
  Clock,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function BulkOrders() {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<BulkOrder[]>(mockBulkOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<SaleItem[]>([]);
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    customerPhone: '',
    advancePaid: 0,
    notes: '',
  });

  const canManageBulkOrders = hasPermission('manage_bulk_orders') || hasPermission('manage_sales');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: BulkOrder['status']) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-warning' },
      confirmed: { variant: 'default' as const, icon: CheckCircle, color: 'text-success' },
      completed: { variant: 'outline' as const, icon: CheckCircle, color: 'text-success' },
      cancelled: { variant: 'destructive' as const, icon: XCircle, color: 'text-destructive' },
    };
    
    const { variant, icon: Icon, color } = variants[status];
    
    return (
      <Badge variant={variant} className="capitalize">
        <Icon className={`w-3 h-3 mr-1 ${color}`} />
        {status}
      </Badge>
    );
  };

  const addItemToOrder = (itemId: string) => {
    const item = mockItems.find(i => i.id === itemId);
    if (!item) return;

    const existingItem = selectedItems.find(si => si.itemId === itemId);
    if (existingItem) {
      setSelectedItems(selectedItems.map(si =>
        si.itemId === itemId
          ? { ...si, quantity: si.quantity + 1, total: (si.quantity + 1) * si.price }
          : si
      ));
    } else {
      setSelectedItems([...selectedItems, {
        itemId: item.id,
        itemName: item.name,
        quantity: 1,
        price: item.price,
        total: item.price,
      }]);
    }
  };

  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setSelectedItems(selectedItems.filter(si => si.itemId !== itemId));
      return;
    }

    setSelectedItems(selectedItems.map(si =>
      si.itemId === itemId
        ? { ...si, quantity, total: quantity * si.price }
        : si
    ));
  };

  const handleCreateOrder = () => {
    if (!newOrder.customerName || !newOrder.customerPhone || !deliveryDate || selectedItems.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and add items",
        variant: "destructive",
      });
      return;
    }

    const total = selectedItems.reduce((sum, item) => sum + item.total, 0);
    const order: BulkOrder = {
      id: Date.now().toString(),
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      items: [...selectedItems],
      total,
      advancePaid: newOrder.advancePaid,
      balanceAmount: total - newOrder.advancePaid,
      deliveryDate: deliveryDate.toISOString(),
      status: 'pending',
      notes: newOrder.notes,
      createdAt: new Date().toISOString(),
    };

    setOrders([order, ...orders]);
    
    // Reset form
    setNewOrder({
      customerName: '',
      customerPhone: '',
      advancePaid: 0,
      notes: '',
    });
    setSelectedItems([]);
    setDeliveryDate(undefined);
    setIsAddDialogOpen(false);

    toast({
      title: "Bulk Order Created",
      description: `Order for ${order.customerName} has been created`,
    });
  };

  const updateOrderStatus = (orderId: string, status: BulkOrder['status']) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
    
    toast({
      title: "Status Updated",
      description: `Order status changed to ${status}`,
    });
  };

  if (!canManageBulkOrders) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Access Restricted</h2>
        <p className="text-muted-foreground">You don't have permission to manage bulk orders.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bulk Orders</h1>
          <p className="text-muted-foreground">
            Manage large orders and catering requests
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Bulk Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Bulk Order</DialogTitle>
              <DialogDescription>
                Create a new bulk order for parties, events, or large purchases
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={newOrder.customerName}
                    onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone Number *</Label>
                  <Input
                    id="customerPhone"
                    value={newOrder.customerPhone}
                    onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Delivery Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !deliveryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deliveryDate ? format(deliveryDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={deliveryDate}
                        onSelect={setDeliveryDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="advancePaid">Advance Payment (₹)</Label>
                  <Input
                    id="advancePaid"
                    type="number"
                    value={newOrder.advancePaid}
                    onChange={(e) => setNewOrder({ ...newOrder, advancePaid: Number(e.target.value) })}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newOrder.notes}
                  onChange={(e) => setNewOrder({ ...newOrder, notes: e.target.value })}
                  placeholder="Special instructions, delivery details, etc."
                />
              </div>

              <div>
                <Label>Add Items</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <h4 className="font-medium mb-2">Available Items</h4>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {mockItems.map(item => (
                        <div 
                          key={item.id}
                          className="p-2 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                          onClick={() => addItemToOrder(item.id)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-medium text-sm">{item.name}</h5>
                              <p className="text-xs text-muted-foreground">{item.category}</p>
                            </div>
                            <Badge variant="outline">₹{item.price}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Selected Items</h4>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {selectedItems.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No items selected
                        </p>
                      ) : (
                        selectedItems.map(item => (
                          <div key={item.itemId} className="p-2 bg-primary/10 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <h5 className="font-medium text-sm">{item.itemName}</h5>
                                <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateItemQuantity(item.itemId, item.quantity - 1)}
                                  className="h-6 w-6 p-0"
                                >
                                  -
                                </Button>
                                <span className="text-sm w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateItemQuantity(item.itemId, item.quantity + 1)}
                                  className="h-6 w-6 p-0"
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs font-medium mt-1">Total: ₹{item.total}</p>
                          </div>
                        ))
                      )}
                    </div>
                    {selectedItems.length > 0 && (
                      <div className="mt-2 p-2 bg-primary/20 rounded-lg">
                        <p className="font-bold">
                          Grand Total: ₹{selectedItems.reduce((sum, item) => sum + item.total, 0)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrder}>
                Create Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance Due</CardTitle>
            <IndianRupee className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ₹{orders.reduce((sum, order) => sum + order.balanceAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Outstanding amount</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by customer name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.customerName}</CardTitle>
                  <CardDescription>{order.customerPhone}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                  <Select
                    value={order.status}
                    onValueChange={(status: BulkOrder['status']) => updateOrderStatus(order.id, status)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Order Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Delivery Date:</span> {new Date(order.deliveryDate).toLocaleDateString()}</p>
                    <p><span className="text-muted-foreground">Total Items:</span> {order.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                    <p><span className="text-muted-foreground">Order Total:</span> ₹{order.total}</p>
                    <p><span className="text-muted-foreground">Advance Paid:</span> ₹{order.advancePaid}</p>
                    <p><span className="text-muted-foreground">Balance Due:</span> <span className="font-medium text-destructive">₹{order.balanceAmount}</span></p>
                  </div>
                  {order.notes && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">Notes:</p>
                      <p className="text-sm">{order.notes}</p>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium mb-2">Items</h4>
                  <div className="space-y-1">
                    {order.items.map(item => (
                      <div key={item.itemId} className="flex justify-between text-sm">
                        <span>{item.itemName} × {item.quantity}</span>
                        <span>₹{item.total}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <span className="text-xs text-muted-foreground">
                  Created: {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No bulk orders found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Start by creating your first bulk order'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
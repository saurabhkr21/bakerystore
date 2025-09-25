import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { mockItems, mockSales } from '@/data/mockData';
import { BakeryItem, Sale, SaleItem } from '@/types';
import {
  Plus,
  Minus,
  ShoppingCart,
  Receipt,
  Trash2,
  Search,
  CreditCard,
  Banknote,
  Smartphone,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Sales() {
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const [items] = useState<BakeryItem[]>(mockItems);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [discount, setDiscount] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const canMakeSales = hasPermission('make_sales') || hasPermission('manage_sales');

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const finalTotal = cartTotal - discount;

  const addToCart = (item: BakeryItem) => {
    if (item.stock === 0) {
      toast({
        title: "Out of Stock",
        description: `${item.name} is currently out of stock`,
        variant: "destructive",
      });
      return;
    }

    const existingItem = cart.find(cartItem => cartItem.itemId === item.id);
    
    if (existingItem) {
      if (existingItem.quantity >= item.stock) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${item.stock} ${item.name} available`,
          variant: "destructive",
        });
        return;
      }
      
      setCart(cart.map(cartItem => 
        cartItem.itemId === item.id 
          ? { 
              ...cartItem, 
              quantity: cartItem.quantity + 1,
              total: (cartItem.quantity + 1) * cartItem.price
            }
          : cartItem
      ));
    } else {
      setCart([...cart, {
        itemId: item.id,
        itemName: item.name,
        quantity: 1,
        price: item.price,
        total: item.price,
      }]);
    }
  };

  const updateCartItem = (itemId: string, quantity: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    if (quantity === 0) {
      setCart(cart.filter(cartItem => cartItem.itemId !== itemId));
      return;
    }

    if (quantity > item.stock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${item.stock} ${item.name} available`,
        variant: "destructive",
      });
      return;
    }

    setCart(cart.map(cartItem => 
      cartItem.itemId === itemId 
        ? { 
            ...cartItem, 
            quantity,
            total: quantity * cartItem.price
          }
        : cartItem
    ));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
    setDiscount(0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        variant: "destructive",
      });
      return;
    }

    const newSale: Sale = {
      id: Date.now().toString(),
      items: [...cart],
      total: cartTotal,
      discount,
      finalTotal,
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      staffId: user!.id,
      staffName: user!.name,
      createdAt: new Date().toISOString(),
      paymentMethod,
    };

    setSales([newSale, ...sales]);
    
    toast({
      title: "Sale Completed",
      description: `Sale of ₹${finalTotal} completed successfully`,
    });

    clearCart();
    setIsCheckoutOpen(false);
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'cash': return <Banknote className="w-4 h-4" />;
      case 'card': return <CreditCard className="w-4 h-4" />;
      case 'upi': return <Smartphone className="w-4 h-4" />;
      default: return <Banknote className="w-4 h-4" />;
    }
  };

  if (!canMakeSales) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Access Restricted</h2>
        <p className="text-muted-foreground">You don't have permission to access the POS system.</p>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Items Selection */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Point of Sale</h1>
          <p className="text-muted-foreground">Select items to add to cart</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredItems.map((item) => (
            <Card 
              key={item.id} 
              className={`cursor-pointer hover:shadow-md transition-all ${
                item.stock === 0 ? 'opacity-50' : 'hover:scale-[1.02]'
              }`}
              onClick={() => addToCart(item)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{item.category}</CardDescription>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="mb-1">₹{item.price}</Badge>
                    <p className="text-xs text-muted-foreground">Stock: {item.stock}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {item.stock <= item.minStock && item.stock > 0 && (
                  <Badge variant="secondary" className="mt-2">Low Stock</Badge>
                )}
                {item.stock === 0 && (
                  <Badge variant="destructive" className="mt-2">Out of Stock</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="space-y-6">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Cart is empty
              </p>
            ) : (
              <>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.itemId} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.itemName}</h4>
                        <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItem(item.itemId, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="min-w-[2rem] text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItem(item.itemId, item.quantity + 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCartItem(item.itemId, 0)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="ml-2 text-right">
                        <p className="font-medium">₹{item.total}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount:</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearCart} className="flex-1">
                    Clear
                  </Button>
                  <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex-1">
                        <Receipt className="w-4 h-4 mr-2" />
                        Checkout
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Complete Sale</DialogTitle>
                        <DialogDescription>
                          Review order details and complete the sale
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="customerName">Customer Name (Optional)</Label>
                            <Input
                              id="customerName"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              placeholder="Enter customer name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="customerPhone">Phone (Optional)</Label>
                            <Input
                              id="customerPhone"
                              value={customerPhone}
                              onChange={(e) => setCustomerPhone(e.target.value)}
                              placeholder="Enter phone number"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="discount">Discount (₹)</Label>
                            <Input
                              id="discount"
                              type="number"
                              value={discount}
                              onChange={(e) => setDiscount(Number(e.target.value))}
                              min="0"
                              max={cartTotal}
                            />
                          </div>
                          <div>
                            <Label htmlFor="paymentMethod">Payment Method</Label>
                            <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">
                                  <div className="flex items-center gap-2">
                                    <Banknote className="w-4 h-4" />
                                    Cash
                                  </div>
                                </SelectItem>
                                <SelectItem value="card">
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Card
                                  </div>
                                </SelectItem>
                                <SelectItem value="upi">
                                  <div className="flex items-center gap-2">
                                    <Smartphone className="w-4 h-4" />
                                    UPI
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="bg-muted p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Order Summary</h4>
                          {cart.map((item) => (
                            <div key={item.itemId} className="flex justify-between text-sm">
                              <span>{item.itemName} × {item.quantity}</span>
                              <span>₹{item.total}</span>
                            </div>
                          ))}
                          <Separator className="my-2" />
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>₹{finalTotal}</span>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCheckout}>
                          Complete Sale
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {sales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">₹{sale.finalTotal}</span>
                    <Badge variant="outline" className="text-xs">
                      {getPaymentIcon(sale.paymentMethod)}
                      <span className="ml-1 capitalize">{sale.paymentMethod}</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {sale.items.reduce((sum, item) => sum + item.quantity, 0)} items • {sale.staffName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(sale.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
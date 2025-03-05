
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  ExternalLink,
  Download,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  amount: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: number;
  store: string;
  paymentMethod: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer';
}

const mockOrders: Order[] = [
  {
    id: 'ORD-7652',
    customer: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    date: '2025-04-21',
    amount: 129.99,
    status: 'processing',
    items: 3,
    store: 'TechGadgetPro',
    paymentMethod: 'credit_card',
  },
  {
    id: 'ORD-7651',
    customer: 'Michael Brown',
    email: 'michael.brown@example.com',
    date: '2025-04-20',
    amount: 79.95,
    status: 'shipped',
    items: 2,
    store: 'FashionTrends',
    paymentMethod: 'paypal',
  },
  {
    id: 'ORD-7650',
    customer: 'Sophia Martinez',
    email: 'sophia.m@example.com',
    date: '2025-04-19',
    amount: 249.99,
    status: 'delivered',
    items: 1,
    store: 'TechGadgetPro',
    paymentMethod: 'apple_pay',
  },
  {
    id: 'ORD-7649',
    customer: 'James Johnson',
    email: 'james.j@example.com',
    date: '2025-04-18',
    amount: 34.50,
    status: 'cancelled',
    items: 1,
    store: 'HomeEssentials',
    paymentMethod: 'credit_card',
  },
  {
    id: 'ORD-7648',
    customer: 'Olivia Davis',
    email: 'olivia.davis@example.com',
    date: '2025-04-17',
    amount: 149.95,
    status: 'delivered',
    items: 4,
    store: 'OutdoorGear',
    paymentMethod: 'google_pay',
  },
  {
    id: 'ORD-7647',
    customer: 'William Taylor',
    email: 'william.t@example.com',
    date: '2025-04-16',
    amount: 89.99,
    status: 'refunded',
    items: 2,
    store: 'BeautyEssentials',
    paymentMethod: 'paypal',
  },
  {
    id: 'ORD-7646',
    customer: 'Ava Anderson',
    email: 'ava.a@example.com',
    date: '2025-04-15',
    amount: 199.50,
    status: 'processing',
    items: 3,
    store: 'TechGadgetPro',
    paymentMethod: 'bank_transfer',
  },
  {
    id: 'ORD-7645',
    customer: 'Ethan Thomas',
    email: 'ethan.t@example.com',
    date: '2025-04-14',
    amount: 59.95,
    status: 'shipped',
    items: 1,
    store: 'FashionTrends',
    paymentMethod: 'credit_card',
  },
  {
    id: 'ORD-7644',
    customer: 'Isabella Jackson',
    email: 'isabella.j@example.com',
    date: '2025-04-13',
    amount: 124.75,
    status: 'delivered',
    items: 2,
    store: 'HomeEssentials',
    paymentMethod: 'apple_pay',
  },
  {
    id: 'ORD-7643',
    customer: 'Mason White',
    email: 'mason.w@example.com',
    date: '2025-04-12',
    amount: 45.25,
    status: 'processing',
    items: 1,
    store: 'OutdoorGear',
    paymentMethod: 'google_pay',
  },
];

const getStatusBadge = (status: Order['status']) => {
  switch (status) {
    case 'processing':
      return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Processing</Badge>;
    case 'shipped':
      return <Badge className="bg-purple-500 text-white hover:bg-purple-600">Shipped</Badge>;
    case 'delivered':
      return <Badge className="bg-green-500 text-white hover:bg-green-600">Delivered</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-500 text-white hover:bg-red-600">Cancelled</Badge>;
    case 'refunded':
      return <Badge className="bg-yellow-500 text-black hover:bg-yellow-600">Refunded</Badge>;
    default:
      return null;
  }
};

const Orders = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Orders & Shipping</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Orders
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-2xl font-bold text-primary">152</div>
                <p className="text-sm text-muted-foreground">New Orders</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-2xl font-bold text-blue-500">87</div>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-2xl font-bold text-green-500">243</div>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="text-2xl font-bold text-red-500">18</div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
            <CardTitle className="text-xl">All Orders</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search orders..."
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Order
                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Customer
                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Date
                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Amount
                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="sr-only">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{order.id}</span>
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{order.customer}</div>
                          <div className="text-xs text-muted-foreground">{order.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(order.amount)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.store}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of <span className="font-medium">100</span> orders
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Orders;

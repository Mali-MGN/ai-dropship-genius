
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { TableEditor } from "@/components/ui/table-editor";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Users, DollarSign, TrendingUp, ArrowRight } from "lucide-react";

const Index = () => {
  const [tableData, setTableData] = useState([
    { id: 1, name: "Wireless Earbuds", category: "Electronics", price: 49.99, stock: 120, status: "In Stock" },
    { id: 2, name: "Fitness Tracker", category: "Electronics", price: 79.99, stock: 75, status: "In Stock" },
    { id: 3, name: "Bamboo Phone Stand", category: "Accessories", price: 12.99, stock: 200, status: "In Stock" },
    { id: 4, name: "Portable Charger", category: "Electronics", price: 34.99, stock: 42, status: "Low Stock" },
    { id: 5, name: "Essential Oil Diffuser", category: "Home", price: 29.99, stock: 85, status: "In Stock" },
    { id: 6, name: "Smart Water Bottle", category: "Fitness", price: 19.99, stock: 10, status: "Low Stock" },
    { id: 7, name: "Laptop Sleeve", category: "Accessories", price: 24.99, stock: 0, status: "Out of Stock" },
    { id: 8, name: "Bluetooth Speaker", category: "Electronics", price: 59.99, stock: 65, status: "In Stock" },
    { id: 9, name: "Plant-Based Protein", category: "Nutrition", price: 39.99, stock: 55, status: "In Stock" },
    { id: 10, name: "Yoga Mat", category: "Fitness", price: 45.99, stock: 30, status: "In Stock" },
  ]);

  const columns = [
    {
      id: "name",
      header: "Product Name",
      accessorKey: "name",
      type: "text" as const,
      width: "200px",
      sortable: true,
      filterable: true,
    },
    {
      id: "category",
      header: "Category",
      accessorKey: "category",
      type: "select" as const,
      width: "150px",
      sortable: true,
      options: ["Electronics", "Accessories", "Home", "Fitness", "Nutrition"],
    },
    {
      id: "price",
      header: "Price",
      accessorKey: "price",
      type: "number" as const,
      width: "120px",
      sortable: true,
      renderCell: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      id: "stock",
      header: "Stock",
      accessorKey: "stock",
      type: "number" as const,
      width: "100px",
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      type: "select" as const,
      options: ["In Stock", "Low Stock", "Out of Stock"],
      width: "130px",
      sortable: true,
      renderCell: (value: string) => {
        const colorMap: Record<string, string> = {
          "In Stock": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          "Low Stock": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
          "Out of Stock": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        };
        
        return (
          <Badge variant="outline" className={`font-normal ${colorMap[value] || ""}`}>
            {value}
          </Badge>
        );
      },
    },
  ];

  const handleDataChange = (newData: any[]) => {
    setTableData(newData);
    console.log("Data updated:", newData);
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your dropshipping platform dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Products"
            value="245"
            change={12}
            icon={<ShoppingCart />}
            description="Last 30 days"
          />
          <StatCard
            title="Total Customers"
            value="1,453"
            change={8}
            icon={<Users />}
            description="Last 30 days"
          />
          <StatCard
            title="Revenue"
            value="$24,568"
            change={24}
            icon={<DollarSign />}
            description="Last 30 days"
          />
          <StatCard
            title="Conversion Rate"
            value="3.6%"
            change={-2}
            icon={<TrendingUp />}
            description="Last 30 days"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Products Overview</CardTitle>
            <CardDescription>
              Manage your product inventory using the table editor below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TableEditor
              columns={columns}
              data={tableData}
              onDataChange={handleDataChange}
              canFilter={true}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="col-span-1">
            <CardHeader className="pb-2">
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link to="/products/discovery" className="group flex items-center justify-between p-2 rounded-md hover:bg-muted">
                  <span>Product Discovery</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link to="/store/management" className="group flex items-center justify-between p-2 rounded-md hover:bg-muted">
                  <span>Store Management</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <Link to="/ai/assistant" className="group flex items-center justify-between p-2 rounded-md hover:bg-muted">
                  <span>AI Assistant</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;


import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { TabsContent, Tabs } from "@/components/ui/tabs";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  UserIcon, 
  Download, 
  RefreshCw, 
  UsersIcon, 
  TrendingUp, 
  MessageCircle, 
  BarChart 
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";

const Customers = () => {
  const [activeTab, setActiveTab] = useState("customers");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Customers & Insights</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Customers
            </Button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="customers" className="gap-2">
              <UsersIcon className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <BarChart className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="engagement" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Engagement
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="customers" className="space-y-6">
            {/* Customer Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <StatCard
                title="Total Customers"
                value="1,286"
                change={8.3}
                icon={<UsersIcon className="h-4 w-4" />}
                description="vs. previous month"
              />
              <StatCard
                title="New Customers"
                value="128"
                change={12.5}
                icon={<UserIcon className="h-4 w-4" />}
                description="this month"
              />
              <StatCard
                title="Repeat Rate"
                value="42%"
                change={3.2}
                icon={<TrendingUp className="h-4 w-4" />}
                description="vs. previous month"
              />
              <StatCard
                title="Avg. LTV"
                value="$242.32"
                change={-1.8}
                icon={<TrendingUp className="h-4 w-4" />}
                description="vs. previous month"
              />
            </div>
            
            {/* Customer List */}
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
                <CardTitle className="text-xl">Your Customers</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search customers..."
                      className="pl-9 w-full sm:w-64"
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-8 text-center">
                  <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
                  <p className="text-muted-foreground">Customer management tools are currently under development.</p>
                  <Button className="mt-4">
                    Import Customers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-8 text-center">
                  <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
                  <p className="text-muted-foreground">Customer insights and analytics will be available here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-8 text-center">
                  <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
                  <p className="text-muted-foreground">Customer engagement tools are under development.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Customers;

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Store, MapPin, Users, Package, DollarSign, TrendingUp, Clock } from "lucide-react";
import type { Brand } from "@/lib/types";

interface Store {
  id: number;
  storeCode: string;
  storeName: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  storeManager?: string;
  storeType: string;
  status: string;
  brand: string;
  operatingHours?: string;
}

interface StoreInventory {
  id: number;
  storeId: number;
  sku: string;
  productName: string;
  category?: string;
  currentStock: number;
  minimumStock?: number;
  retailPrice?: string;
  brand: string;
}

interface StoreSales {
  id: number;
  storeId: number;
  transactionId: string;
  saleDate: string;
  totalAmount: string;
  itemCount: number;
  paymentMethod?: string;
  brand: string;
}

interface StoreStaff {
  id: number;
  storeId: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  position: string;
  status: string;
  brand: string;
}

interface RetailOperationsProps {
  selectedBrand: Brand;
}

export default function RetailOperations({ selectedBrand }: RetailOperationsProps) {
  const [selectedStore, setSelectedStore] = useState<number | null>(null);

  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ["/api/stores", selectedBrand],
    queryFn: async () => {
      const params = selectedBrand !== "all" ? `?brand=${selectedBrand}` : "";
      const res = await fetch(`/api/stores${params}`);
      if (!res.ok) throw new Error("Failed to fetch stores");
      return res.json() as Promise<Store[]>;
    }
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ["/api/store-inventory", selectedBrand, selectedStore],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedBrand !== "all") params.append("brand", selectedBrand);
      if (selectedStore) params.append("storeId", selectedStore.toString());
      
      const res = await fetch(`/api/store-inventory?${params}`);
      if (!res.ok) throw new Error("Failed to fetch inventory");
      return res.json() as Promise<StoreInventory[]>;
    }
  });

  const { data: sales = [] } = useQuery({
    queryKey: ["/api/store-sales", selectedBrand, selectedStore],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedBrand !== "all") params.append("brand", selectedBrand);
      if (selectedStore) params.append("storeId", selectedStore.toString());
      
      const res = await fetch(`/api/store-sales?${params}`);
      if (!res.ok) throw new Error("Failed to fetch sales");
      return res.json() as Promise<StoreSales[]>;
    }
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["/api/store-staff", selectedBrand, selectedStore],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedBrand !== "all") params.append("brand", selectedBrand);
      if (selectedStore) params.append("storeId", selectedStore.toString());
      
      const res = await fetch(`/api/store-staff?${params}`);
      if (!res.ok) throw new Error("Failed to fetch staff");
      return res.json() as Promise<StoreStaff[]>;
    }
  });

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: "bg-green-100 text-green-800",
      closed: "bg-red-100 text-red-800",
      renovation: "bg-yellow-100 text-yellow-800",
    } as const;

    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  const getStoreTypeBadge = (type: string) => {
    const typeColors = {
      flagship: "bg-purple-100 text-purple-800",
      outlet: "bg-blue-100 text-blue-800",
      "pop-up": "bg-orange-100 text-orange-800",
    } as const;

    return (
      <Badge className={typeColors[type as keyof typeof typeColors] || "bg-gray-100 text-gray-800"}>
        {type}
      </Badge>
    );
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount), 0);
  const totalTransactions = sales.length;
  const lowStockItems = inventory.filter(item => 
    item.minimumStock && item.currentStock <= item.minimumStock
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Retail Operations</h1>
          <p className="text-gray-600 mt-1">
            Manage physical store locations, inventory, sales, and staff
          </p>
        </div>
      </div>

      {/* Store Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Store Locations
          </CardTitle>
          <CardDescription>
            Select a store to view detailed operations data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {storesLoading ? (
              <div className="col-span-full text-center py-8">Loading stores...</div>
            ) : stores.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                No stores found for {selectedBrand === "all" ? "any brand" : selectedBrand}
              </div>
            ) : (
              stores.map((store) => (
                <Card 
                  key={store.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedStore === store.id ? "ring-2 ring-ms-blue" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedStore(store.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{store.storeName}</CardTitle>
                        <p className="text-sm text-gray-600">{store.storeCode}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(store.status)}
                        {getStoreTypeBadge(store.storeType)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{store.city}, {store.country}</span>
                      </div>
                      {store.storeManager && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>Manager: {store.storeManager}</span>
                        </div>
                      )}
                      {store.operatingHours && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{store.operatingHours}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Store Operations Dashboard */}
      {selectedStore && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalSales.toString())}</div>
                <p className="text-xs text-muted-foreground">
                  {totalTransactions} transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventory.length}</div>
                <p className="text-xs text-muted-foreground">
                  {lowStockItems} low stock
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{staff.length}</div>
                <p className="text-xs text-muted-foreground">
                  {staff.filter(s => s.status === "active").length} active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalTransactions > 0 ? formatCurrency((totalSales / totalTransactions).toString()) : "$0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  per transaction
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Tabs */}
          <Tabs defaultValue="inventory">
            <TabsList>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>

            <TabsContent value="inventory">
              <Card>
                <CardHeader>
                  <CardTitle>Store Inventory</CardTitle>
                  <CardDescription>
                    Current stock levels and product information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Min Stock</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            No inventory data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        inventory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.sku}</TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>{item.category || "—"}</TableCell>
                            <TableCell>{item.currentStock}</TableCell>
                            <TableCell>{item.minimumStock || "—"}</TableCell>
                            <TableCell>
                              {item.retailPrice ? formatCurrency(item.retailPrice) : "—"}
                            </TableCell>
                            <TableCell>
                              {item.minimumStock && item.currentStock <= item.minimumStock ? (
                                <Badge className="bg-red-100 text-red-800">Low Stock</Badge>
                              ) : (
                                <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    Transaction history and sales performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Payment Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sales.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No sales data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        sales.map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell className="font-medium">{sale.transactionId}</TableCell>
                            <TableCell>
                              {new Date(sale.saleDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{formatCurrency(sale.totalAmount)}</TableCell>
                            <TableCell>{sale.itemCount}</TableCell>
                            <TableCell>{sale.paymentMethod || "—"}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="staff">
              <Card>
                <CardHeader>
                  <CardTitle>Store Staff</CardTitle>
                  <CardDescription>
                    Employee information and staffing levels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {staff.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            No staff data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        staff.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell className="font-medium">{member.employeeId}</TableCell>
                            <TableCell>{member.firstName} {member.lastName}</TableCell>
                            <TableCell>{member.position}</TableCell>
                            <TableCell>
                              <Badge className={
                                member.status === "active" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              }>
                                {member.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
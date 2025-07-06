import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Factory, Package, Users, TrendingUp, AlertTriangle, CheckCircle, Clock, DollarSign, Zap, Recycle, Shield, Plus, Edit, Trash2, Filter, Eye, BarChart3, PieChart, Building2, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Manufacturer, Product, ProductionOrder, ManufacturingMetrics, Supplier, SupplyChainKpis } from "@shared/schema";

type Brand = "all" | "blorcs" | "shaypops";

interface ManufacturingProps {
  selectedBrand: Brand;
}

export default function Manufacturing({ selectedBrand: initialBrand }: ManufacturingProps) {
  const [selectedBrand, setSelectedBrand] = useState<Brand>(initialBrand || "all");
  const [isManufacturerDialogOpen, setIsManufacturerDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [manufacturerFormData, setManufacturerFormData] = useState<Partial<Manufacturer>>({});
  const [productFormData, setProductFormData] = useState<Partial<Product>>({});
  const [orderFormData, setOrderFormData] = useState<Partial<ProductionOrder>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Data queries
  const { data: manufacturers = [], isLoading: manufacturersLoading } = useQuery<Manufacturer[]>({
    queryKey: [`/api/manufacturers?brand=${selectedBrand}`],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: [`/api/products?brand=${selectedBrand}`],
  });

  const { data: productionOrders = [] } = useQuery<ProductionOrder[]>({
    queryKey: [`/api/production-orders?brand=${selectedBrand}`],
  });

  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: [`/api/suppliers?brand=${selectedBrand}`],
  });

  const { data: manufacturingMetrics = [] } = useQuery<ManufacturingMetrics[]>({
    queryKey: ['/api/manufacturing-metrics'],
  });

  const { data: supplyChainKpis = [] } = useQuery<SupplyChainKpis[]>({
    queryKey: [`/api/supply-chain-kpis?brand=${selectedBrand}`],
  });

  // Mutations
  const createManufacturerMutation = useMutation({
    mutationFn: (data: Partial<Manufacturer>) => 
      apiRequest('POST', '/api/manufacturers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/manufacturers'] });
      setIsManufacturerDialogOpen(false);
      setManufacturerFormData({});
      toast({ title: "Success", description: "Manufacturer created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create manufacturer", variant: "destructive" });
    }
  });

  const createProductMutation = useMutation({
    mutationFn: (data: Partial<Product>) => 
      apiRequest('POST', '/api/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setIsProductDialogOpen(false);
      setProductFormData({});
      toast({ title: "Success", description: "Product created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create product", variant: "destructive" });
    }
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: Partial<ProductionOrder>) => 
      apiRequest('POST', '/api/production-orders', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/production-orders'] });
      setIsOrderDialogOpen(false);
      setOrderFormData({});
      toast({ title: "Success", description: "Production order created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create production order", variant: "destructive" });
    }
  });

  // Calculate KPIs from current data
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const currentKpis = supplyChainKpis.find(k => k.month === currentMonth && k.year === currentYear);
  
  const totalManufacturers = manufacturers.length;
  const activeManufacturers = manufacturers.filter(m => m.status === 'active').length;
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const totalOrders = productionOrders.length;
  const pendingOrders = productionOrders.filter(o => o.status === 'pending').length;
  const inProgressOrders = productionOrders.filter(o => o.status === 'in_progress').length;
  const completedOrders = productionOrders.filter(o => o.status === 'completed').length;

  const avgCapacityUtilization = manufacturers.length > 0 
    ? Math.round(manufacturers.reduce((sum, m) => sum + Number(m.currentUtilization || 0), 0) / manufacturers.length * 10) / 10
    : 0;

  const supplierPerformance = suppliers.length > 0
    ? Math.round(suppliers.reduce((sum, s) => sum + Number(s.qualityRating || 0), 0) / suppliers.length * 10) / 10
    : 0;

  const handleCreateManufacturer = () => {
    if (!manufacturerFormData.name || !manufacturerFormData.location || !manufacturerFormData.primaryBrand) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    createManufacturerMutation.mutate({
      ...manufacturerFormData,
      code: `MFG-${String(totalManufacturers + 1).padStart(3, '0')}`,
      type: manufacturerFormData.type || 'internal',
      status: 'active',
      currentUtilization: '0.00',
      complianceStatus: 'compliant'
    });
  };

  const handleCreateProduct = () => {
    if (!productFormData.name || !productFormData.sku || !productFormData.brand) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    createProductMutation.mutate({
      ...productFormData,
      status: 'active',
      productionComplexity: productFormData.productionComplexity || 'medium',
      minOrderQuantity: productFormData.minOrderQuantity || 1
    });
  };

  const handleCreateOrder = () => {
    if (!orderFormData.productId || !orderFormData.manufacturerId || !orderFormData.quantity) {
      toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    createOrderMutation.mutate({
      ...orderFormData,
      orderNumber: `PO-${currentYear}-${String(totalOrders + 1).padStart(4, '0')}`,
      status: 'pending',
      priority: orderFormData.priority || 'medium',
      orderDate: new Date().toISOString().split('T')[0],
      brand: selectedBrand === 'all' ? 'blorcs' : selectedBrand
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ms-text">Manufacturing Management</h2>
        <p className="text-gray-600 mt-2">
          Manage manufacturing operations, production orders, and supply chain KPIs
        </p>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Manufacturers</p>
                <p className="text-2xl font-bold text-ms-text">{activeManufacturers}</p>
                <p className="text-xs text-gray-500 mt-1">of {totalManufacturers} total</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Factory className="text-ms-blue w-6 h-6" />
              </div>
            </div>
            <Progress value={(activeManufacturers / totalManufacturers) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Production Orders</p>
                <p className="text-2xl font-bold text-ms-text">{totalOrders}</p>
                <p className="text-xs text-gray-500 mt-1">{inProgressOrders} in progress</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="text-green-600 w-6 h-6" />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Badge variant="outline" className="text-xs">{pendingOrders} pending</Badge>
              <Badge className="text-xs bg-green-100 text-green-800">{completedOrders} complete</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Capacity Utilization</p>
                <p className="text-2xl font-bold text-ms-text">{avgCapacityUtilization}%</p>
                <p className="text-xs text-gray-500 mt-1">Average across facilities</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-orange-600 w-6 h-6" />
              </div>
            </div>
            <Progress value={avgCapacityUtilization} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Supplier Performance</p>
                <p className="text-2xl font-bold text-ms-text">{supplierPerformance}/10</p>
                <p className="text-xs text-gray-500 mt-1">Quality rating average</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="text-purple-600 w-6 h-6" />
              </div>
            </div>
            <Progress value={supplierPerformance * 10} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Supply Chain KPIs Card */}
      {currentKpis && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Supply Chain KPIs - {currentKpis.month}/{currentKpis.year}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Package className="text-blue-600 w-8 h-8" />
                </div>
                <p className="text-2xl font-bold text-ms-text">{currentKpis.totalProduction?.toLocaleString() || 0}</p>
                <p className="text-sm text-gray-600">Total Production</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="text-green-600 w-8 h-8" />
                </div>
                <p className="text-2xl font-bold text-ms-text">{Number(currentKpis.supplyChainEfficiency || 0)}%</p>
                <p className="text-sm text-gray-600">Efficiency</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="text-orange-600 w-8 h-8" />
                </div>
                <p className="text-2xl font-bold text-ms-text">{Number(currentKpis.averageLeadTime || 0)} days</p>
                <p className="text-sm text-gray-600">Avg Lead Time</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="text-purple-600 w-8 h-8" />
                </div>
                <p className="text-2xl font-bold text-ms-text">{Number(currentKpis.orderFulfillmentRate || 0)}%</p>
                <p className="text-sm text-gray-600">Fulfillment Rate</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Recycle className="text-emerald-600 w-8 h-8" />
                </div>
                <p className="text-2xl font-bold text-ms-text">{Number(currentKpis.sustainabilityScore || 0)}%</p>
                <p className="text-sm text-gray-600">Sustainability</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="manufacturers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="manufacturers">Manufacturers</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Production Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="manufacturers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Manufacturing Facilities</h3>
            <Dialog open={isManufacturerDialogOpen} onOpenChange={setIsManufacturerDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Manufacturer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Manufacturer</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mfg-name">Name *</Label>
                      <Input 
                        id="mfg-name" 
                        value={manufacturerFormData.name || ''} 
                        onChange={(e) => setManufacturerFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Manufacturer name" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="mfg-type">Type</Label>
                      <Select 
                        value={manufacturerFormData.type || 'internal'} 
                        onValueChange={(value) => setManufacturerFormData(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Internal</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="joint_venture">Joint Venture</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="mfg-location">Location *</Label>
                      <Input 
                        id="mfg-location" 
                        value={manufacturerFormData.location || ''} 
                        onChange={(e) => setManufacturerFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Manufacturing location" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="mfg-brand">Primary Brand *</Label>
                      <Select 
                        value={manufacturerFormData.primaryBrand || selectedBrand} 
                        onValueChange={(value) => setManufacturerFormData(prev => ({ ...prev, primaryBrand: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blorcs">Blorcs</SelectItem>
                          <SelectItem value="shaypops">Shaypops</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="mfg-address">Address</Label>
                    <Input 
                      id="mfg-address" 
                      value={manufacturerFormData.address || ''} 
                      onChange={(e) => setManufacturerFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Full address" 
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="mfg-city">City</Label>
                      <Input 
                        id="mfg-city" 
                        value={manufacturerFormData.city || ''} 
                        onChange={(e) => setManufacturerFormData(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="City" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="mfg-state">State</Label>
                      <Input 
                        id="mfg-state" 
                        value={manufacturerFormData.state || ''} 
                        onChange={(e) => setManufacturerFormData(prev => ({ ...prev, state: e.target.value }))}
                        placeholder="State" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="mfg-capacity">Daily Capacity</Label>
                      <Input 
                        id="mfg-capacity" 
                        type="number"
                        value={manufacturerFormData.capacity || ''} 
                        onChange={(e) => setManufacturerFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                        placeholder="Units per day" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsManufacturerDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateManufacturer}
                      disabled={createManufacturerMutation.isPending}
                    >
                      {createManufacturerMutation.isPending ? 'Creating...' : 'Create Manufacturer'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {manufacturersLoading ? (
              <p>Loading manufacturers...</p>
            ) : manufacturers.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-500">
                <Factory className="mx-auto w-16 h-16 mb-4 text-gray-300" />
                <p>No manufacturers found</p>
                <p className="text-sm">Add your first manufacturing facility to get started</p>
              </div>
            ) : (
              manufacturers.map((manufacturer) => (
                <Card key={manufacturer.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{manufacturer.name}</CardTitle>
                        <p className="text-sm text-gray-600">{manufacturer.location}</p>
                      </div>
                      <Badge variant={manufacturer.status === 'active' ? 'default' : 'secondary'}>
                        {manufacturer.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Type:</span>
                        <Badge variant="outline">{manufacturer.type}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Capacity:</span>
                        <span className="text-sm font-medium">{manufacturer.capacity?.toLocaleString() || 'N/A'} units/day</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Utilization:</span>
                        <span className="text-sm font-medium">{manufacturer.currentUtilization || 0}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Compliance:</span>
                        <Badge 
                          variant={manufacturer.complianceStatus === 'compliant' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {manufacturer.complianceStatus}
                        </Badge>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Product Catalog</h3>
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prod-name">Product Name *</Label>
                      <Input 
                        id="prod-name" 
                        value={productFormData.name || ''} 
                        onChange={(e) => setProductFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Product name" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="prod-sku">SKU *</Label>
                      <Input 
                        id="prod-sku" 
                        value={productFormData.sku || ''} 
                        onChange={(e) => setProductFormData(prev => ({ ...prev, sku: e.target.value }))}
                        placeholder="Product SKU" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prod-category">Category</Label>
                      <Select 
                        value={productFormData.category || ''} 
                        onValueChange={(value) => setProductFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="apparel">Apparel</SelectItem>
                          <SelectItem value="home_goods">Home Goods</SelectItem>
                          <SelectItem value="sports">Sports & Recreation</SelectItem>
                          <SelectItem value="automotive">Automotive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="prod-brand">Brand *</Label>
                      <Select 
                        value={productFormData.brand || selectedBrand} 
                        onValueChange={(value) => setProductFormData(prev => ({ ...prev, brand: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blorcs">Blorcs</SelectItem>
                          <SelectItem value="shaypops">Shaypops</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="prod-desc">Description</Label>
                    <Textarea 
                      id="prod-desc" 
                      value={productFormData.description || ''} 
                      onChange={(e) => setProductFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Product description" 
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="prod-cost">Unit Cost</Label>
                      <Input 
                        id="prod-cost" 
                        type="number"
                        step="0.01"
                        value={productFormData.unitCost || ''} 
                        onChange={(e) => setProductFormData(prev => ({ ...prev, unitCost: e.target.value }))}
                        placeholder="0.00" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="prod-msrp">MSRP</Label>
                      <Input 
                        id="prod-msrp" 
                        type="number"
                        step="0.01"
                        value={productFormData.msrp || ''} 
                        onChange={(e) => setProductFormData(prev => ({ ...prev, msrp: e.target.value }))}
                        placeholder="0.00" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="prod-leadtime">Lead Time (days)</Label>
                      <Input 
                        id="prod-leadtime" 
                        type="number"
                        value={productFormData.leadTime || ''} 
                        onChange={(e) => setProductFormData(prev => ({ ...prev, leadTime: parseInt(e.target.value) }))}
                        placeholder="30" 
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateProduct}
                      disabled={createProductMutation.isPending}
                    >
                      {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-500">
                <Package className="mx-auto w-16 h-16 mb-4 text-gray-300" />
                <p>No products found</p>
                <p className="text-sm">Add your first product to start managing production</p>
              </div>
            ) : (
              products.map((product) => (
                <Card key={product.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <p className="text-sm text-gray-600">{product.sku}</p>
                      </div>
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Category:</span>
                        <Badge variant="outline">{product.category}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Unit Cost:</span>
                        <span className="text-sm font-medium">${product.unitCost || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">MSRP:</span>
                        <span className="text-sm font-medium">${product.msrp || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Lead Time:</span>
                        <span className="text-sm font-medium">{product.leadTime || 'N/A'} days</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Production Orders</h3>
            <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Order
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Production Order</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="order-product">Product *</Label>
                      <Select 
                        value={orderFormData.productId?.toString() || ''} 
                        onValueChange={(value) => setOrderFormData(prev => ({ ...prev, productId: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name} ({product.sku})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="order-manufacturer">Manufacturer *</Label>
                      <Select 
                        value={orderFormData.manufacturerId?.toString() || ''} 
                        onValueChange={(value) => setOrderFormData(prev => ({ ...prev, manufacturerId: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select manufacturer" />
                        </SelectTrigger>
                        <SelectContent>
                          {manufacturers.map((manufacturer) => (
                            <SelectItem key={manufacturer.id} value={manufacturer.id.toString()}>
                              {manufacturer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="order-quantity">Quantity *</Label>
                      <Input 
                        id="order-quantity" 
                        type="number"
                        value={orderFormData.quantity || ''} 
                        onChange={(e) => setOrderFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                        placeholder="Order quantity" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="order-priority">Priority</Label>
                      <Select 
                        value={orderFormData.priority || 'medium'} 
                        onValueChange={(value) => setOrderFormData(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="order-required">Required Date *</Label>
                    <Input 
                      id="order-required" 
                      type="date"
                      value={orderFormData.requiredDate || ''} 
                      onChange={(e) => setOrderFormData(prev => ({ ...prev, requiredDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="order-notes">Notes</Label>
                    <Textarea 
                      id="order-notes" 
                      value={orderFormData.notes || ''} 
                      onChange={(e) => setOrderFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Order notes and special instructions" 
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateOrder}
                      disabled={createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {productionOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="mx-auto w-16 h-16 mb-4 text-gray-300" />
              <p>No production orders found</p>
              <p className="text-sm">Create your first production order to start manufacturing</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Manufacturer</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Required Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productionOrders.map((order) => {
                  const product = products.find(p => p.id === order.productId);
                  const manufacturer = manufacturers.find(m => m.id === order.manufacturerId);
                  
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>{product?.name || 'Unknown Product'}</TableCell>
                      <TableCell>{manufacturer?.name || 'Unknown Manufacturer'}</TableCell>
                      <TableCell>{order.quantity?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === 'completed' ? 'default' :
                            order.status === 'in_progress' ? 'secondary' :
                            order.status === 'cancelled' ? 'destructive' : 'outline'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.priority === 'urgent' ? 'destructive' :
                            order.priority === 'high' ? 'default' : 'outline'
                          }
                          className="text-xs"
                        >
                          {order.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.requiredDate}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Supplier Network</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {suppliers.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-gray-500">
                <Truck className="mx-auto w-16 h-16 mb-4 text-gray-300" />
                <p>No suppliers found</p>
                <p className="text-sm">Add suppliers to track your supply chain network</p>
              </div>
            ) : (
              suppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{supplier.name}</CardTitle>
                        <p className="text-sm text-gray-600">{supplier.location}</p>
                      </div>
                      <Badge variant={supplier.status === 'active' ? 'default' : 'secondary'}>
                        {supplier.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Type:</span>
                        <Badge variant="outline">{supplier.type}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Quality Rating:</span>
                        <span className="text-sm font-medium">{supplier.qualityRating || 'N/A'}/10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Delivery Rating:</span>
                        <span className="text-sm font-medium">{supplier.deliveryRating || 'N/A'}/10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Risk Level:</span>
                        <Badge 
                          variant={
                            supplier.riskLevel === 'low' ? 'default' :
                            supplier.riskLevel === 'high' ? 'destructive' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {supplier.riskLevel}
                        </Badge>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h3 className="text-lg font-semibold">Manufacturing Analytics</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Production Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <PieChart className="mx-auto w-16 h-16 mb-4 text-gray-300" />
                  <p>Analytics dashboard coming soon</p>
                  <p className="text-sm">Production metrics and trend analysis</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="mx-auto w-16 h-16 mb-4 text-gray-300" />
                  <p>KPI tracking dashboard</p>
                  <p className="text-sm">Real-time performance monitoring</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
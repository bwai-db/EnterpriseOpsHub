import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  Building2, 
  Users, 
  DollarSign, 
  Calendar,
  Globe,
  ShoppingCart,
  Truck,
  Factory,
  Shield,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Settings,
  Database,
  Cloud,
  Key,
  Ticket
} from "lucide-react";

interface Brand {
  id: number;
  name: string;
  code: string;
  displayName: string;
  description?: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  website?: string;
  industry?: string;
  headquarters?: string;
  foundedYear?: number;
  employeeCount?: number;
  revenue?: number;
  isActive: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface OnboardingStep {
  id: number;
  brandId: number;
  stepName: string;
  stepDescription?: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: number;
  sortOrder: number;
  createdAt: string;
}

interface BrandKPIs {
  totalEmployees: number;
  activeUsers: number;
  totalVendors: number;
  activeLicenses: number;
  totalIncidents: number;
  openIncidents: number;
  totalStores: number;
  monthlyRevenue: number;
  operationalCosts: number;
  complianceScore: number;
}

export default function BrandManagement() {
  const [match, params] = useRoute("/brand/:id/:mode?");
  const [, setLocation] = useLocation();
  const brandId = params?.id ? parseInt(params.id) : null;
  const mode = params?.mode || "view";
  const [isEditing, setIsEditing] = useState(mode === "edit");
  const [formData, setFormData] = useState<Partial<Brand>>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch brand details
  const { data: brand, isLoading: brandLoading } = useQuery({
    queryKey: ["/api/brands", brandId],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/brands/${brandId}`);
      return response.json();
    },
    enabled: !!brandId,
  });

  // Fetch onboarding progress
  const { data: progress } = useQuery({
    queryKey: ["/api/brands", brandId, "onboarding-progress"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/brands/${brandId}/onboarding-progress`);
      return response.json();
    },
    enabled: !!brandId,
  });

  // Fetch onboarding steps
  const { data: onboardingSteps = [] } = useQuery({
    queryKey: ["/api/brands", brandId, "onboarding-steps"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/brands/${brandId}/onboarding-steps`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!brandId,
  });

  // Mock KPIs data - in real implementation, this would come from various APIs
  const mockKPIs: BrandKPIs = {
    totalEmployees: brand?.employeeCount || 0,
    activeUsers: Math.floor((brand?.employeeCount || 0) * 0.85),
    totalVendors: Math.floor(Math.random() * 50) + 20,
    activeLicenses: Math.floor(Math.random() * 200) + 100,
    totalIncidents: Math.floor(Math.random() * 100) + 50,
    openIncidents: Math.floor(Math.random() * 10) + 2,
    totalStores: Math.floor(Math.random() * 20) + 5,
    monthlyRevenue: (brand?.revenue || 0) / 12,
    operationalCosts: ((brand?.revenue || 0) / 12) * 0.7,
    complianceScore: Math.floor(Math.random() * 20) + 80,
  };

  // Update brand mutation
  const updateBrandMutation = useMutation({
    mutationFn: async (updateData: Partial<Brand>) => {
      const response = await apiRequest("PATCH", `/api/brands/${brandId}`, updateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands", brandId] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Brand updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update brand.",
        variant: "destructive",
      });
    },
  });

  // Complete step mutation
  const completeStepMutation = useMutation({
    mutationFn: async ({ stepId, userId }: { stepId: number; userId: number }) => {
      const response = await apiRequest("PATCH", `/api/onboarding-steps/${stepId}/complete`, { userId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands", brandId] });
      toast({
        title: "Success",
        description: "Onboarding step completed!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete step.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (brand && !isEditing) {
      setFormData(brand);
    }
  }, [brand, isEditing]);

  const handleEdit = () => {
    setFormData(brand);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (formData) {
      const submitData = {
        ...formData,
        foundedYear: formData.foundedYear ? Number(formData.foundedYear) : undefined,
        employeeCount: formData.employeeCount ? Number(formData.employeeCount) : undefined,
        revenue: formData.revenue ? Number(formData.revenue) : undefined,
      };
      updateBrandMutation.mutate(submitData);
    }
  };

  const handleCancel = () => {
    setFormData(brand);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Brand, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompleteStep = (stepId: number) => {
    completeStepMutation.mutate({ stepId, userId: 1 });
  };

  if (!match || !brandId) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Brand Not Found</h2>
          <p className="text-gray-600">The requested brand could not be found.</p>
        </div>
      </div>
    );
  }

  if (brandLoading || !brand) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Fetching brand information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/brand-onboarding")}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                style={{ backgroundColor: brand.primaryColor }}
              >
                {brand.displayName.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{brand.displayName}</h1>
                <p className="text-gray-600">@{brand.code}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={brand.isActive ? "default" : "secondary"}>
              {brand.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge variant={brand.onboardingCompleted ? "default" : "destructive"}>
              {brand.onboardingCompleted ? "Onboarded" : "Pending"}
            </Badge>
            {!isEditing ? (
              <Button onClick={handleEdit}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Brand
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSave} disabled={updateBrandMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {updateBrandMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold">{mockKPIs.totalEmployees.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {mockKPIs.activeUsers.toLocaleString()} active users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold">
                    ${(mockKPIs.monthlyRevenue / 1000000).toFixed(1)}M
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ${(mockKPIs.operationalCosts / 1000000).toFixed(1)}M operational costs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Open Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <span className="text-2xl font-bold">{mockKPIs.openIncidents}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {mockKPIs.totalIncidents} total incidents
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Compliance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="text-2xl font-bold">{mockKPIs.complianceScore}%</span>
                </div>
                <Progress value={mockKPIs.complianceScore} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Operations Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Operations Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Service Management</span>
                  </div>
                  <Badge variant="default">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Licensing ({mockKPIs.activeLicenses})</span>
                  </div>
                  <Badge variant="default">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Vendors ({mockKPIs.totalVendors})</span>
                  </div>
                  <Badge variant="default">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Managed
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Retail ({mockKPIs.totalStores} stores)</span>
                  </div>
                  <Badge variant="default">
                    <Activity className="w-3 h-3 mr-1" />
                    Operating
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">License optimization completed</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New vendor integration added</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Security compliance review</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New retail location opened</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          {/* Operational Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="w-5 h-5" />
                  <span>Supply Chain</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Suppliers</span>
                    <span className="text-sm font-medium">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending Orders</span>
                    <span className="text-sm font-medium">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">On-Time Delivery</span>
                    <span className="text-sm font-medium text-green-600">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Factory className="w-5 h-5" />
                  <span>Manufacturing</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Orders</span>
                    <span className="text-sm font-medium">18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Efficiency Rate</span>
                    <span className="text-sm font-medium text-green-600">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Quality Score</span>
                    <span className="text-sm font-medium text-green-600">98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cloud className="w-5 h-5" />
                  <span>Cloud Services</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Services</span>
                    <span className="text-sm font-medium">32</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="text-sm font-medium text-green-600">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Monthly Cost</span>
                    <span className="text-sm font-medium">$45K</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Revenue Growth</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">+12%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Operational Costs</span>
                    <div className="flex items-center space-x-1">
                      <TrendingDown className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">-8%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Employee Satisfaction</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">+5%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Incident Resolution</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">+15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">License Utilization</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">+7%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vendor Performance</span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">+3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          {/* Onboarding Progress */}
          {progress && (
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{progress.percentage}%</span>
                  </div>
                  <Progress value={progress.percentage} className="h-3" />
                  <p className="text-sm text-gray-600">
                    {progress.completedSteps} of {progress.totalSteps} steps completed
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Onboarding Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onboardingSteps.map((step: OnboardingStep, index: number) => (
                  <div key={step.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{step.stepName}</h4>
                      <p className="text-sm text-gray-600">{step.stepDescription}</p>
                      {step.completedAt && (
                        <p className="text-xs text-green-600 mt-1">
                          Completed on {new Date(step.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={step.isCompleted ? "default" : "secondary"}>
                        {step.isCompleted ? "Completed" : "Pending"}
                      </Badge>
                      {!step.isCompleted && (
                        <Button 
                          size="sm" 
                          onClick={() => handleCompleteStep(step.id)}
                          disabled={completeStepMutation.isPending}
                        >
                          {completeStepMutation.isPending ? "Completing..." : "Complete"}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Brand Settings Form */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Brand Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 rounded text-sm">{brand.name}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="code">Brand Code</Label>
                  {isEditing ? (
                    <Input
                      id="code"
                      value={formData.code || ""}
                      onChange={(e) => handleInputChange("code", e.target.value.toLowerCase())}
                      required
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 rounded text-sm">{brand.code}</div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="displayName">Display Name</Label>
                {isEditing ? (
                  <Input
                    id="displayName"
                    value={formData.displayName || ""}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    required
                  />
                ) : (
                  <div className="mt-1 p-2 bg-gray-50 rounded text-sm">{brand.displayName}</div>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    value={formData.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                  />
                ) : (
                  <div className="mt-1 p-2 bg-gray-50 rounded text-sm">{brand.description}</div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={formData.primaryColor || "#3B82F6"}
                        onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={formData.primaryColor || "#3B82F6"}
                        onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                        placeholder="#3B82F6"
                      />
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: brand.primaryColor }}
                      ></div>
                      <span className="text-sm">{brand.primaryColor}</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  {isEditing ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={formData.secondaryColor || "#64748B"}
                        onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={formData.secondaryColor || "#64748B"}
                        onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                        placeholder="#64748B"
                      />
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded border"
                        style={{ backgroundColor: brand.secondaryColor }}
                      ></div>
                      <span className="text-sm">{brand.secondaryColor}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  {isEditing ? (
                    <Input
                      id="website"
                      value={formData.website || ""}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://example.com"
                      type="url"
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
                      {brand.website ? (
                        <a href={brand.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {brand.website}
                        </a>
                      ) : (
                        "Not specified"
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  {isEditing ? (
                    <Select value={formData.industry || ""} onValueChange={(value) => handleInputChange("industry", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 rounded text-sm capitalize">{brand.industry || "Not specified"}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="headquarters">Headquarters</Label>
                  {isEditing ? (
                    <Input
                      id="headquarters"
                      value={formData.headquarters || ""}
                      onChange={(e) => handleInputChange("headquarters", e.target.value)}
                      placeholder="e.g., New York, NY"
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 rounded text-sm">{brand.headquarters || "Not specified"}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="foundedYear">Founded Year</Label>
                  {isEditing ? (
                    <Input
                      id="foundedYear"
                      type="number"
                      value={formData.foundedYear || ""}
                      onChange={(e) => handleInputChange("foundedYear", parseInt(e.target.value))}
                      min="1800"
                      max={new Date().getFullYear()}
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 rounded text-sm">{brand.foundedYear || "Not specified"}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="employeeCount">Employee Count</Label>
                  {isEditing ? (
                    <Input
                      id="employeeCount"
                      type="number"
                      value={formData.employeeCount || ""}
                      onChange={(e) => handleInputChange("employeeCount", parseInt(e.target.value))}
                      min="0"
                    />
                  ) : (
                    <div className="mt-1 p-2 bg-gray-50 rounded text-sm">{brand.employeeCount?.toLocaleString() || "Not specified"}</div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="revenue">Annual Revenue</Label>
                {isEditing ? (
                  <Input
                    id="revenue"
                    type="number"
                    value={formData.revenue || ""}
                    onChange={(e) => handleInputChange("revenue", parseInt(e.target.value))}
                    min="0"
                    placeholder="Annual revenue in USD"
                  />
                ) : (
                  <div className="mt-1 p-2 bg-gray-50 rounded text-sm">
                    {brand.revenue ? `$${(brand.revenue / 1000000).toFixed(1)}M` : "Not specified"}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
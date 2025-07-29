import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, Edit, Trash2, User, Package, Award, BarChart3, RefreshCw, Key, Users, Calendar, 
  DollarSign, TrendingUp, Shield, AlertTriangle, Brain, Zap, Target, PieChart, 
  TrendingDown, Activity, Clock, CheckCircle, XCircle, Lightbulb, Sparkles
} from "lucide-react";

type BrandFilter = "all" | "blorcs" | "shaypops";

interface LicenseKPIs {
  totalLicenses: number;
  utilizationRate: number;
  monthlyCost: number;
  costPerLicense: number;
  expiringIn30Days: number;
  activeUsers: number;
  wastageAmount: number;
  complianceScore: number;
  vendorCount: number;
  renewalsThisQuarter: number;
}

interface AIInsight {
  id: string;
  type: 'cost_optimization' | 'utilization' | 'compliance' | 'renewal' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  potentialSavings?: number;
  impactedLicenses?: number;
  priority: number;
  category: string;
}

interface CorporateLicensePack {
  id: number;
  packName: string;
  vendor: string;
  packType: string;
  totalLicenses: number;
  assignedLicenses: number;
  unassignedLicenses: number;
  costPerLicense: string;
  totalCost: string;
  renewalDate: Date;
  contractNumber: string;
  status: string;
  brand: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EntitlementLicense {
  id: number;
  packId: number;
  licenseName: string;
  licenseKey: string;
  productVersion: string;
  maxUsers: number;
  assignedUsers: number;
  licenseType: string;
  features: string[];
  restrictions: string[];
  supportLevel: string;
  expirationDate: Date;
  isActive: boolean;
  brand: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SpecializedLicense {
  id: number;
  packId: number;
  licenseName: string;
  licenseKey: string;
  specialization: string;
  targetAudience: string;
  usageLimits: string;
  complianceRequirements: string[];
  certificationLevel: string;
  trainingRequired: boolean;
  maxConcurrentUsers: number;
  geographicRestrictions: string[];
  industryRestrictions: string[];
  expirationDate: Date;
  renewalTerms: string;
  supportContacts: string;
  isActive: boolean;
  brand: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserLicenseAssignment {
  id: number;
  userId: number;
  licenseType: string;
  licenseId: number;
  assignedBy: string;
  assignmentReason?: string;
  assignmentDate: Date;
  expirationDate?: Date;
  status: string;
  notes?: string;
  brand: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MicrosoftLicenseKpis {
  id: number;
  tenantId: string;
  month: number;
  year: number;
  totalLicenses: number;
  assignedLicenses: number;
  unassignedLicenses: number;
  utilizationRate: string;
  costPerMonth: string;
  costPerLicense: string;
  activeUsers: number;
  inactiveUsers: number;
  newAssignments: number;
  revokedLicenses: number;
  expiringLicenses: number;
  m365E3Licenses: number;
  m365E5Licenses: number;
  m365F3Licenses: number;
  powerBiLicenses: number;
  teamsLicenses: number;
  azureAdP1Licenses: number;
  azureAdP2Licenses: number;
  intuneDeviceLicenses: number;
  defenderLicenses: number;
  complianceScore: string;
  securityScore: string;
  lastSyncDate: Date;
  brand: string;
  createdAt: Date;
  updatedAt: Date;
}

const createPackSchema = z.object({
  packName: z.string().min(1, "Pack name is required"),
  vendor: z.string().min(1, "Vendor is required"),
  packType: z.string().min(1, "Pack type is required"),
  totalLicenses: z.number().min(1, "Total licenses must be at least 1"),
  costPerLicense: z.string().min(1, "Cost per license is required"),
  totalCost: z.string().min(1, "Total cost is required"),
  renewalDate: z.string().min(1, "Renewal date is required"),
  contractNumber: z.string().min(1, "Contract number is required"),
  status: z.string().min(1, "Status is required"),
  brand: z.string().min(1, "Brand is required"),
});

const createEntitlementSchema = z.object({
  packId: z.number().min(1, "Pack ID is required"),
  licenseName: z.string().min(1, "License name is required"),
  licenseKey: z.string().min(1, "License key is required"),
  productVersion: z.string().min(1, "Product version is required"),
  maxUsers: z.number().min(1, "Max users must be at least 1"),
  licenseType: z.string().min(1, "License type is required"),
  features: z.array(z.string()),
  restrictions: z.array(z.string()),
  supportLevel: z.string().min(1, "Support level is required"),
  expirationDate: z.string().min(1, "Expiration date is required"),
  isActive: z.boolean(),
  brand: z.string().min(1, "Brand is required"),
});

const createAssignmentSchema = z.object({
  userId: z.number().min(1, "User ID is required"),
  licenseType: z.string().min(1, "License type is required"),
  licenseId: z.number().min(1, "License ID is required"),
  assignedBy: z.string().min(1, "Assigned by is required"),
  assignmentReason: z.string().optional(),
  expirationDate: z.string().optional(),
  brand: z.string().min(1, "Brand is required"),
});

// Mock AI Insights Data
const generateAIInsights = (kpis: LicenseKPIs): AIInsight[] => [
  {
    id: "cost-opt-1",
    type: "cost_optimization",
    severity: "high",
    title: "Unused Microsoft 365 E5 Licenses",
    description: `${Math.floor(kpis.totalLicenses * 0.15)} Microsoft 365 E5 licenses are unassigned, costing $${Math.floor(kpis.totalLicenses * 0.15 * 57)} monthly.`,
    recommendation: "Consider downgrading to E3 licenses or reallocating to active users.",
    potentialSavings: Math.floor(kpis.totalLicenses * 0.15 * 57 * 12),
    impactedLicenses: Math.floor(kpis.totalLicenses * 0.15),
    priority: 1,
    category: "Cost Optimization"
  },
  {
    id: "util-1",
    type: "utilization",
    severity: "medium",
    title: "Low Power BI Premium Usage",
    description: "Power BI Premium licenses showing 45% utilization rate.",
    recommendation: "Provide additional training or consider reducing license count.",
    impactedLicenses: 25,
    priority: 2,
    category: "Utilization"
  },
  {
    id: "renewal-1",
    type: "renewal",
    severity: "critical",
    title: "Adobe Creative Cloud Renewal",
    description: "150 Adobe licenses expire in 23 days.",
    recommendation: "Initiate renewal process immediately to avoid service disruption.",
    impactedLicenses: 150,
    priority: 1,
    category: "Renewal Management"
  },
  {
    id: "compliance-1",
    type: "compliance",
    severity: "high",
    title: "Security License Gap",
    description: "12 users lack Microsoft Defender for Office 365 licenses.",
    recommendation: "Assign security licenses to maintain compliance standards.",
    impactedLicenses: 12,
    priority: 1,
    category: "Compliance"
  },
  {
    id: "security-1",
    type: "security",
    severity: "medium",
    title: "Azure AD P2 Underutilization",
    description: "Advanced identity protection features are underutilized.",
    recommendation: "Implement conditional access policies and risk-based authentication.",
    impactedLicenses: 75,
    priority: 3,
    category: "Security Enhancement"
  }
];

export default function LicensingManagement() {
  const [selectedBrand, setSelectedBrand] = useState<BrandFilter>("all");
  const [activeTab, setActiveTab] = useState("overview");
  const [insightFilter, setInsightFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock KPI Data
  const mockKpis: LicenseKPIs = {
    totalLicenses: 2847,
    utilizationRate: 78.4,
    monthlyCost: 245680,
    costPerLicense: 86.32,
    expiringIn30Days: 127,
    activeUsers: 2234,
    wastageAmount: 52840,
    complianceScore: 94.2,
    vendorCount: 24,
    renewalsThisQuarter: 8
  };

  const aiInsights = generateAIInsights(mockKpis);

  // Queries
  const { data: licensePacks, isLoading: packsLoading } = useQuery({
    queryKey: ["/api/corporate-license-packs", selectedBrand],
    enabled: selectedBrand !== "all",
  });

  const { data: entitlementLicenses, isLoading: entitlementsLoading } = useQuery({
    queryKey: ["/api/entitlement-licenses", selectedBrand],
    enabled: selectedBrand !== "all",
  });

  const { data: specializedLicenses, isLoading: specializedLoading } = useQuery({
    queryKey: ["/api/specialized-licenses", selectedBrand],
    enabled: selectedBrand !== "all",
  });

  const { data: userAssignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ["/api/user-license-assignments", selectedBrand],
    enabled: selectedBrand !== "all",
  });

  const { data: microsoftKpis, isLoading: kpisLoading } = useQuery({
    queryKey: ["/api/microsoft-license-kpis", selectedBrand],
    enabled: selectedBrand !== "all",
  });

  // Pack form
  const packForm = useForm({
    resolver: zodResolver(createPackSchema),
    defaultValues: {
      packName: "",
      vendor: "",
      packType: "enterprise",
      totalLicenses: 0,
      costPerLicense: "",
      totalCost: "",
      renewalDate: "",
      contractNumber: "",
      status: "active",
      brand: "blorcs",
    },
  });

  // Entitlement form
  const entitlementForm = useForm({
    resolver: zodResolver(createEntitlementSchema),
    defaultValues: {
      packId: 0,
      licenseName: "",
      licenseKey: "",
      productVersion: "",
      maxUsers: 0,
      licenseType: "user",
      features: [],
      restrictions: [],
      supportLevel: "standard",
      expirationDate: "",
      isActive: true,
      brand: "blorcs",
    },
  });

  // Assignment form
  const assignmentForm = useForm({
    resolver: zodResolver(createAssignmentSchema),
    defaultValues: {
      userId: 0,
      licenseType: "entitlement",
      licenseId: 0,
      assignedBy: "",
      assignmentReason: "",
      expirationDate: "",
      brand: "blorcs",
    },
  });

  // Mutations
  const createPackMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/corporate-license-packs", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/corporate-license-packs"] });
      toast({ title: "License pack created successfully" });
      packForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create license pack", variant: "destructive" });
    },
  });

  const createEntitlementMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/entitlement-licenses", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/entitlement-licenses"] });
      toast({ title: "Entitlement license created successfully" });
      entitlementForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create entitlement license", variant: "destructive" });
    },
  });

  const createAssignmentMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/user-license-assignments", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-license-assignments"] });
      toast({ title: "License assigned successfully" });
      assignmentForm.reset();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to assign license", variant: "destructive" });
    },
  });

  const syncMicrosoftMutation = useMutation({
    mutationFn: (data: { tenantId: string; brand: string }) => 
      apiRequest("/api/microsoft-license-kpis/sync", { method: "POST", body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/microsoft-license-kpis"] });
      toast({ title: "Microsoft license data synced successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to sync Microsoft license data", variant: "destructive" });
    },
  });

  const seedEnterpriseLicensesMutation = useMutation({
    mutationFn: () => apiRequest("/api/licenses/seed-enterprise", { method: "POST" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/corporate-license-packs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/entitlement-licenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/specialized-licenses"] });
      toast({ 
        title: "Enterprise licenses seeded successfully", 
        description: "Microsoft 365, Power Platform, and Adobe licenses have been added" 
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to seed enterprise licenses", variant: "destructive" });
    },
  });

  const seedEnhancedLicensingMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/seed/enhanced-licensing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to seed enhanced licensing structure');
      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate all licensing-related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['/api/corporate-license-packs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/entitlement-licenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/specialized-licenses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user-license-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/microsoft-license-kpis'] });
      
      toast({ 
        title: "Enhanced Licensing Seeded Successfully", 
        description: `Created ${data.result.licensePacks} license packs, ${data.result.entitlementLicenses} entitlement licenses, and ${data.result.specializedLicenses} specialized licenses across all brands with total value of $${data.result.totalValue.toLocaleString()}`
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to seed enhanced licensing structure", variant: "destructive" });
    },
  });

  const onCreatePack = (data: any) => {
    const packData = {
      ...data,
      assignedLicenses: 0,
      unassignedLicenses: data.totalLicenses,
      renewalDate: new Date(data.renewalDate),
    };
    createPackMutation.mutate(packData);
  };

  const onCreateEntitlement = (data: any) => {
    const entitlementData = {
      ...data,
      assignedUsers: 0,
      expirationDate: new Date(data.expirationDate),
    };
    createEntitlementMutation.mutate(entitlementData);
  };

  const onCreateAssignment = (data: any) => {
    const assignmentData = {
      ...data,
      expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,
      assignmentDate: new Date(),
      status: "active",
    };
    createAssignmentMutation.mutate(assignmentData);
  };

  const handleSyncMicrosoft = () => {
    if (selectedBrand === "all") {
      toast({ title: "Error", description: "Please select a specific brand to sync", variant: "destructive" });
      return;
    }
    
    const tenantId = selectedBrand === "blorcs" ? "tenant-blorcs-001" : "tenant-shaypops-001";
    syncMicrosoftMutation.mutate({ tenantId, brand: selectedBrand });
  };

  const handleSeedEnterpriseLicenses = () => {
    seedEnterpriseLicensesMutation.mutate();
  };

  const handleSeedEnhancedLicensing = () => {
    seedEnhancedLicensingMutation.mutate();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "default";
      case "inactive": return "secondary";
      case "expired": return "destructive";
      case "pending": return "outline";
      default: return "secondary";
    }
  };

  if (selectedBrand === "all") {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Licensing Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive enterprise license lifecycle management
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Select Brand
            </CardTitle>
            <CardDescription>
              Choose a brand to manage licensing operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setSelectedBrand("blorcs")}
                className="h-20 flex flex-col items-center justify-center"
                variant="outline"
              >
                <Package className="h-6 w-6 mb-2" />
                <span className="font-semibold">Blorcs Corporation</span>
                <span className="text-sm text-gray-500">Enterprise Licensing</span>
              </Button>
              <Button
                onClick={() => setSelectedBrand("shaypops")}
                className="h-20 flex flex-col items-center justify-center"
                variant="outline"
              >
                <Package className="h-6 w-6 mb-2" />
                <span className="font-semibold">Shaypops Inc.</span>
                <span className="text-sm text-gray-500">Commercial Licensing</span>
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Comprehensive Licensing Setup</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Initialize complete licensing structure for all brands</p>
                </div>
                <Button
                  onClick={handleSeedEnhancedLicensing}
                  disabled={seedEnhancedLicensingMutation.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  {seedEnhancedLicensingMutation.isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Seeding...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Seed Enhanced Licensing
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This will create 9 license packs, 7 entitlement licenses, 4 specialized licenses, and Microsoft KPIs across all brands (Blorcs, Shaypops, TechNova) with a total value of $236,803.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Licensing Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedBrand === "blorcs" ? "Blorcs Corporation" : "Shaypops Inc."} - License Operations
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={handleSeedEnterpriseLicenses}
            disabled={seedEnterpriseLicensesMutation.isPending}
            variant="outline"
          >
            <Package className="h-4 w-4 mr-2" />
            {seedEnterpriseLicensesMutation.isPending ? "Seeding..." : "Seed Enterprise Licenses"}
          </Button>
          
          <Button
            onClick={handleSyncMicrosoft}
            disabled={syncMicrosoftMutation.isPending}
            variant="outline"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Microsoft
          </Button>
          
          <Select value={selectedBrand} onValueChange={(value) => setSelectedBrand(value as BrandFilter)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blorcs">Blorcs Corporation</SelectItem>
              <SelectItem value="shaypops">Shaypops Inc.</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="packs">License Packs</TabsTrigger>
          <TabsTrigger value="entitlements">Entitlements</TabsTrigger>
          <TabsTrigger value="specialized">Specialized</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="kpis">Microsoft KPIs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total License Packs</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{licensePacks?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active corporate license packages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Entitlement Licenses</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{entitlementLicenses?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Standard user entitlements
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Assignments</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userAssignments?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active license assignments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {microsoftKpis?.[0]?.utilizationRate || "0"}%
                </div>
                <p className="text-xs text-muted-foreground">
                  License utilization efficiency
                </p>
              </CardContent>
            </Card>
          </div>

          {microsoftKpis?.[0] && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Microsoft License Analytics
                </CardTitle>
                <CardDescription>
                  Real-time Microsoft 365 license metrics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Total Licenses</Label>
                    <div className="text-2xl font-bold">{microsoftKpis[0].totalLicenses}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Assigned</Label>
                    <div className="text-2xl font-bold text-green-600">{microsoftKpis[0].assignedLicenses}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Unassigned</Label>
                    <div className="text-2xl font-bold text-orange-600">{microsoftKpis[0].unassignedLicenses}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Monthly Cost</Label>
                    <div className="text-2xl font-bold">${microsoftKpis[0].costPerMonth}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="packs">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Corporate License Packs</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage enterprise license packages and contracts
              </p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add License Pack
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create License Pack</DialogTitle>
                  <DialogDescription>
                    Add a new corporate license package
                  </DialogDescription>
                </DialogHeader>
                <Form {...packForm}>
                  <form onSubmit={packForm.handleSubmit(onCreatePack)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={packForm.control}
                        name="packName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pack Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={packForm.control}
                        name="vendor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vendor</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={packForm.control}
                        name="packType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pack Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="volume">Volume</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={packForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={packForm.control}
                        name="totalLicenses"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Licenses</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={packForm.control}
                        name="costPerLicense"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cost Per License</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="123.45" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={packForm.control}
                        name="totalCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Cost</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="12345.00" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={packForm.control}
                        name="renewalDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Renewal Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={packForm.control}
                        name="contractNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contract Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={packForm.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="blorcs">Blorcs Corporation</SelectItem>
                              <SelectItem value="shaypops">Shaypops Inc.</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-3">
                      <Button type="submit" disabled={createPackMutation.isPending}>
                        Create License Pack
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pack Name</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Licenses</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Renewal Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {packsLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">Loading license packs...</TableCell>
                    </TableRow>
                  ) : !licensePacks?.length ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">No license packs found</TableCell>
                    </TableRow>
                  ) : (
                    licensePacks.map((pack: CorporateLicensePack) => (
                      <TableRow key={pack.id}>
                        <TableCell className="font-medium">{pack.packName}</TableCell>
                        <TableCell>{pack.vendor}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{pack.packType}</Badge>
                        </TableCell>
                        <TableCell>
                          {pack.assignedLicenses} / {pack.totalLicenses}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-blue-500 rounded-full" 
                                style={{ width: `${(pack.assignedLicenses / pack.totalLicenses) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm">
                              {Math.round((pack.assignedLicenses / pack.totalLicenses) * 100)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>${pack.totalCost}</TableCell>
                        <TableCell>{new Date(pack.renewalDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(pack.status)}>
                            {pack.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entitlements">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Entitlement Licenses</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Standard user entitlements and feature access
              </p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entitlement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Entitlement License</DialogTitle>
                  <DialogDescription>
                    Add a new entitlement license from a license pack
                  </DialogDescription>
                </DialogHeader>
                <Form {...entitlementForm}>
                  <form onSubmit={entitlementForm.handleSubmit(onCreateEntitlement)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={entitlementForm.control}
                        name="packId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Pack</FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select license pack" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {licensePacks?.map((pack: CorporateLicensePack) => (
                                  <SelectItem key={pack.id} value={pack.id.toString()}>
                                    {pack.packName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={entitlementForm.control}
                        name="licenseName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={entitlementForm.control}
                      name="licenseKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>License Key</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={entitlementForm.control}
                        name="productVersion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Version</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={entitlementForm.control}
                        name="maxUsers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Users</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={entitlementForm.control}
                        name="licenseType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="device">Device</SelectItem>
                                <SelectItem value="site">Site</SelectItem>
                                <SelectItem value="concurrent">Concurrent</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={entitlementForm.control}
                        name="supportLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Support Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="basic">Basic</SelectItem>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                                <SelectItem value="enterprise">Enterprise</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={entitlementForm.control}
                        name="expirationDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiration Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button type="submit" disabled={createEntitlementMutation.isPending}>
                        Create Entitlement License
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>License Name</TableHead>
                    <TableHead>Product Version</TableHead>
                    <TableHead>License Type</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Support Level</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entitlementsLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">Loading entitlement licenses...</TableCell>
                    </TableRow>
                  ) : !entitlementLicenses?.length ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">No entitlement licenses found</TableCell>
                    </TableRow>
                  ) : (
                    entitlementLicenses.map((license: EntitlementLicense) => (
                      <TableRow key={license.id}>
                        <TableCell className="font-medium">{license.licenseName}</TableCell>
                        <TableCell>{license.productVersion}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{license.licenseType}</Badge>
                        </TableCell>
                        <TableCell>
                          {license.assignedUsers} / {license.maxUsers}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{license.supportLevel}</Badge>
                        </TableCell>
                        <TableCell>{new Date(license.expirationDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={license.isActive ? "default" : "secondary"}>
                            {license.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specialized">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Specialized Licenses</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Industry-specific and compliance-required licensing
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>License Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Target Audience</TableHead>
                    <TableHead>Certification Level</TableHead>
                    <TableHead>Max Concurrent Users</TableHead>
                    <TableHead>Training Required</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {specializedLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">Loading specialized licenses...</TableCell>
                    </TableRow>
                  ) : !specializedLicenses?.length ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">No specialized licenses found</TableCell>
                    </TableRow>
                  ) : (
                    specializedLicenses.map((license: SpecializedLicense) => (
                      <TableRow key={license.id}>
                        <TableCell className="font-medium">{license.licenseName}</TableCell>
                        <TableCell>{license.specialization}</TableCell>
                        <TableCell>{license.targetAudience}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{license.certificationLevel}</Badge>
                        </TableCell>
                        <TableCell>{license.maxConcurrentUsers}</TableCell>
                        <TableCell>
                          {license.trainingRequired ? (
                            <Badge variant="destructive">Required</Badge>
                          ) : (
                            <Badge variant="secondary">Optional</Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(license.expirationDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant={license.isActive ? "default" : "secondary"}>
                            {license.isActive ? "Active" : "Inactive"}
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

        <TabsContent value="assignments">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">User License Assignments</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Manage license assignments and user access
              </p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign License
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign License to User</DialogTitle>
                  <DialogDescription>
                    Create a new license assignment for a user
                  </DialogDescription>
                </DialogHeader>
                <Form {...assignmentForm}>
                  <form onSubmit={assignmentForm.handleSubmit(onCreateAssignment)} className="space-y-4">
                    <FormField
                      control={assignmentForm.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User ID</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={assignmentForm.control}
                        name="licenseType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="entitlement">Entitlement</SelectItem>
                                <SelectItem value="specialized">Specialized</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={assignmentForm.control}
                        name="licenseId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>License ID</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={assignmentForm.control}
                      name="assignedBy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assigned By</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={assignmentForm.control}
                      name="assignmentReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assignment Reason</FormLabel>
                          <FormControl>
                            <Textarea {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={assignmentForm.control}
                      name="expirationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiration Date (Optional)</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-3">
                      <Button type="submit" disabled={createAssignmentMutation.isPending}>
                        Assign License
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>License Type</TableHead>
                    <TableHead>License ID</TableHead>
                    <TableHead>Assigned By</TableHead>
                    <TableHead>Assignment Date</TableHead>
                    <TableHead>Expiration Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignmentsLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">Loading assignments...</TableCell>
                    </TableRow>
                  ) : !userAssignments?.length ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">No assignments found</TableCell>
                    </TableRow>
                  ) : (
                    userAssignments.map((assignment: UserLicenseAssignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.userId}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{assignment.licenseType}</Badge>
                        </TableCell>
                        <TableCell>{assignment.licenseId}</TableCell>
                        <TableCell>{assignment.assignedBy}</TableCell>
                        <TableCell>{new Date(assignment.assignmentDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {assignment.expirationDate ? new Date(assignment.expirationDate).toLocaleDateString() : "No expiration"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(assignment.status)}>
                            {assignment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kpis">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Microsoft License KPIs</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time Microsoft 365 license analytics and performance metrics
              </p>
            </div>
            
            <Button onClick={handleSyncMicrosoft} disabled={syncMicrosoftMutation.isPending}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {syncMicrosoftMutation.isPending ? "Syncing..." : "Sync Data"}
            </Button>
          </div>

          {kpisLoading ? (
            <Card>
              <CardContent className="text-center py-8">
                Loading Microsoft license KPIs...
              </CardContent>
            </Card>
          ) : !microsoftKpis?.length ? (
            <Card>
              <CardContent className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No KPI Data Available</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Sync Microsoft license data to view analytics and insights
                </p>
                <Button onClick={handleSyncMicrosoft} disabled={syncMicrosoftMutation.isPending}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Microsoft Data
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {microsoftKpis.map((kpi: MicrosoftLicenseKpis) => (
                <Card key={kpi.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Microsoft 365 KPIs - {kpi.month}/{kpi.year}</span>
                      <Badge variant="outline">
                        Last synced: {new Date(kpi.lastSyncDate).toLocaleDateString()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{kpi.totalLicenses}</div>
                        <div className="text-sm text-gray-600">Total Licenses</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{kpi.assignedLicenses}</div>
                        <div className="text-sm text-gray-600">Assigned</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{kpi.unassignedLicenses}</div>
                        <div className="text-sm text-gray-600">Unassigned</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{kpi.utilizationRate}%</div>
                        <div className="text-sm text-gray-600">Utilization</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">${kpi.costPerMonth}</div>
                        <div className="text-sm text-gray-600">Monthly Cost</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-600">${kpi.costPerLicense}</div>
                        <div className="text-sm text-gray-600">Cost/License</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">License Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">M365 E3</span>
                            <span className="font-medium">{kpi.m365E3Licenses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">M365 E5</span>
                            <span className="font-medium">{kpi.m365E5Licenses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">M365 F3</span>
                            <span className="font-medium">{kpi.m365F3Licenses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Power BI</span>
                            <span className="font-medium">{kpi.powerBiLicenses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Teams</span>
                            <span className="font-medium">{kpi.teamsLicenses}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">User Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Active Users</span>
                            <span className="font-medium text-green-600">{kpi.activeUsers}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Inactive Users</span>
                            <span className="font-medium text-red-600">{kpi.inactiveUsers}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">New Assignments</span>
                            <span className="font-medium text-blue-600">{kpi.newAssignments}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Revoked Licenses</span>
                            <span className="font-medium text-orange-600">{kpi.revokedLicenses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Expiring Soon</span>
                            <span className="font-medium text-yellow-600">{kpi.expiringLicenses}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Security & Compliance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Azure AD P1</span>
                            <span className="font-medium">{kpi.azureAdP1Licenses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Azure AD P2</span>
                            <span className="font-medium">{kpi.azureAdP2Licenses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Intune Devices</span>
                            <span className="font-medium">{kpi.intuneDeviceLicenses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Defender</span>
                            <span className="font-medium">{kpi.defenderLicenses}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Compliance Score</span>
                            <Badge variant="outline">{kpi.complianceScore}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Security Score</span>
                            <Badge variant="outline">{kpi.securityScore}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
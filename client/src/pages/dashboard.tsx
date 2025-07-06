import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Building, 
  AlertTriangle, 
  Ticket, 
  Cloud, 
  Plus,
  TrendingUp,
  CheckCircle,
  Clock,
  BarChart3,
  Users,
  MapPin,
  Factory,
  ShoppingCart,
  Shield,
  DollarSign,
  Zap,
  Target,
  TrendingDown,
  Activity,
  Database,
  Layers,
  Settings
} from "lucide-react";
import type { Brand, DashboardMetrics } from "@/lib/types";
import type { CloudService } from "@shared/schema";

interface HolisticKpis {
  // Business Overview
  totalEmployees: number;
  totalLocations: number;
  activeStores: number;
  activeFacilities: number;
  
  // Operational Excellence
  activeVendors: number;
  openIncidents: number;
  criticalIncidents: number;
  expiringLicenses: number;
  cloudHealth: number;
  
  // Financial Performance
  totalLicenseCost: number;
  averageUtilization: number;
  
  // Manufacturing & Supply Chain
  totalProducts: number;
  activeProductionOrders: number;
  completedProductionOrders: number;
  manufacturingEfficiency: number;
  totalSuppliers: number;
  totalManufacturers: number;
  
  // Infrastructure & Facilities
  activeFacilityProjects: number;
  completedFacilityProjects: number;
  facilityProjectEfficiency: number;
  
  // Risk & Compliance
  complianceScore: number;
  securityScore: number;
  
  // Organizational Structure
  totalCorporates: number;
  totalDivisions: number;
  
  // Performance Trends
  incidentTrend: "increasing" | "stable" | "decreasing";
  licensingTrend: "healthy" | "underutilized" | "overutilized";
  manufacturingTrend: "excellent" | "good" | "needs_improvement";
  facilityTrend: "active_expansion" | "stable" | "declining";
}

interface DashboardProps {
  selectedBrand: Brand;
}

export default function Dashboard({ selectedBrand }: DashboardProps) {
  const { data: holisticKpis, isLoading: holisticLoading } = useQuery<HolisticKpis>({
    queryKey: ["/api/dashboard/holistic-kpis", selectedBrand],
  });

  const { data: cloudServices } = useQuery<CloudService[]>({
    queryKey: ["/api/cloud-services", selectedBrand],
  });

  if (holisticLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-ms-card rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-100 text-green-800">Operational</Badge>;
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>;
      case "outage":
        return <Badge className="bg-red-100 text-red-800">Outage</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
      case "healthy":
      case "excellent":
      case "active_expansion":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "stable":
      case "good":
        return <Activity className="w-4 h-4 text-blue-600" />;
      default:
        return <TrendingDown className="w-4 h-4 text-red-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
      case "healthy":
      case "excellent":
      case "active_expansion":
        return "text-green-600";
      case "stable":
      case "good":
        return "text-blue-600";
      default:
        return "text-red-600";
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ms-text">Business Overview</h1>
          <p className="text-gray-600">Holistic KPI dashboard across all operations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {selectedBrand === "all" ? "All Brands" : selectedBrand.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Executive Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {/* Business Overview */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Organization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-ms-text">{holisticKpis?.totalEmployees || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Global Locations</p>
                <p className="text-2xl font-bold text-ms-text">{holisticKpis?.totalLocations || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Stores</p>
                <p className="text-xl font-semibold text-blue-600">{holisticKpis?.activeStores || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Facilities</p>
                <p className="text-xl font-semibold text-blue-600">{holisticKpis?.activeFacilities || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Operations Health */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Operations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Open Incidents</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-ms-text">{holisticKpis?.openIncidents || 0}</p>
                  {holisticKpis?.criticalIncidents ? (
                    <Badge variant="destructive" className="text-xs">
                      {holisticKpis.criticalIncidents} Critical
                    </Badge>
                  ) : null}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cloud Health</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-green-600">{holisticKpis?.cloudHealth || 0}%</p>
                  <div className="w-12">
                    <Progress value={holisticKpis?.cloudHealth || 0} className="h-2" />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Vendors</p>
                <p className="text-xl font-semibold text-blue-600">{holisticKpis?.activeVendors || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Expiring Licenses</p>
                <p className="text-xl font-semibold text-orange-600">{holisticKpis?.expiringLicenses || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Performance */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              Financial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Monthly License Cost</p>
                <p className="text-2xl font-bold text-ms-text">${holisticKpis?.totalLicenseCost?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">License Utilization</p>
                <div className="flex items-center space-x-3">
                  <p className="text-xl font-semibold text-blue-600">{holisticKpis?.averageUtilization || 0}%</p>
                  <div className="flex-1">
                    <Progress value={holisticKpis?.averageUtilization || 0} className="h-2" />
                  </div>
                  <span className={`text-sm font-medium ${getTrendColor(holisticKpis?.licensingTrend || "stable")}`}>
                    {holisticKpis?.licensingTrend || "stable"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manufacturing & Supply Chain */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Manufacturing Efficiency</p>
                <p className="text-2xl font-bold text-ms-text">{holisticKpis?.manufacturingEfficiency || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Factory className="text-purple-600 w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                {holisticKpis?.activeProductionOrders || 0} active orders
              </p>
              {getTrendIcon(holisticKpis?.manufacturingTrend || "stable")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Supply Chain</p>
                <p className="text-2xl font-bold text-ms-text">{holisticKpis?.totalSuppliers || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="text-orange-600 w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {holisticKpis?.totalManufacturers || 0} manufacturers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Facility Projects</p>
                <p className="text-2xl font-bold text-ms-text">{holisticKpis?.activeFacilityProjects || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="text-green-600 w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                {holisticKpis?.facilityProjectEfficiency || 0}% completion rate
              </p>
              {getTrendIcon(holisticKpis?.facilityTrend || "stable")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold text-green-600">{holisticKpis?.complianceScore || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="text-blue-600 w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Security: {holisticKpis?.securityScore || 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Ticket className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Incident Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getTrendColor(holisticKpis?.incidentTrend || "stable")}`}>
                  {holisticKpis?.incidentTrend || "stable"}
                </span>
                {getTrendIcon(holisticKpis?.incidentTrend || "stable")}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Zap className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">License Utilization</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getTrendColor(holisticKpis?.licensingTrend || "stable")}`}>
                  {holisticKpis?.licensingTrend || "stable"}
                </span>
                {getTrendIcon(holisticKpis?.licensingTrend || "stable")}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Factory className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Manufacturing</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getTrendColor(holisticKpis?.manufacturingTrend || "stable")}`}>
                  {holisticKpis?.manufacturingTrend || "stable"}
                </span>
                {getTrendIcon(holisticKpis?.manufacturingTrend || "stable")}
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium">Facility Expansion</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getTrendColor(holisticKpis?.facilityTrend || "stable")}`}>
                  {holisticKpis?.facilityTrend || "stable"}
                </span>
                {getTrendIcon(holisticKpis?.facilityTrend || "stable")}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-blue-50 text-ms-blue hover:bg-blue-100 border-0">
              <Plus className="mr-3 w-4 h-4" />
              Create Incident
            </Button>
            <Button variant="ghost" className="w-full justify-start hover:bg-gray-50">
              <Settings className="mr-3 w-4 h-4" />
              Review Licenses
            </Button>
            <Button variant="ghost" className="w-full justify-start hover:bg-gray-50">
              <Database className="mr-3 w-4 h-4" />
              Manufacturing Report
            </Button>
            <Button variant="ghost" className="w-full justify-start hover:bg-gray-50">
              <Layers className="mr-3 w-4 h-4" />
              Facility Overview
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Service Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cloud className="w-5 h-5 mr-2 text-blue-600" />
            Service Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cloudServices?.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'operational' ? 'bg-ms-green' : 
                    service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium">{service.serviceName}</span>
                </div>
                {getStatusBadge(service.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

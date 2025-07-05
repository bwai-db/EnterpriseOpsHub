import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  AlertTriangle, 
  Ticket, 
  Cloud, 
  Plus,
  TrendingUp,
  CheckCircle,
  Clock,
  BarChart3
} from "lucide-react";
import type { Brand, DashboardMetrics } from "@/lib/types";
import type { CloudService } from "@shared/schema";

interface DashboardProps {
  selectedBrand: Brand;
}

export default function Dashboard({ selectedBrand }: DashboardProps) {
  const { data: metrics, isLoading: metricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/dashboard/metrics", selectedBrand],
  });

  const { data: cloudServices } = useQuery<CloudService[]>({
    queryKey: ["/api/cloud-services", selectedBrand],
  });

  if (metricsLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
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

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Vendors</p>
                <p className="text-2xl font-bold text-ms-text">{metrics?.activeVendors || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="text-ms-blue w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-ms-green mt-2 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Licenses Expiring</p>
                <p className="text-2xl font-bold text-ms-orange">{metrics?.expiringLicenses || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-ms-orange w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Incidents</p>
                <p className="text-2xl font-bold text-ms-text">{metrics?.openIncidents || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Ticket className="text-ms-green w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-ms-green mt-2 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              -15% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cloud Health</p>
                <p className="text-2xl font-bold text-ms-green">{metrics?.cloudHealth || 0}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Cloud className="text-ms-green w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">All services operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plus className="text-ms-blue w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ms-text">New vendor added: Adobe Creative Suite</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="text-ms-orange w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ms-text">License expiry alert: Microsoft Office 365</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-ms-green w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ms-text">Incident INC-2024-001 resolved</p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-blue-50 text-ms-blue hover:bg-blue-100 border-0">
              <Plus className="mr-3 w-4 h-4" />
              Create Incident
            </Button>
            <Button variant="ghost" className="w-full justify-start hover:bg-gray-50">
              <Building className="mr-3 w-4 h-4" />
              Add Vendor
            </Button>
            <Button variant="ghost" className="w-full justify-start hover:bg-gray-50">
              <AlertTriangle className="mr-3 w-4 h-4" />
              Review Licenses
            </Button>
            <Button variant="ghost" className="w-full justify-start hover:bg-gray-50">
              <BarChart3 className="mr-3 w-4 h-4" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Service Health Overview */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Service Health Overview</CardTitle>
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

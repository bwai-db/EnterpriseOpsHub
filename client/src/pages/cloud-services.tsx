import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Activity, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { Brand } from "@/lib/types";
import type { CloudService } from "@shared/schema";

interface CloudServicesProps {
  selectedBrand: Brand;
}

export default function CloudServices({ selectedBrand }: CloudServicesProps) {
  const { data: services, isLoading } = useQuery<CloudService[]>({
    queryKey: ["/api/cloud-services", selectedBrand],
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="w-5 h-5 text-ms-green" />;
      case "degraded":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "outage":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

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

  const formatLastChecked = (date: Date | string) => {
    const now = new Date();
    const checked = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - checked.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-ms-card rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const operationalServices = services?.filter(s => s.status === "operational").length || 0;
  const degradedServices = services?.filter(s => s.status === "degraded").length || 0;
  const outageServices = services?.filter(s => s.status === "outage").length || 0;
  const totalServices = services?.length || 0;

  const overallHealth = totalServices > 0 
    ? Math.round((operationalServices / totalServices) * 1000) / 10 
    : 100;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ms-text">Cloud Services Monitoring</h2>
        <p className="text-gray-600 mt-2">Real-time status of all cloud services and platforms</p>
      </div>

      {/* Overall Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Health</p>
                <p className="text-2xl font-bold text-ms-green">{overallHealth}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Cloud className="text-ms-green w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Operational</p>
                <p className="text-2xl font-bold text-ms-green">{operationalServices}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-ms-green w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Degraded</p>
                <p className="text-2xl font-bold text-yellow-600">{degradedServices}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-yellow-600 w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outages</p>
                <p className="text-2xl font-bold text-red-600">{outageServices}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="text-red-600 w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{service.serviceName}</CardTitle>
                {getStatusIcon(service.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status:</span>
                  {getStatusBadge(service.status)}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Provider:</span>
                  <span className="text-sm font-medium">{service.provider.toUpperCase()}</span>
                </div>
                
                {service.region && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Region:</span>
                    <span className="text-sm font-medium">{service.region}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Checked:</span>
                  <span className="text-sm text-gray-500">
                    {formatLastChecked(service.lastChecked)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Details Table */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Service Status History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Activity className="mx-auto w-12 h-12 mb-4 text-gray-300" />
            <p>Service history and detailed monitoring coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

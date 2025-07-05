import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Server, 
  Database, 
  Cloud, 
  Shield, 
  Smartphone,
  Printer,
  Cpu,
  RefreshCw,
  Search,
  Filter,
  ExternalLink
} from "lucide-react";
import type { Brand } from "@/lib/types";
import ServiceDependencyMap from "@/components/service-dependency-map";
import ImpactAnalysis from "@/components/impact-analysis";

interface ServiceManagementProps {
  selectedBrand: Brand;
}

export default function ServiceManagement({ selectedBrand }: ServiceManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedService, setSelectedService] = useState<number | null>(null);

  // Fetch service categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/service-categories', selectedBrand],
    queryFn: () => fetch(`/api/service-categories?brand=${selectedBrand}`).then(res => res.json())
  });

  // Fetch ITIL services
  const { data: services = [] } = useQuery({
    queryKey: ['/api/itil-services', selectedBrand],
    queryFn: () => fetch(`/api/itil-services?brand=${selectedBrand}`).then(res => res.json())
  });

  // Fetch configuration items
  const { data: configItems = [] } = useQuery({
    queryKey: ['/api/configuration-items', selectedBrand, selectedClass],
    queryFn: () => {
      const params = new URLSearchParams({ brand: selectedBrand });
      if (selectedClass !== "all") params.append("ciClass", selectedClass);
      return fetch(`/api/configuration-items?${params}`).then(res => res.json());
    }
  });

  // Fetch change requests
  const { data: changeRequests = [] } = useQuery({
    queryKey: ['/api/change-requests', selectedBrand],
    queryFn: () => fetch(`/api/change-requests?brand=${selectedBrand}`).then(res => res.json())
  });

  // Fetch service relationships
  const { data: serviceRelationships = [] } = useQuery({
    queryKey: ['/api/service-relationships'],
    queryFn: () => fetch('/api/service-relationships').then(res => res.json())
  });

  // Fetch CI relationships
  const { data: ciRelationships = [] } = useQuery({
    queryKey: ['/api/ci-relationships'],
    queryFn: () => fetch('/api/ci-relationships').then(res => res.json())
  });

  const getServiceIcon = (serviceCode: string) => {
    if (serviceCode.includes('AZURE') || serviceCode.includes('AZ-')) return <Cloud className="h-4 w-4" />;
    if (serviceCode.includes('ENTRA') || serviceCode.includes('IDENTITY')) return <Shield className="h-4 w-4" />;
    if (serviceCode.includes('INTUNE') || serviceCode.includes('HYBRID')) return <Smartphone className="h-4 w-4" />;
    if (serviceCode.includes('PRINT')) return <Printer className="h-4 w-4" />;
    if (serviceCode.includes('CAD') || serviceCode.includes('3D')) return <Cpu className="h-4 w-4" />;
    return <Server className="h-4 w-4" />;
  };

  const getCriticality = (criticality: string) => {
    const colors = {
      critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    };
    return colors[criticality as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      operational: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      planned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      retired: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      under_change: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      maintenance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    };
    return colors[status as keyof typeof colors] || colors.operational;
  };

  const filteredConfigItems = configItems.filter(item =>
    item.ciName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ciType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">ITIL Service Management</h1>
          <p className="text-muted-foreground">
            Configuration Management Database (CMDB) and Service Catalog
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Service Portal
          </Button>
        </div>
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="cmdb">Configuration Items</TabsTrigger>
          <TabsTrigger value="changes">Change Requests</TabsTrigger>
          <TabsTrigger value="dependencies">Service Dependencies</TabsTrigger>
          <TabsTrigger value="impact">Impact Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <div className="grid gap-4">
            {categories.map((category: any) => {
              const categoryServices = services.filter((s: any) => s.categoryId === category.id);
              if (categoryServices.length === 0) return null;
              
              return (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="h-5 w-5" />
                      <span>{category.name}</span>
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {categoryServices.map((service: any) => (
                        <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getServiceIcon(service.serviceCode)}
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{service.serviceName}</span>
                                <Badge variant="outline">{service.serviceCode}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge className={getCriticality(service.businessCriticality)}>
                                  {service.businessCriticality}
                                </Badge>
                                <Badge className={getStatusColor(service.serviceStatus)}>
                                  {service.serviceStatus}
                                </Badge>
                                <span className="text-xs text-muted-foreground">SLA: {service.slaTarget}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Owner</p>
                            <p className="text-sm font-medium">{service.serviceOwner}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="cmdb" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search configuration items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="azure">Azure</SelectItem>
                <SelectItem value="m365">Microsoft 365</SelectItem>
                <SelectItem value="intune">Intune</SelectItem>
                <SelectItem value="identity">Identity</SelectItem>
                <SelectItem value="hybrid_endpoint">Hybrid Endpoint</SelectItem>
                <SelectItem value="print">Print Services</SelectItem>
                <SelectItem value="cad">CAD Workstations</SelectItem>
                <SelectItem value="3d_printing">3D Printing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredConfigItems.map((ci: any) => (
              <Card key={ci.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getServiceIcon(ci.ciClass)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{ci.ciName}</span>
                          <Badge variant="outline">{ci.ciType}</Badge>
                          <Badge variant="secondary">{ci.ciClass}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge className={getStatusColor(ci.status)}>
                            {ci.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Environment: {ci.environment}
                          </span>
                          {ci.vendor && (
                            <span className="text-sm text-muted-foreground">
                              Vendor: {ci.vendor}
                            </span>
                          )}
                          {ci.lastSyncDate && (
                            <span className="text-sm text-muted-foreground">
                              Last Sync: {new Date(ci.lastSyncDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {ci.assignedTo && (
                        <div>
                          <p className="text-sm text-muted-foreground">Assigned To</p>
                          <p className="text-sm font-medium">{ci.assignedTo}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {ci.attributes && (
                    <div className="mt-3 p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-2">Configuration Details</p>
                      <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                        {JSON.stringify(JSON.parse(ci.attributes || '{}'), null, 2)}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="changes" className="space-y-4">
          <div className="grid gap-4">
            {changeRequests.map((change: any) => (
              <Card key={change.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{change.title}</span>
                        <Badge variant="outline">{change.changeNumber}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{change.description}</p>
                      <div className="flex items-center space-x-4">
                        <Badge className={getStatusColor(change.status)}>
                          {change.status}
                        </Badge>
                        <Badge className={getCriticality(change.priority)}>
                          {change.priority} priority
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Type: {change.changeType}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          Risk: {change.risk}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Requested By</p>
                      <p className="text-sm font-medium">{change.requestedBy}</p>
                      {change.plannedStartDate && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Planned Start</p>
                          <p className="text-sm">{new Date(change.plannedStartDate).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <ServiceDependencyMap
            services={services}
            configItems={configItems}
            relationships={serviceRelationships}
            onServiceSelect={(serviceId) => setSelectedService(serviceId)}
            selectedService={selectedService || undefined}
          />
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          <ImpactAnalysis
            services={services}
            configItems={configItems}
            relationships={serviceRelationships}
            selectedService={selectedService || undefined}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
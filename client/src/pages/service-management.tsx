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
  ExternalLink,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
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

  const filteredConfigItems = configItems.filter((item: any) =>
    item.ciName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ciType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate KPIs for each tab
  const serviceKPIs = {
    total: services.length,
    operational: services.filter((s: any) => s.status === 'operational').length,
    planned: services.filter((s: any) => s.status === 'planned').length,
    retired: services.filter((s: any) => s.status === 'retired').length,
    criticalServices: services.filter((s: any) => s.criticality === 'critical').length,
    highServices: services.filter((s: any) => s.criticality === 'high').length
  };

  const configItemKPIs = {
    total: configItems.length,
    operational: configItems.filter((ci: any) => ci.status === 'operational').length,
    maintenance: configItems.filter((ci: any) => ci.status === 'maintenance').length,
    retired: configItems.filter((ci: any) => ci.status === 'retired').length,
    cloudItems: configItems.filter((ci: any) => ci.environment === 'cloud').length,
    onPremItems: configItems.filter((ci: any) => ci.environment === 'on-premises').length,
    criticalItems: configItems.filter((ci: any) => ci.criticality === 'critical').length
  };

  const changeKPIs = {
    total: changeRequests.length,
    pending: changeRequests.filter((cr: any) => cr.status === 'pending').length,
    approved: changeRequests.filter((cr: any) => cr.status === 'approved').length,
    implemented: changeRequests.filter((cr: any) => cr.status === 'implemented').length,
    rejected: changeRequests.filter((cr: any) => cr.status === 'rejected').length,
    emergencyChanges: changeRequests.filter((cr: any) => cr.priority === 'emergency').length,
    standardChanges: changeRequests.filter((cr: any) => cr.changeType === 'standard').length
  };

  const KPICard = ({ title, value, icon, trend, subtitle }: any) => (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
        <div className="flex flex-col items-end">
          {icon}
          {trend && (
            <div className={`flex items-center mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span className="text-xs ml-1">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </div>
    </Card>
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
          {/* Services KPI Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <KPICard
              title="Total Services"
              value={serviceKPIs.total}
              icon={<Server className="h-5 w-5 text-blue-600" />}
              subtitle="All services"
            />
            <KPICard
              title="Operational"
              value={serviceKPIs.operational}
              icon={<CheckCircle className="h-5 w-5 text-green-600" />}
              trend={2.5}
              subtitle="Currently running"
            />
            <KPICard
              title="Critical Services"
              value={serviceKPIs.criticalServices}
              icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
              subtitle="High priority"
            />
            <KPICard
              title="High Priority"
              value={serviceKPIs.highServices}
              icon={<Activity className="h-5 w-5 text-orange-600" />}
              subtitle="Important services"
            />
            <KPICard
              title="Planned"
              value={serviceKPIs.planned}
              icon={<Clock className="h-5 w-5 text-blue-600" />}
              subtitle="Upcoming deployment"
            />
            <KPICard
              title="Retired"
              value={serviceKPIs.retired}
              icon={<Database className="h-5 w-5 text-gray-600" />}
              subtitle="Legacy services"
            />
          </div>

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
          {/* Configuration Items KPI Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <KPICard
              title="Total CIs"
              value={configItemKPIs.total}
              icon={<Database className="h-5 w-5 text-blue-600" />}
              subtitle="All configuration items"
            />
            <KPICard
              title="Operational"
              value={configItemKPIs.operational}
              icon={<CheckCircle className="h-5 w-5 text-green-600" />}
              trend={1.8}
              subtitle="Currently active"
            />
            <KPICard
              title="Cloud Items"
              value={configItemKPIs.cloudItems}
              icon={<Cloud className="h-5 w-5 text-blue-600" />}
              subtitle="Cloud hosted"
            />
            <KPICard
              title="On-Premises"
              value={configItemKPIs.onPremItems}
              icon={<Server className="h-5 w-5 text-gray-600" />}
              subtitle="Local infrastructure"
            />
            <KPICard
              title="Critical Items"
              value={configItemKPIs.criticalItems}
              icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
              subtitle="High priority"
            />
            <KPICard
              title="Maintenance"
              value={configItemKPIs.maintenance}
              icon={<Activity className="h-5 w-5 text-orange-600" />}
              subtitle="Under maintenance"
            />
            <KPICard
              title="Retired"
              value={configItemKPIs.retired}
              icon={<Clock className="h-5 w-5 text-gray-600" />}
              subtitle="End of life"
            />
          </div>

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
                  {ci.secureBaseline && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="h-4 w-4 text-green-600" />
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">Security Baseline Configuration</p>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(JSON.parse(ci.secureBaseline)).map(([category, controls]: [string, any]) => (
                          <div key={category} className="space-y-1">
                            <p className="text-xs font-medium text-green-700 dark:text-green-300 capitalize">
                              {category.replace(/_/g, ' ')}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 ml-2">
                              {Object.entries(controls).map(([control, value]: [string, any]) => (
                                <div key={control} className="text-xs text-green-600 dark:text-green-400">
                                  <span className="font-medium">{control.replace(/_/g, ' ')}:</span> {value}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="changes" className="space-y-4">
          {/* Change Requests KPI Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
            <KPICard
              title="Total Changes"
              value={changeKPIs.total}
              icon={<RefreshCw className="h-5 w-5 text-blue-600" />}
              subtitle="All change requests"
            />
            <KPICard
              title="Pending"
              value={changeKPIs.pending}
              icon={<Clock className="h-5 w-5 text-orange-600" />}
              subtitle="Awaiting approval"
            />
            <KPICard
              title="Approved"
              value={changeKPIs.approved}
              icon={<CheckCircle className="h-5 w-5 text-green-600" />}
              trend={3.2}
              subtitle="Ready for implementation"
            />
            <KPICard
              title="Implemented"
              value={changeKPIs.implemented}
              icon={<Activity className="h-5 w-5 text-blue-600" />}
              subtitle="Successfully completed"
            />
            <KPICard
              title="Emergency"
              value={changeKPIs.emergencyChanges}
              icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
              subtitle="High priority changes"
            />
            <KPICard
              title="Standard"
              value={changeKPIs.standardChanges}
              icon={<Server className="h-5 w-5 text-gray-600" />}
              subtitle="Routine changes"
            />
            <KPICard
              title="Rejected"
              value={changeKPIs.rejected}
              icon={<Shield className="h-5 w-5 text-red-600" />}
              subtitle="Risk mitigated"
            />
          </div>

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
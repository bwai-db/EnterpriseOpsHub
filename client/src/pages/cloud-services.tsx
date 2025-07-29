import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cloud, Activity, CheckCircle, AlertTriangle, XCircle, Plus, Bot, Zap, Users, FileText, Database, Globe, Smartphone, Settings } from "lucide-react";
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

      {/* Self-Service Deployments */}
      <div className="mb-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-ms-text mb-2">Self-Service Deployments</h3>
          <p className="text-gray-600">Quick deploy automated services and applications with one-click provisioning</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* AI-Powered Services */}
          <Card className="hover:shadow-lg transition-all duration-200 border-blue-200 hover:border-blue-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-base">AI Requirements Agent</CardTitle>
                  <Badge variant="outline" className="text-xs">5 min setup</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm mb-4">
                Deploy an AI-powered web app to help teams ideate and gather requirements with intelligent conversation flows.
              </CardDescription>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Azure OpenAI integration
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Requirements export to Word
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Team collaboration features
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Deploy Now
              </Button>
            </CardContent>
          </Card>

          {/* Power Platform Services */}
          <Card className="hover:shadow-lg transition-all duration-200 border-purple-200 hover:border-purple-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-base">New PowerApp</CardTitle>
                  <Badge variant="outline" className="text-xs">2 min setup</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm mb-4">
                Create a new PowerApp with pre-configured templates, data connections, and governance policies.
              </CardDescription>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Template gallery access
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  SharePoint integration
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Auto-approval workflow
                </div>
              </div>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create PowerApp
              </Button>
            </CardContent>
          </Card>

          {/* Microsoft Teams Services */}
          <Card className="hover:shadow-lg transition-all duration-200 border-indigo-200 hover:border-indigo-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-base">New Teams Workspace</CardTitle>
                  <Badge variant="outline" className="text-xs">3 min setup</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm mb-4">
                Provision a new Microsoft Teams workspace with channels, SharePoint site, and security policies.
              </CardDescription>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Project template setup
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Guest access controls
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Document library sync
                </div>
              </div>
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </CardContent>
          </Card>

          {/* Document Automation */}
          <Card className="hover:shadow-lg transition-all duration-200 border-green-200 hover:border-green-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Document Processor</CardTitle>
                  <Badge variant="outline" className="text-xs">4 min setup</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm mb-4">
                Deploy AI-powered document processing with OCR, data extraction, and automated workflows.
              </CardDescription>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Form Recognizer AI
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  SharePoint integration
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Power Automate flows
                </div>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Deploy Service
              </Button>
            </CardContent>
          </Card>

          {/* Database Services */}
          <Card className="hover:shadow-lg transition-all duration-200 border-orange-200 hover:border-orange-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Quick Database</CardTitle>
                  <Badge variant="outline" className="text-xs">6 min setup</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm mb-4">
                Provision secure Azure SQL Database with backup policies, monitoring, and connection strings.
              </CardDescription>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Automated backups
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  TDE encryption
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Performance monitoring
                </div>
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Database
              </Button>
            </CardContent>
          </Card>

          {/* Web Application */}
          <Card className="hover:shadow-lg transition-all duration-200 border-teal-200 hover:border-teal-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Static Web App</CardTitle>
                  <Badge variant="outline" className="text-xs">3 min setup</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm mb-4">
                Deploy a React/Vue/Angular web app with GitHub integration, custom domains, and SSL certificates.
              </CardDescription>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  GitHub Actions CI/CD
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Custom domain & SSL
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Global CDN deployment
                </div>
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Deploy Web App
              </Button>
            </CardContent>
          </Card>

          {/* Mobile App Backend */}
          <Card className="hover:shadow-lg transition-all duration-200 border-pink-200 hover:border-pink-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Mobile App Backend</CardTitle>
                  <Badge variant="outline" className="text-xs">8 min setup</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm mb-4">
                Complete mobile backend with authentication, push notifications, and offline sync capabilities.
              </CardDescription>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Azure AD B2C auth
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Push notification hub
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Offline data sync
                </div>
              </div>
              <Button className="w-full bg-pink-600 hover:bg-pink-700" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Setup Backend
              </Button>
            </CardContent>
          </Card>

          {/* Process Automation */}
          <Card className="hover:shadow-lg transition-all duration-200 border-cyan-200 hover:border-cyan-300">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <CardTitle className="text-base">Workflow Automation</CardTitle>
                  <Badge variant="outline" className="text-xs">7 min setup</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm mb-4">
                Create automated business processes with approvals, notifications, and data transformations.
              </CardDescription>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Power Automate flows
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Approval workflows
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                  Multi-system integration
                </div>
              </div>
              <Button className="w-full bg-cyan-600 hover:bg-cyan-700" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Build Workflow
              </Button>
            </CardContent>
          </Card>
        </div>
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

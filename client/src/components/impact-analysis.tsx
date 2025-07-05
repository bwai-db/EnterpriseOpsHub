import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle
} from "lucide-react";

interface ImpactAnalysisProps {
  services: any[];
  configItems: any[];
  relationships: any[];
  selectedService?: number;
}

export default function ImpactAnalysis({ 
  services, 
  configItems, 
  relationships, 
  selectedService 
}: ImpactAnalysisProps) {
  const [analysisType, setAnalysisType] = useState<"outage" | "change" | "security">("outage");
  const [selectedServiceId, setSelectedServiceId] = useState<number>(selectedService || 0);

  const service = services.find(s => s.id === selectedServiceId);

  const getAffectedServices = (serviceId: number, depth = 0): any[] => {
    if (depth > 3) return []; // Prevent infinite loops
    
    const directlyAffected = relationships
      .filter(rel => rel.parentServiceId === serviceId)
      .map(rel => services.find(s => s.id === rel.childServiceId))
      .filter(Boolean);
    
    const indirectlyAffected = directlyAffected.flatMap(affectedService => 
      getAffectedServices(affectedService.id, depth + 1)
    );
    
    return [...directlyAffected, ...indirectlyAffected];
  };

  const getAffectedConfigItems = (serviceId: number): any[] => {
    return configItems.filter(ci => ci.serviceId === serviceId);
  };

  const calculateBusinessImpact = (affectedServices: any[]) => {
    const criticalServices = affectedServices.filter(s => s.businessCriticality === 'critical').length;
    const highServices = affectedServices.filter(s => s.businessCriticality === 'high').length;
    const totalServices = affectedServices.length;
    
    if (criticalServices > 0) return 'critical';
    if (highServices > 2) return 'high';
    if (totalServices > 3) return 'medium';
    return 'low';
  };

  const getImpactColor = (impact: string) => {
    const colors = {
      critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    };
    return colors[impact as keyof typeof colors] || colors.medium;
  };

  const generateImpactScenario = () => {
    if (!service) return null;

    const affectedServices = getAffectedServices(selectedServiceId);
    const affectedCIs = getAffectedConfigItems(selectedServiceId);
    const businessImpact = calculateBusinessImpact([service, ...affectedServices]);

    const scenarios = {
      outage: {
        title: "Service Outage Impact",
        description: `Analysis of impact if ${service.serviceName} becomes unavailable`,
        impacts: [
          {
            type: "Services",
            count: affectedServices.length,
            details: affectedServices.map(s => s.serviceName),
            severity: businessImpact
          },
          {
            type: "Configuration Items",
            count: affectedCIs.length,
            details: affectedCIs.map(ci => ci.ciName),
            severity: "medium"
          },
          {
            type: "Estimated Users",
            count: service.businessCriticality === 'critical' ? 500 : 
                   service.businessCriticality === 'high' ? 200 : 50,
            details: ["End users", "Administrative users", "External partners"],
            severity: businessImpact
          }
        ]
      },
      change: {
        title: "Change Impact Analysis",
        description: `Analysis of risks when implementing changes to ${service.serviceName}`,
        impacts: [
          {
            type: "Dependent Services",
            count: affectedServices.length,
            details: affectedServices.map(s => s.serviceName),
            severity: "medium"
          },
          {
            type: "Testing Required",
            count: affectedServices.length + affectedCIs.length,
            details: ["Functional testing", "Integration testing", "Performance testing"],
            severity: "low"
          },
          {
            type: "Rollback Complexity",
            count: 1,
            details: ["Database changes", "Configuration updates", "Service dependencies"],
            severity: businessImpact === 'critical' ? 'high' : 'medium'
          }
        ]
      },
      security: {
        title: "Security Impact Assessment",
        description: `Security implications of issues affecting ${service.serviceName}`,
        impacts: [
          {
            type: "Data Exposure Risk",
            count: 1,
            details: ["Customer data", "Business data", "System credentials"],
            severity: service.businessCriticality === 'critical' ? 'critical' : 'high'
          },
          {
            type: "Access Control Impact",
            count: affectedServices.length,
            details: affectedServices.map(s => s.serviceName),
            severity: "high"
          },
          {
            type: "Compliance Requirements",
            count: 1,
            details: ["GDPR compliance", "SOX compliance", "Industry standards"],
            severity: "medium"
          }
        ]
      }
    };

    return scenarios[analysisType];
  };

  const scenario = generateImpactScenario();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Impact Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Assess potential business and technical impact
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedServiceId.toString()} onValueChange={(value) => setSelectedServiceId(parseInt(value))}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {services.map(service => (
                <SelectItem key={service.id} value={service.id.toString()}>
                  {service.serviceName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={analysisType} onValueChange={(value: "outage" | "change" | "security") => setAnalysisType(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outage">Outage Impact</SelectItem>
              <SelectItem value="change">Change Impact</SelectItem>
              <SelectItem value="security">Security Impact</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {service && scenario && (
        <div className="grid gap-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>{scenario.title}</strong><br />
              {scenario.description}
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-3">
            {scenario.impacts.map((impact, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>{impact.type}</span>
                    <Badge className={getImpactColor(impact.severity)}>
                      {impact.severity}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{impact.count}</div>
                  <div className="space-y-1">
                    {impact.details.slice(0, 3).map((detail, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground flex items-center">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full mr-2"></div>
                        {detail}
                      </div>
                    ))}
                    {impact.details.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{impact.details.length - 3} more
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Immediate Actions</div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                      Notify stakeholders
                    </div>
                    <div className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                      Assess service dependencies
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-3 w-3 mr-2 text-yellow-500" />
                      Activate incident response
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Follow-up Actions</div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Clock className="h-3 w-3 mr-2 text-yellow-500" />
                      Document lessons learned
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-3 w-3 mr-2 text-yellow-500" />
                      Update runbooks
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-3 w-3 mr-2 text-yellow-500" />
                      Review monitoring
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Estimated Recovery Time: {service.businessCriticality === 'critical' ? '< 1 hour' : 
                                             service.businessCriticality === 'high' ? '< 4 hours' : '< 24 hours'}
                  </div>
                  <Button variant="outline" size="sm">
                    Generate Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
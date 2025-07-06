import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Brain, Zap, Target, PieChart, TrendingUp, TrendingDown, Activity, Clock, 
  CheckCircle, XCircle, Lightbulb, Sparkles, DollarSign, Users, Shield, 
  Calendar, AlertTriangle, BarChart3, RefreshCw, Download, Filter
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

  // Severity badge styling
  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200",
      high: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200",
      low: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200"
    };
    return variants[severity as keyof typeof variants] || variants.low;
  };

  // Filter insights based on selected filter
  const filteredInsights = insightFilter === "all" 
    ? aiInsights 
    : aiInsights.filter(insight => insight.type === insightFilter);

  const handleOptimizeAction = (insightId: string) => {
    toast({ 
      title: "Optimization Started", 
      description: "AI recommendation is being processed..." 
    });
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            AI License Management Center
          </h1>
          <p className="text-muted-foreground">
            Intelligent license optimization with comprehensive analytics and cost management
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedBrand} onValueChange={(value: BrandFilter) => setSelectedBrand(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="blorcs">Blorcs</SelectItem>
              <SelectItem value="shaypops">Shaypops</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Licenses
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* License KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Licenses</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKpis.totalLicenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(mockKpis.utilizationRate)}</div>
            <Progress value={mockKpis.utilizationRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockKpis.monthlyCost)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+3.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(mockKpis.complianceScore)}</div>
            <Progress value={mockKpis.complianceScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{mockKpis.expiringIn30Days}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Cost Wastage Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 mb-2">
              {formatCurrency(mockKpis.wastageAmount)}
            </div>
            <p className="text-sm text-muted-foreground mb-4">Monthly wastage from unused licenses</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Unassigned E5 Licenses</span>
                <span className="font-medium">{formatCurrency(28450)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Inactive User Licenses</span>
                <span className="font-medium">{formatCurrency(18200)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Overprovisioned Add-ons</span>
                <span className="font-medium">{formatCurrency(6190)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Optimization Potential
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatCurrency(146720)}
            </div>
            <p className="text-sm text-muted-foreground mb-4">Annual savings potential</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>License Rightsizing</span>
                <span className="font-medium">{formatCurrency(89400)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Contract Optimization</span>
                <span className="font-medium">{formatCurrency(34800)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Usage Optimization</span>
                <span className="font-medium">{formatCurrency(22520)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              Renewal Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{mockKpis.renewalsThisQuarter}</div>
            <p className="text-sm text-muted-foreground mb-4">Contracts this quarter</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>This Month</span>
                <span className="font-medium text-red-600">3 contracts</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Next Month</span>
                <span className="font-medium text-orange-600">2 contracts</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Month After</span>
                <span className="font-medium text-yellow-600">3 contracts</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-blue-500" />
              <div>
                <CardTitle>AI-Powered Insights & Recommendations</CardTitle>
                <CardDescription>
                  Smart optimization suggestions based on usage patterns and cost analysis
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Select value={insightFilter} onValueChange={setInsightFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter insights" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Insights</SelectItem>
                  <SelectItem value="cost_optimization">Cost Optimization</SelectItem>
                  <SelectItem value="utilization">Utilization</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="renewal">Renewal</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Auto-Optimize
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInsights.map((insight) => (
              <div key={insight.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {insight.severity === 'critical' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                      {insight.severity === 'high' && <TrendingUp className="h-5 w-5 text-orange-500" />}
                      {insight.severity === 'medium' && <BarChart3 className="h-5 w-5 text-yellow-500" />}
                      {insight.severity === 'low' && <Lightbulb className="h-5 w-5 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <Badge className={getSeverityBadge(insight.severity)}>
                          {insight.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{insight.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                      <p className="text-sm font-medium text-blue-600">{insight.recommendation}</p>
                      {insight.potentialSavings && (
                        <p className="text-sm text-green-600 font-medium mt-1">
                          Potential annual savings: {formatCurrency(insight.potentialSavings)}
                        </p>
                      )}
                      {insight.impactedLicenses && (
                        <p className="text-xs text-muted-foreground">
                          Affects {insight.impactedLicenses} licenses
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                    <Button size="sm" onClick={() => handleOptimizeAction(insight.id)}>
                      Apply Fix
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="microsoft">Microsoft 365</TabsTrigger>
          <TabsTrigger value="assignments">User Assignments</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>License Distribution by Vendor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Microsoft</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="w-20" />
                      <span className="text-sm font-medium">1,850</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Adobe</span>
                    <div className="flex items-center gap-2">
                      <Progress value={20} className="w-20" />
                      <span className="text-sm font-medium">569</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Atlassian</span>
                    <div className="flex items-center gap-2">
                      <Progress value={8} className="w-20" />
                      <span className="text-sm font-medium">228</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Other</span>
                    <div className="flex items-center gap-2">
                      <Progress value={7} className="w-20" />
                      <span className="text-sm font-medium">200</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Cost Centers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Microsoft 365 E5</span>
                    <span className="font-medium">{formatCurrency(105400)}/mo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Adobe Creative Cloud</span>
                    <span className="font-medium">{formatCurrency(34200)}/mo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Power Platform Premium</span>
                    <span className="font-medium">{formatCurrency(28900)}/mo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Azure AD Premium P2</span>
                    <span className="font-medium">{formatCurrency(18600)}/mo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Microsoft 365 E3</span>
                    <span className="font-medium">{formatCurrency(58580)}/mo</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="microsoft" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Microsoft 365 License Breakdown</CardTitle>
              <CardDescription>
                Detailed view of Microsoft 365 subscriptions and usage patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">850</div>
                  <div className="text-sm text-muted-foreground">E5 Licenses</div>
                  <div className="text-xs">78% utilized</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">1,200</div>
                  <div className="text-sm text-muted-foreground">E3 Licenses</div>
                  <div className="text-xs">89% utilized</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">250</div>
                  <div className="text-sm text-muted-foreground">F3 Licenses</div>
                  <div className="text-xs">92% utilized</div>
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>License Type</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Cost/Month</TableHead>
                    <TableHead>Utilization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Microsoft 365 E5</TableCell>
                    <TableCell>663</TableCell>
                    <TableCell>187</TableCell>
                    <TableCell>{formatCurrency(48450)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={78} className="w-16" />
                        <span className="text-sm">78%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Microsoft 365 E3</TableCell>
                    <TableCell>1,068</TableCell>
                    <TableCell>132</TableCell>
                    <TableCell>{formatCurrency(23760)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={89} className="w-16" />
                        <span className="text-sm">89%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Microsoft 365 F3</TableCell>
                    <TableCell>230</TableCell>
                    <TableCell>20</TableCell>
                    <TableCell>{formatCurrency(2000)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={92} className="w-16" />
                        <span className="text-sm">92%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent License Assignments</CardTitle>
              <CardDescription>
                Track and manage user license assignments across the organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Assigned Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Sarah Chen</TableCell>
                    <TableCell>Microsoft 365 E5</TableCell>
                    <TableCell>Dec 15, 2024</TableCell>
                    <TableCell><Badge variant="default">Active</Badge></TableCell>
                    <TableCell>2 hours ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Marcus Rodriguez</TableCell>
                    <TableCell>Adobe Creative Cloud</TableCell>
                    <TableCell>Dec 14, 2024</TableCell>
                    <TableCell><Badge variant="default">Active</Badge></TableCell>
                    <TableCell>1 day ago</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jennifer Wu</TableCell>
                    <TableCell>Power BI Premium</TableCell>
                    <TableCell>Dec 12, 2024</TableCell>
                    <TableCell><Badge variant="secondary">Inactive</Badge></TableCell>
                    <TableCell>7 days ago</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Dashboard</CardTitle>
              <CardDescription>
                Monitor license compliance and security requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Security Compliance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">MFA Enabled Users</span>
                      <div className="flex items-center gap-2">
                        <Progress value={96} className="w-20" />
                        <span className="text-sm">96%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Conditional Access</span>
                      <div className="flex items-center gap-2">
                        <Progress value={84} className="w-20" />
                        <span className="text-sm">84%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Device Compliance</span>
                      <div className="flex items-center gap-2">
                        <Progress value={91} className="w-20" />
                        <span className="text-sm">91%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">License Compliance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Properly Assigned</span>
                      <div className="flex items-center gap-2">
                        <Progress value={98} className="w-20" />
                        <span className="text-sm">98%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Usage Tracking</span>
                      <div className="flex items-center gap-2">
                        <Progress value={87} className="w-20" />
                        <span className="text-sm">87%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Audit Readiness</span>
                      <div className="flex items-center gap-2">
                        <Progress value={94} className="w-20" />
                        <span className="text-sm">94%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cost Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Q1 2024</span>
                    <span className="font-medium">{formatCurrency(692000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Q2 2024</span>
                    <span className="font-medium">{formatCurrency(718000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Q3 2024</span>
                    <span className="font-medium">{formatCurrency(745000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Q4 2024 (Proj.)</span>
                    <span className="font-medium">{formatCurrency(772000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Peak Usage Hours</span>
                      <span className="text-sm font-medium">9 AM - 5 PM</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Weekend Activity</span>
                      <span className="text-sm font-medium">23% of weekday</span>
                    </div>
                    <Progress value={23} />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Mobile Access</span>
                      <span className="text-sm font-medium">67% of users</span>
                    </div>
                    <Progress value={67} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Brain, Zap, Target, Users, ArrowRightLeft, CheckCircle, 
  TrendingUp, DollarSign, AlertCircle, Sparkles, RefreshCw,
  UserPlus, UserMinus, ArrowRight, Clock
} from "lucide-react";

interface RedistributionRecommendation {
  id: string;
  type: 'downgrade' | 'upgrade' | 'reassign' | 'remove';
  fromUser: string;
  toUser?: string;
  fromLicense: string;
  toLicense?: string;
  reason: string;
  impact: string;
  savings: number;
  priority: 'high' | 'medium' | 'low';
  department: string;
  lastActivity: string;
  confidence: number;
}

interface RedistributionPlan {
  totalSavings: number;
  totalAffectedUsers: number;
  categories: {
    downgrades: number;
    reassignments: number;
    removals: number;
  };
  timeToComplete: string;
  riskLevel: 'low' | 'medium' | 'high';
}

// Mock redistribution data
const mockRecommendations: RedistributionRecommendation[] = [
  {
    id: "recom-1",
    type: "downgrade",
    fromUser: "Jennifer Wu (IT)",
    fromLicense: "Microsoft 365 E5",
    toLicense: "Microsoft 365 E3",
    reason: "No advanced security features usage for 90+ days",
    impact: "Basic productivity tools maintained",
    savings: 684,
    priority: "high",
    department: "IT Infrastructure",
    lastActivity: "92 days ago",
    confidence: 95
  },
  {
    id: "recom-2",
    type: "reassign",
    fromUser: "Mark Thompson (HR)",
    toUser: "Sarah Chen (Marketing)",
    fromLicense: "Adobe Creative Cloud All Apps",
    reason: "Mark: No usage in 45 days, Sarah: Requesting creative tools",
    impact: "Improved marketing content creation capability",
    savings: 0,
    priority: "medium",
    department: "Marketing",
    lastActivity: "45 days ago",
    confidence: 88
  },
  {
    id: "recom-3",
    type: "remove",
    fromUser: "Alex Rodriguez (Sales)",
    fromLicense: "Power BI Premium",
    reason: "Inactive user, role changed to non-analytical position",
    impact: "No impact on current responsibilities",
    savings: 240,
    priority: "high",
    department: "Sales",
    lastActivity: "67 days ago",
    confidence: 92
  },
  {
    id: "recom-4",
    type: "downgrade",
    fromUser: "Lisa Park (Operations)",
    fromLicense: "Microsoft 365 E5",
    toLicense: "Microsoft 365 E3",
    reason: "Advanced compliance features unused",
    impact: "Core office apps and email retained",
    savings: 684,
    priority: "medium",
    department: "Operations",
    lastActivity: "78 days ago",
    confidence: 85
  },
  {
    id: "recom-5",
    type: "reassign",
    fromUser: "David Kim (Finance)",
    toUser: "Emma Wilson (Finance)",
    fromLicense: "Power Platform Premium",
    reason: "David: Minimal usage, Emma: Heavy Excel/Power Apps user",
    impact: "Enhanced automation capabilities for active user",
    savings: 0,
    priority: "low",
    department: "Finance",
    lastActivity: "34 days ago",
    confidence: 78
  }
];

const mockPlan: RedistributionPlan = {
  totalSavings: 20568,
  totalAffectedUsers: 23,
  categories: {
    downgrades: 8,
    reassignments: 12,
    removals: 3
  },
  timeToComplete: "2-3 business days",
  riskLevel: "low"
};

export default function LicenseRedistribution() {
  const [selectedRecommendations, setSelectedRecommendations] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const redistributeLicensesMutation = useMutation({
    mutationFn: (recommendations: string[]) => 
      apiRequest("/api/licenses/redistribute", { 
        method: "POST",
        body: JSON.stringify({ recommendations })
      }),
    onSuccess: () => {
      toast({ 
        title: "License Redistribution Complete", 
        description: "All selected recommendations have been applied successfully" 
      });
      setSelectedRecommendations([]);
      setProcessing(false);
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to redistribute licenses", 
        variant: "destructive" 
      });
      setProcessing(false);
    },
  });

  const handleSelectRecommendation = (id: string) => {
    setSelectedRecommendations(prev => 
      prev.includes(id) 
        ? prev.filter(recId => recId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRecommendations.length === mockRecommendations.length) {
      setSelectedRecommendations([]);
    } else {
      setSelectedRecommendations(mockRecommendations.map(r => r.id));
    }
  };

  const handleApplySelected = () => {
    if (selectedRecommendations.length === 0) {
      toast({ 
        title: "No Recommendations Selected", 
        description: "Please select at least one recommendation to apply",
        variant: "destructive"
      });
      return;
    }
    
    setProcessing(true);
    redistributeLicensesMutation.mutate(selectedRecommendations);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'downgrade': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'upgrade': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'reassign': return <ArrowRightLeft className="h-4 w-4 text-blue-500" />;
      case 'remove': return <UserMinus className="h-4 w-4 text-red-500" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      downgrade: "bg-orange-100 text-orange-800 border-orange-200",
      upgrade: "bg-green-100 text-green-800 border-green-200", 
      reassign: "bg-blue-100 text-blue-800 border-blue-200",
      remove: "bg-red-100 text-red-800 border-red-200"
    };
    return variants[type as keyof typeof variants] || variants.reassign;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-green-100 text-green-800 border-green-200"
    };
    return variants[priority as keyof typeof variants] || variants.medium;
  };

  const calculateSelectedSavings = () => {
    return mockRecommendations
      .filter(r => selectedRecommendations.includes(r.id))
      .reduce((total, r) => total + r.savings, 0);
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-purple-600" />
            AI License Redistribution
          </h1>
          <p className="text-muted-foreground">
            Optimize license allocation with intelligent redistribution recommendations
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Analyze Usage
          </Button>
          <Button 
            onClick={handleApplySelected}
            disabled={selectedRecommendations.length === 0 || processing}
          >
            <Zap className="h-4 w-4 mr-2" />
            Apply Selected ({selectedRecommendations.length})
          </Button>
        </div>
      </div>

      {/* Redistribution Plan Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Potential Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(mockPlan.totalSavings)}
            </div>
            <p className="text-xs text-muted-foreground">Annual savings opportunity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Affected Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPlan.totalAffectedUsers}</div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Implementation Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPlan.timeToComplete}</div>
            <p className="text-xs text-muted-foreground">Expected completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 capitalize">{mockPlan.riskLevel}</div>
            <p className="text-xs text-muted-foreground">Business impact assessment</p>
          </CardContent>
        </Card>
      </div>

      {/* Redistribution Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-500" />
              License Downgrades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{mockPlan.categories.downgrades}</div>
            <p className="text-sm text-muted-foreground mb-4">Users suitable for lower-tier licenses</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>E5 → E3</span>
                <span className="font-medium">6 users</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Premium → Standard</span>
                <span className="font-medium">2 users</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-blue-500" />
              License Reassignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{mockPlan.categories.reassignments}</div>
            <p className="text-sm text-muted-foreground mb-4">Licenses to redistribute between users</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Creative Cloud</span>
                <span className="font-medium">4 licenses</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Power Platform</span>
                <span className="font-medium">5 licenses</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Power BI Premium</span>
                <span className="font-medium">3 licenses</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserMinus className="h-5 w-5 text-red-500" />
              License Removals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{mockPlan.categories.removals}</div>
            <p className="text-sm text-muted-foreground mb-4">Unused licenses to be removed</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Inactive Users</span>
                <span className="font-medium">2 licenses</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Role Changes</span>
                <span className="font-medium">1 license</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected Summary */}
      {selectedRecommendations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <CheckCircle className="h-5 w-5" />
              Selected Recommendations Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {selectedRecommendations.length}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-300">Actions Selected</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(calculateSelectedSavings())}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-300">Annual Savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {Math.round(calculateSelectedSavings() / 12)}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-300">Monthly Savings</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                AI Redistribution Recommendations
              </CardTitle>
              <CardDescription>
                Smart recommendations based on usage patterns and business requirements
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleSelectAll}>
              {selectedRecommendations.length === mockRecommendations.length ? "Deselect All" : "Select All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>User/License</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Savings</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRecommendations.map((recommendation) => (
                <TableRow key={recommendation.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRecommendations.includes(recommendation.id)}
                      onChange={() => handleSelectRecommendation(recommendation.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(recommendation.type)}
                      <Badge className={getTypeBadge(recommendation.type)}>
                        {recommendation.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{recommendation.fromUser}</div>
                      <div className="text-sm text-muted-foreground">{recommendation.fromLicense}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {recommendation.type === 'reassign' && recommendation.toUser ? (
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4" />
                          <div className="text-sm">{recommendation.toUser}</div>
                        </div>
                      ) : recommendation.toLicense ? (
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4" />
                          <div className="text-sm">{recommendation.toLicense}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Remove license</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="text-sm">{recommendation.reason}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Last activity: {recommendation.lastActivity}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{recommendation.department}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {recommendation.savings > 0 
                        ? formatCurrency(recommendation.savings) + "/year"
                        : "Cost neutral"
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityBadge(recommendation.priority)}>
                      {recommendation.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={recommendation.confidence} className="w-16" />
                      <span className="text-sm">{recommendation.confidence}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Building2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Settings, 
  Users, 
  ShoppingCart, 
  Factory, 
  Link,
  FileText,
  Rocket,
  Palette,
  Globe
} from "lucide-react";

interface Brand {
  id: number;
  name: string;
  code: string;
  displayName: string;
  description?: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  website?: string;
  industry?: string;
  headquarters?: string;
  foundedYear?: number;
  employeeCount?: number;
  revenue?: number;
  isActive: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface OnboardingStep {
  id: number;
  brandId: number;
  stepName: string;
  stepDescription?: string;
  isCompleted: boolean;
  completedAt?: string;
  completedBy?: number;
  sortOrder: number;
  createdAt: string;
}

interface OnboardingProgress {
  completedSteps: number;
  totalSteps: number;
  percentage: number;
}

const stepIcons = {
  "Corporate Structure Setup": Building2,
  "User Management Integration": Users,
  "Vendor & License Setup": ShoppingCart,
  "Service Management Configuration": Settings,
  "Retail Operations Setup": ShoppingCart,
  "Supply Chain Integration": Factory,
  "Integration & API Setup": Link,
  "Documentation & Training": FileText,
};

export default function BrandOnboarding() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    displayName: "",
    description: "",
    logoUrl: "",
    primaryColor: "#3B82F6",
    secondaryColor: "#64748B",
    website: "",
    industry: "",
    headquarters: "",
    foundedYear: new Date().getFullYear(),
    employeeCount: 0,
    revenue: 0,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch brands
  const { data: brands = [], isLoading: brandsLoading } = useQuery({
    queryKey: ["/api/brands"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/brands");
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
  });

  // Fetch onboarding progress for selected brand
  const { data: progress } = useQuery({
    queryKey: ["/api/brands", selectedBrand?.id, "onboarding-progress"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/brands/${selectedBrand?.id}/onboarding-progress`);
      return response.json();
    },
    enabled: !!selectedBrand,
  });

  // Fetch onboarding steps for selected brand
  const { data: onboardingSteps = [] } = useQuery({
    queryKey: ["/api/brands", selectedBrand?.id, "onboarding-steps"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/brands/${selectedBrand?.id}/onboarding-steps`);
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: !!selectedBrand,
  });

  // Create brand mutation
  const createBrandMutation = useMutation({
    mutationFn: async (brandData: any) => {
      const response = await apiRequest("POST", "/api/brands/onboard", brandData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Success",
        description: "Brand onboarded successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to onboard brand.",
        variant: "destructive",
      });
    },
  });

  // Complete step mutation
  const completeStepMutation = useMutation({
    mutationFn: async ({ stepId, userId }: { stepId: number; userId: number }) => {
      const response = await apiRequest("PATCH", `/api/onboarding-steps/${stepId}/complete`, { userId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands", selectedBrand?.id] });
      toast({
        title: "Success",
        description: "Onboarding step completed!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete step.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      displayName: "",
      description: "",
      logoUrl: "",
      primaryColor: "#3B82F6",
      secondaryColor: "#64748B",
      website: "",
      industry: "",
      headquarters: "",
      foundedYear: new Date().getFullYear(),
      employeeCount: 0,
      revenue: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert numeric fields to proper types
    const submitData = {
      ...formData,
      foundedYear: formData.foundedYear ? Number(formData.foundedYear) : undefined,
      employeeCount: formData.employeeCount ? Number(formData.employeeCount) : undefined,
      revenue: formData.revenue ? Number(formData.revenue) : undefined,
    };
    createBrandMutation.mutate(submitData);
  };

  const handleCompleteStep = (stepId: number) => {
    completeStepMutation.mutate({ stepId, userId: 1 }); // Using demo user ID
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ms-text">Brand Onboarding Center</h2>
          <p className="text-gray-600 mt-2">
            Streamlined brand onboarding with automated downstream integration
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-ms-blue hover:bg-ms-blue/90">
              <Plus className="w-4 h-4 mr-2" />
              Onboard New Brand
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="onboard-brand-description">
            <DialogHeader>
              <DialogTitle>Onboard New Brand</DialogTitle>
              <p id="onboard-brand-description" className="text-sm text-gray-600">
                Create a new brand and initialize its onboarding workflow for enterprise operations integration.
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Brand Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., TechCorp Industries"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="code">Brand Code</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange("code", e.target.value.toLowerCase())}
                    placeholder="e.g., techcorp"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange("displayName", e.target.value)}
                  placeholder="e.g., TechCorp"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of the brand..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                      placeholder="#64748B"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="headquarters">Headquarters</Label>
                  <Input
                    id="headquarters"
                    value={formData.headquarters}
                    onChange={(e) => handleInputChange("headquarters", e.target.value)}
                    placeholder="e.g., New York, NY"
                  />
                </div>
                <div>
                  <Label htmlFor="foundedYear">Founded Year</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    value={formData.foundedYear}
                    onChange={(e) => handleInputChange("foundedYear", parseInt(e.target.value))}
                    min="1800"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div>
                  <Label htmlFor="employeeCount">Employee Count</Label>
                  <Input
                    id="employeeCount"
                    type="number"
                    value={formData.employeeCount}
                    onChange={(e) => handleInputChange("employeeCount", parseInt(e.target.value))}
                    min="0"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createBrandMutation.isPending}>
                  {createBrandMutation.isPending ? "Creating..." : "Create Brand"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Brand Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand: Brand) => (
              <Card key={brand.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                    onClick={() => setSelectedBrand(brand)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: brand.primaryColor }}
                      >
                        {brand.displayName.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{brand.displayName}</CardTitle>
                        <p className="text-sm text-gray-500">@{brand.code}</p>
                      </div>
                    </div>
                    <Badge variant={brand.isActive ? "default" : "secondary"}>
                      {brand.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {brand.industry && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building2 className="w-4 h-4 mr-2" />
                        {brand.industry}
                      </div>
                    )}
                    {brand.headquarters && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Globe className="w-4 h-4 mr-2" />
                        {brand.headquarters}
                      </div>
                    )}
                    {brand.employeeCount && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {brand.employeeCount.toLocaleString()} employees
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-2">
                      <Badge variant={brand.onboardingCompleted ? "default" : "destructive"}>
                        {brand.onboardingCompleted ? "Onboarded" : "Pending"}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBrand(brand);
                        }}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {brands.length === 0 && !brandsLoading && (
            <Card>
              <CardContent className="text-center py-12">
                <Rocket className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No brands yet</h3>
                <p className="text-gray-600 mb-4">
                  Get started by onboarding your first brand to the platform.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Onboard First Brand
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          {selectedBrand ? (
            <>
              {/* Brand Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                        style={{ backgroundColor: selectedBrand.primaryColor }}
                      >
                        {selectedBrand.displayName.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{selectedBrand.displayName}</CardTitle>
                        <p className="text-gray-600">{selectedBrand.description}</p>
                      </div>
                    </div>
                    <Badge variant={selectedBrand.onboardingCompleted ? "default" : "destructive"}>
                      {selectedBrand.onboardingCompleted ? "Completed" : "In Progress"}
                    </Badge>
                  </div>
                </CardHeader>
                {progress && (
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Onboarding Progress</span>
                        <span>{progress.percentage}%</span>
                      </div>
                      <Progress value={progress.percentage} className="h-2" />
                      <p className="text-sm text-gray-600">
                        {progress.completedSteps} of {progress.totalSteps} steps completed
                      </p>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Onboarding Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Onboarding Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {onboardingSteps.map((step: OnboardingStep, index: number) => {
                      const IconComponent = stepIcons[step.stepName as keyof typeof stepIcons] || Settings;
                      return (
                        <div key={step.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {step.isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <IconComponent className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{step.stepName}</h4>
                            <p className="text-sm text-gray-600">{step.stepDescription}</p>
                            {step.completedAt && (
                              <p className="text-xs text-green-600 mt-1">
                                Completed on {new Date(step.completedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={step.isCompleted ? "default" : "secondary"}>
                              {step.isCompleted ? "Completed" : "Pending"}
                            </Badge>
                            {!step.isCompleted && (
                              <Button 
                                size="sm" 
                                onClick={() => handleCompleteStep(step.id)}
                                disabled={completeStepMutation.isPending}
                              >
                                {completeStepMutation.isPending ? "Completing..." : "Complete"}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a brand</h3>
                <p className="text-gray-600">
                  Choose a brand from the overview tab to view its onboarding progress.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
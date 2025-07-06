import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building, MapPin, Users, Calendar, TrendingUp, AlertTriangle, Wrench, PlusCircle, Monitor, FileText, Activity, Server } from "lucide-react";
import type { Brand } from "@/lib/types";

interface FacilitiesManagementProps {
  selectedBrand: Brand;
}

interface Facility {
  id: number;
  facilityCode: string;
  facilityName: string;
  facilityType: string;
  status: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  timezone: string;
  buildingSize?: number;
  floors?: number;
  capacity?: number;
  currentOccupancy?: number;
  facilityManager?: string;
  brand: string;
}

interface FacilityProject {
  id: number;
  projectNumber: string;
  projectName: string;
  projectType: string;
  facilityId: number;
  status: string;
  priority: string;
  estimatedCost?: number;
  actualCost?: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  brand: string;
}

interface FacilityImprovement {
  id: number;
  improvementNumber: string;
  title: string;
  category: string;
  facilityId: number;
  status: string;
  urgency: string;
  estimatedCost?: number;
  submittedBy: string;
  brand: string;
}

interface FacilityRequest {
  id: number;
  requestNumber: string;
  requestType: string;
  facilityId: number;
  title: string;
  priority: string;
  status: string;
  requestedBy: string;
  requestDate: string;
  brand: string;
}

interface FacilityIncident {
  id: number;
  incidentNumber: string;
  facilityId: number;
  title: string;
  incidentType: string;
  severity: string;
  status: string;
  reportedBy: string;
  occurredAt: string;
  brand: string;
}

interface ConfigurationItem {
  id: number;
  ciName: string;
  ciType: string;
  ciClass: string;
  status: string;
  environment: string;
  location: string;
  assignedTo: string;
  vendor: string;
  model: string;
  brand: string;
  attributes?: any;
  secureBaseline?: any;
}

export default function FacilitiesManagement({ selectedBrand }: FacilitiesManagementProps) {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch facilities
  const { data: facilities = [], isLoading: facilitiesLoading } = useQuery({
    queryKey: ["/api/facilities", selectedBrand],
    queryFn: async () => {
      const params = selectedBrand !== "all" ? `?brand=${selectedBrand}` : "";
      const res = await fetch(`/api/facilities${params}`);
      if (!res.ok) throw new Error("Failed to fetch facilities");
      return res.json() as Promise<Facility[]>;
    }
  });

  // Fetch facility-specific data when a facility is selected
  const { data: projects = [] } = useQuery({
    queryKey: ["/api/facility-projects", selectedBrand, selectedFacility?.id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedBrand !== "all") params.append("brand", selectedBrand);
      if (selectedFacility?.id) params.append("facilityId", selectedFacility.id.toString());
      const res = await fetch(`/api/facility-projects?${params}`);
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json() as Promise<FacilityProject[]>;
    },
    enabled: !!selectedFacility
  });

  const { data: improvements = [] } = useQuery({
    queryKey: ["/api/facility-improvements", selectedBrand, selectedFacility?.id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedBrand !== "all") params.append("brand", selectedBrand);
      if (selectedFacility?.id) params.append("facilityId", selectedFacility.id.toString());
      const res = await fetch(`/api/facility-improvements?${params}`);
      if (!res.ok) throw new Error("Failed to fetch improvements");
      return res.json() as Promise<FacilityImprovement[]>;
    },
    enabled: !!selectedFacility
  });

  const { data: requests = [] } = useQuery({
    queryKey: ["/api/facility-requests", selectedBrand, selectedFacility?.id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedBrand !== "all") params.append("brand", selectedBrand);
      if (selectedFacility?.id) params.append("facilityId", selectedFacility.id.toString());
      const res = await fetch(`/api/facility-requests?${params}`);
      if (!res.ok) throw new Error("Failed to fetch requests");
      return res.json() as Promise<FacilityRequest[]>;
    },
    enabled: !!selectedFacility
  });

  const { data: incidents = [] } = useQuery({
    queryKey: ["/api/facility-incidents", selectedBrand, selectedFacility?.id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedBrand !== "all") params.append("brand", selectedBrand);
      if (selectedFacility?.id) params.append("facilityId", selectedFacility.id.toString());
      const res = await fetch(`/api/facility-incidents?${params}`);
      if (!res.ok) throw new Error("Failed to fetch incidents");
      return res.json() as Promise<FacilityIncident[]>;
    },
    enabled: !!selectedFacility
  });

  // Fetch configuration items for selected facility
  const { data: configurationItems = [], isLoading: cisLoading } = useQuery({
    queryKey: ["/api/configuration-items", selectedFacility?.facilityCode, selectedBrand],
    queryFn: async () => {
      if (!selectedFacility) return [];
      const params = new URLSearchParams();
      if (selectedBrand !== "all") params.set('brand', selectedBrand);
      
      const res = await fetch(`/api/configuration-items?${params}`);
      if (!res.ok) throw new Error("Failed to fetch configuration items");
      const allCIs = await res.json() as ConfigurationItem[];
      
      // Filter CIs by facility location
      return allCIs.filter(ci => ci.location && ci.location.includes(selectedFacility.facilityCode));
    },
    enabled: !!selectedFacility
  });

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'inactive': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      'under_construction': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'planned': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'decommissioned': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'open': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'in_progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'approved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'low': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'high': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'critical': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'urgent': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      'emergency': 'bg-red-500 text-white dark:bg-red-600'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  if (facilitiesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading facilities...</p>
        </div>
      </div>
    );
  }

  if (selectedFacility) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => setSelectedFacility(null)}>
              ← Back to Facilities
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{selectedFacility.facilityName}</h1>
              <p className="text-muted-foreground">
                {selectedFacility.facilityCode} • {selectedFacility.city}, {selectedFacility.country}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(selectedFacility.status)}>
            {selectedFacility.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {selectedFacility.currentOccupancy || 0}/{selectedFacility.capacity || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedFacility.capacity ? 
                  `${Math.round(((selectedFacility.currentOccupancy || 0) / selectedFacility.capacity) * 100)}% capacity` 
                  : 'Capacity not set'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter(p => p.status === 'in_progress').length}
              </div>
              <p className="text-xs text-muted-foreground">
                {projects.length} total projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter(r => ['open', 'assigned', 'in_progress'].includes(r.status)).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {requests.length} total requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {incidents.filter(i => ['open', 'investigating', 'in_progress'].includes(i.status)).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {incidents.length} total incidents
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Configuration Items</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {configurationItems.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {configurationItems.filter(ci => ci.status === 'active').length} active configuration items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Infrastructure Health</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {configurationItems.length > 0 ? 
                  Math.round((configurationItems.filter(ci => ci.status === 'active').length / configurationItems.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Operational status
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="improvements">Improvements</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="configuration">Configuration Items</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Facility Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Type</span>
                      <p className="capitalize">{selectedFacility.facilityType.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Building Size</span>
                      <p>{selectedFacility.buildingSize ? `${selectedFacility.buildingSize.toLocaleString()} sq ft` : 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Floors</span>
                      <p>{selectedFacility.floors || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-muted-foreground">Timezone</span>
                      <p>{selectedFacility.timezone}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Address</span>
                    <p>{selectedFacility.address}</p>
                    <p>{selectedFacility.city}{selectedFacility.state ? `, ${selectedFacility.state}` : ''}, {selectedFacility.country}</p>
                  </div>
                  {selectedFacility.facilityManager && (
                    <>
                      <Separator />
                      <div>
                        <span className="text-sm font-medium text-muted-foreground">Facility Manager</span>
                        <p>{selectedFacility.facilityManager}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...incidents, ...requests, ...projects]
                      .sort((a, b) => {
                        let dateA = '';
                        let dateB = '';
                        
                        if ('occurredAt' in a) dateA = a.occurredAt;
                        else if ('requestDate' in a) dateA = a.requestDate;
                        else if ('plannedStartDate' in a) dateA = a.plannedStartDate;
                        
                        if ('occurredAt' in b) dateB = b.occurredAt;
                        else if ('requestDate' in b) dateB = b.requestDate;
                        else if ('plannedStartDate' in b) dateB = b.plannedStartDate;
                        
                        return new Date(dateB).getTime() - new Date(dateA).getTime();
                      })
                      .slice(0, 5)
                      .map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {'incidentType' in item ? (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            ) : 'requestType' in item ? (
                              <FileText className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Building className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {'title' in item ? item.title : 
                               'projectName' in item ? item.projectName : 
                               'Unknown'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {'incidentType' in item ? `Incident • ${item.incidentType}` :
                               'requestType' in item ? `Request • ${item.requestType}` :
                               'projectType' in item ? `Project • ${item.projectType}` :
                               'Unknown type'}
                            </p>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Facility Projects</h3>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{project.projectName}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardDescription>
                      {project.projectNumber} • {project.projectType.replace('_', ' ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Priority:</span>
                        <Badge variant="outline" className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                      </div>
                      {project.estimatedCost && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Budget:</span>
                          <span className="font-medium">${project.estimatedCost.toLocaleString()}</span>
                        </div>
                      )}
                      {project.plannedStartDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Start Date:</span>
                          <span>{new Date(project.plannedStartDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {projects.length === 0 && (
              <div className="text-center py-8">
                <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Projects Found</h3>
                <p className="text-sm text-muted-foreground">Projects for this facility will appear here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="improvements" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Facility Improvements</h3>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Improvement
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {improvements.map((improvement) => (
                <Card key={improvement.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{improvement.title}</CardTitle>
                      <Badge className={getStatusColor(improvement.status)}>
                        {improvement.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardDescription>
                      {improvement.improvementNumber} • {improvement.category}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Urgency:</span>
                        <Badge variant="outline" className={getPriorityColor(improvement.urgency)}>
                          {improvement.urgency}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Submitted by:</span>
                        <span>{improvement.submittedBy}</span>
                      </div>
                      {improvement.estimatedCost && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Est. Cost:</span>
                          <span className="font-medium">${improvement.estimatedCost.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {improvements.length === 0 && (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Improvements Found</h3>
                <p className="text-sm text-muted-foreground">Improvement suggestions for this facility will appear here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Facility Requests</h3>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((request) => (
                <Card key={request.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{request.title}</CardTitle>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardDescription>
                      {request.requestNumber} • {request.requestType.replace('_', ' ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Priority:</span>
                        <Badge variant="outline" className={getPriorityColor(request.priority)}>
                          {request.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Requested by:</span>
                        <span>{request.requestedBy}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span>{new Date(request.requestDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {requests.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Requests Found</h3>
                <p className="text-sm text-muted-foreground">Service requests for this facility will appear here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="incidents" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Facility Incidents</h3>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Report Incident
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incidents.map((incident) => (
                <Card key={incident.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{incident.title}</CardTitle>
                      <Badge className={getStatusColor(incident.status)}>
                        {incident.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardDescription>
                      {incident.incidentNumber} • {incident.incidentType.replace('_', ' ')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Severity:</span>
                        <Badge variant="outline" className={getPriorityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Reported by:</span>
                        <span>{incident.reportedBy}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Occurred:</span>
                        <span>{new Date(incident.occurredAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {incidents.length === 0 && (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Incidents Found</h3>
                <p className="text-sm text-muted-foreground">Facility incidents will appear here when reported.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Configuration Items</h3>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Configuration Item
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {configurationItems.map((ci) => (
                <Card key={ci.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{ci.ciName}</CardTitle>
                      <Badge className={getStatusColor(ci.status)}>
                        {ci.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <CardDescription>
                      {ci.ciType.replace('_', ' ')} • {ci.ciClass}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Environment:</span>
                        <Badge variant="outline">
                          {ci.environment}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Vendor:</span>
                        <span>{ci.vendor}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Model:</span>
                        <span>{ci.model}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Location:</span>
                        <p className="text-xs mt-1">{ci.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {configurationItems.length === 0 && (
              <div className="text-center py-8">
                <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Configuration Items Found</h3>
                <p className="text-sm text-muted-foreground">Configuration items for this facility will appear here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Main facilities overview
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Facilities Management</h1>
          <p className="text-muted-foreground">
            Managing {facilities.length} corporate facilities worldwide
          </p>
        </div>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Facility
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilities.length}</div>
            <p className="text-xs text-muted-foreground">
              {facilities.filter(f => f.status === 'active').length} active facilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {facilities.reduce((sum, f) => sum + (f.capacity || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {facilities.reduce((sum, f) => sum + (f.currentOccupancy || 0), 0).toLocaleString()} current occupancy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(facilities.map(f => f.country)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Global presence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Building Size</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(facilities.reduce((sum, f) => sum + (f.buildingSize || 0), 0) / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground">
              Total sq ft
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <Card 
            key={facility.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedFacility(facility)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{facility.facilityName}</CardTitle>
                <Badge className={getStatusColor(facility.status)}>
                  {facility.status.replace('_', ' ')}
                </Badge>
              </div>
              <CardDescription>{facility.facilityCode}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2" />
                  {facility.city}, {facility.country}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building className="h-4 w-4 mr-2" />
                  {facility.facilityType.replace('_', ' ').charAt(0).toUpperCase() + facility.facilityType.replace('_', ' ').slice(1)}
                </div>

                {facility.capacity && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    {facility.currentOccupancy || 0}/{facility.capacity} capacity
                  </div>
                )}

                {facility.facilityManager && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Manager: </span>
                    <span className="font-medium">{facility.facilityManager}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {facilities.length === 0 && (
        <div className="text-center py-12">
          <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium text-muted-foreground mb-2">No Facilities Found</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Get started by adding your first corporate facility.
          </p>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Your First Facility
          </Button>
        </div>
      )}
    </div>
  );
}
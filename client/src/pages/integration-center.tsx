import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Code, Key, Globe, Shield, CheckCircle, AlertTriangle, Clock, Trash2, Edit, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { IntegrationLibrary, IntegrationEndpoint, IntegrationCredential } from "@shared/schema";

interface IntegrationCenterProps {
  selectedBrand: string;
}

export default function IntegrationCenter({ selectedBrand: initialBrand }: IntegrationCenterProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand || "all");
  const [isLibraryDialogOpen, setIsLibraryDialogOpen] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<IntegrationLibrary | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: libraries = [], isLoading: librariesLoading } = useQuery<IntegrationLibrary[]>({
    queryKey: ['/api/integration-libraries', selectedBrand],
    queryFn: () => apiRequest(`/api/integration-libraries?brand=${selectedBrand}`),
  });

  const { data: endpoints = [] } = useQuery<IntegrationEndpoint[]>({
    queryKey: ['/api/integration-endpoints'],
    queryFn: () => apiRequest('/api/integration-endpoints'),
  });

  const { data: credentials = [] } = useQuery<IntegrationCredential[]>({
    queryKey: ['/api/integration-credentials'],
    queryFn: () => apiRequest('/api/integration-credentials'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/integration-libraries/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integration-libraries'] });
      toast({ title: "Success", description: "Integration library deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete integration library", variant: "destructive" });
    }
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      development: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      testing: { color: "bg-blue-100 text-blue-800", icon: AlertTriangle },
      production: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      deprecated: { color: "bg-gray-100 text-gray-800", icon: AlertTriangle }
    };
    
    const config = statusMap[status as keyof typeof statusMap] || statusMap.development;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} text-xs`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryMap = {
      api: "bg-blue-100 text-blue-800",
      sdk: "bg-purple-100 text-purple-800",
      webhook: "bg-orange-100 text-orange-800",
      middleware: "bg-indigo-100 text-indigo-800"
    };
    
    return (
      <Badge className={`${categoryMap[category as keyof typeof categoryMap] || 'bg-gray-100 text-gray-800'} text-xs`}>
        {category.toUpperCase()}
      </Badge>
    );
  };

  const getLibraryEndpoints = (libraryId: number) => {
    return endpoints.filter(endpoint => endpoint.libraryId === libraryId);
  };

  const getLibraryCredentials = (libraryId: number) => {
    return credentials.filter(credential => credential.libraryId === libraryId);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this integration library?')) {
      deleteMutation.mutate(id);
    }
  };

  if (librariesLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integration Center</h1>
          <p className="text-gray-600">Manage API libraries, endpoints, and credentials for enterprise integrations</p>
        </div>
        <div className="flex gap-4">
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              <SelectItem value="blorcs">Blorcs</SelectItem>
              <SelectItem value="shaypops">Shaypops</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isLibraryDialogOpen} onOpenChange={setIsLibraryDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Library
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Integration Library</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Library Name</Label>
                    <Input id="name" placeholder="e.g., Microsoft Graph API" />
                  </div>
                  <div>
                    <Label htmlFor="provider">Provider</Label>
                    <Input id="provider" placeholder="e.g., microsoft" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="api">API</SelectItem>
                        <SelectItem value="sdk">SDK</SelectItem>
                        <SelectItem value="webhook">Webhook</SelectItem>
                        <SelectItem value="middleware">Middleware</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="version">Version</Label>
                    <Input id="version" placeholder="e.g., 1.0.0" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe the integration library purpose and capabilities" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsLibraryDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Create Library</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Libraries</p>
                <p className="text-2xl font-bold">{libraries.length}</p>
              </div>
              <Code className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Endpoints</p>
                <p className="text-2xl font-bold">{endpoints.length}</p>
              </div>
              <Globe className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Credentials</p>
                <p className="text-2xl font-bold">{credentials.length}</p>
              </div>
              <Key className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Production Ready</p>
                <p className="text-2xl font-bold">{libraries.filter(l => l.status === 'production').length}</p>
              </div>
              <Shield className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {libraries.map((library) => {
          const libraryEndpoints = getLibraryEndpoints(library.id);
          const libraryCredentials = getLibraryCredentials(library.id);
          
          return (
            <Card key={library.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{library.name}</CardTitle>
                      {getCategoryBadge(library.category)}
                      {getStatusBadge(library.status)}
                    </div>
                    <p className="text-gray-600">{library.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Provider: {library.provider}</span>
                      <span>Version: {library.version}</span>
                      <span>Auth: {library.authMethod}</span>
                      <span>Endpoints: {libraryEndpoints.length}</span>
                      <span>Credentials: {libraryCredentials.length}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {library.documentation && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={library.documentation} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Docs
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => setSelectedLibrary(library)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(library.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="endpoints" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="endpoints">Endpoints ({libraryEndpoints.length})</TabsTrigger>
                    <TabsTrigger value="credentials">Credentials ({libraryCredentials.length})</TabsTrigger>
                    <TabsTrigger value="config">Configuration</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="endpoints" className="mt-4">
                    {libraryEndpoints.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Method</TableHead>
                            <TableHead>Endpoint</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Auth Required</TableHead>
                            <TableHead>Permissions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {libraryEndpoints.map((endpoint) => (
                            <TableRow key={endpoint.id}>
                              <TableCell>
                                <Badge variant="outline" className="font-mono text-xs">
                                  {endpoint.method}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {endpoint.endpoint}
                              </TableCell>
                              <TableCell className="max-w-xs truncate">
                                {endpoint.description}
                              </TableCell>
                              <TableCell>
                                {endpoint.requiresAuth ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <span className="text-gray-400">No</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {endpoint.permissions?.slice(0, 2).map((permission, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {permission}
                                    </Badge>
                                  ))}
                                  {endpoint.permissions && endpoint.permissions.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{endpoint.permissions.length - 2} more
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No endpoints configured for this library
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="credentials" className="mt-4">
                    {libraryCredentials.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Environment</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Client ID</TableHead>
                            <TableHead>Scopes</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Used</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {libraryCredentials.map((credential) => (
                            <TableRow key={credential.id}>
                              <TableCell>
                                <Badge variant="outline">
                                  {credential.environment}
                                </Badge>
                              </TableCell>
                              <TableCell>{credential.credentialType}</TableCell>
                              <TableCell className="font-mono text-sm">
                                {credential.clientId ? `${credential.clientId.substring(0, 8)}...` : 'N/A'}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  {credential.scopes?.slice(0, 1).map((scope, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {scope}
                                    </Badge>
                                  ))}
                                  {credential.scopes && credential.scopes.length > 1 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{credential.scopes.length - 1} more
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {credential.isActive ? (
                                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                                ) : (
                                  <Badge variant="outline">Inactive</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-sm text-gray-500">
                                {credential.lastUsed ? new Date(credential.lastUsed).toLocaleDateString() : 'Never'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No credentials configured for this library
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="config" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Base Configuration</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Base URL:</span>
                            <span className="font-mono">{library.baseUrl || 'Not configured'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Rate Limits:</span>
                            <span>{library.rateLimits || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Maintainer:</span>
                            <span>{library.maintainer || 'Not assigned'}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Dependencies & Environment</h4>
                        <div className="space-y-3">
                          {library.dependencies && library.dependencies.length > 0 && (
                            <div>
                              <span className="text-sm text-gray-600">Dependencies:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {library.dependencies.map((dep, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {dep}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {library.environmentVariables && library.environmentVariables.length > 0 && (
                            <div>
                              <span className="text-sm text-gray-600">Environment Variables:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {library.environmentVariables.map((env, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs font-mono">
                                    {env}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {libraries.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Integration Libraries Found</h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first integration library to manage API endpoints and credentials.
            </p>
            <Button onClick={() => setIsLibraryDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Integration Library
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
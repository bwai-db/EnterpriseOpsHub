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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCredentialDialogOpen, setIsCredentialDialogOpen] = useState(false);
  const [isEditCredentialDialogOpen, setIsEditCredentialDialogOpen] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<IntegrationLibrary | null>(null);
  const [selectedCredential, setSelectedCredential] = useState<IntegrationCredential | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<IntegrationLibrary>>({});
  const [credentialFormData, setCredentialFormData] = useState<Partial<IntegrationCredential>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: libraries = [], isLoading: librariesLoading } = useQuery<IntegrationLibrary[]>({
    queryKey: [`/api/integration-libraries?brand=${selectedBrand}`],
  });

  const { data: endpoints = [] } = useQuery<IntegrationEndpoint[]>({
    queryKey: ['/api/integration-endpoints'],
  });

  const { data: credentials = [] } = useQuery<IntegrationCredential[]>({
    queryKey: ['/api/integration-credentials'],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/integration-libraries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integration-libraries'] });
      toast({ title: "Success", description: "Integration library deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete integration library", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IntegrationLibrary> }) => 
      apiRequest('PUT', `/api/integration-libraries/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integration-libraries'] });
      setIsEditDialogOpen(false);
      setEditFormData({});
      toast({ title: "Success", description: "Integration library updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update integration library", variant: "destructive" });
    }
  });

  const createCredentialMutation = useMutation({
    mutationFn: (data: Partial<IntegrationCredential>) => 
      apiRequest('POST', '/api/integration-credentials', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integration-credentials'] });
      setIsCredentialDialogOpen(false);
      setCredentialFormData({});
      toast({ title: "Success", description: "Credential created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create credential", variant: "destructive" });
    }
  });

  const updateCredentialMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IntegrationCredential> }) => 
      apiRequest('PUT', `/api/integration-credentials/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/integration-credentials'] });
      setIsEditCredentialDialogOpen(false);
      setCredentialFormData({});
      toast({ title: "Success", description: "Credential updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update credential", variant: "destructive" });
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
    return (endpoints as IntegrationEndpoint[]).filter((endpoint: IntegrationEndpoint) => endpoint.libraryId === libraryId);
  };

  const getLibraryCredentials = (libraryId: number) => {
    return (credentials as IntegrationCredential[]).filter((credential: IntegrationCredential) => credential.libraryId === libraryId);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this integration library?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (library: IntegrationLibrary) => {
    setSelectedLibrary(library);
    setEditFormData({
      name: library.name,
      provider: library.provider,
      category: library.category,
      version: library.version,
      description: library.description,
      authMethod: library.authMethod,
      baseUrl: library.baseUrl,
      documentation: library.documentation
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (selectedLibrary && editFormData) {
      updateMutation.mutate({ 
        id: selectedLibrary.id, 
        data: editFormData 
      });
    }
  };

  const handleCreateCredential = (libraryId: number) => {
    setSelectedLibrary(libraries.find(l => l.id === libraryId) || null);
    setCredentialFormData({
      libraryId: libraryId,
      environment: 'production',
      credentialType: 'oauth2',
      isActive: true
    });
    setIsCredentialDialogOpen(true);
  };

  const handleSaveCredential = () => {
    if (credentialFormData.libraryId) {
      createCredentialMutation.mutate(credentialFormData);
    }
  };

  const handleEditCredential = (credential: IntegrationCredential) => {
    setSelectedCredential(credential);
    setCredentialFormData({
      libraryId: credential.libraryId,
      environment: credential.environment,
      credentialType: credential.credentialType,
      clientId: credential.clientId,
      tenantId: credential.tenantId,
      scopes: credential.scopes,
      keyVaultReference: credential.keyVaultReference,
      isActive: credential.isActive,
      createdBy: credential.createdBy
    });
    setIsEditCredentialDialogOpen(true);
  };

  const handleUpdateCredential = () => {
    if (selectedCredential && credentialFormData) {
      updateCredentialMutation.mutate({ 
        id: selectedCredential.id, 
        data: credentialFormData 
      });
    }
  };

  const generateGraphAppRegistrationScript = () => {
    const script = `# Microsoft Graph API App Registration Script
# Run this script as a Global Administrator in Azure AD

# Connect to Microsoft Graph PowerShell
Connect-MgGraph -Scopes "Application.ReadWrite.All", "DelegatedPermissionGrant.ReadWrite.All"

# Define application settings
$DisplayName = "Enterprise Operations Platform - Graph API"
$RequiredResourceAccess = @(
    @{
        ResourceAppId = "00000003-0000-0000-c000-000000000000" # Microsoft Graph
        ResourceAccess = @(
            @{
                Id = "e1fe6dd8-ba31-4d61-89e7-88639da4683d"  # User.Read
                Type = "Scope"
            },
            @{
                Id = "df021288-bdef-4463-88db-98f22de89214"  # User.Read.All
                Type = "Role"
            },
            @{
                Id = "62a82d76-70ea-41e2-9197-370581804d09"  # Group.ReadWrite.All
                Type = "Role"
            },
            @{
                Id = "19dbc75e-c2e2-444c-a770-ec69d8559fc7"  # Directory.ReadWrite.All
                Type = "Role"
            },
            @{
                Id = "246dd0d5-5bd0-4def-940b-0421030a5b68"  # Policy.Read.All
                Type = "Role"
            }
        )
    }
)

# Create the application
$App = New-MgApplication -DisplayName $DisplayName -RequiredResourceAccess $RequiredResourceAccess

# Create a service principal for the application
$ServicePrincipal = New-MgServicePrincipal -AppId $App.AppId

# Create a client secret
$PasswordCredential = Add-MgApplicationPassword -ApplicationId $App.Id -PasswordCredential @{
    DisplayName = "Enterprise Operations Platform Secret"
    EndDateTime = (Get-Date).AddMonths(24)  # Valid for 2 years
}

# Get tenant information
$Organization = Get-MgOrganization | Select-Object -First 1

# Output the configuration details
Write-Host "=== Application Registration Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Application Details:" -ForegroundColor Yellow
Write-Host "Application Name: $($App.DisplayName)"
Write-Host "Application ID (Client ID): $($App.AppId)" -ForegroundColor Cyan
Write-Host "Object ID: $($App.Id)"
Write-Host "Tenant ID: $($Organization.Id)" -ForegroundColor Cyan
Write-Host "Client Secret: $($PasswordCredential.SecretText)" -ForegroundColor Red
Write-Host ""
Write-Host "IMPORTANT: Save these values securely!" -ForegroundColor Red
Write-Host "The client secret will not be shown again." -ForegroundColor Red
Write-Host ""
Write-Host "Required Permissions (Admin Consent Required):" -ForegroundColor Yellow
Write-Host "- User.Read (Delegated)"
Write-Host "- User.Read.All (Application)"
Write-Host "- Group.ReadWrite.All (Application)"
Write-Host "- Directory.ReadWrite.All (Application)"
Write-Host "- Policy.Read.All (Application)"
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Grant admin consent for the required permissions"
Write-Host "2. Add the Client ID, Tenant ID, and Client Secret to your application credentials"
Write-Host "3. Configure the application to use these values"

# Grant admin consent (requires Global Administrator)
try {
    Write-Host "Attempting to grant admin consent..." -ForegroundColor Yellow
    $ConsentUrl = "https://login.microsoftonline.com/$($Organization.Id)/adminconsent?client_id=$($App.AppId)"
    Write-Host "Admin consent URL: $ConsentUrl" -ForegroundColor Cyan
    Write-Host "Opening browser for admin consent..." -ForegroundColor Yellow
    Start-Process $ConsentUrl
} catch {
    Write-Host "Could not automatically open consent URL. Please visit manually:" -ForegroundColor Red
    Write-Host $ConsentUrl -ForegroundColor Cyan
}

# Disconnect from Microsoft Graph
Disconnect-MgGraph

Write-Host ""
Write-Host "Script execution completed!" -ForegroundColor Green`;

    // Create a blob and download the script
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph-api-app-registration.ps1';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ 
      title: "Script Generated", 
      description: "PowerShell script downloaded. Run as Global Administrator in Azure AD." 
    });
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
          
          {/* Edit Library Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Integration Library</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Library Name</Label>
                    <Input 
                      id="edit-name" 
                      value={editFormData.name || ''} 
                      onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Microsoft Graph API" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-provider">Provider</Label>
                    <Input 
                      id="edit-provider" 
                      value={editFormData.provider || ''} 
                      onChange={(e) => setEditFormData(prev => ({ ...prev, provider: e.target.value }))}
                      placeholder="e.g., microsoft" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-category">Category</Label>
                    <Select 
                      value={editFormData.category || ''} 
                      onValueChange={(value) => setEditFormData(prev => ({ ...prev, category: value }))}
                    >
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
                    <Label htmlFor="edit-version">Version</Label>
                    <Input 
                      id="edit-version" 
                      value={editFormData.version || ''} 
                      onChange={(e) => setEditFormData(prev => ({ ...prev, version: e.target.value }))}
                      placeholder="e.g., 1.0.0" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-auth">Auth Method</Label>
                    <Select 
                      value={editFormData.authMethod || ''} 
                      onValueChange={(value) => setEditFormData(prev => ({ ...prev, authMethod: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select auth method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                        <SelectItem value="api_key">API Key</SelectItem>
                        <SelectItem value="basic">Basic Auth</SelectItem>
                        <SelectItem value="bearer">Bearer Token</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-baseurl">Base URL</Label>
                    <Input 
                      id="edit-baseurl" 
                      value={editFormData.baseUrl || ''} 
                      onChange={(e) => setEditFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
                      placeholder="e.g., https://graph.microsoft.com" 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea 
                    id="edit-description" 
                    value={editFormData.description || ''} 
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the integration library purpose and capabilities" 
                  />
                </div>
                <div>
                  <Label htmlFor="edit-documentation">Documentation URL</Label>
                  <Input 
                    id="edit-documentation" 
                    value={editFormData.documentation || ''} 
                    onChange={(e) => setEditFormData(prev => ({ ...prev, documentation: e.target.value }))}
                    placeholder="e.g., https://docs.microsoft.com/graph" 
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdate}
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? 'Updating...' : 'Update Library'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Add Credential Dialog */}
          <Dialog open={isCredentialDialogOpen} onOpenChange={setIsCredentialDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Authentication Credential</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cred-environment">Environment</Label>
                    <Select 
                      value={credentialFormData.environment || 'production'} 
                      onValueChange={(value) => setCredentialFormData(prev => ({ ...prev, environment: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cred-type">Credential Type</Label>
                    <Select 
                      value={credentialFormData.credentialType || 'oauth2'} 
                      onValueChange={(value) => setCredentialFormData(prev => ({ ...prev, credentialType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select credential type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                        <SelectItem value="api_key">API Key</SelectItem>
                        <SelectItem value="basic_auth">Basic Auth</SelectItem>
                        <SelectItem value="bearer_token">Bearer Token</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cred-client-id">Client ID</Label>
                    <Input 
                      id="cred-client-id" 
                      value={credentialFormData.clientId || ''} 
                      onChange={(e) => setCredentialFormData(prev => ({ ...prev, clientId: e.target.value }))}
                      placeholder="Enter client/application ID" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="cred-tenant-id">Tenant ID</Label>
                    <Input 
                      id="cred-tenant-id" 
                      value={credentialFormData.tenantId || ''} 
                      onChange={(e) => setCredentialFormData(prev => ({ ...prev, tenantId: e.target.value }))}
                      placeholder="Enter tenant ID (for Azure AD)" 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cred-keyvault">Key Vault Reference</Label>
                  <Input 
                    id="cred-keyvault" 
                    value={credentialFormData.keyVaultReference || ''} 
                    onChange={(e) => setCredentialFormData(prev => ({ ...prev, keyVaultReference: e.target.value }))}
                    placeholder="Key vault secret reference (e.g., keyvault-secret-name)" 
                  />
                </div>
                <div>
                  <Label htmlFor="cred-scopes">Scopes (comma-separated)</Label>
                  <Input 
                    id="cred-scopes" 
                    value={credentialFormData.scopes?.join(', ') || ''} 
                    onChange={(e) => setCredentialFormData(prev => ({ 
                      ...prev, 
                      scopes: e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
                    }))}
                    placeholder="e.g., https://graph.microsoft.com/.default" 
                  />
                </div>
                <div>
                  <Label htmlFor="cred-created-by">Created By</Label>
                  <Input 
                    id="cred-created-by" 
                    value={credentialFormData.createdBy || ''} 
                    onChange={(e) => setCredentialFormData(prev => ({ ...prev, createdBy: e.target.value }))}
                    placeholder="Who created this credential" 
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCredentialDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveCredential}
                    disabled={createCredentialMutation.isPending}
                  >
                    {createCredentialMutation.isPending ? 'Creating...' : 'Create Credential'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Edit Credential Dialog */}
          <Dialog open={isEditCredentialDialogOpen} onOpenChange={setIsEditCredentialDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Authentication Credential</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-cred-environment">Environment</Label>
                    <Select 
                      value={credentialFormData.environment || 'production'} 
                      onValueChange={(value) => setCredentialFormData(prev => ({ ...prev, environment: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select environment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-cred-type">Credential Type</Label>
                    <Select 
                      value={credentialFormData.credentialType || 'oauth2'} 
                      onValueChange={(value) => setCredentialFormData(prev => ({ ...prev, credentialType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select credential type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                        <SelectItem value="api_key">API Key</SelectItem>
                        <SelectItem value="basic_auth">Basic Auth</SelectItem>
                        <SelectItem value="bearer_token">Bearer Token</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-cred-client-id">Client ID</Label>
                    <Input 
                      id="edit-cred-client-id" 
                      value={credentialFormData.clientId || ''} 
                      onChange={(e) => setCredentialFormData(prev => ({ ...prev, clientId: e.target.value }))}
                      placeholder="Enter client/application ID" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-cred-tenant-id">Tenant ID</Label>
                    <Input 
                      id="edit-cred-tenant-id" 
                      value={credentialFormData.tenantId || ''} 
                      onChange={(e) => setCredentialFormData(prev => ({ ...prev, tenantId: e.target.value }))}
                      placeholder="Enter tenant ID (for Azure AD)" 
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-cred-keyvault">Key Vault Reference</Label>
                  <Input 
                    id="edit-cred-keyvault" 
                    value={credentialFormData.keyVaultReference || ''} 
                    onChange={(e) => setCredentialFormData(prev => ({ ...prev, keyVaultReference: e.target.value }))}
                    placeholder="Key vault secret reference (e.g., keyvault-secret-name)" 
                  />
                </div>
                <div>
                  <Label htmlFor="edit-cred-scopes">Scopes (comma-separated)</Label>
                  <Input 
                    id="edit-cred-scopes" 
                    value={credentialFormData.scopes?.join(', ') || ''} 
                    onChange={(e) => setCredentialFormData(prev => ({ 
                      ...prev, 
                      scopes: e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
                    }))}
                    placeholder="e.g., https://graph.microsoft.com/.default" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-cred-created-by">Created By</Label>
                    <Input 
                      id="edit-cred-created-by" 
                      value={credentialFormData.createdBy || ''} 
                      onChange={(e) => setCredentialFormData(prev => ({ ...prev, createdBy: e.target.value }))}
                      placeholder="Who created this credential" 
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="edit-cred-active">Active Status</Label>
                    <Select 
                      value={credentialFormData.isActive ? 'true' : 'false'} 
                      onValueChange={(value) => setCredentialFormData(prev => ({ ...prev, isActive: value === 'true' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditCredentialDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdateCredential}
                    disabled={updateCredentialMutation.isPending}
                  >
                    {updateCredentialMutation.isPending ? 'Updating...' : 'Update Credential'}
                  </Button>
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
                <p className="text-2xl font-bold">{(libraries as IntegrationLibrary[]).length}</p>
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
                <p className="text-2xl font-bold">{(endpoints as IntegrationEndpoint[]).length}</p>
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
                <p className="text-2xl font-bold">{(credentials as IntegrationCredential[]).length}</p>
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
                <p className="text-2xl font-bold">{(libraries as IntegrationLibrary[]).filter((l: IntegrationLibrary) => l.status === 'production').length}</p>
              </div>
              <Shield className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {(libraries as IntegrationLibrary[]).map((library: IntegrationLibrary) => {
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
                    <Button variant="outline" size="sm" onClick={() => handleEdit(library)}>
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
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-gray-700">API Endpoints</h4>
                      <Button size="sm" variant="outline">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Endpoint
                      </Button>
                    </div>
                    {libraryEndpoints.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Method</TableHead>
                            <TableHead>Endpoint</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Auth Required</TableHead>
                            <TableHead>Permissions</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {libraryEndpoints.map((endpoint: IntegrationEndpoint) => (
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
                                  {endpoint.permissions?.slice(0, 2).map((permission: string, idx: number) => (
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
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
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
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-gray-700">Authentication Credentials</h4>
                      <Button size="sm" variant="outline" onClick={() => handleCreateCredential(library.id)}>
                        <Plus className="h-3 w-3 mr-1" />
                        Add Credential
                      </Button>
                    </div>
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
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {libraryCredentials.map((credential: IntegrationCredential) => (
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
                                  {credential.scopes?.slice(0, 1).map((scope: string, idx: number) => (
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
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => handleEditCredential(credential)}>
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
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
                    {library.name === "Microsoft Graph API" && (
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-blue-900">Azure App Registration Setup</h4>
                          <Button 
                            size="sm" 
                            onClick={() => generateGraphAppRegistrationScript()}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Code className="h-3 w-3 mr-1" />
                            Generate PowerShell Script
                          </Button>
                        </div>
                        <p className="text-sm text-blue-700">
                          Generate a PowerShell script for your admin to register the Microsoft Graph API application 
                          and configure the necessary permissions and credentials.
                        </p>
                      </div>
                    )}
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
                                {library.dependencies.map((dep: string, idx: number) => (
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
                                {library.environmentVariables.map((env: string, idx: number) => (
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

      {(libraries as IntegrationLibrary[]).length === 0 && (
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
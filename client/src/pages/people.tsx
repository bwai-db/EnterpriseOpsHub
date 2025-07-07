import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Users, Building, Briefcase, UserCheck, Globe, Shield, BarChart, MapPin, Clock, Download, Filter, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import type { Brand } from "@/lib/types";
import UserDetailModal from "@/components/user-detail-modal";

interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  entraId?: string;
  jobTitle?: string;
  department?: string;
  manager?: string;
  officeLocation?: string;
  mobilePhone?: string;
  businessPhone?: string;
  isActive: boolean;
  lastSync?: Date;
  departmentId?: number;
  functionId?: number;
  personaId?: number;
  brand?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface Corporate {
  id: number;
  name: string;
  description?: string;
  brand: string;
  createdAt?: Date;
}

interface Division {
  id: number;
  name: string;
  description?: string;
  corporateId?: number;
  brand?: string;
  createdAt?: Date;
}

interface Department {
  id: number;
  name: string;
  description?: string;
  divisionId?: number;
  brand?: string;
  createdAt?: Date;
}

interface Persona {
  id: number;
  name: string;
  description?: string;
  permissions?: string[];
  brand?: string;
  createdAt?: Date;
}

interface PeopleProps {
  selectedBrand: Brand;
}

export default function People({ selectedBrand }: PeopleProps) {
  const [activeTab, setActiveTab] = useState("users");

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users', selectedBrand],
    queryFn: async () => {
      const response = await fetch(`/api/users?brand=${selectedBrand}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      return response.json() as Promise<User[]>;
    }
  });

  const { data: corporates, isLoading: corporatesLoading } = useQuery({
    queryKey: ['/api/corporates', selectedBrand],
    queryFn: async () => {
      const response = await fetch(`/api/corporates?brand=${selectedBrand}`);
      if (!response.ok) throw new Error('Failed to fetch corporates');
      return response.json() as Promise<Corporate[]>;
    }
  });

  const { data: divisions, isLoading: divisionsLoading } = useQuery({
    queryKey: ['/api/divisions', selectedBrand],
    queryFn: async () => {
      const response = await fetch(`/api/divisions?brand=${selectedBrand}`);
      if (!response.ok) throw new Error('Failed to fetch divisions');
      return response.json() as Promise<Division[]>;
    }
  });

  const { data: departments, isLoading: departmentsLoading } = useQuery({
    queryKey: ['/api/departments', selectedBrand],
    queryFn: async () => {
      const response = await fetch(`/api/departments?brand=${selectedBrand}`);
      if (!response.ok) throw new Error('Failed to fetch departments');
      return response.json() as Promise<Department[]>;
    }
  });

  const { data: personas, isLoading: personasLoading } = useQuery({
    queryKey: ['/api/personas', selectedBrand],
    queryFn: async () => {
      const response = await fetch(`/api/personas?brand=${selectedBrand}`);
      if (!response.ok) throw new Error('Failed to fetch personas');
      return response.json() as Promise<Persona[]>;
    }
  });

  const syncEntraMutation = useMutation({
    mutationFn: async () => {
      // This would normally call Microsoft Graph API
      // For demo purposes, we'll simulate EntraID data
      const mockEntraData = {
        id: "dd4ee5ff-6g07-8h19-i2j3-k4l5m6n7o8p9",
        userPrincipalName: "alice.smith@company.com",
        mail: "alice.smith@company.com",
        displayName: "Alice Smith",
        givenName: "Alice",
        surname: "Smith",
        jobTitle: "DevOps Engineer",
        department: "DevOps & Platform",
        manager: { displayName: "John Doe" },
        officeLocation: "Seattle Office",
        mobilePhone: "+1-555-0126",
        businessPhones: ["+1-555-0103"],
        accountEnabled: true
      };

      const response = await fetch('/api/users/sync-entra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entraData: mockEntraData })
      });
      
      if (!response.ok) throw new Error('Failed to sync user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    }
  });

  const getStatusBadge = (isActive: boolean) => {
    return (
      <Badge variant={isActive ? "default" : "secondary"}>
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const getSyncStatus = (lastSync?: Date, entraId?: string) => {
    if (!entraId) return <Badge variant="outline">Local Account</Badge>;
    if (!lastSync) return <Badge variant="destructive">Never Synced</Badge>;
    
    const syncDate = new Date(lastSync);
    const now = new Date();
    const daysSinceSync = Math.floor((now.getTime() - syncDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceSync === 0) return <Badge variant="default">Synced Today</Badge>;
    if (daysSinceSync <= 7) return <Badge variant="default">Synced {daysSinceSync}d ago</Badge>;
    return <Badge variant="destructive">Stale ({daysSinceSync}d ago)</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-ms-text">People & Organization</h1>
          <p className="text-gray-600 mt-1">
            Manage users, departments, and organizational structure
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => syncEntraMutation.mutate()}
            disabled={syncEntraMutation.isPending}
            className="bg-ms-blue hover:bg-ms-blue/90"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            {syncEntraMutation.isPending ? "Syncing..." : "Sync from EntraID"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="corporates">Corporates</TabsTrigger>
          <TabsTrigger value="divisions">Divisions</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="space-y-6">
            {/* Workforce Analytics KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Workforce</p>
                      <p className="text-2xl font-bold text-ms-text">2,847</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="text-blue-600 w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Active: {users?.filter(u => u.isActive).length || 0} | Managed: {users?.length || 0}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">EntraID Sync Rate</p>
                      <p className="text-2xl font-bold text-green-600">
                        {users ? Math.round((users.filter(u => u.entraId).length / users.length) * 100) : 0}%
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <UserCheck className="text-green-600 w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {users?.filter(u => u.entraId).length || 0} of {users?.length || 0} synced
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Department Coverage</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {departments?.length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building className="text-purple-600 w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Across {divisions?.length || 0} divisions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Persona Assignments</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {users?.filter(u => u.personaId).length || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Shield className="text-orange-600 w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {personas?.length || 0} role types available
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Workforce Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart className="w-5 h-5 mr-2 text-blue-600" />
                    Department Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {departments?.slice(0, 8).map((dept) => {
                      const deptUsers = users?.filter(u => u.departmentId === dept.id).length || 0;
                      const percentage = users?.length ? Math.round((deptUsers / users.length) * 100) : 0;
                      
                      return (
                        <div key={dept.id} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{dept.name}</span>
                              <span className="text-sm text-gray-500">{deptUsers} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                    Location Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(new Set(users?.map(u => u.officeLocation).filter(Boolean))).slice(0, 8).map((location) => {
                      const locationUsers = users?.filter(u => u.officeLocation === location).length || 0;
                      const percentage = users?.length ? Math.round((locationUsers / users.length) * 100) : 0;
                      
                      return (
                        <div key={location} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">{location}</span>
                              <span className="text-sm text-gray-500">{locationUsers} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sync Activity & User Management */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      User Directory ({users?.length || 0})
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge variant={users?.filter(u => u.isActive).length === users?.length ? "default" : "secondary"}>
                        {users?.filter(u => u.isActive).length || 0} Active
                      </Badge>
                      <Badge variant="outline">
                        {users?.filter(u => !u.isActive).length || 0} Inactive
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="border rounded-lg p-4">
                            <div className="flex space-x-4">
                              <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : users?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="mx-auto w-12 h-12 mb-4 text-gray-300" />
                      <p>No users found for {selectedBrand === 'all' ? 'all brands' : selectedBrand}</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {users?.map((user) => (
                        <UserDetailModal key={user.id} userId={user.id} userName={user.displayName}>
                          <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex justify-between items-start">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-ms-blue/10 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-semibold text-ms-blue">
                                    {user.displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-sm">{user.displayName}</h3>
                                    {getStatusBadge(user.isActive)}
                                    {getSyncStatus(user.lastSync, user.entraId)}
                                  </div>
                                  <p className="text-xs text-gray-600 mb-1">{user.email}</p>
                                  {user.jobTitle && <p className="text-xs text-gray-600">{user.jobTitle}</p>}
                                  <div className="flex items-center gap-4 mt-2">
                                    {user.department && (
                                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {user.department}
                                      </span>
                                    )}
                                    {user.officeLocation && (
                                      <span className="text-xs text-gray-500 flex items-center">
                                        <MapPin className="w-3 h-3 mr-1" />
                                        {user.officeLocation}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right text-xs text-gray-500">
                                {user.businessPhone && <p>📞 {user.businessPhone}</p>}
                                {user.entraId && <p className="mt-1">ID: {user.entraId.substring(0, 8)}...</p>}
                              </div>
                            </div>
                          </div>
                        </UserDetailModal>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                    Sync Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Last EntraID Sync</span>
                      </div>
                      <span className="text-xs text-gray-600">2 hours ago</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Sync Success Rate</span>
                        <span className="text-sm font-semibold text-green-600">98.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">New Users (30d)</span>
                        <span className="text-sm font-semibold">+47</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Deactivated (30d)</span>
                        <span className="text-sm font-semibold text-red-600">-12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Profile Updates</span>
                        <span className="text-sm font-semibold">156</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-semibold mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                          <Download className="w-3 h-3 mr-2" />
                          Export User List
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                          <Filter className="w-3 h-3 mr-2" />
                          Advanced Filters
                        </Button>
                        <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                          <BarChart className="w-3 h-3 mr-2" />
                          Analytics Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="corporates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Corporate Entities ({corporates?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {corporatesLoading ? (
                <p>Loading corporates...</p>
              ) : corporates?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Globe className="mx-auto w-12 h-12 mb-4 text-gray-300" />
                  <p>No corporate entities found for {selectedBrand === 'all' ? 'all brands' : selectedBrand}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {corporates?.map((corporate) => (
                    <div key={corporate.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{corporate.name}</h3>
                      {corporate.description && <p className="text-sm text-gray-600 mb-2">{corporate.description}</p>}
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="capitalize">{corporate.brand}</Badge>
                        <div className="text-xs text-gray-400">
                          {divisions?.filter(d => d.corporateId === corporate.id).length || 0} divisions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="divisions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Divisions ({divisions?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {divisionsLoading ? (
                <p>Loading divisions...</p>
              ) : divisions?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building className="mx-auto w-12 h-12 mb-4 text-gray-300" />
                  <p>No divisions found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {divisions?.map((division) => {
                    const corporate = corporates?.find(c => c.id === division.corporateId);
                    return (
                      <div key={division.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">{division.name}</h3>
                        {division.description && <p className="text-sm text-gray-600 mb-2">{division.description}</p>}
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{division.brand || 'all'}</Badge>
                          {corporate && (
                            <div className="text-xs text-gray-400">
                              Corporate: {corporate.name}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Departments ({departments?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {departmentsLoading ? (
                <p>Loading departments...</p>
              ) : departments?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Briefcase className="mx-auto w-12 h-12 mb-4 text-gray-300" />
                  <p>No departments found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {departments?.map((department) => (
                    <div key={department.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{department.name}</h3>
                      {department.description && <p className="text-sm text-gray-600 mb-2">{department.description}</p>}
                      <div className="flex justify-between items-center">
                        <Badge variant="outline">{department.brand || 'all'}</Badge>
                        {department.divisionId && <span className="text-xs text-gray-400">Division #{department.divisionId}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Personas & Roles ({personas?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {personasLoading ? (
                <p>Loading personas...</p>
              ) : personas?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="mx-auto w-12 h-12 mb-4 text-gray-300" />
                  <p>No personas found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {personas?.map((persona) => (
                    <div key={persona.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{persona.name}</h3>
                        <Badge variant="outline">{persona.brand || 'all'}</Badge>
                      </div>
                      {persona.description && <p className="text-sm text-gray-600 mb-3">{persona.description}</p>}
                      {persona.permissions && persona.permissions.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-2">Permissions:</p>
                          <div className="flex flex-wrap gap-1">
                            {persona.permissions.map((permission, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
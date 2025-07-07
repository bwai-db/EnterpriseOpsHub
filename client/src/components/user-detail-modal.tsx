import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  User, Monitor, Key, Ticket, FileText, MapPin, Calendar, 
  Brain, Shield, Building, Phone, Mail, Clock, Award,
  Laptop, Smartphone, Printer, Server, Database, Settings
} from "lucide-react";

interface UserDetailModalProps {
  userId: number;
  userName: string;
  children: React.ReactNode;
}

interface UserProfile {
  id: number;
  displayName: string;
  email: string;
  jobTitle: string;
  department: string;
  manager: string;
  officeLocation: string;
  businessPhone: string;
  mobilePhone: string;
  entraId: string;
  isActive: boolean;
  lastSync: string;
  hireDate: string;
  tenure: number;
  brand: string;
  division: string;
  persona: string;
}

interface UserLicense {
  id: number;
  licenseName: string;
  licenseType: string;
  status: string;
  assignedDate: string;
  expiryDate: string;
  utilizationRate: number;
  cost: number;
  category: string;
}

interface UserDevice {
  id: number;
  deviceName: string;
  deviceType: string;
  model: string;
  serialNumber: string;
  status: string;
  assignedDate: string;
  lastSeen: string;
  operatingSystem: string;
  location: string;
  compliance: string;
}

interface UserTicket {
  id: number;
  ticketNumber: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  createdDate: string;
  lastUpdate: string;
  category: string;
  description: string;
}

export default function UserDetailModal({ userId, userName, children }: UserDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user profile data
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: [`/api/users/${userId}/profile`],
    queryFn: async () => {
      // Mock comprehensive user profile data
      return {
        id: userId,
        displayName: userName,
        email: `${userName.toLowerCase().replace(' ', '.')}@blorcs.com`,
        jobTitle: "Senior Software Engineer",
        department: "IT Infrastructure",
        manager: "Sarah Johnson",
        officeLocation: "New York, NY",
        businessPhone: "+1 (555) 123-4567",
        mobilePhone: "+1 (555) 987-6543",
        entraId: "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
        isActive: true,
        lastSync: "2025-01-07T10:30:00Z",
        hireDate: "2021-03-15",
        tenure: 1396, // days
        brand: "blorcs",
        division: "Technology Division",
        persona: "IT Administrator"
      };
    }
  });

  // Fetch user licenses
  const { data: userLicenses } = useQuery<UserLicense[]>({
    queryKey: [`/api/users/${userId}/licenses`],
    queryFn: async () => {
      return [
        {
          id: 1,
          licenseName: "Microsoft 365 E5",
          licenseType: "Enterprise",
          status: "active",
          assignedDate: "2023-01-15",
          expiryDate: "2025-01-15",
          utilizationRate: 87,
          cost: 57,
          category: "Productivity"
        },
        {
          id: 2,
          licenseName: "Power Platform Premium",
          licenseType: "Platform",
          status: "active",
          assignedDate: "2023-06-01",
          expiryDate: "2025-06-01",
          utilizationRate: 92,
          cost: 20,
          category: "Development"
        },
        {
          id: 3,
          licenseName: "Adobe Creative Cloud All Apps",
          licenseType: "Creative",
          status: "active",
          assignedDate: "2023-03-10",
          expiryDate: "2025-03-10",
          utilizationRate: 65,
          cost: 54.99,
          category: "Design"
        },
        {
          id: 4,
          licenseName: "GitHub Enterprise",
          licenseType: "Development",
          status: "active",
          assignedDate: "2023-01-20",
          expiryDate: "2025-01-20",
          utilizationRate: 94,
          cost: 21,
          category: "Development"
        }
      ];
    }
  });

  // Fetch user devices
  const { data: userDevices } = useQuery<UserDevice[]>({
    queryKey: [`/api/users/${userId}/devices`],
    queryFn: async () => {
      return [
        {
          id: 1,
          deviceName: "LAPTOP-NYC-001",
          deviceType: "Laptop",
          model: "Dell Latitude 5530",
          serialNumber: "DL5530NYC001",
          status: "active",
          assignedDate: "2023-01-15",
          lastSeen: "2025-01-07T09:45:00Z",
          operatingSystem: "Windows 11 Pro",
          location: "New York Office",
          compliance: "compliant"
        },
        {
          id: 2,
          deviceName: "PHONE-NYC-001",
          deviceType: "Mobile",
          model: "iPhone 14 Pro",
          serialNumber: "IP14NYC001",
          status: "active",
          assignedDate: "2023-02-01",
          lastSeen: "2025-01-07T11:20:00Z",
          operatingSystem: "iOS 17.2",
          location: "Mobile",
          compliance: "compliant"
        },
        {
          id: 3,
          deviceName: "MONITOR-NYC-001",
          deviceType: "Monitor",
          model: "Dell UltraSharp U2723QE",
          serialNumber: "DU27NYC001",
          status: "active",
          assignedDate: "2023-01-15",
          lastSeen: "2025-01-07T09:45:00Z",
          operatingSystem: "N/A",
          location: "New York Office",
          compliance: "compliant"
        }
      ];
    }
  });

  // Fetch user tickets
  const { data: userTickets } = useQuery<UserTicket[]>({
    queryKey: [`/api/users/${userId}/tickets`],
    queryFn: async () => {
      return [
        {
          id: 1,
          ticketNumber: "INC-2025-0156",
          title: "Unable to access SharePoint site",
          type: "Incident",
          priority: "medium",
          status: "in_progress",
          createdDate: "2025-01-06T14:30:00Z",
          lastUpdate: "2025-01-07T08:15:00Z",
          category: "Access Management",
          description: "User reports inability to access team SharePoint site after recent permission changes"
        },
        {
          id: 2,
          ticketNumber: "REQ-2025-0089",
          title: "Request for additional Adobe license",
          type: "Service Request",
          priority: "low",
          status: "approved",
          createdDate: "2025-01-05T10:00:00Z",
          lastUpdate: "2025-01-06T16:30:00Z",
          category: "Software Licensing",
          description: "Request for Adobe Acrobat Pro license for PDF editing capabilities"
        },
        {
          id: 3,
          ticketNumber: "CHG-2025-0023",
          title: "Laptop RAM upgrade",
          type: "Change Request",
          priority: "medium",
          status: "completed",
          createdDate: "2024-12-20T09:00:00Z",
          lastUpdate: "2025-01-02T14:45:00Z",
          category: "Hardware",
          description: "Upgrade laptop RAM from 16GB to 32GB for development workload requirements"
        }
      ];
    }
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { color: "bg-green-100 text-green-800", label: "Active" },
      inactive: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
      compliant: { color: "bg-green-100 text-green-800", label: "Compliant" },
      "non-compliant": { color: "bg-red-100 text-red-800", label: "Non-Compliant" },
      in_progress: { color: "bg-blue-100 text-blue-800", label: "In Progress" },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      approved: { color: "bg-purple-100 text-purple-800", label: "Approved" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" }
    };
    const config = statusMap[status] || { color: "bg-gray-100 text-gray-800", label: status };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      critical: { color: "bg-red-100 text-red-800", label: "Critical" },
      high: { color: "bg-orange-100 text-orange-800", label: "High" },
      medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
      low: { color: "bg-blue-100 text-blue-800", label: "Low" }
    };
    const config = priorityMap[priority] || { color: "bg-gray-100 text-gray-800", label: priority };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'laptop': return <Laptop className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'monitor': return <Monitor className="w-4 h-4" />;
      case 'printer': return <Printer className="w-4 h-4" />;
      case 'server': return <Server className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const formatTenure = (days: number) => {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    return `${years}y ${months}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const generateAIIntroduction = () => {
    if (!userProfile) return "";
    
    const tenure = formatTenure(userProfile.tenure);
    const totalLicenseCost = userLicenses?.reduce((sum, license) => sum + license.cost, 0) || 0;
    const avgUtilization = userLicenses?.reduce((sum, license) => sum + license.utilizationRate, 0) / (userLicenses?.length || 1) || 0;
    
    return `${userProfile.displayName} is a ${userProfile.jobTitle} in the ${userProfile.department} department, bringing ${tenure} of experience to ${userProfile.brand}. Based in ${userProfile.officeLocation}, they demonstrate strong technology adoption with ${Math.round(avgUtilization)}% average license utilization across ${userLicenses?.length || 0} enterprise applications. Their current technology stack represents a monthly investment of ${formatCurrency(totalLicenseCost)}, with particularly high engagement in development and productivity tools. Recent activity shows consistent device compliance and proactive service request management, indicating a tech-savvy professional who maximizes available resources.`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-ms-blue/10 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-ms-blue">
                {userName?.split(' ').map(n => n[0]).join('').toUpperCase() || '??'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{userName}</h2>
              <p className="text-sm text-gray-600">{userProfile?.jobTitle || 'Loading...'}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="licenses">Licenses</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="tickets">Service Tickets</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    Key Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tenure</span>
                    <span className="font-semibold">{userProfile ? formatTenure(userProfile.tenure) : 'Loading...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Licenses</span>
                    <span className="font-semibold">{userLicenses?.filter(l => l.status === 'active').length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Assigned Devices</span>
                    <span className="font-semibold">{userDevices?.filter(d => d.status === 'active').length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Open Tickets</span>
                    <span className="font-semibold">{userTickets?.filter(t => ['open', 'in_progress'].includes(t.status)).length || 0}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-green-600" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Last sync: 2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Device check-in: 1 hour ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">License usage: Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Service request: 1 day ago</span>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Database className="w-5 h-5 mr-2 text-purple-600" />
                    Cost Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Monthly License Cost</span>
                      <span className="font-semibold">
                        {formatCurrency(userLicenses?.reduce((sum, license) => sum + license.cost, 0) || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Annual Cost</span>
                      <span className="font-semibold">
                        {formatCurrency((userLicenses?.reduce((sum, license) => sum + license.cost, 0) || 0) * 12)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Avg. Utilization</span>
                      <span className="font-semibold">
                        {Math.round(userLicenses?.reduce((sum, license) => sum + license.utilizationRate, 0) / (userLicenses?.length || 1) || 0)}%
                      </span>
                    </div>
                    <Progress 
                      value={userLicenses?.reduce((sum, license) => sum + license.utilizationRate, 0) / (userLicenses?.length || 1) || 0} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="licenses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Software Licenses ({userLicenses?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userLicenses?.map((license) => (
                    <div key={license.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{license.licenseName}</h3>
                          <p className="text-sm text-gray-600">{license.category} • {license.licenseType}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(license.status)}
                          <p className="text-sm font-semibold mt-1">{formatCurrency(license.cost)}/month</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Assigned:</span>
                          <p className="font-medium">{formatDate(license.assignedDate)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Expires:</span>
                          <p className="font-medium">{formatDate(license.expiryDate)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Utilization:</span>
                          <p className="font-medium">{license.utilizationRate}%</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Annual Cost:</span>
                          <p className="font-medium">{formatCurrency(license.cost * 12)}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Progress value={license.utilizationRate} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Assigned Devices ({userDevices?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userDevices?.map((device) => (
                    <div key={device.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          {getDeviceIcon(device.deviceType)}
                          <div>
                            <h3 className="font-semibold">{device.deviceName}</h3>
                            <p className="text-sm text-gray-600">{device.model}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(device.status)}
                          {getStatusBadge(device.compliance)}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Serial Number:</span>
                          <p className="font-medium">{device.serialNumber}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">OS:</span>
                          <p className="font-medium">{device.operatingSystem}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Location:</span>
                          <p className="font-medium">{device.location}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Seen:</span>
                          <p className="font-medium">{formatDateTime(device.lastSeen)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="w-5 h-5" />
                  Service Tickets & Requests ({userTickets?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userTickets?.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{ticket.title}</h3>
                          <p className="text-sm text-gray-600">{ticket.ticketNumber} • {ticket.category}</p>
                        </div>
                        <div className="flex gap-2">
                          {getPriorityBadge(ticket.priority)}
                          {getStatusBadge(ticket.status)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{ticket.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <p className="font-medium">{ticket.type}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Created:</span>
                          <p className="font-medium">{formatDateTime(ticket.createdDate)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Update:</span>
                          <p className="font-medium">{formatDateTime(ticket.lastUpdate)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{userProfile?.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{userProfile?.businessPhone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-gray-500" />
                      <span>{userProfile?.mobilePhone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{userProfile?.officeLocation}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Organization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Department:</span>
                      <p className="font-medium">{userProfile?.department}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Division:</span>
                      <p className="font-medium">{userProfile?.division}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Manager:</span>
                      <p className="font-medium">{userProfile?.manager}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Role:</span>
                      <p className="font-medium">{userProfile?.persona}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Employment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Hire Date:</span>
                      <p className="font-medium">{userProfile ? formatDate(userProfile.hireDate) : 'Loading...'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Tenure:</span>
                      <p className="font-medium">{userProfile ? formatTenure(userProfile.tenure) : 'Loading...'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Status:</span>
                      <p className="font-medium">{getStatusBadge(userProfile?.isActive ? 'active' : 'inactive')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Brand:</span>
                      <p className="font-medium capitalize">{userProfile?.brand}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security & Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">EntraID:</span>
                      <p className="font-medium text-xs">{userProfile?.entraId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Last Sync:</span>
                      <p className="font-medium">{userProfile ? formatDateTime(userProfile.lastSync) : 'Loading...'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Sync Status:</span>
                      <p className="font-medium">{getStatusBadge('active')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Compliance:</span>
                      <p className="font-medium">{getStatusBadge('compliant')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI-Generated Professional Introduction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {generateAIIntroduction()}
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Utilization Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Top Performing License:</span>
                      <span className="font-semibold">GitHub Enterprise (94%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Optimization Opportunity:</span>
                      <span className="font-semibold">Adobe Creative Cloud (65%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Risk Level:</span>
                      <span className="font-semibold text-green-600">Low</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Productivity Score:</span>
                      <span className="font-semibold">87/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">High Engagement</p>
                    <p className="text-xs text-green-600">Strong adoption of development tools suggests potential for advanced training</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm font-medium text-yellow-800">License Review</p>
                    <p className="text-xs text-yellow-600">Consider Adobe license tier adjustment based on current usage patterns</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Device Compliance</p>
                    <p className="text-xs text-blue-600">Exemplary device management and security compliance record</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
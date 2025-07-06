import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Store, MapPin, Users, Package, DollarSign, TrendingUp, Clock, Calendar, Key, MessageSquare, Monitor, ArrowLeft } from "lucide-react";
import type { Brand } from "@/lib/types";

interface StoreType {
  id: number;
  storeCode: string;
  storeName: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  storeManager?: string;
  storeType: string;
  status: string;
  brand: string;
  operatingHours?: string;
  timezone?: string;
}

interface StoreInventory {
  id: number;
  storeId: number;
  sku: string;
  productName: string;
  category?: string;
  currentStock: number;
  minimumStock?: number;
  retailPrice?: string;
  brand: string;
}

interface StoreSales {
  id: number;
  storeId: number;
  transactionId: string;
  saleDate: string;
  totalAmount: string;
  itemCount: number;
  paymentMethod?: string;
  brand: string;
}

interface StoreStaff {
  id: number;
  storeId: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position: string;
  status: string;
  isKeyholder?: boolean;
  keyholderLevel?: string;
  brand: string;
}

interface StoreDisplay {
  id: number;
  storeId: number;
  displayName: string;
  displayType: string;
  location: string;
  theme?: string;
  products?: string[];
  setupDate?: string;
  takedownDate?: string;
  status: string;
  assignedTo?: string;
  notes?: string;
  brand: string;
}

interface StoreSchedule {
  id: number;
  storeId: number;
  staffId: number;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  shiftType: string;
  position?: string;
  status: string;
  notes?: string;
}

interface KeyholderAssignment {
  id: number;
  storeId: number;
  staffId: number;
  assignmentDate: string;
  shiftType: string;
  primaryKeyholder?: boolean;
  backupKeyholder?: boolean;
  accessLevel: string;
  status: string;
  responsibilities?: string[];
}

interface CorporateMessage {
  id: number;
  messageId: string;
  title: string;
  content: string;
  messageType: string;
  priority: string;
  sender: string;
  targetAudience: string;
  publishedDate?: string;
  expiryDate?: string;
  status: string;
  requiresAcknowledgment?: boolean;
  tags?: string[];
  brand: string;
}

interface RetailOperationsProps {
  selectedBrand: Brand;
}

export default function RetailOperations({ selectedBrand }: RetailOperationsProps) {
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ["/api/stores", selectedBrand],
    queryFn: async () => {
      const params = selectedBrand !== "all" ? `?brand=${selectedBrand}` : "";
      const res = await fetch(`/api/stores${params}`);
      if (!res.ok) throw new Error("Failed to fetch stores");
      return res.json() as Promise<StoreType[]>;
    }
  });

  const { data: inventory = [] } = useQuery({
    queryKey: ["/api/store-inventory", selectedBrand, selectedStore?.id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedBrand !== "all") params.append("brand", selectedBrand);
      if (selectedStore?.id) params.append("storeId", selectedStore.id.toString());
      const res = await fetch(`/api/store-inventory?${params}`);
      if (!res.ok) throw new Error("Failed to fetch inventory");
      return res.json() as Promise<StoreInventory[]>;
    },
    enabled: !!selectedStore
  });

  const { data: sales = [] } = useQuery({
    queryKey: ["/api/store-sales", selectedBrand, selectedStore?.id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedBrand !== "all") params.append("brand", selectedBrand);
      if (selectedStore?.id) params.append("storeId", selectedStore.id.toString());
      const res = await fetch(`/api/store-sales?${params}`);
      if (!res.ok) throw new Error("Failed to fetch sales");
      return res.json() as Promise<StoreSales[]>;
    },
    enabled: !!selectedStore
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["/api/store-staff", selectedBrand, selectedStore?.id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedBrand !== "all") params.append("brand", selectedBrand);
      if (selectedStore?.id) params.append("storeId", selectedStore.id.toString());
      const res = await fetch(`/api/store-staff?${params}`);
      if (!res.ok) throw new Error("Failed to fetch staff");
      return res.json() as Promise<StoreStaff[]>;
    },
    enabled: !!selectedStore
  });

  const { data: displays = [] } = useQuery({
    queryKey: ["/api/store-displays", selectedBrand, selectedStore?.id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedBrand !== "all") params.append("brand", selectedBrand);
      if (selectedStore?.id) params.append("storeId", selectedStore.id.toString());
      const res = await fetch(`/api/store-displays?${params}`);
      if (!res.ok) throw new Error("Failed to fetch displays");
      return res.json() as Promise<StoreDisplay[]>;
    },
    enabled: !!selectedStore
  });

  const { data: schedules = [] } = useQuery({
    queryKey: ["/api/store-schedules", selectedStore?.id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedStore?.id) params.append("storeId", selectedStore.id.toString());
      const res = await fetch(`/api/store-schedules?${params}`);
      if (!res.ok) throw new Error("Failed to fetch schedules");
      return res.json() as Promise<StoreSchedule[]>;
    },
    enabled: !!selectedStore
  });

  const { data: keyholders = [] } = useQuery({
    queryKey: ["/api/keyholder-assignments", selectedStore?.id],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedStore?.id) params.append("storeId", selectedStore.id.toString());
      const res = await fetch(`/api/keyholder-assignments?${params}`);
      if (!res.ok) throw new Error("Failed to fetch keyholder assignments");
      return res.json() as Promise<KeyholderAssignment[]>;
    },
    enabled: !!selectedStore
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["/api/corporate-messages", selectedBrand],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedBrand !== "all") params.append("brand", selectedBrand);
      const res = await fetch(`/api/corporate-messages?${params}`);
      if (!res.ok) throw new Error("Failed to fetch corporate messages");
      return res.json() as Promise<CorporateMessage[]>;
    }
  });

  const getStoresByRegion = () => {
    const regions: { [key: string]: StoreType[] } = {};
    stores.forEach(store => {
      const region = getRegionFromCountry(store.country);
      if (!regions[region]) regions[region] = [];
      regions[region].push(store);
    });
    return regions;
  };

  const getRegionFromCountry = (country: string) => {
    const regionMap: { [key: string]: string } = {
      'Japan': 'Asia Pacific',
      'China': 'Asia Pacific',
      'Singapore': 'Asia Pacific',
      'Hong Kong': 'Asia Pacific',
      'Saudi Arabia': 'Middle East',
      'Qatar': 'Middle East',
      'Israel': 'Middle East',
      'Germany': 'Europe',
      'France': 'Europe',
      'Spain': 'Europe',
      'United States': 'North America',
      'Mexico': 'Latin America',
      'Brazil': 'Latin America'
    };
    return regionMap[country] || 'Other';
  };

  const getBrandColor = (brand: string) => {
    return brand === 'blorcs' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'renovation': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (selectedStore) {
    return (
      <div className="space-y-6">
        {/* Store Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedStore(null)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Stores
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{selectedStore.storeName}</h1>
              <p className="text-muted-foreground">
                {selectedStore.city}, {selectedStore.country} • {selectedStore.storeCode}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Badge className={getBrandColor(selectedStore.brand)}>
              {selectedStore.brand.toUpperCase()}
            </Badge>
            <Badge className={getStatusColor(selectedStore.status)}>
              {selectedStore.status}
            </Badge>
          </div>
        </div>

        {/* Store Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="staff">Team ({staff.length})</TabsTrigger>
            <TabsTrigger value="displays">Displays ({displays.length})</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            <TabsTrigger value="keyholders">Keyholders</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{staff.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {staff.filter(s => s.isKeyholder).length} keyholders
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Displays</CardTitle>
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{displays.filter(d => d.status === 'active').length}</div>
                  <p className="text-xs text-muted-foreground">
                    {displays.length} total displays
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{inventory.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Stock management
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Store Info</CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-1">
                    <p><strong>Manager:</strong> {selectedStore.storeManager || 'Not assigned'}</p>
                    <p><strong>Type:</strong> {selectedStore.storeType}</p>
                    <p><strong>Hours:</strong> {selectedStore.operatingHours || 'Not specified'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Store Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {selectedStore.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedStore.city}, {selectedStore.state ? `${selectedStore.state}, ` : ''}{selectedStore.country}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Team</CardTitle>
                <CardDescription>
                  Manage team members, roles, and keyholder assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Keyholder</TableHead>
                      <TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{member.firstName} {member.lastName}</div>
                            <div className="text-sm text-muted-foreground">{member.employeeId}</div>
                          </div>
                        </TableCell>
                        <TableCell>{member.position}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {member.isKeyholder ? (
                            <Badge variant="secondary">
                              <Key className="h-3 w-3 mr-1" />
                              {member.keyholderLevel || 'Standard'}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {member.email && <div>{member.email}</div>}
                            {member.phone && <div>{member.phone}</div>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="displays" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Displays</CardTitle>
                <CardDescription>
                  Manage visual merchandising and product displays
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displays.map((display) => (
                    <Card key={display.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{display.displayName}</CardTitle>
                          <Badge className={getStatusColor(display.status)}>
                            {display.status}
                          </Badge>
                        </div>
                        <CardDescription>{display.displayType} • {display.location}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {display.theme && (
                            <p className="text-sm"><strong>Theme:</strong> {display.theme}</p>
                          )}
                          {display.assignedTo && (
                            <p className="text-sm"><strong>Assigned to:</strong> {display.assignedTo}</p>
                          )}
                          {display.products && display.products.length > 0 && (
                            <p className="text-sm"><strong>Products:</strong> {display.products.length} items</p>
                          )}
                          {display.notes && (
                            <p className="text-sm text-muted-foreground">{display.notes}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedules" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Schedules</CardTitle>
                <CardDescription>
                  Manage shift schedules and staff assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule) => {
                      const staffMember = staff.find(s => s.id === schedule.staffId);
                      return (
                        <TableRow key={schedule.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(schedule.scheduleDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            {staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : 'Unknown'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {schedule.startTime} - {schedule.endTime}
                            </div>
                          </TableCell>
                          <TableCell>{schedule.position || schedule.shiftType}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(schedule.status)}>
                              {schedule.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keyholders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Keyholder Assignments</CardTitle>
                <CardDescription>
                  Manage security access and keyholder responsibilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Assignment Date</TableHead>
                      <TableHead>Access Level</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {keyholders.map((assignment) => {
                      const staffMember = staff.find(s => s.id === assignment.staffId);
                      return (
                        <TableRow key={assignment.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Key className="h-4 w-4 mr-2" />
                              {staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : 'Unknown'}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(assignment.assignmentDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{assignment.accessLevel}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-x-1">
                              {assignment.primaryKeyholder && <Badge variant="default">Primary</Badge>}
                              {assignment.backupKeyholder && <Badge variant="secondary">Backup</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(assignment.status)}>
                              {assignment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Corporate Messages</CardTitle>
                <CardDescription>
                  Important announcements and communications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <Card key={message.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{message.title}</CardTitle>
                          <div className="flex space-x-2">
                            <Badge variant={message.priority === 'urgent' ? 'destructive' : 'secondary'}>
                              {message.priority}
                            </Badge>
                            <Badge variant="outline">{message.messageType}</Badge>
                          </div>
                        </div>
                        <CardDescription>
                          From: {message.sender} • {message.publishedDate ? new Date(message.publishedDate).toLocaleDateString() : 'Draft'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{message.content}</p>
                        {message.requiresAcknowledgment && (
                          <div className="flex items-center mt-3 text-sm text-amber-600">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Acknowledgment required
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Main store overview
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Global Retail Operations</h1>
          <p className="text-muted-foreground">
            Managing {stores.length} stores across {Object.keys(getStoresByRegion()).length} regions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center">
            <Store className="h-3 w-3 mr-1" />
            {stores.length} Stores
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="stores" className="space-y-6">
        <TabsList>
          <TabsTrigger value="stores">Store Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="global-messages">Global Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="space-y-6">
          {Object.entries(getStoresByRegion()).map(([region, regionStores]) => (
            <Card key={region}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {region} ({regionStores.length} stores)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regionStores.map((store) => (
                    <Card 
                      key={store.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedStore(store)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{store.storeName}</CardTitle>
                          <Badge className={getBrandColor(store.brand)}>
                            {store.brand.toUpperCase()}
                          </Badge>
                        </div>
                        <CardDescription>{store.storeCode}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2" />
                            {store.city}, {store.country}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge className={getStatusColor(store.status)}>
                              {store.status}
                            </Badge>
                            <Badge variant="outline">{store.storeType}</Badge>
                          </div>
                          {store.storeManager && (
                            <p className="text-sm text-muted-foreground">
                              Manager: {store.storeManager}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stores.length}</div>
                <p className="text-xs text-muted-foreground">
                  Across {Object.keys(getStoresByRegion()).length} regions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stores.filter(s => s.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {((stores.filter(s => s.status === 'active').length / stores.length) * 100).toFixed(1)}% operational
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Flagship Stores</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stores.filter(s => s.storeType === 'flagship').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Premium locations
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Global Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{messages.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active communications
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="global-messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Corporate Messages</CardTitle>
              <CardDescription>
                Company-wide announcements and communications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <Card key={message.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{message.title}</CardTitle>
                        <div className="flex space-x-2">
                          <Badge variant={message.priority === 'urgent' ? 'destructive' : 'secondary'}>
                            {message.priority}
                          </Badge>
                          <Badge variant="outline">{message.messageType}</Badge>
                          <Badge className={getBrandColor(message.brand)}>
                            {message.brand.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>
                        From: {message.sender} • Target: {message.targetAudience} • {message.publishedDate ? new Date(message.publishedDate).toLocaleDateString() : 'Draft'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">{message.content}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          {message.requiresAcknowledgment && (
                            <div className="flex items-center text-amber-600">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Acknowledgment required
                            </div>
                          )}
                          {message.tags && message.tags.length > 0 && (
                            <div className="flex items-center space-x-1">
                              {message.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <Badge className={getStatusColor(message.status)}>
                          {message.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
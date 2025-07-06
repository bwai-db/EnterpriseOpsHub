import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Store, MapPin, Users, Package, DollarSign, TrendingUp, Clock, Calendar, Key, MessageSquare, Monitor, ArrowLeft, Globe } from "lucide-react";
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

const WorldMap = ({ stores, onStoreClick }: { stores: StoreType[], onStoreClick: (store: StoreType) => void }) => {
  const getStoreCoordinates = (store: StoreType) => {
    const coordinates: { [key: string]: { lat: number, lng: number } } = {
      'Tokyo': { lat: 35.6762, lng: 139.6503 },
      'Riyadh': { lat: 24.7136, lng: 46.6753 },
      'Doha': { lat: 25.2854, lng: 51.5310 },
      'Berlin': { lat: 52.5200, lng: 13.4050 },
      'Frankfurt': { lat: 50.1109, lng: 8.6821 },
      'Paris': { lat: 48.8566, lng: 2.3522 },
      'Madrid': { lat: 40.4168, lng: -3.7038 },
      'Anchorage': { lat: 61.2181, lng: -149.9003 },
      'San Diego': { lat: 32.7157, lng: -117.1611 },
      'Seattle': { lat: 47.6062, lng: -122.3321 },
      'Denver': { lat: 39.7392, lng: -104.9903 },
      'Aspen': { lat: 39.1911, lng: -106.8175 },
      'Mexico City': { lat: 19.4326, lng: -99.1332 },
      'São Paulo': { lat: -23.5505, lng: -46.6333 },
      'Beijing': { lat: 39.9042, lng: 116.4074 },
      'Singapore': { lat: 1.3521, lng: 103.8198 },
      'Hong Kong': { lat: 22.3193, lng: 114.1694 },
      'Tel Aviv': { lat: 32.0853, lng: 34.7818 }
    };
    return coordinates[store.city] || { lat: 0, lng: 0 };
  };

  const isStoreOpen = (store: StoreType) => {
    if (!store.timezone || !store.operatingHours) return null;
    
    try {
      const now = new Date();
      const storeTime = new Date(now.toLocaleString("en-US", { timeZone: store.timezone }));
      const currentHour = storeTime.getHours();
      
      // Parse operating hours (format: "10:00-21:00")
      if (store.operatingHours.includes('-')) {
        const [openTime, closeTime] = store.operatingHours.split('-');
        const openHour = parseInt(openTime.split(':')[0]);
        const closeHour = parseInt(closeTime.split(':')[0]);
        
        return currentHour >= openHour && currentHour < closeHour;
      }
    } catch (error) {
      return null;
    }
    return null;
  };

  const getStoreLocalTime = (store: StoreType) => {
    if (!store.timezone) return 'Unknown';
    try {
      const now = new Date();
      return now.toLocaleString("en-US", {
        timeZone: store.timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Unknown';
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden border">
      {/* World Map SVG */}
      <svg viewBox="0 0 1000 500" className="w-full h-64 md:h-80">
        {/* Ocean background */}
        <rect width="1000" height="500" fill="#3b82f6" fillOpacity="0.1" />
        
        {/* Realistic world map paths */}
        {/* North America */}
        <path d="M158 110 L158 95 L178 85 L195 88 L210 78 L225 85 L240 82 L255 95 L275 98 L285 108 L290 125 L285 140 L275 155 L260 165 L245 170 L230 175 L215 180 L200 185 L185 180 L170 175 L158 165 L148 150 L145 135 L148 120 Z" 
              fill="#22c55e" fillOpacity="0.6" stroke="#16a34a" strokeWidth="1"/>
        
        {/* Greenland */}
        <path d="M320 45 L340 40 L360 45 L365 65 L360 85 L340 90 L320 85 L315 65 Z" 
              fill="#22c55e" fillOpacity="0.6" stroke="#16a34a" strokeWidth="1"/>
        
        {/* South America */}
        <path d="M245 230 L255 225 L265 235 L270 250 L275 265 L280 285 L275 305 L270 325 L265 345 L260 365 L255 385 L245 395 L235 390 L225 385 L220 365 L215 345 L220 325 L225 305 L230 285 L235 265 L240 250 L245 235 Z" 
              fill="#22c55e" fillOpacity="0.6" stroke="#16a34a" strokeWidth="1"/>
        
        {/* Europe */}
        <path d="M445 85 L465 80 L485 85 L505 90 L515 105 L510 120 L505 135 L485 140 L465 135 L445 130 L435 115 L440 100 Z" 
              fill="#22c55e" fillOpacity="0.6" stroke="#16a34a" strokeWidth="1"/>
        
        {/* Africa */}
        <path d="M430 160 L450 155 L470 160 L485 175 L490 195 L495 215 L490 235 L485 255 L480 275 L475 295 L470 315 L465 335 L450 340 L435 335 L420 330 L415 315 L410 295 L415 275 L420 255 L425 235 L430 215 L435 195 L440 175 Z" 
              fill="#22c55e" fillOpacity="0.6" stroke="#16a34a" strokeWidth="1"/>
        
        {/* Asia */}
        <path d="M520 70 L580 65 L640 70 L700 75 L750 80 L780 90 L790 110 L795 130 L790 150 L785 170 L780 190 L770 210 L760 225 L745 235 L725 240 L705 235 L685 230 L665 225 L645 220 L625 215 L605 210 L585 205 L565 200 L545 195 L530 185 L520 170 L515 150 L520 130 L525 110 L530 90 Z" 
              fill="#22c55e" fillOpacity="0.6" stroke="#16a34a" strokeWidth="1"/>
        
        {/* Australia */}
        <path d="M720 320 L760 315 L800 320 L820 335 L825 355 L820 375 L800 380 L760 375 L720 370 L700 355 L705 335 Z" 
              fill="#22c55e" fillOpacity="0.6" stroke="#16a34a" strokeWidth="1"/>
        
        {/* Antarctica */}
        <path d="M100 450 L900 450 L900 480 L100 480 Z" 
              fill="#e5e7eb" fillOpacity="0.8" stroke="#9ca3af" strokeWidth="1"/>

        {/* Store pins with enhanced styling */}
        {stores.map((store) => {
          const coords = getStoreCoordinates(store);
          const isOpen = isStoreOpen(store);
          // Convert lat/lng to SVG coordinates (Equirectangular projection)
          const x = ((coords.lng + 180) / 360) * 1000;
          const y = ((90 - coords.lat) / 180) * 500;
          
          return (
            <g key={store.id}>
              {/* Store pin shadow */}
              <circle
                cx={x + 1}
                cy={y + 1}
                r="10"
                fill="rgba(0,0,0,0.2)"
                className="pointer-events-none"
              />
              {/* Store pin */}
              <circle
                cx={x}
                cy={y}
                r="8"
                fill={isOpen === true ? '#10b981' : isOpen === false ? '#ef4444' : '#6b7280'}
                stroke="white"
                strokeWidth="3"
                className="cursor-pointer hover:scale-110 transition-all duration-200 drop-shadow-lg"
                onClick={() => onStoreClick(store)}
              />
              {/* Inner dot for better visibility */}
              <circle
                cx={x}
                cy={y}
                r="3"
                fill="white"
                className="pointer-events-none"
              />
              {/* Store label with background */}
              <rect
                x={x - 25}
                y={y - 25}
                width="50"
                height="12"
                fill="rgba(255,255,255,0.9)"
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="0.5"
                rx="6"
                className="pointer-events-none"
              />
              <text
                x={x}
                y={y - 16}
                textAnchor="middle"
                className="text-[8px] font-medium fill-slate-700 pointer-events-none"
              >
                {store.city}
              </text>
              {/* Pulsing animation for open stores */}
              {isOpen === true && (
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  className="pointer-events-none animate-ping"
                />
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Enhanced Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 dark:text-green-300 font-medium">Open</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-700 dark:text-red-300 font-medium">Closed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Unknown</span>
          </div>
        </div>
      </div>
      
      {/* Geographic grid lines for more realism */}
      <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Longitude lines */}
        {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="500" stroke="rgba(156, 163, 175, 0.3)" strokeWidth="0.5"/>
        ))}
        {/* Latitude lines */}
        {[0, 100, 150, 200, 250, 300, 350, 400, 500].map(y => (
          <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(156, 163, 175, 0.3)" strokeWidth="0.5"/>
        ))}
        {/* Equator line */}
        <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(156, 163, 175, 0.5)" strokeWidth="1" strokeDasharray="5,5"/>
      </svg>
    </div>
  );
};

export default function RetailOperations({ selectedBrand }: RetailOperationsProps) {
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for real-time store status
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

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

  // Store status summary
  const getOpenStores = () => {
    return stores.filter(store => {
      if (!store.timezone || !store.operatingHours) return false;
      try {
        const now = new Date();
        const storeTime = new Date(now.toLocaleString("en-US", { timeZone: store.timezone }));
        const currentHour = storeTime.getHours();
        
        if (store.operatingHours.includes('-')) {
          const [openTime, closeTime] = store.operatingHours.split('-');
          const openHour = parseInt(openTime.split(':')[0]);
          const closeHour = parseInt(closeTime.split(':')[0]);
          
          return currentHour >= openHour && currentHour < closeHour;
        }
      } catch (error) {
        return false;
      }
      return false;
    });
  };

  const openStores = getOpenStores();

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
          <Badge variant="outline" className="flex items-center">
            <Clock className="h-3 w-3 mr-1 text-green-600" />
            {openStores.length} Open Now
          </Badge>
        </div>
      </div>

      {/* World Map with Store Locations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Global Store Network
              </CardTitle>
              <CardDescription>
                Real-time store status across {Object.keys(getStoresByRegion()).length} regions • Updated every minute
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>{openStores.length} Open</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>{stores.filter(s => s.timezone && s.operatingHours).length - openStores.length} Closed</span>
              </div>
              <div className="text-muted-foreground">
                {new Date().toLocaleString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <WorldMap stores={stores} onStoreClick={setSelectedStore} />
        </CardContent>
      </Card>

      {/* Open Stores Summary */}
      {openStores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-green-600" />
              Currently Open Stores ({openStores.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {openStores.map((store) => {
                const getStoreLocalTime = (store: StoreType) => {
                  if (!store.timezone) return 'Unknown';
                  try {
                    const now = new Date();
                    return now.toLocaleString("en-US", {
                      timeZone: store.timezone,
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    });
                  } catch (error) {
                    return 'Unknown';
                  }
                };

                return (
                  <Card 
                    key={store.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow border-green-200"
                    onClick={() => setSelectedStore(store)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{store.storeName}</h4>
                          <p className="text-sm text-muted-foreground">{store.city}, {store.country}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-green-600 text-sm font-medium">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                            Open
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {getStoreLocalTime(store)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <Badge className={getBrandColor(store.brand)} variant="outline">
                          {store.brand.toUpperCase()}
                        </Badge>
                        <span className="text-muted-foreground">{store.operatingHours}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

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
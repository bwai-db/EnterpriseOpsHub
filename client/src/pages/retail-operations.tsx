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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Store, MapPin, Users, Package, DollarSign, TrendingUp, Clock, Calendar, Key, MessageSquare, Monitor, ArrowLeft, Globe, Settings, HelpCircle, Phone, Wrench, Building, CreditCard, AlertTriangle, CheckCircle, XCircle, Plus } from "lucide-react";
import * as z from "zod";
import type { Brand } from "@/lib/types";

// Service Request Schema
const serviceRequestSchema = z.object({
  requestType: z.string().min(1, "Request type is required"),
  department: z.string().min(1, "Department is required"),
  priority: z.string().min(1, "Priority is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  storeId: z.string().optional(),
  requesterName: z.string().min(1, "Name is required"),
  requesterEmail: z.string().email("Valid email is required"),
  requesterPhone: z.string().optional(),
  requesterRole: z.string().min(1, "Role is required"),
});

type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;

interface ServiceRequest {
  id: number;
  ticketNumber: string;
  requestType: string;
  department: string;
  priority: string;
  title: string;
  description: string;
  status: string;
  persona: string;
  storeId?: number;
  requesterName: string;
  requesterEmail: string;
  requesterPhone?: string;
  requesterRole: string;
  assignedTo?: string;
  assignedDepartment?: string;
  estimatedResolution?: string;
  actualResolution?: string;
  resolutionNotes?: string;
  internalNotes?: string;
  customerFeedback?: string;
  satisfactionRating?: number;
  resolutionTime?: number;
  escalationLevel?: number;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  brand: string;
}

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

interface ConfigurationItem {
  id: number;
  ciName: string;
  ciType: string;
  ciClass?: string;
  status: string;
  environment?: string;
  location?: string;
  brand: string;
  vendor?: string;
  model?: string;
  attributes?: string;
  secureBaseline?: string;
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
        <rect width="1000" height="500" fill="#dbeafe" className="dark:fill-slate-800" />
        
        {/* Accurate world map paths based on Natural Earth data */}
        {/* North America - United States and Canada */}
        <path d="M158 120 Q180 95 220 100 Q260 90 290 110 Q320 105 340 120 Q350 140 345 160 Q340 180 320 195 Q300 200 280 195 Q250 190 220 185 Q190 180 170 170 Q155 155 150 135 Q155 125 158 120 Z" 
              fill="#10b981" fillOpacity="0.3" stroke="#059669" strokeWidth="0.5"/>
        
        {/* Alaska */}
        <path d="M80 140 Q100 130 120 135 Q130 145 125 155 Q115 160 105 155 Q90 150 80 140 Z" 
              fill="#10b981" fillOpacity="0.3" stroke="#059669" strokeWidth="0.5"/>
        
        {/* Greenland */}
        <path d="M380 80 Q400 70 420 75 Q430 90 425 110 Q415 125 400 130 Q385 125 375 110 Q370 95 380 80 Z" 
              fill="#10b981" fillOpacity="0.3" stroke="#059669" strokeWidth="0.5"/>
        
        {/* South America */}
        <path d="M260 240 Q280 230 300 240 Q310 260 315 280 Q320 300 315 320 Q310 340 305 360 Q300 380 285 395 Q270 400 255 395 Q240 390 235 370 Q230 350 235 330 Q240 310 245 290 Q250 270 260 240 Z" 
              fill="#10b981" fillOpacity="0.3" stroke="#059669" strokeWidth="0.5"/>
        
        {/* Europe */}
        <path d="M480 100 Q500 95 520 100 Q535 110 540 125 Q535 140 525 150 Q510 155 495 150 Q480 145 475 130 Q470 115 480 100 Z" 
              fill="#10b981" fillOpacity="0.3" stroke="#059669" strokeWidth="0.5"/>
        
        {/* Africa */}
        <path d="M460 170 Q480 165 500 175 Q515 190 520 210 Q525 230 520 250 Q515 270 510 290 Q505 310 495 330 Q485 350 470 365 Q455 370 440 365 Q425 360 420 340 Q415 320 420 300 Q425 280 430 260 Q435 240 440 220 Q445 200 450 180 Q455 175 460 170 Z" 
              fill="#10b981" fillOpacity="0.3" stroke="#059669" strokeWidth="0.5"/>
        
        {/* Asia - Russia, China, India */}
        <path d="M540 90 Q600 85 660 90 Q720 95 780 100 Q820 110 840 130 Q845 150 840 170 Q835 190 825 210 Q815 225 800 235 Q780 240 760 235 Q740 230 720 225 Q700 220 680 215 Q660 210 640 205 Q620 200 600 195 Q580 190 565 185 Q550 175 545 160 Q540 145 545 130 Q548 110 540 90 Z" 
              fill="#10b981" fillOpacity="0.3" stroke="#059669" strokeWidth="0.5"/>
        
        {/* Australia */}
        <path d="M720 340 Q760 335 800 340 Q830 350 835 370 Q830 385 810 390 Q780 395 750 390 Q720 385 705 370 Q700 355 715 345 Q720 340 720 340 Z" 
              fill="#10b981" fillOpacity="0.3" stroke="#059669" strokeWidth="0.5"/>
        
        {/* Japan (separate island) */}
        <path d="M820 180 Q830 175 840 180 Q845 190 840 200 Q830 205 820 200 Q815 190 820 180 Z" 
              fill="#10b981" fillOpacity="0.3" stroke="#059669" strokeWidth="0.5"/>

        {/* Store pins with clean styling */}
        {stores.map((store) => {
          const coords = getStoreCoordinates(store);
          const isOpen = isStoreOpen(store);
          // Convert lat/lng to SVG coordinates (Equirectangular projection)
          const x = ((coords.lng + 180) / 360) * 1000;
          const y = ((90 - coords.lat) / 180) * 500;
          
          return (
            <g key={store.id}>
              {/* Store pin */}
              <circle
                cx={x}
                cy={y}
                r="6"
                fill={isOpen === true ? '#059669' : isOpen === false ? '#dc2626' : '#6b7280'}
                stroke="white"
                strokeWidth="2"
                className="cursor-pointer hover:scale-125 transition-transform duration-200"
                onClick={() => onStoreClick(store)}
              />
              {/* Store label */}
              <text
                x={x}
                y={y - 12}
                textAnchor="middle"
                className="text-[10px] font-medium fill-slate-700 dark:fill-slate-200 pointer-events-none bg-white/80 px-1 rounded"
                style={{
                  textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                }}
              >
                {store.city}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Clean Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-green-700 dark:text-green-300 font-medium">Open</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-red-700 dark:text-red-300 font-medium">Closed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">Unknown</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function RetailOperations({ selectedBrand }: RetailOperationsProps) {
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showServiceRequestDialog, setShowServiceRequestDialog] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: configurationItems = [] } = useQuery({
    queryKey: ["/api/configuration-items", selectedBrand, selectedStore?.storeCode],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedBrand !== "all") params.append("brand", selectedBrand);
      const res = await fetch(`/api/configuration-items?${params}`);
      if (!res.ok) throw new Error("Failed to fetch configuration items");
      const allItems = await res.json() as ConfigurationItem[];
      // Filter by store location if a store is selected
      if (selectedStore) {
        return allItems.filter(item => 
          item.location?.includes(selectedStore.city) || 
          item.ciName.includes(selectedStore.storeCode)
        );
      }
      return allItems;
    },
    enabled: !!selectedStore
  });

  // Service requests query
  const { data: serviceRequests = [] } = useQuery({
    queryKey: ["/api/service-requests", selectedBrand],
    queryFn: async () => {
      const params = selectedBrand !== "all" ? `?brand=${selectedBrand}` : "";
      const res = await fetch(`/api/service-requests${params}`);
      if (!res.ok) throw new Error("Failed to fetch service requests");
      return res.json() as Promise<ServiceRequest[]>;
    }
  });

  // Service request form
  const form = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      requestType: "",
      department: "",
      priority: "",
      title: "",
      description: "",
      storeId: selectedStore?.id?.toString() || "",
      requesterName: "",
      requesterEmail: "",
      requesterPhone: "",
      requesterRole: "",
    },
  });

  // Service request mutation
  const createServiceRequestMutation = useMutation({
    mutationFn: async (data: ServiceRequestFormData) => {
      return apiRequest("POST", "/api/service-requests", {
        requestType: data.requestType,
        department: data.department,
        priority: data.priority,
        title: data.title,
        description: data.description,
        brand: selectedBrand === "all" ? "blorcs" : selectedBrand,
        storeId: data.storeId ? parseInt(data.storeId) : undefined,
        requesterName: data.requesterName,
        requesterEmail: data.requesterEmail,
        requesterPhone: data.requesterPhone,
        requesterRole: data.requesterRole,
        persona: data.requesterRole, // Use requester role as persona
        category: data.requestType, // Map requestType to category for the database
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/service-requests"] });
      setShowServiceRequestDialog(false);
      form.reset();
      toast({
        title: "Service Request Submitted",
        description: "Your request has been submitted successfully and will be processed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit service request. Please try again.",
        variant: "destructive",
      });
    },
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
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="staff">Team ({staff.length})</TabsTrigger>
            <TabsTrigger value="displays">Displays ({displays.length})</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
            <TabsTrigger value="keyholders">Keyholders</TabsTrigger>
            <TabsTrigger value="service-requests">Service Requests</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
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

          <TabsContent value="service-requests" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Service Request Form */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="h-5 w-5 mr-2" />
                    Submit Service Request
                  </CardTitle>
                  <CardDescription>
                    Submit requests for IT, HR, Finance, or Facilities support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => createServiceRequestMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="requestType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Request Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select request type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="incident">Incident Report</SelectItem>
                                <SelectItem value="service-request">Service Request</SelectItem>
                                <SelectItem value="change-request">Change Request</SelectItem>
                                <SelectItem value="access-request">Access Request</SelectItem>
                                <SelectItem value="hardware-request">Hardware Request</SelectItem>
                                <SelectItem value="software-request">Software Request</SelectItem>
                                <SelectItem value="facilities-request">Facilities Request</SelectItem>
                                <SelectItem value="hr-request">HR Request</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="it">
                                  <div className="flex items-center">
                                    <Monitor className="h-4 w-4 mr-2" />
                                    IT Support
                                  </div>
                                </SelectItem>
                                <SelectItem value="hr">
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    Human Resources
                                  </div>
                                </SelectItem>
                                <SelectItem value="finance">
                                  <div className="flex items-center">
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Finance
                                  </div>
                                </SelectItem>
                                <SelectItem value="facilities">
                                  <div className="flex items-center">
                                    <Building className="h-4 w-4 mr-2" />
                                    Facilities
                                  </div>
                                </SelectItem>
                                <SelectItem value="security">
                                  <div className="flex items-center">
                                    <Key className="h-4 w-4 mr-2" />
                                    Security
                                  </div>
                                </SelectItem>
                                <SelectItem value="maintenance">
                                  <div className="flex items-center">
                                    <Wrench className="h-4 w-4 mr-2" />
                                    Maintenance
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                    Low
                                  </div>
                                </SelectItem>
                                <SelectItem value="medium">
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                                    Medium
                                  </div>
                                </SelectItem>
                                <SelectItem value="high">
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                                    High
                                  </div>
                                </SelectItem>
                                <SelectItem value="critical">
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                                    Critical
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="requesterRole"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="retail-associate">Retail Associate</SelectItem>
                                <SelectItem value="shift-supervisor">Shift Supervisor</SelectItem>
                                <SelectItem value="store-manager">Store Manager</SelectItem>
                                <SelectItem value="assistant-manager">Assistant Manager</SelectItem>
                                <SelectItem value="regional-manager">Regional Manager</SelectItem>
                                <SelectItem value="corporate-operations">Corporate Operations</SelectItem>
                                <SelectItem value="district-manager">District Manager</SelectItem>
                                <SelectItem value="area-manager">Area Manager</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Request Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Brief description of your request" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Detailed Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide detailed information about your request..."
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="requesterName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="requesterEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your.email@company.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="requesterPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={createServiceRequestMutation.isPending}
                      >
                        {createServiceRequestMutation.isPending ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Submitting...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Plus className="w-4 h-4 mr-2" />
                            Submit Request
                          </div>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Service Requests List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Service Requests</CardTitle>
                      <CardDescription>
                        Track your service requests and their status
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {serviceRequests.length} Total
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {serviceRequests.length > 0 ? (
                    <div className="space-y-4">
                      {serviceRequests.slice(0, 10).map((request) => (
                        <Card key={request.id} className="border-l-4 border-l-blue-500">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  {request.department === 'it' && <Monitor className="h-4 w-4 text-blue-600" />}
                                  {request.department === 'hr' && <Users className="h-4 w-4 text-green-600" />}
                                  {request.department === 'finance' && <CreditCard className="h-4 w-4 text-purple-600" />}
                                  {request.department === 'facilities' && <Building className="h-4 w-4 text-orange-600" />}
                                  {request.department === 'security' && <Key className="h-4 w-4 text-red-600" />}
                                  {request.department === 'maintenance' && <Wrench className="h-4 w-4 text-gray-600" />}
                                  <div>
                                    <CardTitle className="text-base">{request.title}</CardTitle>
                                    <CardDescription className="text-sm">
                                      {request.ticketNumber} • {request.requesterName}
                                    </CardDescription>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant={
                                  request.priority === 'critical' ? 'destructive' :
                                  request.priority === 'high' ? 'default' :
                                  request.priority === 'medium' ? 'secondary' : 'outline'
                                }>
                                  {request.priority}
                                </Badge>
                                <Badge className={
                                  request.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                  request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }>
                                  {request.status === 'in-progress' ? 'In Progress' : 
                                   request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-700 mb-3">{request.description}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                <span>Department: {request.department.toUpperCase()}</span>
                                <span>Type: {request.requestType.replace('-', ' ')}</span>
                                <span>Role: {request.requesterRole.replace('-', ' ')}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            {request.assignedTo && (
                              <div className="mt-2 flex items-center text-sm text-blue-600">
                                <Users className="h-4 w-4 mr-1" />
                                Assigned to: {request.assignedTo}
                              </div>
                            )}
                            {request.estimatedResolution && (
                              <div className="mt-2 flex items-center text-sm text-green-600">
                                <Calendar className="h-4 w-4 mr-1" />
                                Estimated resolution: {new Date(request.estimatedResolution).toLocaleDateString()}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">
                        No Service Requests
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Service requests from associates, managers, and corporate operations will appear here.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="configuration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Items</CardTitle>
                <CardDescription>
                  IT infrastructure and configuration management for this store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {configurationItems.map((ci) => {
                    let attributes = {};
                    let secureBaseline = {};
                    try {
                      attributes = ci.attributes ? JSON.parse(ci.attributes) : {};
                      secureBaseline = ci.secureBaseline ? JSON.parse(ci.secureBaseline) : {};
                    } catch (e) {
                      // Handle malformed JSON gracefully
                    }

                    return (
                      <Card key={ci.id} className="h-full">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-medium truncate" title={ci.ciName}>
                              {ci.ciName.replace(selectedStore?.storeCode || '', '').replace('-', ' ').trim()}
                            </CardTitle>
                            <Badge className={getStatusColor(ci.status)}>
                              {ci.status}
                            </Badge>
                          </div>
                          <CardDescription className="text-sm">
                            {ci.ciType} • {ci.ciClass || 'General'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Vendor:</span>
                              <span className="font-medium">{ci.vendor || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Model:</span>
                              <span className="font-medium">{ci.model || 'N/A'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Environment:</span>
                              <Badge variant="outline" className="text-xs">
                                {ci.environment || 'production'}
                              </Badge>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center">
                              <Monitor className="h-4 w-4 mr-1" />
                              Key Specifications
                            </h4>
                            <div className="text-xs space-y-1">
                              {Object.entries(attributes).slice(0, 3).map(([key, value], idx) => (
                                <div key={idx} className="flex justify-between">
                                  <span className="text-muted-foreground capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                                  </span>
                                  <span className="font-mono text-xs">
                                    {typeof value === 'object' ? JSON.stringify(value).slice(0, 20) + '...' : String(value).slice(0, 20)}
                                    {String(value).length > 20 ? '...' : ''}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center">
                              <Key className="h-4 w-4 mr-1" />
                              Security Baseline
                            </h4>
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              {Object.entries(secureBaseline).slice(0, 4).map(([key, value], idx) => (
                                <div key={idx} className="flex items-center">
                                  <div className={`w-2 h-2 rounded-full mr-1 ${
                                    value === true ? 'bg-green-500' : 
                                    value === false ? 'bg-red-500' : 
                                    'bg-yellow-500'
                                  }`} />
                                  <span className="truncate" title={key}>
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <Button variant="outline" size="sm" className="text-xs">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs">
                              Edit Config
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                {configurationItems.length === 0 && (
                  <div className="text-center py-8">
                    <Monitor className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      No Configuration Items Found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Configuration items for this store will appear here once they are added to the CMDB.
                    </p>
                  </div>
                )}
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
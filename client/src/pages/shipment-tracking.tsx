import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  Truck, 
  Factory, 
  MapPin, 
  Clock, 
  Search, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  Building,
  Plane,
  Ship,
  Train,
  Archive
} from "lucide-react";
import type { Brand } from "@/lib/types";

interface ShipmentTrackingProps {
  selectedBrand: Brand;
}

// Mock data interfaces (will be replaced with actual API calls)
interface Shipment {
  id: number;
  shipmentNumber: string;
  trackingNumber?: string;
  status: string;
  priority: string;
  currentStage: string;
  currentLocation?: string;
  sourceName: string;
  destinationName: string;
  productName: string;
  quantity: number;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  carrierName?: string;
  brand: string;
}

interface ShipmentStage {
  id: number;
  stage: string;
  status: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  notes?: string;
}

interface ShipmentEvent {
  id: number;
  eventType: string;
  eventStatus: string;
  eventDate: string;
  location?: string;
  description: string;
}

export default function ShipmentTracking({ selectedBrand }: ShipmentTrackingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  // Mock data - will be replaced with actual API calls
  const mockShipments: Shipment[] = [
    {
      id: 1,
      shipmentNumber: "SHP-2025-001",
      trackingNumber: "1Z123456780",
      status: "in_transit",
      priority: "urgent",
      currentStage: "shipping_to_distro",
      currentLocation: "Frankfurt Distribution Hub",
      sourceName: "Blorcs Manufacturing Guangzhou",
      destinationName: "Blorcs Tokyo Flagship",
      productName: "Blorcs Pro Wireless Headphones",
      quantity: 250,
      expectedDeliveryDate: "2025-01-09",
      carrierName: "DHL Express",
      brand: "blorcs"
    },
    {
      id: 2,
      shipmentNumber: "SHP-2025-002",
      trackingNumber: "UPS789012345",
      status: "manufacturing",
      priority: "high",
      currentStage: "manufacturing",
      currentLocation: "Shaypops Manufacturing São Paulo",
      sourceName: "TechCore Components",
      destinationName: "Shaypops Mexico City Store",
      productName: "Shaypops Smart Watch Pro",
      quantity: 150,
      expectedDeliveryDate: "2025-01-12",
      carrierName: "UPS",
      brand: "shaypops"
    },
    {
      id: 3,
      shipmentNumber: "SHP-2025-003",
      status: "delivered",
      priority: "standard",
      currentStage: "delivered",
      currentLocation: "Blorcs Berlin Store",
      sourceName: "European Distribution Center",
      destinationName: "Blorcs Berlin Store",
      productName: "Blorcs Gaming Mouse Elite",
      quantity: 75,
      expectedDeliveryDate: "2025-01-05",
      actualDeliveryDate: "2025-01-05",
      carrierName: "DPD",
      brand: "blorcs"
    }
  ];

  const mockStages: { [key: number]: ShipmentStage[] } = {
    1: [
      { id: 1, stage: "sourcing", status: "completed", startDate: "2025-01-02", endDate: "2025-01-03", location: "TechCore Components", notes: "Components sourced" },
      { id: 2, stage: "manufacturing", status: "completed", startDate: "2025-01-03", endDate: "2025-01-05", location: "Blorcs Manufacturing Guangzhou", notes: "Production completed" },
      { id: 3, stage: "shipping_to_distro", status: "in_progress", startDate: "2025-01-05", location: "In transit to Frankfurt", notes: "Express shipping via DHL" },
      { id: 4, stage: "at_distribution", status: "pending", location: "Frankfurt Distribution Hub" },
      { id: 5, stage: "shipping_to_destination", status: "pending", location: "Tokyo" },
      { id: 6, stage: "delivered", status: "pending", location: "Blorcs Tokyo Flagship" }
    ]
  };

  const mockEvents: { [key: number]: ShipmentEvent[] } = {
    1: [
      { id: 1, eventType: "pickup", eventStatus: "success", eventDate: "2025-01-05T10:30:00Z", location: "Guangzhou, China", description: "Package picked up from manufacturer" },
      { id: 2, eventType: "transit", eventStatus: "success", eventDate: "2025-01-05T14:00:00Z", location: "Guangzhou Airport", description: "Departed from origin facility" },
      { id: 3, eventType: "transit", eventStatus: "success", eventDate: "2025-01-06T08:15:00Z", location: "Frankfurt Airport", description: "Arrived at international hub" },
      { id: 4, eventType: "transit", eventStatus: "in_progress", eventDate: "2025-01-06T12:00:00Z", location: "Frankfurt Distribution Hub", description: "Processing at distribution center" }
    ]
  };

  const filteredShipments = mockShipments.filter(shipment => 
    (selectedBrand === "all" || shipment.brand === selectedBrand) &&
    (searchTerm === "" || 
     shipment.shipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
     shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     shipment.productName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'manufacturing': return 'bg-yellow-100 text-yellow-800';
      case 'at_distribution': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'standard': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBrandColor = (brand: string) => {
    return brand === 'blorcs' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'sourcing': return <Package className="h-4 w-4" />;
      case 'manufacturing': return <Factory className="h-4 w-4" />;
      case 'shipping_to_distro': return <Truck className="h-4 w-4" />;
      case 'at_distribution': return <Building className="h-4 w-4" />;
      case 'shipping_to_destination': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getTransportIcon = (carrier: string) => {
    if (carrier?.includes('DHL') || carrier?.includes('Express')) return <Plane className="h-4 w-4" />;
    if (carrier?.includes('Sea') || carrier?.includes('Ocean')) return <Ship className="h-4 w-4" />;
    if (carrier?.includes('Rail')) return <Train className="h-4 w-4" />;
    return <Truck className="h-4 w-4" />;
  };

  const getStageProgress = (stages: ShipmentStage[]) => {
    const completed = stages.filter(s => s.status === 'completed').length;
    return (completed / stages.length) * 100;
  };

  if (selectedShipment) {
    const stages = mockStages[selectedShipment.id] || [];
    const events = mockEvents[selectedShipment.id] || [];

    return (
      <div className="space-y-6">
        {/* Shipment Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedShipment(null)}
            >
              ← Back to Shipments
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{selectedShipment.shipmentNumber}</h1>
              <p className="text-muted-foreground">
                {selectedShipment.sourceName} → {selectedShipment.destinationName}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Badge className={getBrandColor(selectedShipment.brand)}>
              {selectedShipment.brand.toUpperCase()}
            </Badge>
            <Badge className={getPriorityColor(selectedShipment.priority)}>
              {selectedShipment.priority}
            </Badge>
            <Badge className={getStatusColor(selectedShipment.status)}>
              {selectedShipment.status.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        {/* Shipment Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shipment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Product</p>
                <p className="text-sm text-muted-foreground">{selectedShipment.productName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Quantity</p>
                <p className="text-sm text-muted-foreground">{selectedShipment.quantity} units</p>
              </div>
              <div>
                <p className="text-sm font-medium">Tracking Number</p>
                <p className="text-sm text-muted-foreground">{selectedShipment.trackingNumber || 'Not available'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Carrier</p>
                <p className="text-sm text-muted-foreground">{selectedShipment.carrierName || 'Not assigned'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Current Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Current Stage</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getStageIcon(selectedShipment.currentStage)}
                  <span className="text-sm text-muted-foreground capitalize">
                    {selectedShipment.currentStage.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Current Location</p>
                <div className="flex items-center space-x-2 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">
                    {selectedShipment.currentLocation || 'Location not available'}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Progress</p>
                <div className="mt-2">
                  <Progress value={getStageProgress(stages)} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(getStageProgress(stages))}% complete
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Expected Delivery</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm text-muted-foreground">
                    {new Date(selectedShipment.expectedDeliveryDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {selectedShipment.actualDeliveryDate && (
                <div>
                  <p className="text-sm font-medium">Actual Delivery</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(selectedShipment.actualDeliveryDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tracking Details */}
        <Tabs defaultValue="stages" className="space-y-6">
          <TabsList>
            <TabsTrigger value="stages">Stages</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="route">Route</TabsTrigger>
          </TabsList>

          <TabsContent value="stages">
            <Card>
              <CardHeader>
                <CardTitle>Shipment Stages</CardTitle>
                <CardDescription>
                  Track progress through each stage of the supply chain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {stage.status === 'completed' ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : stage.status === 'in_progress' ? (
                          <Clock className="h-6 w-6 text-blue-600" />
                        ) : stage.status === 'failed' ? (
                          <XCircle className="h-6 w-6 text-red-600" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getStageIcon(stage.stage)}
                            <h4 className="font-medium capitalize">
                              {stage.stage.replace('_', ' ')}
                            </h4>
                            <Badge className={getStatusColor(stage.status)} variant="outline">
                              {stage.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stage.startDate && new Date(stage.startDate).toLocaleDateString()}
                            {stage.endDate && ` - ${new Date(stage.endDate).toLocaleDateString()}`}
                          </div>
                        </div>
                        {stage.location && (
                          <p className="text-sm text-muted-foreground mt-1">
                            📍 {stage.location}
                          </p>
                        )}
                        {stage.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {stage.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Tracking Events</CardTitle>
                <CardDescription>
                  Detailed event log for this shipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {event.eventStatus === 'success' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : event.eventStatus === 'in_progress' ? (
                          <Clock className="h-5 w-5 text-blue-600" />
                        ) : event.eventStatus === 'failure' ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{event.description}</h4>
                          <span className="text-sm text-muted-foreground">
                            {new Date(event.eventDate).toLocaleString()}
                          </span>
                        </div>
                        {event.location && (
                          <p className="text-sm text-muted-foreground mt-1">
                            📍 {event.location}
                          </p>
                        )}
                        <Badge className={getStatusColor(event.eventType)} variant="outline">
                          {event.eventType.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="route">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Route</CardTitle>
                <CardDescription>
                  Geographic route and transportation details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Factory className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">Origin</span>
                    </div>
                    <div className="flex-1 text-sm text-muted-foreground">
                      {selectedShipment.sourceName}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      {getTransportIcon(selectedShipment.carrierName || '')}
                      <span className="font-medium">In Transit</span>
                    </div>
                    <div className="flex-1 text-sm text-muted-foreground">
                      Via {selectedShipment.carrierName || 'Carrier TBD'}
                      {selectedShipment.currentLocation && ` • Currently at ${selectedShipment.currentLocation}`}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">Destination</span>
                    </div>
                    <div className="flex-1 text-sm text-muted-foreground">
                      {selectedShipment.destinationName}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shipment Tracking</h1>
          <p className="text-muted-foreground">
            Track shipments from sourcing to delivery across the supply chain
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by shipment number, tracking number, or product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredShipments.filter(s => ['in_transit', 'manufacturing', 'at_distribution'].includes(s.status)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Manufacturing</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredShipments.filter(s => s.status === 'manufacturing').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Being produced
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredShipments.filter(s => s.status === 'in_transit').length}
            </div>
            <p className="text-xs text-muted-foreground">
              On the way
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredShipments.filter(s => s.status === 'delivered').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Shipments</CardTitle>
          <CardDescription>
            Complete list of shipments across the supply chain
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shipment</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{shipment.shipmentNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {shipment.trackingNumber || 'No tracking'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{shipment.productName}</div>
                      <div className="text-sm text-muted-foreground">
                        Qty: {shipment.quantity}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{shipment.sourceName}</div>
                      <div className="text-muted-foreground">↓</div>
                      <div>{shipment.destinationName}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(shipment.status)}>
                      {shipment.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(shipment.priority)} variant="outline">
                      {shipment.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(shipment.expectedDeliveryDate).toLocaleDateString()}
                      {shipment.actualDeliveryDate && (
                        <div className="text-xs text-green-600">
                          Delivered: {new Date(shipment.actualDeliveryDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getBrandColor(shipment.brand)}>
                      {shipment.brand.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedShipment(shipment)}
                    >
                      Track
                    </Button>
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
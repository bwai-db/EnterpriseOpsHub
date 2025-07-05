import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Database, 
  ArrowRight, 
  GitBranch, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";

interface ServiceDependencyMapProps {
  services: any[];
  configItems: any[];
  relationships: any[];
  onServiceSelect: (serviceId: number) => void;
  selectedService?: number;
}

export default function ServiceDependencyMap({ 
  services, 
  configItems, 
  relationships, 
  onServiceSelect,
  selectedService 
}: ServiceDependencyMapProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"services" | "config">("services");
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
      case 'active':
        return '#10b981'; // green
      case 'maintenance':
      case 'under_change':
        return '#f59e0b'; // amber
      case 'inactive':
      case 'retired':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical':
        return '#ef4444'; // red
      case 'high':
        return '#f59e0b'; // amber
      case 'medium':
        return '#3b82f6'; // blue
      case 'low':
        return '#10b981'; // green
      default:
        return '#6b7280'; // gray
    }
  };

  const buildDependencyGraph = () => {
    const nodes: any[] = [];
    const edges: any[] = [];

    if (viewMode === "services") {
      // Add service nodes
      services.forEach((service, index) => {
        nodes.push({
          id: `service-${service.id}`,
          label: service.serviceName,
          type: 'service',
          data: service,
          x: 100 + (index % 4) * 200,
          y: 100 + Math.floor(index / 4) * 150,
          status: service.serviceStatus,
          criticality: service.businessCriticality
        });
      });

      // Add service relationships
      relationships.forEach(rel => {
        edges.push({
          from: `service-${rel.parentServiceId}`,
          to: `service-${rel.childServiceId}`,
          label: rel.relationshipType,
          type: 'service-relation'
        });
      });
    } else {
      // Add configuration item nodes grouped by service
      const serviceGroups: { [key: number]: any[] } = {};
      
      configItems.forEach(ci => {
        if (ci.serviceId) {
          if (!serviceGroups[ci.serviceId]) {
            serviceGroups[ci.serviceId] = [];
          }
          serviceGroups[ci.serviceId].push(ci);
        }
      });

      let yOffset = 50;
      Object.entries(serviceGroups).forEach(([serviceId, cis]) => {
        const service = services.find(s => s.id === parseInt(serviceId));
        if (!service) return;

        // Add service header node
        nodes.push({
          id: `service-${serviceId}`,
          label: service.serviceName,
          type: 'service-header',
          data: service,
          x: 50,
          y: yOffset,
          width: 300,
          height: 40
        });

        yOffset += 60;

        // Add CI nodes under service
        cis.forEach((ci, index) => {
          nodes.push({
            id: `ci-${ci.id}`,
            label: ci.ciName,
            type: 'config-item',
            data: ci,
            x: 80 + (index % 3) * 120,
            y: yOffset,
            status: ci.status,
            ciClass: ci.ciClass
          });
        });

        yOffset += 100;
      });
    }

    return { nodes, edges };
  };

  const renderNode = (node: any, ctx: CanvasRenderingContext2D) => {
    const { x, y, label, type, status, criticality, ciClass } = node;
    
    ctx.save();
    
    // Apply zoom and pan transformations
    const transformedX = (x + panX) * zoom;
    const transformedY = (y + panY) * zoom;
    
    if (type === 'service') {
      // Service node
      const width = 150 * zoom;
      const height = 60 * zoom;
      
      // Background
      ctx.fillStyle = selectedNode === node.id ? '#1f2937' : '#f9fafb';
      ctx.fillRect(transformedX, transformedY, width, height);
      
      // Border based on criticality
      ctx.strokeStyle = getCriticalityColor(criticality);
      ctx.lineWidth = 2 * zoom;
      ctx.strokeRect(transformedX, transformedY, width, height);
      
      // Status indicator
      ctx.fillStyle = getStatusColor(status);
      ctx.fillRect(transformedX + width - (10 * zoom), transformedY, 10 * zoom, height);
      
      // Text
      ctx.fillStyle = '#1f2937';
      ctx.font = `${12 * zoom}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(label, transformedX + width/2, transformedY + height/2 + (4 * zoom));
      
    } else if (type === 'config-item') {
      // Configuration item node
      const width = 100 * zoom;
      const height = 40 * zoom;
      
      // Background
      ctx.fillStyle = selectedNode === node.id ? '#e5e7eb' : '#ffffff';
      ctx.fillRect(transformedX, transformedY, width, height);
      
      // Border based on CI class
      ctx.strokeStyle = getStatusColor(status);
      ctx.lineWidth = 1 * zoom;
      ctx.strokeRect(transformedX, transformedY, width, height);
      
      // Text
      ctx.fillStyle = '#374151';
      ctx.font = `${10 * zoom}px sans-serif`;
      ctx.textAlign = 'center';
      
      // Truncate long labels
      const truncatedLabel = label.length > 12 ? label.substring(0, 12) + '...' : label;
      ctx.fillText(truncatedLabel, transformedX + width/2, transformedY + height/2 + (3 * zoom));
      
    } else if (type === 'service-header') {
      // Service header for CI view
      const width = (node.width || 300) * zoom;
      const height = (node.height || 40) * zoom;
      
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(transformedX, transformedY, width, height);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${14 * zoom}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(label, transformedX + (10 * zoom), transformedY + height/2 + (4 * zoom));
    }
    
    ctx.restore();
  };

  const renderEdge = (edge: any, nodes: any[], ctx: CanvasRenderingContext2D) => {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);
    
    if (!fromNode || !toNode) return;
    
    ctx.save();
    
    // Apply zoom and pan transformations
    const fromX = (fromNode.x + 75 + panX) * zoom; // Center of node
    const fromY = (fromNode.y + 30 + panY) * zoom;
    const toX = (toNode.x + 75 + panX) * zoom;
    const toY = (toNode.y + 30 + panY) * zoom;
    
    // Draw arrow
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2 * zoom;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    // Draw arrowhead
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const headLength = 10 * zoom;
    
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
    
    // Draw label
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    
    ctx.fillStyle = '#374151';
    ctx.font = `${10 * zoom}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(edge.label, midX, midY - (5 * zoom));
    
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const { nodes, edges } = buildDependencyGraph();
    
    // Draw edges first (behind nodes)
    edges.forEach(edge => renderEdge(edge, nodes, ctx));
    
    // Draw nodes
    nodes.forEach(node => renderNode(node, ctx));
    
  }, [services, configItems, relationships, viewMode, selectedNode, zoom, panX, panY]);

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Calculate zoom
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, zoom * zoomFactor));
    
    // Calculate pan to zoom toward mouse position
    const deltaZoom = newZoom - zoom;
    const newPanX = panX - (mouseX / zoom) * deltaZoom;
    const newPanY = panY - (mouseY / zoom) * deltaZoom;
    
    setZoom(newZoom);
    setPanX(newPanX);
    setPanY(newPanY);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const deltaX = event.clientX - lastMousePos.x;
    const deltaY = event.clientY - lastMousePos.y;
    
    setPanX(panX + deltaX / zoom);
    setPanY(panY + deltaY / zoom);
    
    setLastMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) return; // Don't handle clicks while dragging
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Transform click coordinates to canvas space
    const canvasX = (x / zoom) - panX;
    const canvasY = (y / zoom) - panY;
    
    const { nodes } = buildDependencyGraph();
    
    // Check if click is on any node
    const clickedNode = nodes.find(node => {
      const nodeWidth = node.type === 'service' ? 150 : node.type === 'service-header' ? 300 : 100;
      const nodeHeight = node.type === 'service' ? 60 : node.type === 'service-header' ? 40 : 40;
      
      return canvasX >= node.x && canvasX <= node.x + nodeWidth &&
             canvasY >= node.y && canvasY <= node.y + nodeHeight;
    });
    
    if (clickedNode) {
      setSelectedNode(clickedNode.id);
      if (clickedNode.type === 'service' && clickedNode.data.id) {
        onServiceSelect(clickedNode.data.id);
      }
    } else {
      setSelectedNode(null);
    }
  };

  const getSelectedNodeInfo = () => {
    if (!selectedNode) return null;
    
    const { nodes } = buildDependencyGraph();
    const node = nodes.find(n => n.id === selectedNode);
    return node?.data;
  };

  const selectedInfo = getSelectedNodeInfo();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Service Dependency Map</h3>
          <p className="text-sm text-muted-foreground">
            Visual representation of service relationships and dependencies
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={viewMode} onValueChange={(value: "services" | "config") => setViewMode(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="services">Service View</SelectItem>
              <SelectItem value="config">Configuration View</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(3, zoom * 1.2))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.1, zoom * 0.8))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetView}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <div className="text-xs text-muted-foreground px-2">
              {Math.round(zoom * 100)}%
            </div>
          </div>
          <Button variant="outline" size="sm">
            <GitBranch className="h-4 w-4 mr-2" />
            Auto Layout
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-0">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onClick={handleCanvasClick}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-full border cursor-grab active:cursor-grabbing"
                style={{ maxHeight: '600px' }}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          {/* Legend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Status</div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Operational</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Maintenance</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Offline</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Criticality</div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-1 bg-red-500"></div>
                  <span>Critical</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-1 bg-yellow-500"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-1 bg-blue-500"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-1 bg-green-500"></div>
                  <span>Low</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Selected Node Info */}
          {selectedInfo && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Selected {selectedInfo.serviceName ? 'Service' : 'Configuration Item'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="font-medium text-sm">{selectedInfo.serviceName || selectedInfo.ciName}</div>
                  {selectedInfo.serviceCode && (
                    <Badge variant="outline" className="mt-1">{selectedInfo.serviceCode}</Badge>
                  )}
                  {selectedInfo.ciType && (
                    <Badge variant="secondary" className="mt-1">{selectedInfo.ciType}</Badge>
                  )}
                </div>
                
                {selectedInfo.description && (
                  <p className="text-xs text-muted-foreground">{selectedInfo.description}</p>
                )}
                
                <div className="space-y-2">
                  {selectedInfo.businessCriticality && (
                    <div className="flex items-center justify-between text-xs">
                      <span>Criticality:</span>
                      <Badge className="text-xs">{selectedInfo.businessCriticality}</Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs">
                    <span>Status:</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedInfo.serviceStatus || selectedInfo.status}
                    </Badge>
                  </div>
                  
                  {selectedInfo.slaTarget && (
                    <div className="flex items-center justify-between text-xs">
                      <span>SLA:</span>
                      <span>{selectedInfo.slaTarget}</span>
                    </div>
                  )}
                  
                  {selectedInfo.serviceOwner && (
                    <div className="flex items-center justify-between text-xs">
                      <span>Owner:</span>
                      <span>{selectedInfo.serviceOwner}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Impact Analysis
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Zap className="h-4 w-4 mr-2" />
                Create Change
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Database className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
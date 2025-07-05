import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, Globe, Factory, MapPin, TrendingUp, Clock, Shield } from "lucide-react";
import type { Brand } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import type { DistributionCenter, DistributionCenterMetrics } from "@shared/schema";

interface SupplyChainProps {
  selectedBrand: Brand;
}

export default function SupplyChain({ selectedBrand }: SupplyChainProps) {
  const { data: distributionCenters, isLoading: centersLoading } = useQuery({
    queryKey: ['/api/distribution-centers', selectedBrand],
    queryFn: async () => {
      const response = await fetch(`/api/distribution-centers?brand=${selectedBrand}`);
      if (!response.ok) throw new Error('Failed to fetch distribution centers');
      return response.json() as Promise<DistributionCenter[]>;
    }
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['/api/distribution-center-metrics', selectedBrand],
    queryFn: async () => {
      const response = await fetch('/api/distribution-center-metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      return response.json() as Promise<DistributionCenterMetrics[]>;
    }
  });

  // Calculate current quarter metrics
  const currentQuarter = 'Q1';
  const currentYear = 2025;
  const currentMetrics = metrics?.filter(m => m.quarter === currentQuarter && m.year === currentYear) || [];
  
  const totalPackages = currentMetrics.reduce((sum, m) => sum + m.packagesProcessed, 0);
  const avgOnTimeDelivery = currentMetrics.length > 0 
    ? Math.round(currentMetrics.reduce((sum, m) => sum + Number(m.onTimeDeliveryRate || 0), 0) / currentMetrics.length * 10) / 10
    : 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ms-text">Supply Chain Management</h2>
        <p className="text-gray-600 mt-2">
          Manage distribution centers, PLC/3PL stacks, and global manufacturing logistics
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Distribution Centers</p>
                <p className="text-2xl font-bold text-ms-text">
                  {centersLoading ? "..." : distributionCenters?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="text-ms-blue w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Active facilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quarterly Volume</p>
                <p className="text-2xl font-bold text-ms-text">
                  {metricsLoading ? "..." : `${(totalPackages / 1000).toFixed(0)}K`}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="text-green-600 w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Packages processed {currentQuarter} {currentYear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivery Performance</p>
                <p className="text-2xl font-bold text-ms-text">
                  {metricsLoading ? "..." : `${avgOnTimeDelivery}%`}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="text-orange-600 w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">On-time delivery rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Global Reach</p>
                <p className="text-2xl font-bold text-ms-text">35</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="text-purple-600 w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Countries</p>
          </CardContent>
        </Card>
      </div>

      {/* Brand-specific Content */}
      {selectedBrand !== "all" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="capitalize">{selectedBrand} Supply Chain Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Factory className="mx-auto w-12 h-12 mb-4 text-gray-300" />
              <p>Brand-specific supply chain data for {selectedBrand}</p>
              <p className="text-sm">Manufacturing and logistics details coming soon</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Supply Chain Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Distribution Centers ({distributionCenters?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {centersLoading ? (
              <p>Loading distribution centers...</p>
            ) : distributionCenters?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="mx-auto w-12 h-12 mb-4 text-gray-300" />
                <p>No distribution centers found for {selectedBrand === 'all' ? 'all brands' : selectedBrand}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {distributionCenters?.map((center) => {
                  const centerMetrics = currentMetrics.find(m => m.centerId === center.id);
                  return (
                    <div key={center.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {center.name}
                          </h3>
                          <p className="text-sm text-gray-600">{center.city}, {center.state}</p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {center.primaryBrand}
                        </Badge>
                      </div>
                      
                      {centerMetrics && (
                        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t text-sm">
                          <div>
                            <p className="text-gray-600">Packages Processed</p>
                            <p className="font-semibold">{(centerMetrics.packagesProcessed / 1000).toFixed(0)}K</p>
                          </div>
                          <div>
                            <p className="text-gray-600">On-Time Delivery</p>
                            <p className="font-semibold">{centerMetrics.onTimeDeliveryRate}%</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                        <span>Capacity: {center.capacity?.toLocaleString() || 'N/A'}/day</span>
                        <span>Utilization: {center.currentUtilization}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manufacturing Logistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Factory className="mx-auto w-12 h-12 mb-4 text-gray-300" />
              <p>Global manufacturing coordination</p>
              <p className="text-sm">From design to delivery across all brands</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PLC/3PL Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Truck className="mx-auto w-12 h-12 mb-4 text-gray-300" />
              <p>Third-party logistics management</p>
              <p className="text-sm">Integrate with external logistics providers</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shipment Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Globe className="mx-auto w-12 h-12 mb-4 text-gray-300" />
              <p>Real-time shipment monitoring</p>
              <p className="text-sm">Track deliveries worldwide</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

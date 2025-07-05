import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, AlertCircle, Clock, Rocket, CheckCircle } from "lucide-react";
import IncidentForm from "@/components/forms/incident-form";
import IncidentTable from "@/components/tables/incident-table";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Brand } from "@/lib/types";
import type { Incident } from "@shared/schema";

interface ITILProps {
  selectedBrand: Brand;
}

export default function ITIL({ selectedBrand }: ITILProps) {
  const [activeTab, setActiveTab] = useState("incidents");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null);

  const { toast } = useToast();

  const { data: incidents, isLoading } = useQuery<Incident[]>({
    queryKey: ["/api/incidents", selectedBrand],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Incident> }) => {
      const response = await fetch(`/api/incidents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update incident");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/incidents"] });
      toast({
        title: "Success",
        description: "Incident updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update incident",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (incident: Incident) => {
    setEditingIncident(incident);
    setIsDialogOpen(true);
  };

  const handleStatusUpdate = (id: number, status: string) => {
    updateMutation.mutate({ id, data: { status } });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingIncident(null);
  };

  const criticalIncidents = incidents?.filter(i => 
    i.priority === "critical" && (i.status === "open" || i.status === "assigned" || i.status === "in_progress")
  ).length || 0;

  const pendingChanges = 7; // Mock data for now
  const monthlyReleases = 12; // Mock data for now
  
  const openIncidents = incidents?.filter(i => 
    i.status === "open" || i.status === "assigned" || i.status === "in_progress"
  ).length || 0;
  
  const resolvedIncidents = incidents?.filter(i => i.status === "resolved" || i.status === "closed").length || 0;
  const totalIncidents = incidents?.length || 0;
  const resolutionRate = totalIncidents > 0 ? Math.round((resolvedIncidents / totalIncidents) * 100) : 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ms-text">ITIL Management</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-ms-blue hover:bg-blue-600">
                <Plus className="mr-2 w-4 h-4" />
                Create Incident
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingIncident ? "Edit Incident" : "Create New Incident"}
                </DialogTitle>
              </DialogHeader>
              <IncidentForm 
                incident={editingIncident} 
                onSuccess={handleDialogClose}
                selectedBrand={selectedBrand}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ITIL Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="changes">Change Requests</TabsTrigger>
          <TabsTrigger value="releases">Release Management</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ITIL Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <AlertCircle className="text-red-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">{criticalIncidents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <Clock className="text-yellow-600 w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Changes</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingChanges}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Rocket className="text-ms-blue w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Releases This Month</p>
                <p className="text-2xl font-bold text-ms-blue">{monthlyReleases}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="text-ms-green w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                <p className="text-2xl font-bold text-ms-green">{resolutionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <TabsContent value="incidents">
        <IncidentTable 
          incidents={incidents || []}
          isLoading={isLoading}
          onEdit={handleEdit}
          onStatusUpdate={handleStatusUpdate}
        />
      </TabsContent>

      <TabsContent value="changes">
        <Card>
          <CardHeader>
            <CardTitle>Change Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Clock className="mx-auto w-12 h-12 mb-4 text-gray-300" />
              <p>Change management functionality coming soon</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="releases">
        <Card>
          <CardHeader>
            <CardTitle>Release Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Rocket className="mx-auto w-12 h-12 mb-4 text-gray-300" />
              <p>Release management functionality coming soon</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}

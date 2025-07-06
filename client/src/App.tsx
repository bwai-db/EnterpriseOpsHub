import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Vendors from "@/pages/vendors";
import Licensing from "@/pages/licensing";
import CloudServices from "@/pages/cloud-services";
import ITIL from "@/pages/itil";
import SupplyChain from "@/pages/supply-chain";
import Manufacturing from "@/pages/manufacturing";
import Security from "@/pages/security";
import HRService from "@/pages/hr-service";
import People from "@/pages/people";
import RetailOperations from "@/pages/retail-operations";
import ServiceManagement from "@/pages/service-management";
import IntegrationCenter from "@/pages/integration-center";
import ShipmentTracking from "@/pages/shipment-tracking";
import FacilitiesManagement from "@/pages/facilities-management";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import type { Brand } from "@/lib/types";

function Router({ selectedBrand }: { selectedBrand: Brand }) {
  return (
    <Switch>
      <Route path="/" component={() => <Dashboard selectedBrand={selectedBrand} />} />
      <Route path="/dashboard" component={() => <Dashboard selectedBrand={selectedBrand} />} />
      <Route path="/vendors" component={() => <Vendors selectedBrand={selectedBrand} />} />
      <Route path="/licensing" component={() => <Licensing selectedBrand={selectedBrand} />} />
      <Route path="/cloud-services" component={() => <CloudServices selectedBrand={selectedBrand} />} />
      <Route path="/itil" component={() => <ITIL selectedBrand={selectedBrand} />} />
      <Route path="/supply-chain" component={() => <SupplyChain selectedBrand={selectedBrand} />} />
      <Route path="/manufacturing" component={() => <Manufacturing selectedBrand={selectedBrand} />} />
      <Route path="/security" component={() => <Security selectedBrand={selectedBrand} />} />
      <Route path="/hr-service" component={() => <HRService selectedBrand={selectedBrand} />} />
      <Route path="/people" component={() => <People selectedBrand={selectedBrand} />} />
      <Route path="/retail-operations" component={() => <RetailOperations selectedBrand={selectedBrand} />} />
      <Route path="/service-management" component={() => <ServiceManagement selectedBrand={selectedBrand} />} />
      <Route path="/integration-center" component={() => <IntegrationCenter selectedBrand={selectedBrand} />} />
      <Route path="/shipment-tracking" component={() => <ShipmentTracking selectedBrand={selectedBrand} />} />
      <Route path="/facilities-management" component={() => <FacilitiesManagement selectedBrand={selectedBrand} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [selectedBrand, setSelectedBrand] = useState<Brand>("all");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="h-screen bg-ms-bg">
          <Header selectedBrand={selectedBrand} onBrandChange={setSelectedBrand} />
          <div className="flex h-[calc(100vh-73px)]">
            <Sidebar />
            <main className="flex-1 overflow-auto p-6">
              <Router selectedBrand={selectedBrand} />
            </main>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

export type Brand = "all" | "blorcs" | "shaypops";

export interface DashboardMetrics {
  activeVendors: number;
  expiringLicenses: number;
  openIncidents: number;
  cloudHealth: number;
  criticalIncidents: number;
}

export interface FilterState {
  search: string;
  status: string;
  category: string;
  brand: Brand;
}

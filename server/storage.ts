import { 
  users, vendors, licenses, incidents, cloudServices,
  type User, type InsertUser,
  type Vendor, type InsertVendor,
  type License, type InsertLicense,
  type Incident, type InsertIncident,
  type CloudService, type InsertCloudService
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Vendors
  getVendors(brand?: string): Promise<Vendor[]>;
  getVendor(id: number): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: number, vendor: Partial<InsertVendor>): Promise<Vendor>;
  deleteVendor(id: number): Promise<boolean>;

  // Licenses
  getLicenses(brand?: string): Promise<License[]>;
  getLicense(id: number): Promise<License | undefined>;
  createLicense(license: InsertLicense): Promise<License>;
  updateLicense(id: number, license: Partial<InsertLicense>): Promise<License>;
  deleteLicense(id: number): Promise<boolean>;

  // Incidents
  getIncidents(brand?: string): Promise<Incident[]>;
  getIncident(id: number): Promise<Incident | undefined>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  updateIncident(id: number, incident: Partial<InsertIncident>): Promise<Incident>;
  deleteIncident(id: number): Promise<boolean>;

  // Cloud Services
  getCloudServices(brand?: string): Promise<CloudService[]>;
  getCloudService(id: number): Promise<CloudService | undefined>;
  createCloudService(service: InsertCloudService): Promise<CloudService>;
  updateCloudService(id: number, service: Partial<InsertCloudService>): Promise<CloudService>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private vendors: Map<number, Vendor>;
  private licenses: Map<number, License>;
  private incidents: Map<number, Incident>;
  private cloudServices: Map<number, CloudService>;
  private currentUserId: number;
  private currentVendorId: number;
  private currentLicenseId: number;
  private currentIncidentId: number;
  private currentCloudServiceId: number;
  private currentIncidentNumber: number;

  constructor() {
    this.users = new Map();
    this.vendors = new Map();
    this.licenses = new Map();
    this.incidents = new Map();
    this.cloudServices = new Map();
    this.currentUserId = 1;
    this.currentVendorId = 1;
    this.currentLicenseId = 1;
    this.currentIncidentId = 1;
    this.currentCloudServiceId = 1;
    this.currentIncidentNumber = 1;

    // Initialize with some default cloud services
    this.initializeCloudServices();
  }

  private initializeCloudServices() {
    const defaultServices = [
      { serviceName: "Azure Services", provider: "azure", status: "operational", region: "East US", brand: "all" },
      { serviceName: "M365", provider: "m365", status: "operational", region: "Global", brand: "all" },
      { serviceName: "PowerBI", provider: "powerbi", status: "degraded", region: "Global", brand: "all" },
      { serviceName: "Intune", provider: "intune", status: "operational", region: "Global", brand: "all" },
    ];

    defaultServices.forEach(service => {
      const id = this.currentCloudServiceId++;
      const cloudService: CloudService = {
        ...service,
        id,
        lastChecked: new Date(),
      };
      this.cloudServices.set(id, cloudService);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Vendors
  async getVendors(brand?: string): Promise<Vendor[]> {
    const allVendors = Array.from(this.vendors.values());
    if (!brand || brand === "all") return allVendors;
    return allVendors.filter(vendor => vendor.brand === brand || vendor.brand === "all");
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const id = this.currentVendorId++;
    const vendor: Vendor = {
      ...insertVendor,
      id,
      createdAt: new Date(),
    };
    this.vendors.set(id, vendor);
    return vendor;
  }

  async updateVendor(id: number, updateData: Partial<InsertVendor>): Promise<Vendor> {
    const vendor = this.vendors.get(id);
    if (!vendor) throw new Error("Vendor not found");
    
    const updatedVendor = { ...vendor, ...updateData };
    this.vendors.set(id, updatedVendor);
    return updatedVendor;
  }

  async deleteVendor(id: number): Promise<boolean> {
    return this.vendors.delete(id);
  }

  // Licenses
  async getLicenses(brand?: string): Promise<License[]> {
    const allLicenses = Array.from(this.licenses.values());
    if (!brand || brand === "all") return allLicenses;
    return allLicenses.filter(license => license.brand === brand || license.brand === "all");
  }

  async getLicense(id: number): Promise<License | undefined> {
    return this.licenses.get(id);
  }

  async createLicense(insertLicense: InsertLicense): Promise<License> {
    const id = this.currentLicenseId++;
    const license: License = {
      ...insertLicense,
      id,
      createdAt: new Date(),
    };
    this.licenses.set(id, license);
    return license;
  }

  async updateLicense(id: number, updateData: Partial<InsertLicense>): Promise<License> {
    const license = this.licenses.get(id);
    if (!license) throw new Error("License not found");
    
    const updatedLicense = { ...license, ...updateData };
    this.licenses.set(id, updatedLicense);
    return updatedLicense;
  }

  async deleteLicense(id: number): Promise<boolean> {
    return this.licenses.delete(id);
  }

  // Incidents
  async getIncidents(brand?: string): Promise<Incident[]> {
    const allIncidents = Array.from(this.incidents.values());
    if (!brand || brand === "all") return allIncidents;
    return allIncidents.filter(incident => incident.brand === brand || incident.brand === "all");
  }

  async getIncident(id: number): Promise<Incident | undefined> {
    return this.incidents.get(id);
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const id = this.currentIncidentId++;
    const incidentId = `INC-2024-${String(this.currentIncidentNumber++).padStart(3, '0')}`;
    
    const incident: Incident = {
      ...insertIncident,
      id,
      incidentId,
      createdAt: new Date(),
      resolvedAt: null,
    };
    this.incidents.set(id, incident);
    return incident;
  }

  async updateIncident(id: number, updateData: Partial<InsertIncident>): Promise<Incident> {
    const incident = this.incidents.get(id);
    if (!incident) throw new Error("Incident not found");
    
    const updatedIncident = { 
      ...incident, 
      ...updateData,
      resolvedAt: updateData.status === "resolved" || updateData.status === "closed" 
        ? new Date() 
        : incident.resolvedAt
    };
    this.incidents.set(id, updatedIncident);
    return updatedIncident;
  }

  async deleteIncident(id: number): Promise<boolean> {
    return this.incidents.delete(id);
  }

  // Cloud Services
  async getCloudServices(brand?: string): Promise<CloudService[]> {
    const allServices = Array.from(this.cloudServices.values());
    if (!brand || brand === "all") return allServices;
    return allServices.filter(service => service.brand === brand || service.brand === "all");
  }

  async getCloudService(id: number): Promise<CloudService | undefined> {
    return this.cloudServices.get(id);
  }

  async createCloudService(insertService: InsertCloudService): Promise<CloudService> {
    const id = this.currentCloudServiceId++;
    const service: CloudService = {
      ...insertService,
      id,
      lastChecked: new Date(),
    };
    this.cloudServices.set(id, service);
    return service;
  }

  async updateCloudService(id: number, updateData: Partial<InsertCloudService>): Promise<CloudService> {
    const service = this.cloudServices.get(id);
    if (!service) throw new Error("Cloud service not found");
    
    const updatedService = { 
      ...service, 
      ...updateData,
      lastChecked: new Date()
    };
    this.cloudServices.set(id, updatedService);
    return updatedService;
  }
}

export const storage = new MemStorage();

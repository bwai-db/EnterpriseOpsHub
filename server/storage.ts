import { 
  users, vendors, licenses, incidents, cloudServices,
  type User, type InsertUser,
  type Vendor, type InsertVendor,
  type License, type InsertLicense,
  type Incident, type InsertIncident,
  type CloudService, type InsertCloudService
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Vendors
  async getVendors(brand?: string): Promise<Vendor[]> {
    if (brand && brand !== "all") {
      return await db.select().from(vendors).where(eq(vendors.brand, brand));
    }
    return await db.select().from(vendors);
  }

  async getVendor(id: number): Promise<Vendor | undefined> {
    const [vendor] = await db.select().from(vendors).where(eq(vendors.id, id));
    return vendor || undefined;
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const [vendor] = await db
      .insert(vendors)
      .values(insertVendor)
      .returning();
    return vendor;
  }

  async updateVendor(id: number, updateData: Partial<InsertVendor>): Promise<Vendor> {
    const [vendor] = await db
      .update(vendors)
      .set(updateData)
      .where(eq(vendors.id, id))
      .returning();
    return vendor;
  }

  async deleteVendor(id: number): Promise<boolean> {
    const result = await db.delete(vendors).where(eq(vendors.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Licenses
  async getLicenses(brand?: string): Promise<License[]> {
    if (brand && brand !== "all") {
      return await db.select().from(licenses).where(eq(licenses.brand, brand));
    }
    return await db.select().from(licenses);
  }

  async getLicense(id: number): Promise<License | undefined> {
    const [license] = await db.select().from(licenses).where(eq(licenses.id, id));
    return license || undefined;
  }

  async createLicense(insertLicense: InsertLicense): Promise<License> {
    const [license] = await db
      .insert(licenses)
      .values(insertLicense)
      .returning();
    return license;
  }

  async updateLicense(id: number, updateData: Partial<InsertLicense>): Promise<License> {
    const [license] = await db
      .update(licenses)
      .set(updateData)
      .where(eq(licenses.id, id))
      .returning();
    return license;
  }

  async deleteLicense(id: number): Promise<boolean> {
    const result = await db.delete(licenses).where(eq(licenses.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Incidents
  async getIncidents(brand?: string): Promise<Incident[]> {
    if (brand && brand !== "all") {
      return await db.select().from(incidents).where(eq(incidents.brand, brand));
    }
    return await db.select().from(incidents);
  }

  async getIncident(id: number): Promise<Incident | undefined> {
    const [incident] = await db.select().from(incidents).where(eq(incidents.id, id));
    return incident || undefined;
  }

  async createIncident(insertIncident: InsertIncident): Promise<Incident> {
    const [incident] = await db
      .insert(incidents)
      .values(insertIncident)
      .returning();
    return incident;
  }

  async updateIncident(id: number, updateData: Partial<InsertIncident>): Promise<Incident> {
    const [incident] = await db
      .update(incidents)
      .set(updateData)
      .where(eq(incidents.id, id))
      .returning();
    return incident;
  }

  async deleteIncident(id: number): Promise<boolean> {
    const result = await db.delete(incidents).where(eq(incidents.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Cloud Services
  async getCloudServices(brand?: string): Promise<CloudService[]> {
    if (brand && brand !== "all") {
      return await db.select().from(cloudServices).where(eq(cloudServices.brand, brand));
    }
    return await db.select().from(cloudServices);
  }

  async getCloudService(id: number): Promise<CloudService | undefined> {
    const [service] = await db.select().from(cloudServices).where(eq(cloudServices.id, id));
    return service || undefined;
  }

  async createCloudService(insertService: InsertCloudService): Promise<CloudService> {
    const [service] = await db
      .insert(cloudServices)
      .values(insertService)
      .returning();
    return service;
  }

  async updateCloudService(id: number, updateData: Partial<InsertCloudService>): Promise<CloudService> {
    const [service] = await db
      .update(cloudServices)
      .set(updateData)
      .where(eq(cloudServices.id, id))
      .returning();
    return service;
  }
}

export const storage = new DatabaseStorage();
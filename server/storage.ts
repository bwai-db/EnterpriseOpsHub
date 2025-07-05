import { 
  users, vendors, licenses, incidents, cloudServices,
  divisions, departments, functions, personas,
  type User, type InsertUser,
  type Vendor, type InsertVendor,
  type License, type InsertLicense,
  type Incident, type InsertIncident,
  type CloudService, type InsertCloudService,
  type Division, type InsertDivision,
  type Department, type InsertDepartment,
  type Function, type InsertFunction,
  type Persona, type InsertPersona
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Organizational Structure
  getDivisions(brand?: string): Promise<Division[]>;
  getDivision(id: number): Promise<Division | undefined>;
  createDivision(division: InsertDivision): Promise<Division>;
  updateDivision(id: number, division: Partial<InsertDivision>): Promise<Division>;
  deleteDivision(id: number): Promise<boolean>;

  getDepartments(brand?: string, divisionId?: number): Promise<Department[]>;
  getDepartment(id: number): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department>;
  deleteDepartment(id: number): Promise<boolean>;

  getFunctions(brand?: string, departmentId?: number): Promise<Function[]>;
  getFunction(id: number): Promise<Function | undefined>;
  createFunction(func: InsertFunction): Promise<Function>;
  updateFunction(id: number, func: Partial<InsertFunction>): Promise<Function>;
  deleteFunction(id: number): Promise<boolean>;

  getPersonas(brand?: string): Promise<Persona[]>;
  getPersona(id: number): Promise<Persona | undefined>;
  createPersona(persona: InsertPersona): Promise<Persona>;
  updatePersona(id: number, persona: Partial<InsertPersona>): Promise<Persona>;
  deletePersona(id: number): Promise<boolean>;

  // Users
  getUsers(brand?: string): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEntraId(entraId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
  syncUserFromEntra(entraData: any): Promise<User>;

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
  // Organizational Structure
  async getDivisions(brand?: string): Promise<Division[]> {
    if (brand && brand !== "all") {
      return await db.select().from(divisions).where(eq(divisions.brand, brand));
    }
    return await db.select().from(divisions);
  }

  async getDivision(id: number): Promise<Division | undefined> {
    const [division] = await db.select().from(divisions).where(eq(divisions.id, id));
    return division || undefined;
  }

  async createDivision(insertDivision: InsertDivision): Promise<Division> {
    const [division] = await db
      .insert(divisions)
      .values(insertDivision)
      .returning();
    return division;
  }

  async updateDivision(id: number, updateData: Partial<InsertDivision>): Promise<Division> {
    const [division] = await db
      .update(divisions)
      .set(updateData)
      .where(eq(divisions.id, id))
      .returning();
    return division;
  }

  async deleteDivision(id: number): Promise<boolean> {
    const result = await db.delete(divisions).where(eq(divisions.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getDepartments(brand?: string, divisionId?: number): Promise<Department[]> {
    if (divisionId) {
      return await db.select().from(departments).where(eq(departments.divisionId, divisionId));
    } else if (brand && brand !== "all") {
      return await db.select().from(departments).where(eq(departments.brand, brand));
    }
    return await db.select().from(departments);
  }

  async getDepartment(id: number): Promise<Department | undefined> {
    const [department] = await db.select().from(departments).where(eq(departments.id, id));
    return department || undefined;
  }

  async createDepartment(insertDepartment: InsertDepartment): Promise<Department> {
    const [department] = await db
      .insert(departments)
      .values(insertDepartment)
      .returning();
    return department;
  }

  async updateDepartment(id: number, updateData: Partial<InsertDepartment>): Promise<Department> {
    const [department] = await db
      .update(departments)
      .set(updateData)
      .where(eq(departments.id, id))
      .returning();
    return department;
  }

  async deleteDepartment(id: number): Promise<boolean> {
    const result = await db.delete(departments).where(eq(departments.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getFunctions(brand?: string, departmentId?: number): Promise<Function[]> {
    if (departmentId) {
      return await db.select().from(functions).where(eq(functions.departmentId, departmentId));
    } else if (brand && brand !== "all") {
      return await db.select().from(functions).where(eq(functions.brand, brand));
    }
    return await db.select().from(functions);
  }

  async getFunction(id: number): Promise<Function | undefined> {
    const [func] = await db.select().from(functions).where(eq(functions.id, id));
    return func || undefined;
  }

  async createFunction(insertFunction: InsertFunction): Promise<Function> {
    const [func] = await db
      .insert(functions)
      .values(insertFunction)
      .returning();
    return func;
  }

  async updateFunction(id: number, updateData: Partial<InsertFunction>): Promise<Function> {
    const [func] = await db
      .update(functions)
      .set(updateData)
      .where(eq(functions.id, id))
      .returning();
    return func;
  }

  async deleteFunction(id: number): Promise<boolean> {
    const result = await db.delete(functions).where(eq(functions.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getPersonas(brand?: string): Promise<Persona[]> {
    if (brand && brand !== "all") {
      return await db.select().from(personas).where(eq(personas.brand, brand));
    }
    return await db.select().from(personas);
  }

  async getPersona(id: number): Promise<Persona | undefined> {
    const [persona] = await db.select().from(personas).where(eq(personas.id, id));
    return persona || undefined;
  }

  async createPersona(insertPersona: InsertPersona): Promise<Persona> {
    const [persona] = await db
      .insert(personas)
      .values(insertPersona)
      .returning();
    return persona;
  }

  async updatePersona(id: number, updateData: Partial<InsertPersona>): Promise<Persona> {
    const [persona] = await db
      .update(personas)
      .set(updateData)
      .where(eq(personas.id, id))
      .returning();
    return persona;
  }

  async deletePersona(id: number): Promise<boolean> {
    const result = await db.delete(personas).where(eq(personas.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Users
  async getUsers(brand?: string): Promise<User[]> {
    if (brand && brand !== "all") {
      return await db.select().from(users).where(eq(users.brand, brand));
    }
    return await db.select().from(users);
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEntraId(entraId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.entraId, entraId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async syncUserFromEntra(entraData: any): Promise<User> {
    // Check if user exists by EntraID
    const existingUser = await this.getUserByEntraId(entraData.id);
    
    const userData = {
      username: entraData.userPrincipalName || entraData.mail,
      email: entraData.mail || entraData.userPrincipalName,
      displayName: entraData.displayName,
      firstName: entraData.givenName,
      lastName: entraData.surname,
      entraId: entraData.id,
      jobTitle: entraData.jobTitle,
      department: entraData.department,
      manager: entraData.manager?.displayName,
      officeLocation: entraData.officeLocation,
      mobilePhone: entraData.mobilePhone,
      businessPhone: entraData.businessPhones?.[0],
      isActive: entraData.accountEnabled,
      lastSync: new Date(),
      brand: "all" // Default brand, can be updated based on business logic
    };

    if (existingUser) {
      // Update existing user
      return await this.updateUser(existingUser.id, userData);
    } else {
      // Create new user
      return await this.createUser(userData);
    }
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
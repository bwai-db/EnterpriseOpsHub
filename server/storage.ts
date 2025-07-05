import { 
  users, vendors, vendorTeamMembers, vendorAgreements, licenses, incidents, cloudServices,
  corporates, divisions, departments, functions, personas,
  stores, storeInventory, storeSales, storeStaff,
  serviceCategories, itilServices, configurationItems,
  serviceRelationships, ciRelationships, changeRequests, serviceLevelAgreements,
  distributionCenters, distributionCenterMetrics,
  integrationLibraries, integrationEndpoints, integrationCredentials,
  type User, type InsertUser,
  type Vendor, type InsertVendor,
  type VendorTeamMember, type InsertVendorTeamMember,
  type VendorAgreement, type InsertVendorAgreement,
  type License, type InsertLicense,
  type Incident, type InsertIncident,
  type CloudService, type InsertCloudService,
  type Corporate, type InsertCorporate,
  type Division, type InsertDivision,
  type Department, type InsertDepartment,
  type Function, type InsertFunction,
  type Persona, type InsertPersona,
  type Store, type InsertStore,
  type StoreInventory, type InsertStoreInventory,
  type StoreSales, type InsertStoreSales,
  type StoreStaff, type InsertStoreStaff,
  type ServiceCategory, type InsertServiceCategory,
  type ItilService, type InsertItilService,
  type ConfigurationItem, type InsertConfigurationItem,
  type ServiceRelationship, type InsertServiceRelationship,
  type CiRelationship, type InsertCiRelationship,
  type ChangeRequest, type InsertChangeRequest,
  type ServiceLevelAgreement, type InsertServiceLevelAgreement,
  type DistributionCenter, type InsertDistributionCenter,
  type DistributionCenterMetrics, type InsertDistributionCenterMetrics,
  type IntegrationLibrary, type InsertIntegrationLibrary,
  type IntegrationEndpoint, type InsertIntegrationEndpoint,
  type IntegrationCredential, type InsertIntegrationCredential
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Organizational Structure
  getCorporates(brand?: string): Promise<Corporate[]>;
  getCorporate(id: number): Promise<Corporate | undefined>;
  createCorporate(corporate: InsertCorporate): Promise<Corporate>;
  updateCorporate(id: number, corporate: Partial<InsertCorporate>): Promise<Corporate>;
  deleteCorporate(id: number): Promise<boolean>;

  getDivisions(brand?: string, corporateId?: number): Promise<Division[]>;
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

  // Vendor Team Members
  getVendorTeamMembers(vendorId?: number): Promise<VendorTeamMember[]>;
  getVendorTeamMember(id: number): Promise<VendorTeamMember | undefined>;
  createVendorTeamMember(member: InsertVendorTeamMember): Promise<VendorTeamMember>;
  updateVendorTeamMember(id: number, member: Partial<InsertVendorTeamMember>): Promise<VendorTeamMember>;
  deleteVendorTeamMember(id: number): Promise<boolean>;

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

  // Retail Store Operations
  getStores(brand?: string): Promise<Store[]>;
  getStore(id: number): Promise<Store | undefined>;
  createStore(store: InsertStore): Promise<Store>;
  updateStore(id: number, store: Partial<InsertStore>): Promise<Store>;
  deleteStore(id: number): Promise<boolean>;

  getStoreInventory(storeId?: number, brand?: string): Promise<StoreInventory[]>;
  getInventoryItem(id: number): Promise<StoreInventory | undefined>;
  createInventoryItem(item: InsertStoreInventory): Promise<StoreInventory>;
  updateInventoryItem(id: number, item: Partial<InsertStoreInventory>): Promise<StoreInventory>;
  deleteInventoryItem(id: number): Promise<boolean>;

  getStoreSales(storeId?: number, brand?: string): Promise<StoreSales[]>;
  getSalesRecord(id: number): Promise<StoreSales | undefined>;
  createSalesRecord(sale: InsertStoreSales): Promise<StoreSales>;

  getStoreStaff(storeId?: number, brand?: string): Promise<StoreStaff[]>;
  getStaffMember(id: number): Promise<StoreStaff | undefined>;
  createStaffMember(staff: InsertStoreStaff): Promise<StoreStaff>;
  updateStaffMember(id: number, staff: Partial<InsertStoreStaff>): Promise<StoreStaff>;
  deleteStaffMember(id: number): Promise<boolean>;

  // ITIL Service Management and CMDB
  getServiceCategories(brand?: string): Promise<ServiceCategory[]>;
  getServiceCategory(id: number): Promise<ServiceCategory | undefined>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  updateServiceCategory(id: number, category: Partial<InsertServiceCategory>): Promise<ServiceCategory>;
  deleteServiceCategory(id: number): Promise<boolean>;

  getItilServices(brand?: string, categoryId?: number): Promise<ItilService[]>;
  getItilService(id: number): Promise<ItilService | undefined>;
  createItilService(service: InsertItilService): Promise<ItilService>;
  updateItilService(id: number, service: Partial<InsertItilService>): Promise<ItilService>;
  deleteItilService(id: number): Promise<boolean>;

  getConfigurationItems(brand?: string, serviceId?: number, ciClass?: string): Promise<ConfigurationItem[]>;
  getConfigurationItem(id: number): Promise<ConfigurationItem | undefined>;
  createConfigurationItem(ci: InsertConfigurationItem): Promise<ConfigurationItem>;
  updateConfigurationItem(id: number, ci: Partial<InsertConfigurationItem>): Promise<ConfigurationItem>;
  deleteConfigurationItem(id: number): Promise<boolean>;
  syncConfigurationItems(ciClass: string, brand?: string): Promise<ConfigurationItem[]>;

  getServiceRelationships(serviceId?: number): Promise<ServiceRelationship[]>;
  createServiceRelationship(relationship: InsertServiceRelationship): Promise<ServiceRelationship>;
  deleteServiceRelationship(id: number): Promise<boolean>;

  getCiRelationships(ciId?: number): Promise<CiRelationship[]>;
  createCiRelationship(relationship: InsertCiRelationship): Promise<CiRelationship>;
  deleteCiRelationship(id: number): Promise<boolean>;

  getChangeRequests(brand?: string, status?: string): Promise<ChangeRequest[]>;
  getChangeRequest(id: number): Promise<ChangeRequest | undefined>;
  createChangeRequest(change: InsertChangeRequest): Promise<ChangeRequest>;
  updateChangeRequest(id: number, change: Partial<InsertChangeRequest>): Promise<ChangeRequest>;
  deleteChangeRequest(id: number): Promise<boolean>;

  getServiceLevelAgreements(serviceId?: number): Promise<ServiceLevelAgreement[]>;
  getServiceLevelAgreement(id: number): Promise<ServiceLevelAgreement | undefined>;
  createServiceLevelAgreement(sla: InsertServiceLevelAgreement): Promise<ServiceLevelAgreement>;
  updateServiceLevelAgreement(id: number, sla: Partial<InsertServiceLevelAgreement>): Promise<ServiceLevelAgreement>;
  deleteServiceLevelAgreement(id: number): Promise<boolean>;

  // Distribution Centers
  getDistributionCenters(brand?: string): Promise<DistributionCenter[]>;
  getDistributionCenter(id: number): Promise<DistributionCenter | undefined>;
  createDistributionCenter(center: InsertDistributionCenter): Promise<DistributionCenter>;
  updateDistributionCenter(id: number, center: Partial<InsertDistributionCenter>): Promise<DistributionCenter>;
  deleteDistributionCenter(id: number): Promise<boolean>;

  getDistributionCenterMetrics(centerId?: number, quarter?: string, year?: number): Promise<DistributionCenterMetrics[]>;
  getDistributionCenterMetric(id: number): Promise<DistributionCenterMetrics | undefined>;
  createDistributionCenterMetrics(metrics: InsertDistributionCenterMetrics): Promise<DistributionCenterMetrics>;
  updateDistributionCenterMetrics(id: number, metrics: Partial<InsertDistributionCenterMetrics>): Promise<DistributionCenterMetrics>;
  deleteDistributionCenterMetrics(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // Organizational Structure
  async getCorporates(brand?: string): Promise<Corporate[]> {
    if (brand && brand !== "all") {
      return await db.select().from(corporates).where(eq(corporates.brand, brand));
    }
    return await db.select().from(corporates);
  }

  async getCorporate(id: number): Promise<Corporate | undefined> {
    const [corporate] = await db.select().from(corporates).where(eq(corporates.id, id));
    return corporate || undefined;
  }

  async createCorporate(insertCorporate: InsertCorporate): Promise<Corporate> {
    const [corporate] = await db
      .insert(corporates)
      .values(insertCorporate)
      .returning();
    return corporate;
  }

  async updateCorporate(id: number, updateData: Partial<InsertCorporate>): Promise<Corporate> {
    const [corporate] = await db
      .update(corporates)
      .set(updateData)
      .where(eq(corporates.id, id))
      .returning();
    return corporate;
  }

  async deleteCorporate(id: number): Promise<boolean> {
    const result = await db.delete(corporates).where(eq(corporates.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getDivisions(brand?: string, corporateId?: number): Promise<Division[]> {
    let query = db.select().from(divisions);
    
    if (corporateId) {
      query = query.where(eq(divisions.corporateId, corporateId));
    } else if (brand && brand !== "all") {
      query = query.where(eq(divisions.brand, brand));
    }
    
    return await query;
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

  // Vendor Team Members
  async getVendorTeamMembers(vendorId?: number): Promise<VendorTeamMember[]> {
    if (vendorId) {
      return await db.select().from(vendorTeamMembers).where(eq(vendorTeamMembers.vendorId, vendorId));
    }
    return await db.select().from(vendorTeamMembers);
  }

  async getVendorTeamMember(id: number): Promise<VendorTeamMember | undefined> {
    const [member] = await db.select().from(vendorTeamMembers).where(eq(vendorTeamMembers.id, id));
    return member || undefined;
  }

  async createVendorTeamMember(insertMember: InsertVendorTeamMember): Promise<VendorTeamMember> {
    const [member] = await db
      .insert(vendorTeamMembers)
      .values(insertMember)
      .returning();
    return member;
  }

  async updateVendorTeamMember(id: number, updateData: Partial<InsertVendorTeamMember>): Promise<VendorTeamMember> {
    const [member] = await db
      .update(vendorTeamMembers)
      .set(updateData)
      .where(eq(vendorTeamMembers.id, id))
      .returning();
    return member;
  }

  async deleteVendorTeamMember(id: number): Promise<boolean> {
    const result = await db.delete(vendorTeamMembers).where(eq(vendorTeamMembers.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Vendor Agreements
  async getVendorAgreements(vendorId?: number): Promise<VendorAgreement[]> {
    if (vendorId) {
      return await db.select().from(vendorAgreements).where(eq(vendorAgreements.vendorId, vendorId));
    }
    return await db.select().from(vendorAgreements);
  }

  async getVendorAgreement(id: number): Promise<VendorAgreement | undefined> {
    const [agreement] = await db.select().from(vendorAgreements).where(eq(vendorAgreements.id, id));
    return agreement || undefined;
  }

  async createVendorAgreement(insertAgreement: InsertVendorAgreement): Promise<VendorAgreement> {
    const [agreement] = await db
      .insert(vendorAgreements)
      .values(insertAgreement)
      .returning();
    return agreement;
  }

  async updateVendorAgreement(id: number, updateData: Partial<InsertVendorAgreement>): Promise<VendorAgreement> {
    const [agreement] = await db
      .update(vendorAgreements)
      .set(updateData)
      .where(eq(vendorAgreements.id, id))
      .returning();
    return agreement;
  }

  async deleteVendorAgreement(id: number): Promise<boolean> {
    const result = await db.delete(vendorAgreements).where(eq(vendorAgreements.id, id));
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

  // Retail Store Operations
  async getStores(brand?: string): Promise<Store[]> {
    if (brand && brand !== "all") {
      return await db.select().from(stores).where(eq(stores.brand, brand));
    }
    return await db.select().from(stores);
  }

  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store || undefined;
  }

  async createStore(insertStore: InsertStore): Promise<Store> {
    const [store] = await db
      .insert(stores)
      .values(insertStore)
      .returning();
    return store;
  }

  async updateStore(id: number, updateData: Partial<InsertStore>): Promise<Store> {
    const [store] = await db
      .update(stores)
      .set(updateData)
      .where(eq(stores.id, id))
      .returning();
    return store;
  }

  async deleteStore(id: number): Promise<boolean> {
    const result = await db.delete(stores).where(eq(stores.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getStoreInventory(storeId?: number, brand?: string): Promise<StoreInventory[]> {
    if (storeId) {
      return await db.select().from(storeInventory).where(eq(storeInventory.storeId, storeId));
    } else if (brand && brand !== "all") {
      return await db.select().from(storeInventory).where(eq(storeInventory.brand, brand));
    }
    
    return await db.select().from(storeInventory);
  }

  async getInventoryItem(id: number): Promise<StoreInventory | undefined> {
    const [item] = await db.select().from(storeInventory).where(eq(storeInventory.id, id));
    return item || undefined;
  }

  async createInventoryItem(insertItem: InsertStoreInventory): Promise<StoreInventory> {
    const [item] = await db
      .insert(storeInventory)
      .values(insertItem)
      .returning();
    return item;
  }

  async updateInventoryItem(id: number, updateData: Partial<InsertStoreInventory>): Promise<StoreInventory> {
    const [item] = await db
      .update(storeInventory)
      .set(updateData)
      .where(eq(storeInventory.id, id))
      .returning();
    return item;
  }

  async deleteInventoryItem(id: number): Promise<boolean> {
    const result = await db.delete(storeInventory).where(eq(storeInventory.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getStoreSales(storeId?: number, brand?: string): Promise<StoreSales[]> {
    if (storeId) {
      return await db.select().from(storeSales).where(eq(storeSales.storeId, storeId));
    } else if (brand && brand !== "all") {
      return await db.select().from(storeSales).where(eq(storeSales.brand, brand));
    }
    
    return await db.select().from(storeSales);
  }

  async getSalesRecord(id: number): Promise<StoreSales | undefined> {
    const [sale] = await db.select().from(storeSales).where(eq(storeSales.id, id));
    return sale || undefined;
  }

  async createSalesRecord(insertSale: InsertStoreSales): Promise<StoreSales> {
    const [sale] = await db
      .insert(storeSales)
      .values(insertSale)
      .returning();
    return sale;
  }

  async getStoreStaff(storeId?: number, brand?: string): Promise<StoreStaff[]> {
    if (storeId) {
      return await db.select().from(storeStaff).where(eq(storeStaff.storeId, storeId));
    } else if (brand && brand !== "all") {
      return await db.select().from(storeStaff).where(eq(storeStaff.brand, brand));
    }
    
    return await db.select().from(storeStaff);
  }

  async getStaffMember(id: number): Promise<StoreStaff | undefined> {
    const [staff] = await db.select().from(storeStaff).where(eq(storeStaff.id, id));
    return staff || undefined;
  }

  async createStaffMember(insertStaff: InsertStoreStaff): Promise<StoreStaff> {
    const [staff] = await db
      .insert(storeStaff)
      .values(insertStaff)
      .returning();
    return staff;
  }

  async updateStaffMember(id: number, updateData: Partial<InsertStoreStaff>): Promise<StoreStaff> {
    const [staff] = await db
      .update(storeStaff)
      .set(updateData)
      .where(eq(storeStaff.id, id))
      .returning();
    return staff;
  }

  async deleteStaffMember(id: number): Promise<boolean> {
    const result = await db.delete(storeStaff).where(eq(storeStaff.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // ITIL Service Management and CMDB Methods
  async getServiceCategories(brand?: string): Promise<ServiceCategory[]> {
    if (brand && brand !== "all") {
      return await db.select().from(serviceCategories).where(eq(serviceCategories.brand, brand));
    }
    return await db.select().from(serviceCategories);
  }

  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    const [category] = await db.select().from(serviceCategories).where(eq(serviceCategories.id, id));
    return category || undefined;
  }

  async createServiceCategory(insertCategory: InsertServiceCategory): Promise<ServiceCategory> {
    const [category] = await db
      .insert(serviceCategories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async updateServiceCategory(id: number, updateData: Partial<InsertServiceCategory>): Promise<ServiceCategory> {
    const [category] = await db
      .update(serviceCategories)
      .set(updateData)
      .where(eq(serviceCategories.id, id))
      .returning();
    return category;
  }

  async deleteServiceCategory(id: number): Promise<boolean> {
    const result = await db.delete(serviceCategories).where(eq(serviceCategories.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getItilServices(brand?: string, categoryId?: number): Promise<ItilService[]> {
    if (categoryId) {
      return await db.select().from(itilServices).where(eq(itilServices.categoryId, categoryId));
    } else if (brand && brand !== "all") {
      return await db.select().from(itilServices).where(eq(itilServices.brand, brand));
    }
    
    return await db.select().from(itilServices);
  }

  async getItilService(id: number): Promise<ItilService | undefined> {
    const [service] = await db.select().from(itilServices).where(eq(itilServices.id, id));
    return service || undefined;
  }

  async createItilService(insertService: InsertItilService): Promise<ItilService> {
    const [service] = await db
      .insert(itilServices)
      .values(insertService)
      .returning();
    return service;
  }

  async updateItilService(id: number, updateData: Partial<InsertItilService>): Promise<ItilService> {
    const [service] = await db
      .update(itilServices)
      .set(updateData)
      .where(eq(itilServices.id, id))
      .returning();
    return service;
  }

  async deleteItilService(id: number): Promise<boolean> {
    const result = await db.delete(itilServices).where(eq(itilServices.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getConfigurationItems(brand?: string, serviceId?: number, ciClass?: string): Promise<ConfigurationItem[]> {
    if (serviceId) {
      return await db.select().from(configurationItems).where(eq(configurationItems.serviceId, serviceId));
    } else if (ciClass) {
      return await db.select().from(configurationItems).where(eq(configurationItems.ciClass, ciClass));
    } else if (brand && brand !== "all") {
      return await db.select().from(configurationItems).where(eq(configurationItems.brand, brand));
    }
    
    return await db.select().from(configurationItems);
  }

  async getConfigurationItem(id: number): Promise<ConfigurationItem | undefined> {
    const [ci] = await db.select().from(configurationItems).where(eq(configurationItems.id, id));
    return ci || undefined;
  }

  async createConfigurationItem(insertCi: InsertConfigurationItem): Promise<ConfigurationItem> {
    const [ci] = await db
      .insert(configurationItems)
      .values(insertCi)
      .returning();
    return ci;
  }

  async updateConfigurationItem(id: number, updateData: Partial<InsertConfigurationItem>): Promise<ConfigurationItem> {
    const [ci] = await db
      .update(configurationItems)
      .set({ ...updateData, lastSyncDate: new Date() })
      .where(eq(configurationItems.id, id))
      .returning();
    return ci;
  }

  async deleteConfigurationItem(id: number): Promise<boolean> {
    const result = await db.delete(configurationItems).where(eq(configurationItems.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async syncConfigurationItems(ciClass: string, brand?: string): Promise<ConfigurationItem[]> {
    // This method would typically call external APIs (Azure, M365, Intune, etc.)
    // For now, we'll return existing CIs and update their sync date
    let query = db.select().from(configurationItems).where(eq(configurationItems.ciClass, ciClass));
    
    if (brand && brand !== "all") {
      query = query.where(eq(configurationItems.brand, brand));
    }
    
    const cis = await query;
    
    // Update sync date for all found CIs
    if (cis.length > 0) {
      await db
        .update(configurationItems)
        .set({ lastSyncDate: new Date() })
        .where(eq(configurationItems.ciClass, ciClass));
    }
    
    return cis;
  }

  async getServiceRelationships(serviceId?: number): Promise<ServiceRelationship[]> {
    if (serviceId) {
      return await db.select().from(serviceRelationships)
        .where(eq(serviceRelationships.parentServiceId, serviceId));
    }
    return await db.select().from(serviceRelationships);
  }

  async createServiceRelationship(insertRelationship: InsertServiceRelationship): Promise<ServiceRelationship> {
    const [relationship] = await db
      .insert(serviceRelationships)
      .values(insertRelationship)
      .returning();
    return relationship;
  }

  async deleteServiceRelationship(id: number): Promise<boolean> {
    const result = await db.delete(serviceRelationships).where(eq(serviceRelationships.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getCiRelationships(ciId?: number): Promise<CiRelationship[]> {
    if (ciId) {
      return await db.select().from(ciRelationships)
        .where(eq(ciRelationships.parentCiId, ciId));
    }
    return await db.select().from(ciRelationships);
  }

  async createCiRelationship(insertRelationship: InsertCiRelationship): Promise<CiRelationship> {
    const [relationship] = await db
      .insert(ciRelationships)
      .values(insertRelationship)
      .returning();
    return relationship;
  }

  async deleteCiRelationship(id: number): Promise<boolean> {
    const result = await db.delete(ciRelationships).where(eq(ciRelationships.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getChangeRequests(brand?: string, status?: string): Promise<ChangeRequest[]> {
    let query = db.select().from(changeRequests);
    
    if (status) {
      query = query.where(eq(changeRequests.status, status));
    } else if (brand && brand !== "all") {
      query = query.where(eq(changeRequests.brand, brand));
    }
    
    return await query;
  }

  async getChangeRequest(id: number): Promise<ChangeRequest | undefined> {
    const [change] = await db.select().from(changeRequests).where(eq(changeRequests.id, id));
    return change || undefined;
  }

  async createChangeRequest(insertChange: InsertChangeRequest): Promise<ChangeRequest> {
    const [change] = await db
      .insert(changeRequests)
      .values(insertChange)
      .returning();
    return change;
  }

  async updateChangeRequest(id: number, updateData: Partial<InsertChangeRequest>): Promise<ChangeRequest> {
    const [change] = await db
      .update(changeRequests)
      .set(updateData)
      .where(eq(changeRequests.id, id))
      .returning();
    return change;
  }

  async deleteChangeRequest(id: number): Promise<boolean> {
    const result = await db.delete(changeRequests).where(eq(changeRequests.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getServiceLevelAgreements(serviceId?: number): Promise<ServiceLevelAgreement[]> {
    if (serviceId) {
      return await db.select().from(serviceLevelAgreements)
        .where(eq(serviceLevelAgreements.serviceId, serviceId));
    }
    return await db.select().from(serviceLevelAgreements);
  }

  async getServiceLevelAgreement(id: number): Promise<ServiceLevelAgreement | undefined> {
    const [sla] = await db.select().from(serviceLevelAgreements).where(eq(serviceLevelAgreements.id, id));
    return sla || undefined;
  }

  async createServiceLevelAgreement(insertSla: InsertServiceLevelAgreement): Promise<ServiceLevelAgreement> {
    const [sla] = await db
      .insert(serviceLevelAgreements)
      .values(insertSla)
      .returning();
    return sla;
  }

  async updateServiceLevelAgreement(id: number, updateData: Partial<InsertServiceLevelAgreement>): Promise<ServiceLevelAgreement> {
    const [sla] = await db
      .update(serviceLevelAgreements)
      .set(updateData)
      .where(eq(serviceLevelAgreements.id, id))
      .returning();
    return sla;
  }

  async deleteServiceLevelAgreement(id: number): Promise<boolean> {
    const result = await db.delete(serviceLevelAgreements).where(eq(serviceLevelAgreements.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Distribution Centers
  async getDistributionCenters(brand?: string): Promise<DistributionCenter[]> {
    let query = db.select().from(distributionCenters);
    if (brand && brand !== 'all') {
      query = query.where(eq(distributionCenters.primaryBrand, brand)) as any;
    }
    return await query;
  }

  async getDistributionCenter(id: number): Promise<DistributionCenter | undefined> {
    const result = await db.select().from(distributionCenters).where(eq(distributionCenters.id, id));
    return result[0];
  }

  async createDistributionCenter(insertCenter: InsertDistributionCenter): Promise<DistributionCenter> {
    const result = await db.insert(distributionCenters).values(insertCenter).returning();
    return result[0];
  }

  async updateDistributionCenter(id: number, updateData: Partial<InsertDistributionCenter>): Promise<DistributionCenter> {
    const result = await db.update(distributionCenters)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(distributionCenters.id, id))
      .returning();
    return result[0];
  }

  async deleteDistributionCenter(id: number): Promise<boolean> {
    const result = await db.delete(distributionCenters).where(eq(distributionCenters.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getDistributionCenterMetrics(centerId?: number, quarter?: string, year?: number): Promise<DistributionCenterMetrics[]> {
    let query = db.select().from(distributionCenterMetrics);
    
    const conditions = [];
    if (centerId) conditions.push(eq(distributionCenterMetrics.centerId, centerId));
    if (quarter) conditions.push(eq(distributionCenterMetrics.quarter, quarter));
    if (year) conditions.push(eq(distributionCenterMetrics.year, year));
    
    if (conditions.length > 0) {
      query = query.where(conditions.reduce((acc, condition) => acc && condition)) as any;
    }
    
    return await query;
  }

  async getDistributionCenterMetric(id: number): Promise<DistributionCenterMetrics | undefined> {
    const result = await db.select().from(distributionCenterMetrics).where(eq(distributionCenterMetrics.id, id));
    return result[0];
  }

  async createDistributionCenterMetrics(insertMetrics: InsertDistributionCenterMetrics): Promise<DistributionCenterMetrics> {
    const result = await db.insert(distributionCenterMetrics).values(insertMetrics).returning();
    return result[0];
  }

  async updateDistributionCenterMetrics(id: number, updateData: Partial<InsertDistributionCenterMetrics>): Promise<DistributionCenterMetrics> {
    const result = await db.update(distributionCenterMetrics)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(distributionCenterMetrics.id, id))
      .returning();
    return result[0];
  }

  async deleteDistributionCenterMetrics(id: number): Promise<boolean> {
    const result = await db.delete(distributionCenterMetrics).where(eq(distributionCenterMetrics.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Integration Libraries
  async getIntegrationLibraries(brand?: string): Promise<IntegrationLibrary[]> {
    if (brand && brand !== "all") {
      return await db.select().from(integrationLibraries).where(eq(integrationLibraries.brand, brand));
    }
    return await db.select().from(integrationLibraries);
  }

  async getIntegrationLibrary(id: number): Promise<IntegrationLibrary | undefined> {
    const [library] = await db.select().from(integrationLibraries).where(eq(integrationLibraries.id, id));
    return library || undefined;
  }

  async createIntegrationLibrary(insertLibrary: InsertIntegrationLibrary): Promise<IntegrationLibrary> {
    const [library] = await db
      .insert(integrationLibraries)
      .values(insertLibrary)
      .returning();
    return library;
  }

  async updateIntegrationLibrary(id: number, updateData: Partial<InsertIntegrationLibrary>): Promise<IntegrationLibrary> {
    const [library] = await db
      .update(integrationLibraries)
      .set(updateData)
      .where(eq(integrationLibraries.id, id))
      .returning();
    return library;
  }

  async deleteIntegrationLibrary(id: number): Promise<boolean> {
    const result = await db.delete(integrationLibraries).where(eq(integrationLibraries.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Integration Endpoints
  async getIntegrationEndpoints(libraryId?: number): Promise<IntegrationEndpoint[]> {
    if (libraryId) {
      return await db.select().from(integrationEndpoints).where(eq(integrationEndpoints.libraryId, libraryId));
    }
    return await db.select().from(integrationEndpoints);
  }

  async getIntegrationEndpoint(id: number): Promise<IntegrationEndpoint | undefined> {
    const [endpoint] = await db.select().from(integrationEndpoints).where(eq(integrationEndpoints.id, id));
    return endpoint || undefined;
  }

  async createIntegrationEndpoint(insertEndpoint: InsertIntegrationEndpoint): Promise<IntegrationEndpoint> {
    const [endpoint] = await db
      .insert(integrationEndpoints)
      .values(insertEndpoint)
      .returning();
    return endpoint;
  }

  async updateIntegrationEndpoint(id: number, updateData: Partial<InsertIntegrationEndpoint>): Promise<IntegrationEndpoint> {
    const [endpoint] = await db
      .update(integrationEndpoints)
      .set(updateData)
      .where(eq(integrationEndpoints.id, id))
      .returning();
    return endpoint;
  }

  async deleteIntegrationEndpoint(id: number): Promise<boolean> {
    const result = await db.delete(integrationEndpoints).where(eq(integrationEndpoints.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Integration Credentials
  async getIntegrationCredentials(libraryId?: number): Promise<IntegrationCredential[]> {
    if (libraryId) {
      return await db.select().from(integrationCredentials).where(eq(integrationCredentials.libraryId, libraryId));
    }
    return await db.select().from(integrationCredentials);
  }

  async getIntegrationCredential(id: number): Promise<IntegrationCredential | undefined> {
    const [credential] = await db.select().from(integrationCredentials).where(eq(integrationCredentials.id, id));
    return credential || undefined;
  }

  async createIntegrationCredential(insertCredential: InsertIntegrationCredential): Promise<IntegrationCredential> {
    const [credential] = await db
      .insert(integrationCredentials)
      .values(insertCredential)
      .returning();
    return credential;
  }

  async updateIntegrationCredential(id: number, updateData: Partial<InsertIntegrationCredential>): Promise<IntegrationCredential> {
    const [credential] = await db
      .update(integrationCredentials)
      .set(updateData)
      .where(eq(integrationCredentials.id, id))
      .returning();
    return credential;
  }

  async deleteIntegrationCredential(id: number): Promise<boolean> {
    const result = await db.delete(integrationCredentials).where(eq(integrationCredentials.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();
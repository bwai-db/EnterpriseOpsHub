import { pgTable, text, serial, integer, boolean, timestamp, decimal, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Organizational Structure Tables
export const divisions = pgTable("divisions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  brand: text("brand"), // blorcs, shaypops, all
  createdAt: timestamp("created_at").defaultNow(),
});

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  divisionId: integer("division_id").references(() => divisions.id),
  brand: text("brand"), // blorcs, shaypops, all
  createdAt: timestamp("created_at").defaultNow(),
});

export const functions = pgTable("functions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  departmentId: integer("department_id").references(() => departments.id),
  brand: text("brand"), // blorcs, shaypops, all
  createdAt: timestamp("created_at").defaultNow(),
});

export const personas = pgTable("personas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  permissions: text("permissions").array(), // Array of permission strings
  brand: text("brand"), // blorcs, shaypops, all
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"), // Optional for EntraID users
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  entraId: text("entra_id").unique(), // Azure AD Object ID
  jobTitle: text("job_title"),
  department: text("department"),
  manager: text("manager"),
  officeLocation: text("office_location"),
  mobilePhone: text("mobile_phone"),
  businessPhone: text("business_phone"),
  isActive: boolean("is_active").default(true),
  lastSync: timestamp("last_sync"), // Last EntraID sync
  departmentId: integer("department_id").references(() => departments.id),
  functionId: integer("function_id").references(() => functions.id),
  personaId: integer("persona_id").references(() => personas.id),
  brand: text("brand"), // blorcs, shaypops, all
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vendors = pgTable("vendors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // software, hardware, manufacturing, cloud
  type: text("type").notNull(), // vendor type
  status: text("status").notNull().default("active"), // active, inactive, pending
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  contractStart: timestamp("contract_start"),
  contractEnd: timestamp("contract_end"),
  monthlyCost: decimal("monthly_cost", { precision: 10, scale: 2 }),
  description: text("description"),
  brand: text("brand"), // blorcs, shaypops, all
  createdAt: timestamp("created_at").defaultNow(),
});

export const licenses = pgTable("licenses", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id),
  productName: text("product_name").notNull(),
  licenseType: text("license_type").notNull(), // subscription, perpetual, enterprise
  licenseCount: integer("license_count").notNull(),
  expiryDate: timestamp("expiry_date"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("active"), // active, expired, expiring
  renewalDate: timestamp("renewal_date"),
  brand: text("brand"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const incidents = pgTable("incidents", {
  id: serial("id").primaryKey(),
  incidentId: text("incident_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull(), // critical, high, medium, low
  status: text("status").notNull().default("open"), // open, assigned, in_progress, resolved, closed
  assignedTo: text("assigned_to"),
  reportedBy: text("reported_by"),
  category: text("category"), // hardware, software, network, security
  brand: text("brand"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const cloudServices = pgTable("cloud_services", {
  id: serial("id").primaryKey(),
  serviceName: text("service_name").notNull(),
  provider: text("provider").notNull(), // azure, m365, powerbi, intune
  status: text("status").notNull().default("operational"), // operational, degraded, outage
  lastChecked: timestamp("last_checked").defaultNow(),
  region: text("region"),
  brand: text("brand"),
});

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  storeCode: text("store_code").notNull().unique(),
  storeName: text("store_name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country").notNull(),
  phone: text("phone"),
  email: text("email"),
  storeManager: text("store_manager"),
  district: text("district"),
  region: text("region"),
  storeType: text("store_type").notNull(), // flagship, outlet, pop-up
  squareFootage: integer("square_footage"),
  openingDate: date("opening_date"),
  status: text("status").notNull().default("active"), // active, closed, renovation
  brand: text("brand").notNull(),
  operatingHours: text("operating_hours"),
  timezone: text("timezone"),
  posSystemId: text("pos_system_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const storeInventory = pgTable("store_inventory", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  sku: text("sku").notNull(),
  productName: text("product_name").notNull(),
  category: text("category"),
  subCategory: text("sub_category"),
  size: text("size"),
  color: text("color"),
  currentStock: integer("current_stock").notNull().default(0),
  minimumStock: integer("minimum_stock").default(0),
  maximumStock: integer("maximum_stock"),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  retailPrice: decimal("retail_price", { precision: 10, scale: 2 }),
  supplier: text("supplier"),
  lastRestocked: timestamp("last_restocked"),
  lastSold: timestamp("last_sold"),
  seasonality: text("seasonality"), // spring, summer, fall, winter, year-round
  brand: text("brand").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const storeSales = pgTable("store_sales", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  transactionId: text("transaction_id").notNull().unique(),
  saleDate: timestamp("sale_date").notNull(),
  customerId: text("customer_id"),
  salesAssociate: text("sales_associate"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }),
  paymentMethod: text("payment_method"), // cash, card, digital
  itemCount: integer("item_count").notNull(),
  saleType: text("sale_type").default("regular"), // regular, return, exchange
  brand: text("brand").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const storeStaff = pgTable("store_staff", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  employeeId: text("employee_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  position: text("position").notNull(),
  department: text("department"),
  hireDate: date("hire_date"),
  status: text("status").notNull().default("active"), // active, inactive, terminated
  hourlyRate: decimal("hourly_rate", { precision: 8, scale: 2 }),
  workSchedule: text("work_schedule"),
  emergencyContact: text("emergency_contact"),
  brand: text("brand").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertDivisionSchema = createInsertSchema(divisions).omit({
  id: true,
  createdAt: true,
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
  createdAt: true,
});

export const insertFunctionSchema = createInsertSchema(functions).omit({
  id: true,
  createdAt: true,
});

export const insertPersonaSchema = createInsertSchema(personas).omit({
  id: true,
  createdAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastSync: true,
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
});

export const insertLicenseSchema = createInsertSchema(licenses).omit({
  id: true,
  createdAt: true,
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertCloudServiceSchema = createInsertSchema(cloudServices).omit({
  id: true,
  lastChecked: true,
});

export const insertStoreSchema = createInsertSchema(stores).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStoreInventorySchema = createInsertSchema(storeInventory).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStoreSalesSchema = createInsertSchema(storeSales).omit({
  id: true,
  createdAt: true,
});

export const insertStoreStaffSchema = createInsertSchema(storeStaff).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertDivision = z.infer<typeof insertDivisionSchema>;
export type Division = typeof divisions.$inferSelect;

export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Department = typeof departments.$inferSelect;

export type InsertFunction = z.infer<typeof insertFunctionSchema>;
export type Function = typeof functions.$inferSelect;

export type InsertPersona = z.infer<typeof insertPersonaSchema>;
export type Persona = typeof personas.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;

export type InsertLicense = z.infer<typeof insertLicenseSchema>;
export type License = typeof licenses.$inferSelect;

export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Incident = typeof incidents.$inferSelect;

export type InsertCloudService = z.infer<typeof insertCloudServiceSchema>;
export type CloudService = typeof cloudServices.$inferSelect;

export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Store = typeof stores.$inferSelect;

export type InsertStoreInventory = z.infer<typeof insertStoreInventorySchema>;
export type StoreInventory = typeof storeInventory.$inferSelect;

export type InsertStoreSales = z.infer<typeof insertStoreSalesSchema>;
export type StoreSales = typeof storeSales.$inferSelect;

export type InsertStoreStaff = z.infer<typeof insertStoreStaffSchema>;
export type StoreStaff = typeof storeStaff.$inferSelect;

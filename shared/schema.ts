import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
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

import { pgTable, text, serial, integer, boolean, timestamp, decimal, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Organizational Structure Tables
export const corporates = pgTable("corporates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  brand: text("brand").notNull(), // blorcs, shaypops
  createdAt: timestamp("created_at").defaultNow(),
});

export const divisions = pgTable("divisions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  corporateId: integer("corporate_id").references(() => corporates.id),
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
  
  // Enhanced metadata fields
  website: text("website"),
  hqAddress: text("hq_address"),
  hqCity: text("hq_city"),
  hqState: text("hq_state"),
  hqZipCode: text("hq_zip_code"),
  hqCountry: text("hq_country"),
  accountManager: text("account_manager"),
  accountManagerEmail: text("account_manager_email"),
  accountManagerPhone: text("account_manager_phone"),
  
  // GDAP and compliance
  providesGDAP: boolean("provides_gdap").default(false),
  gdapStatus: text("gdap_status").default("unknown"), // compliant, non_compliant, unknown, pending
  complianceNotes: text("compliance_notes"),
  
  // Entra B2B integration
  entraB2BConfigured: boolean("entra_b2b_configured").default(false),
  externalTenantId: text("external_tenant_id"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vendor team members and contacts
export const vendorTeamMembers = pgTable("vendor_team_members", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  title: text("title"),
  department: text("department"),
  isPrimary: boolean("is_primary").default(false),
  
  // Entra B2B integration
  entraB2BUserId: text("entra_b2b_user_id"),
  entraB2BStatus: text("entra_b2b_status").default("not_configured"), // invited, active, disabled, not_configured
  lastLoginDate: timestamp("last_login_date"),
  
  // Access and permissions
  accessLevel: text("access_level").default("read"), // read, write, admin
  servicesAccess: text("services_access").array(), // array of service names they can access
  
  status: text("status").notNull().default("active"), // active, inactive, pending
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vendor agreements (NDAs, MSAs, etc.)
export const vendorAgreements = pgTable("vendor_agreements", {
  id: serial("id").primaryKey(),
  vendorId: integer("vendor_id").references(() => vendors.id),
  agreementType: text("agreement_type").notNull(), // nda, msa, sow, dpa, sla, master_services, consulting, licensing
  agreementName: text("agreement_name").notNull(),
  agreementNumber: text("agreement_number"),
  description: text("description"),
  
  // Status and lifecycle
  status: text("status").notNull().default("draft"), // draft, pending_review, pending_signature, active, expired, terminated, renewed
  executionDate: timestamp("execution_date"),
  effectiveDate: timestamp("effective_date"),
  expirationDate: timestamp("expiration_date"),
  renewalDate: timestamp("renewal_date"),
  terminationDate: timestamp("termination_date"),
  
  // Financial terms
  totalValue: decimal("total_value", { precision: 12, scale: 2 }),
  annualValue: decimal("annual_value", { precision: 12, scale: 2 }),
  currency: text("currency").default("USD"),
  
  // Legal and compliance
  governingLaw: text("governing_law"),
  jurisdiction: text("jurisdiction"),
  confidentialityLevel: text("confidentiality_level").default("standard"), // standard, high, critical
  dataProtectionRequired: boolean("data_protection_required").default(false),
  
  // Approval workflow
  requestedBy: text("requested_by"),
  approvedBy: text("approved_by"),
  legalReviewBy: text("legal_review_by"),
  approvalDate: timestamp("approval_date"),
  legalReviewDate: timestamp("legal_review_date"),
  
  // Document management
  documentUrl: text("document_url"),
  documentVersion: text("document_version").default("1.0"),
  lastReviewDate: timestamp("last_review_date"),
  nextReviewDate: timestamp("next_review_date"),
  
  // Auto-renewal settings
  autoRenewal: boolean("auto_renewal").default(false),
  renewalNoticeDays: integer("renewal_notice_days").default(90),
  
  // Risk and compliance flags
  riskLevel: text("risk_level").default("medium"), // low, medium, high, critical
  complianceNotes: text("compliance_notes"),
  
  brand: text("brand").notNull(), // blorcs, shaypops, all
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Integration Center Tables
export const integrationLibraries = pgTable("integration_libraries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  provider: text("provider").notNull(), // microsoft, google, aws, salesforce, etc
  category: text("category").notNull(), // api, sdk, webhook, middleware
  description: text("description"),
  version: text("version").notNull(),
  status: text("status").notNull().default("development"), // development, testing, production, deprecated
  authMethod: text("auth_method").notNull(), // oauth2, api_key, certificate, service_principal
  baseUrl: text("base_url"),
  documentation: text("documentation"),
  maintainer: text("maintainer"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  dependencies: text("dependencies").array(),
  environmentVariables: text("environment_variables").array(),
  supportedOperations: text("supported_operations").array(),
  rateLimits: text("rate_limits"),
  testingEndpoint: text("testing_endpoint"),
  productionEndpoint: text("production_endpoint"),
  brand: text("brand").notNull(), // blorcs, shaypops, all
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const integrationEndpoints = pgTable("integration_endpoints", {
  id: serial("id").primaryKey(),
  libraryId: integer("library_id").references(() => integrationLibraries.id).notNull(),
  name: text("name").notNull(),
  method: text("method").notNull(), // GET, POST, PUT, DELETE, PATCH
  endpoint: text("endpoint").notNull(),
  description: text("description"),
  parameters: text("parameters").array(),
  requestBody: text("request_body"),
  responseSchema: text("response_schema"),
  errorCodes: text("error_codes").array(),
  examples: text("examples"),
  requiresAuth: boolean("requires_auth").default(true),
  permissions: text("permissions").array(),
  rateLimitTier: text("rate_limit_tier"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const integrationCredentials = pgTable("integration_credentials", {
  id: serial("id").primaryKey(),
  libraryId: integer("library_id").references(() => integrationLibraries.id).notNull(),
  environment: text("environment").notNull(), // development, staging, production
  credentialType: text("credential_type").notNull(), // oauth2, api_key, certificate, service_principal
  clientId: text("client_id"),
  tenantId: text("tenant_id"),
  scopes: text("scopes").array(),
  keyVaultReference: text("key_vault_reference"), // Reference to secure key storage
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  lastUsed: timestamp("last_used"),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

// ITIL Service Management and CMDB Tables
export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  brand: text("brand").notNull(), // blorcs, shaypops, all
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const itilServices = pgTable("itil_services", {
  id: serial("id").primaryKey(),
  serviceName: text("service_name").notNull(),
  serviceCode: text("service_code").notNull().unique(),
  categoryId: integer("category_id").references(() => serviceCategories.id),
  description: text("description"),
  serviceOwner: text("service_owner"),
  businessCriticality: text("business_criticality").notNull(), // critical, high, medium, low
  serviceStatus: text("service_status").notNull(), // operational, planned, retired, under_change
  slaTarget: text("sla_target"), // e.g., "99.9% uptime"
  brand: text("brand").notNull(), // blorcs, shaypops, all
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const configurationItems = pgTable("configuration_items", {
  id: serial("id").primaryKey(),
  ciName: text("ci_name").notNull(),
  ciType: text("ci_type").notNull(), // server, application, database, network, etc.
  ciClass: text("ci_class").notNull(), // m365, azure, intune, hybrid_endpoint, identity, print, cad, 3d_printing
  serialNumber: text("serial_number"),
  assetTag: text("asset_tag"),
  status: text("status").notNull(), // active, inactive, maintenance, retired
  environment: text("environment").notNull(), // production, staging, development, test
  location: text("location"),
  assignedTo: text("assigned_to"),
  serviceId: integer("service_id").references(() => itilServices.id),
  vendor: text("vendor"),
  model: text("model"),
  operatingSystem: text("operating_system"),
  ipAddress: text("ip_address"),
  macAddress: text("mac_address"),
  installDate: timestamp("install_date"),
  warrantyExpiry: timestamp("warranty_expiry"),
  lastSyncDate: timestamp("last_sync_date"),
  syncSource: text("sync_source"), // azure_api, m365_api, intune_api, manual
  attributes: text("attributes"), // flexible storage for service-specific attributes as JSON string
  secureBaseline: text("secure_baseline"), // JSON string containing security configuration baseline
  brand: text("brand").notNull(), // blorcs, shaypops, all
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceRelationships = pgTable("service_relationships", {
  id: serial("id").primaryKey(),
  parentServiceId: integer("parent_service_id").references(() => itilServices.id),
  childServiceId: integer("child_service_id").references(() => itilServices.id),
  relationshipType: text("relationship_type").notNull(), // depends_on, supports, hosted_on, connects_to
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ciRelationships = pgTable("ci_relationships", {
  id: serial("id").primaryKey(),
  parentCiId: integer("parent_ci_id").references(() => configurationItems.id),
  childCiId: integer("child_ci_id").references(() => configurationItems.id),
  relationshipType: text("relationship_type").notNull(), // installed_on, connects_to, depends_on, part_of
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const changeRequests = pgTable("change_requests", {
  id: serial("id").primaryKey(),
  changeNumber: text("change_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  requestedBy: text("requested_by").notNull(),
  assignedTo: text("assigned_to"),
  changeType: text("change_type").notNull(), // standard, normal, emergency, urgent
  risk: text("risk").notNull(), // low, medium, high, very_high
  impact: text("impact").notNull(), // low, medium, high, very_high
  priority: text("priority").notNull(), // low, medium, high, critical
  status: text("status").notNull(), // draft, submitted, approved, in_progress, completed, cancelled, failed
  plannedStartDate: timestamp("planned_start_date"),
  plannedEndDate: timestamp("planned_end_date"),
  actualStartDate: timestamp("actual_start_date"),
  actualEndDate: timestamp("actual_end_date"),
  rollbackPlan: text("rollback_plan"),
  testingNotes: text("testing_notes"),
  affectedCis: text("affected_cis").array(), // array of CI IDs
  affectedServices: text("affected_services").array(), // array of service IDs
  approver: text("approver"),
  approvalDate: timestamp("approval_date"),
  brand: text("brand").notNull(), // blorcs, shaypops, all
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceLevelAgreements = pgTable("service_level_agreements", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").references(() => itilServices.id),
  slaName: text("sla_name").notNull(),
  metricType: text("metric_type").notNull(), // availability, response_time, resolution_time, throughput
  target: text("target").notNull(), // e.g., "99.9%", "< 5 minutes", "< 4 hours"
  measurement: text("measurement").notNull(), // monthly, weekly, daily
  reportingPeriod: text("reporting_period").notNull(),
  status: text("status").notNull(), // active, suspended, expired
  validFrom: timestamp("valid_from").notNull(),
  validTo: timestamp("valid_to"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Supply Chain and Distribution Centers
export const distributionCenters = pgTable("distribution_centers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(), // DYT, LVS, etc.
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull().default("US"),
  primaryBrand: text("primary_brand").notNull(), // blorcs, shaypops
  status: text("status").notNull().default("active"), // active, inactive, maintenance
  capacity: integer("capacity"), // Max packages per day
  currentUtilization: decimal("current_utilization", { precision: 5, scale: 2 }), // Percentage
  managerName: text("manager_name"),
  managerEmail: text("manager_email"),
  phone: text("phone"),
  operatingHours: text("operating_hours"),
  timezone: text("timezone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const distributionCenterMetrics = pgTable("distribution_center_metrics", {
  id: serial("id").primaryKey(),
  centerId: integer("center_id").references(() => distributionCenters.id),
  quarter: text("quarter").notNull(), // Q1-2025, Q2-2025, etc.
  year: integer("year").notNull(),
  inboundOrders: integer("inbound_orders").notNull().default(0),
  outboundOrders: integer("outbound_orders").notNull().default(0),
  packagesProcessed: integer("packages_processed").notNull().default(0),
  averageProcessingTime: decimal("average_processing_time", { precision: 8, scale: 2 }), // in hours
  onTimeDeliveryRate: decimal("on_time_delivery_rate", { precision: 5, scale: 2 }), // percentage
  damageRate: decimal("damage_rate", { precision: 5, scale: 2 }), // percentage
  operatingCosts: decimal("operating_costs", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Manufacturing Management Tables
export const manufacturers = pgTable("manufacturers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(), // MFG-001, MFG-002, etc.
  type: text("type").notNull(), // internal, contract, joint_venture
  location: text("location").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull().default("US"),
  primaryBrand: text("primary_brand").notNull(), // blorcs, shaypops
  status: text("status").notNull().default("active"), // active, inactive, maintenance, certification_pending
  capacity: integer("capacity"), // Units per day
  currentUtilization: decimal("current_utilization", { precision: 5, scale: 2 }), // Percentage
  qualityCertifications: text("quality_certifications").array(), // ISO9001, ISO14001, etc.
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  complianceStatus: text("compliance_status").notNull().default("compliant"), // compliant, pending, non_compliant
  lastAuditDate: date("last_audit_date"),
  nextAuditDate: date("next_audit_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  category: text("category").notNull(), // electronics, apparel, home_goods, etc.
  brand: text("brand").notNull(), // blorcs, shaypops
  description: text("description"),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  msrp: decimal("msrp", { precision: 10, scale: 2 }),
  weight: decimal("weight", { precision: 8, scale: 3 }), // in kg
  dimensions: jsonb("dimensions"), // {length, width, height} in cm
  materials: text("materials").array(),
  productionComplexity: text("production_complexity").notNull().default("medium"), // low, medium, high, critical
  leadTime: integer("lead_time"), // in days
  minOrderQuantity: integer("min_order_quantity").default(1),
  status: text("status").notNull().default("active"), // active, discontinued, development
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productionOrders = pgTable("production_orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  productId: integer("product_id").references(() => products.id),
  manufacturerId: integer("manufacturer_id").references(() => manufacturers.id),
  quantity: integer("quantity").notNull(),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, cancelled, on_hold
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  orderDate: date("order_date").notNull(),
  requiredDate: date("required_date").notNull(),
  startDate: date("start_date"),
  completionDate: date("completion_date"),
  estimatedCost: decimal("estimated_cost", { precision: 12, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 12, scale: 2 }),
  qualityScore: decimal("quality_score", { precision: 3, scale: 1 }), // 0-10 scale
  notes: text("notes"),
  brand: text("brand").notNull(), // blorcs, shaypops
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const manufacturingMetrics = pgTable("manufacturing_metrics", {
  id: serial("id").primaryKey(),
  manufacturerId: integer("manufacturer_id").references(() => manufacturers.id),
  productId: integer("product_id").references(() => products.id),
  month: integer("month").notNull(), // 1-12
  year: integer("year").notNull(),
  unitsProduced: integer("units_produced").notNull().default(0),
  defectRate: decimal("defect_rate", { precision: 5, scale: 2 }), // percentage
  onTimeDeliveryRate: decimal("on_time_delivery_rate", { precision: 5, scale: 2 }), // percentage
  averageLeadTime: decimal("average_lead_time", { precision: 8, scale: 2 }), // in days
  costPerUnit: decimal("cost_per_unit", { precision: 10, scale: 2 }),
  utilizationRate: decimal("utilization_rate", { precision: 5, scale: 2 }), // percentage
  energyConsumption: decimal("energy_consumption", { precision: 12, scale: 2 }), // kWh
  wasteGenerated: decimal("waste_generated", { precision: 8, scale: 2 }), // kg
  safetyIncidents: integer("safety_incidents").default(0),
  downtimeHours: decimal("downtime_hours", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  type: text("type").notNull(), // raw_materials, components, packaging, services
  category: text("category").notNull(), // electronics, textiles, metals, chemicals, etc.
  location: text("location").notNull(),
  country: text("country").notNull(),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  paymentTerms: text("payment_terms"), // net_30, net_60, etc.
  qualityRating: decimal("quality_rating", { precision: 3, scale: 1 }), // 1-10 scale
  deliveryRating: decimal("delivery_rating", { precision: 3, scale: 1 }), // 1-10 scale
  costRating: decimal("cost_rating", { precision: 3, scale: 1 }), // 1-10 scale
  certifications: text("certifications").array(), // ISO certifications, etc.
  riskLevel: text("risk_level").notNull().default("medium"), // low, medium, high, critical
  status: text("status").notNull().default("active"), // active, inactive, blacklisted, pending_approval
  brand: text("brand").notNull(), // blorcs, shaypops, all
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const supplyChainKpis = pgTable("supply_chain_kpis", {
  id: serial("id").primaryKey(),
  brand: text("brand").notNull(), // blorcs, shaypops, all
  month: integer("month").notNull(), // 1-12
  year: integer("year").notNull(),
  totalProduction: integer("total_production").notNull().default(0),
  productionCost: decimal("production_cost", { precision: 15, scale: 2 }),
  averageLeadTime: decimal("average_lead_time", { precision: 8, scale: 2 }), // days
  supplyChainEfficiency: decimal("supply_chain_efficiency", { precision: 5, scale: 2 }), // percentage
  inventoryTurnover: decimal("inventory_turnover", { precision: 5, scale: 2 }),
  orderFulfillmentRate: decimal("order_fulfillment_rate", { precision: 5, scale: 2 }), // percentage
  supplierPerformanceScore: decimal("supplier_performance_score", { precision: 5, scale: 2 }), // percentage
  sustainabilityScore: decimal("sustainability_score", { precision: 5, scale: 2 }), // percentage
  riskMitigationScore: decimal("risk_mitigation_score", { precision: 5, scale: 2 }), // percentage
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Manufacturing insert schemas
export const insertManufacturerSchema = createInsertSchema(manufacturers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductionOrderSchema = createInsertSchema(productionOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertManufacturingMetricsSchema = createInsertSchema(manufacturingMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupplyChainKpisSchema = createInsertSchema(supplyChainKpis).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Insert schemas
export const insertCorporateSchema = createInsertSchema(corporates).omit({
  id: true,
  createdAt: true,
});

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
  updatedAt: true,
});

export const insertVendorTeamMemberSchema = createInsertSchema(vendorTeamMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVendorAgreementSchema = createInsertSchema(vendorAgreements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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

export const insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertItilServiceSchema = createInsertSchema(itilServices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConfigurationItemSchema = createInsertSchema(configurationItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastSyncDate: true,
});

export const insertServiceRelationshipSchema = createInsertSchema(serviceRelationships).omit({
  id: true,
  createdAt: true,
});

export const insertCiRelationshipSchema = createInsertSchema(ciRelationships).omit({
  id: true,
  createdAt: true,
});

export const insertChangeRequestSchema = createInsertSchema(changeRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  actualStartDate: true,
  actualEndDate: true,
  approvalDate: true,
});

export const insertServiceLevelAgreementSchema = createInsertSchema(serviceLevelAgreements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDistributionCenterSchema = createInsertSchema(distributionCenters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDistributionCenterMetricsSchema = createInsertSchema(distributionCenterMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIntegrationLibrarySchema = createInsertSchema(integrationLibraries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastUpdated: true,
});

export const insertIntegrationEndpointSchema = createInsertSchema(integrationEndpoints).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIntegrationCredentialSchema = createInsertSchema(integrationCredentials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastUsed: true,
});

// Types
export type InsertCorporate = z.infer<typeof insertCorporateSchema>;
export type Corporate = typeof corporates.$inferSelect;

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

export type InsertVendorTeamMember = z.infer<typeof insertVendorTeamMemberSchema>;
export type VendorTeamMember = typeof vendorTeamMembers.$inferSelect;

export type InsertVendorAgreement = z.infer<typeof insertVendorAgreementSchema>;
export type VendorAgreement = typeof vendorAgreements.$inferSelect;

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

export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;
export type ServiceCategory = typeof serviceCategories.$inferSelect;

export type InsertItilService = z.infer<typeof insertItilServiceSchema>;
export type ItilService = typeof itilServices.$inferSelect;

export type InsertConfigurationItem = z.infer<typeof insertConfigurationItemSchema>;
export type ConfigurationItem = typeof configurationItems.$inferSelect;

export type InsertServiceRelationship = z.infer<typeof insertServiceRelationshipSchema>;
export type ServiceRelationship = typeof serviceRelationships.$inferSelect;

export type InsertCiRelationship = z.infer<typeof insertCiRelationshipSchema>;
export type CiRelationship = typeof ciRelationships.$inferSelect;

export type InsertChangeRequest = z.infer<typeof insertChangeRequestSchema>;
export type ChangeRequest = typeof changeRequests.$inferSelect;

export type InsertServiceLevelAgreement = z.infer<typeof insertServiceLevelAgreementSchema>;
export type ServiceLevelAgreement = typeof serviceLevelAgreements.$inferSelect;

export type InsertDistributionCenter = z.infer<typeof insertDistributionCenterSchema>;
export type DistributionCenter = typeof distributionCenters.$inferSelect;

export type InsertDistributionCenterMetrics = z.infer<typeof insertDistributionCenterMetricsSchema>;
export type DistributionCenterMetrics = typeof distributionCenterMetrics.$inferSelect;

export type InsertIntegrationLibrary = z.infer<typeof insertIntegrationLibrarySchema>;
export type IntegrationLibrary = typeof integrationLibraries.$inferSelect;

export type InsertIntegrationEndpoint = z.infer<typeof insertIntegrationEndpointSchema>;
export type IntegrationEndpoint = typeof integrationEndpoints.$inferSelect;

export type InsertIntegrationCredential = z.infer<typeof insertIntegrationCredentialSchema>;
export type IntegrationCredential = typeof integrationCredentials.$inferSelect;

// Manufacturing types
export type InsertManufacturer = z.infer<typeof insertManufacturerSchema>;
export type Manufacturer = typeof manufacturers.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertProductionOrder = z.infer<typeof insertProductionOrderSchema>;
export type ProductionOrder = typeof productionOrders.$inferSelect;

export type InsertManufacturingMetrics = z.infer<typeof insertManufacturingMetricsSchema>;
export type ManufacturingMetrics = typeof manufacturingMetrics.$inferSelect;

export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

export type InsertSupplyChainKpis = z.infer<typeof insertSupplyChainKpisSchema>;
export type SupplyChainKpis = typeof supplyChainKpis.$inferSelect;

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
  isKeyholder: boolean("is_keyholder").default(false),
  keyholderLevel: text("keyholder_level"), // junior, senior, manager, assistant_manager
  certifications: text("certifications").array(),
  languages: text("languages").array(),
  brand: text("brand").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const storeDisplays = pgTable("store_displays", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  displayName: text("display_name").notNull(),
  displayType: text("display_type").notNull(), // window, endcap, wall, floor, counter, seasonal
  location: text("location").notNull(), // front_window, back_wall, center_floor, etc.
  theme: text("theme"), // seasonal, promotional, brand_showcase, new_arrivals
  products: text("products").array(), // SKUs of products on display
  setupDate: timestamp("setup_date"),
  takedownDate: timestamp("takedown_date"),
  status: text("status").notNull().default("active"), // active, planned, archived
  assignedTo: text("assigned_to"), // staff member responsible
  notes: text("notes"),
  photos: text("photos").array(), // URLs to display photos
  performance: jsonb("performance"), // JSON object with metrics like conversion rate, engagement
  brand: text("brand").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const storeSchedules = pgTable("store_schedules", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  staffId: integer("staff_id").references(() => storeStaff.id).notNull(),
  scheduleDate: date("schedule_date").notNull(),
  startTime: text("start_time").notNull(), // HH:MM format
  endTime: text("end_time").notNull(), // HH:MM format
  shiftType: text("shift_type").notNull(), // opening, closing, mid, split
  breakTime: text("break_time"), // JSON string with break times
  position: text("position"), // cashier, sales_floor, stockroom, keyholder
  status: text("status").notNull().default("scheduled"), // scheduled, confirmed, called_out, no_show
  notes: text("notes"),
  approvedBy: text("approved_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const keyholderAssignments = pgTable("keyholder_assignments", {
  id: serial("id").primaryKey(),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  staffId: integer("staff_id").references(() => storeStaff.id).notNull(),
  assignmentDate: date("assignment_date").notNull(),
  shiftType: text("shift_type").notNull(), // opening, closing, manager_on_duty
  primaryKeyholder: boolean("primary_keyholder").default(false),
  backupKeyholder: boolean("backup_keyholder").default(false),
  accessLevel: text("access_level").notNull(), // basic, advanced, manager
  keyCode: text("key_code"),
  alarmCode: text("alarm_code"),
  safeAccess: boolean("safe_access").default(false),
  responsibilities: text("responsibilities").array(),
  emergencyContact: text("emergency_contact"),
  status: text("status").notNull().default("active"), // active, temporary, revoked
  expiryDate: date("expiry_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const corporateMessages = pgTable("corporate_messages", {
  id: serial("id").primaryKey(),
  messageId: text("message_id").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").notNull(), // announcement, policy, promotion, training, emergency
  priority: text("priority").notNull(), // low, medium, high, urgent
  sender: text("sender").notNull(),
  senderRole: text("sender_role"),
  targetAudience: text("target_audience").notNull(), // all_stores, specific_stores, managers, staff, keyholders
  targetStores: text("target_stores").array(), // Store IDs if targeting specific stores
  targetRoles: text("target_roles").array(), // Specific roles if targeting by role
  scheduledDate: timestamp("scheduled_date"),
  publishedDate: timestamp("published_date"),
  expiryDate: timestamp("expiry_date"),
  status: text("status").notNull().default("draft"), // draft, scheduled, published, archived
  requiresAcknowledgment: boolean("requires_acknowledgment").default(false),
  attachments: text("attachments").array(),
  tags: text("tags").array(),
  brand: text("brand").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messageAcknowledgments = pgTable("message_acknowledgments", {
  id: serial("id").primaryKey(),
  messageId: integer("message_id").references(() => corporateMessages.id).notNull(),
  storeId: integer("store_id").references(() => stores.id).notNull(),
  staffId: integer("staff_id").references(() => storeStaff.id),
  acknowledgedBy: text("acknowledged_by").notNull(),
  acknowledgedDate: timestamp("acknowledged_date").defaultNow(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
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

export const insertStoreDisplaySchema = createInsertSchema(storeDisplays).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStoreScheduleSchema = createInsertSchema(storeSchedules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertKeyholderAssignmentSchema = createInsertSchema(keyholderAssignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCorporateMessageSchema = createInsertSchema(corporateMessages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageAcknowledgmentSchema = createInsertSchema(messageAcknowledgments).omit({
  id: true,
  createdAt: true,
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

// Enhanced retail types
export type InsertStoreDisplay = z.infer<typeof insertStoreDisplaySchema>;
export type StoreDisplay = typeof storeDisplays.$inferSelect;

export type InsertStoreSchedule = z.infer<typeof insertStoreScheduleSchema>;
export type StoreSchedule = typeof storeSchedules.$inferSelect;

export type InsertKeyholderAssignment = z.infer<typeof insertKeyholderAssignmentSchema>;
export type KeyholderAssignment = typeof keyholderAssignments.$inferSelect;

export type InsertCorporateMessage = z.infer<typeof insertCorporateMessageSchema>;
export type CorporateMessage = typeof corporateMessages.$inferSelect;

export type InsertMessageAcknowledgment = z.infer<typeof insertMessageAcknowledgmentSchema>;
export type MessageAcknowledgment = typeof messageAcknowledgments.$inferSelect;

// Shipment Tracking Tables
export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  shipmentNumber: text("shipment_number").notNull().unique(),
  trackingNumber: text("tracking_number"),
  status: text("status").notNull(), // pending, sourcing, manufacturing, in_transit, at_distribution, delivered, cancelled
  priority: text("priority").notNull().default("standard"), // urgent, high, standard, low
  currentStage: text("current_stage").notNull(), // sourcing, manufacturing, shipping_to_distro, at_distribution, shipping_to_destination, delivered
  currentLocation: text("current_location"),
  
  // Source information
  sourceType: text("source_type").notNull(), // supplier, manufacturer, store, distribution_center
  sourceId: integer("source_id").notNull(), // References suppliers, manufacturers, stores, or distribution_centers
  sourceName: text("source_name").notNull(),
  sourceAddress: text("source_address"),
  
  // Destination information
  destinationType: text("destination_type").notNull(), // store, distribution_center, customer
  destinationId: integer("destination_id").notNull(),
  destinationName: text("destination_name").notNull(),
  destinationAddress: text("destination_address").notNull(),
  
  // Product information
  productId: integer("product_id").references(() => products.id),
  productName: text("product_name").notNull(),
  quantity: integer("quantity").notNull(),
  unitValue: decimal("unit_value", { precision: 10, scale: 2 }),
  totalValue: decimal("total_value", { precision: 12, scale: 2 }),
  weight: decimal("weight", { precision: 8, scale: 2 }), // in kg
  dimensions: text("dimensions"), // LxWxH in cm
  
  // Dates and timeline
  orderDate: timestamp("order_date").notNull(),
  expectedPickupDate: timestamp("expected_pickup_date"),
  actualPickupDate: timestamp("actual_pickup_date"),
  expectedDeliveryDate: timestamp("expected_delivery_date").notNull(),
  actualDeliveryDate: timestamp("actual_delivery_date"),
  
  // Shipping details
  carrierId: integer("carrier_id"), // References shipping companies
  carrierName: text("carrier_name"),
  carrierService: text("carrier_service"), // express, standard, economy
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }),
  
  // Manufacturing details (if applicable)
  productionOrderId: integer("production_order_id").references(() => productionOrders.id),
  manufacturerId: integer("manufacturer_id").references(() => manufacturers.id),
  manufacturingStartDate: timestamp("manufacturing_start_date"),
  manufacturingEndDate: timestamp("manufacturing_end_date"),
  qualityCheckStatus: text("quality_check_status"), // pending, passed, failed, not_required
  
  // Additional metadata
  notes: text("notes"),
  specialInstructions: text("special_instructions"),
  temperatureControlled: boolean("temperature_controlled").default(false),
  fragile: boolean("fragile").default(false),
  hazardous: boolean("hazardous").default(false),
  customsDeclaration: text("customs_declaration"),
  
  brand: text("brand").notNull(), // blorcs, shaypops
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const shipmentStages = pgTable("shipment_stages", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id").references(() => shipments.id).notNull(),
  stage: text("stage").notNull(), // sourcing, manufacturing, shipping_to_distro, at_distribution, shipping_to_destination, delivered
  status: text("status").notNull(), // pending, in_progress, completed, failed, cancelled
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  expectedDuration: integer("expected_duration"), // in hours
  actualDuration: integer("actual_duration"), // in hours
  location: text("location"),
  notes: text("notes"),
  performedBy: text("performed_by"), // Who or what entity performed this stage
  createdAt: timestamp("created_at").defaultNow(),
});

export const shipmentEvents = pgTable("shipment_events", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id").references(() => shipments.id).notNull(),
  eventType: text("event_type").notNull(), // pickup, transit, delivery_attempt, delivered, exception, customs_clearance
  eventStatus: text("event_status").notNull(), // success, failure, pending, in_progress
  eventDate: timestamp("event_date").notNull(),
  location: text("location"),
  description: text("description").notNull(),
  details: jsonb("details"), // Additional structured data
  source: text("source"), // system, carrier, manual, sensor
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shippingCarriers = pgTable("shipping_carriers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  type: text("type").notNull(), // express, freight, postal, specialty
  services: text("services").array(), // express, standard, economy, overnight
  trackingUrlTemplate: text("tracking_url_template"), // URL template with {tracking_number} placeholder
  apiEndpoint: text("api_endpoint"),
  apiKey: text("api_key"),
  isActive: boolean("is_active").default(true),
  contactInfo: jsonb("contact_info"), // phone, email, website
  serviceAreas: text("service_areas").array(), // Countries or regions served
  averageDeliveryTime: integer("average_delivery_time"), // in hours
  reliability: decimal("reliability", { precision: 5, scale: 2 }), // percentage
  cost: text("cost"), // low, medium, high
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const shipmentRoutes = pgTable("shipment_routes", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id").references(() => shipments.id).notNull(),
  sequenceNumber: integer("sequence_number").notNull(),
  fromLocation: text("from_location").notNull(),
  toLocation: text("to_location").notNull(),
  fromType: text("from_type").notNull(), // supplier, manufacturer, distribution_center, transit_hub, store
  toType: text("to_type").notNull(),
  distance: decimal("distance", { precision: 8, scale: 2 }), // in km
  estimatedTransitTime: integer("estimated_transit_time"), // in hours
  actualTransitTime: integer("actual_transit_time"), // in hours
  carrierId: integer("carrier_id").references(() => shippingCarriers.id),
  transportMode: text("transport_mode"), // truck, air, sea, rail
  cost: decimal("cost", { precision: 10, scale: 2 }),
  status: text("status").notNull(), // planned, in_progress, completed, cancelled
  departureDate: timestamp("departure_date"),
  arrivalDate: timestamp("arrival_date"),
  actualDepartureDate: timestamp("actual_departure_date"),
  actualArrivalDate: timestamp("actual_arrival_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shipmentDocuments = pgTable("shipment_documents", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id").references(() => shipments.id).notNull(),
  documentType: text("document_type").notNull(), // invoice, packing_list, bill_of_lading, customs_declaration, certificate
  documentName: text("document_name").notNull(),
  documentUrl: text("document_url"),
  documentData: jsonb("document_data"), // Structured document content
  isRequired: boolean("is_required").default(false),
  isVerified: boolean("is_verified").default(false),
  verifiedBy: text("verified_by"),
  verificationDate: timestamp("verification_date"),
  expiryDate: timestamp("expiry_date"),
  notes: text("notes"),
  uploadedBy: text("uploaded_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shipmentAlerts = pgTable("shipment_alerts", {
  id: serial("id").primaryKey(),
  shipmentId: integer("shipment_id").references(() => shipments.id).notNull(),
  alertType: text("alert_type").notNull(), // delay, exception, temperature, security, customs
  severity: text("severity").notNull(), // low, medium, high, critical
  title: text("title").notNull(),
  message: text("message").notNull(),
  isResolved: boolean("is_resolved").default(false),
  resolvedBy: text("resolved_by"),
  resolvedDate: timestamp("resolved_date"),
  resolution: text("resolution"),
  actionRequired: boolean("action_required").default(false),
  assignedTo: text("assigned_to"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for shipment tracking
export const insertShipmentSchema = createInsertSchema(shipments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShipmentStageSchema = createInsertSchema(shipmentStages).omit({
  id: true,
  createdAt: true,
});

export const insertShipmentEventSchema = createInsertSchema(shipmentEvents).omit({
  id: true,
  createdAt: true,
});

export const insertShippingCarrierSchema = createInsertSchema(shippingCarriers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShipmentRouteSchema = createInsertSchema(shipmentRoutes).omit({
  id: true,
  createdAt: true,
});

export const insertShipmentDocumentSchema = createInsertSchema(shipmentDocuments).omit({
  id: true,
  createdAt: true,
});

export const insertShipmentAlertSchema = createInsertSchema(shipmentAlerts).omit({
  id: true,
  createdAt: true,
});

// Shipment tracking types
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Shipment = typeof shipments.$inferSelect;

export type InsertShipmentStage = z.infer<typeof insertShipmentStageSchema>;
export type ShipmentStage = typeof shipmentStages.$inferSelect;

export type InsertShipmentEvent = z.infer<typeof insertShipmentEventSchema>;
export type ShipmentEvent = typeof shipmentEvents.$inferSelect;

export type InsertShippingCarrier = z.infer<typeof insertShippingCarrierSchema>;
export type ShippingCarrier = typeof shippingCarriers.$inferSelect;

export type InsertShipmentRoute = z.infer<typeof insertShipmentRouteSchema>;
export type ShipmentRoute = typeof shipmentRoutes.$inferSelect;

export type InsertShipmentDocument = z.infer<typeof insertShipmentDocumentSchema>;
export type ShipmentDocument = typeof shipmentDocuments.$inferSelect;

export type InsertShipmentAlert = z.infer<typeof insertShipmentAlertSchema>;
export type ShipmentAlert = typeof shipmentAlerts.$inferSelect;

// Facilities Management Tables
export const facilities = pgTable("facilities", {
  id: serial("id").primaryKey(),
  facilityCode: text("facilityCode").notNull().unique(),
  facilityName: text("facilityName").notNull(),
  facilityType: text("facilityType").notNull(),
  status: text("status").notNull().default("active"),
  
  // Location information
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state"),
  country: text("country").notNull(),
  zipCode: text("zipCode"),
  coordinates: text("coordinates"),
  timezone: text("timezone").notNull(),
  
  // Building details
  buildingSize: decimal("buildingSize", { precision: 10, scale: 2 }),
  floors: integer("floors").default(1),
  capacity: integer("capacity"),
  currentOccupancy: integer("currentOccupancy").default(0),
  parkingSpaces: integer("parkingSpaces").default(0),
  
  // Operational details
  openedDate: timestamp("openedDate"),
  leaseStartDate: timestamp("leaseStartDate"),
  leaseEndDate: timestamp("leaseEndDate"),
  monthlyRent: decimal("monthlyRent", { precision: 12, scale: 2 }),
  securityLevel: text("securityLevel").notNull().default("standard"),
  
  // Contact information
  facilityManager: text("facilityManager"),
  facilityManagerEmail: text("facilityManagerEmail"),
  facilityManagerPhone: text("facilityManagerPhone"),
  
  // Organization
  brand: text("brand").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const facilityProjects = pgTable("facilityProjects", {
  id: serial("id").primaryKey(),
  projectNumber: text("projectNumber").notNull().unique(),
  projectName: text("projectName").notNull(),
  projectType: text("projectType").notNull(),
  facilityId: integer("facilityId").references(() => facilities.id).notNull(),
  
  // Project details
  description: text("description"),
  priority: text("priority").notNull().default("medium"),
  status: text("status").notNull().default("planning"),
  
  // Timeline
  plannedStartDate: date("plannedStartDate"),
  plannedEndDate: date("plannedEndDate"),
  actualStartDate: date("actualStartDate"),
  actualEndDate: date("actualEndDate"),
  
  // Budget
  estimatedCost: decimal("estimatedCost", { precision: 12, scale: 2 }),
  actualCost: decimal("actualCost", { precision: 12, scale: 2 }),
  progressPercentage: decimal("progressPercentage", { precision: 5, scale: 2 }).default("0"),
  
  // Resources
  projectManager: text("projectManager"),
  lastUpdateDate: timestamp("lastUpdateDate").defaultNow(),
  
  // Metadata
  notes: text("notes"),
  brand: text("brand").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const facilityImprovements = pgTable("facility_improvements", {
  id: serial("id").primaryKey(),
  improvementNumber: text("improvement_number").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(), // comfort, efficiency, sustainability, safety, technology, accessibility
  facilityId: integer("facility_id").references(() => facilities.id).notNull(),
  
  // Improvement details
  description: text("description").notNull(),
  currentState: text("current_state"),
  proposedSolution: text("proposed_solution"),
  expectedBenefits: text("expected_benefits"),
  
  // Classification
  impactLevel: text("impact_level").notNull(), // minimal, moderate, significant, major
  urgency: text("urgency").notNull().default("medium"), // low, medium, high, urgent
  complexity: text("complexity").notNull().default("medium"), // simple, medium, complex, very_complex
  
  // Status and workflow
  status: text("status").notNull().default("submitted"), // submitted, under_review, approved, in_progress, completed, rejected, deferred
  submittedBy: text("submitted_by").notNull(),
  reviewedBy: text("reviewed_by"),
  implementedBy: text("implemented_by"),
  
  // Timeline
  submissionDate: timestamp("submission_date").defaultNow(),
  reviewDate: timestamp("review_date"),
  approvalDate: timestamp("approval_date"),
  implementationDate: timestamp("implementation_date"),
  completionDate: timestamp("completion_date"),
  
  // Budget and resources
  estimatedCost: decimal("estimated_cost", { precision: 12, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 12, scale: 2 }),
  roi: decimal("roi", { precision: 5, scale: 2 }), // return on investment percentage
  paybackPeriod: integer("payback_period"), // months
  
  // Metrics and tracking
  energySavings: decimal("energy_savings", { precision: 8, scale: 2 }), // kWh per year
  costSavings: decimal("cost_savings", { precision: 10, scale: 2 }), // annual savings
  satisfactionRating: decimal("satisfaction_rating", { precision: 3, scale: 1 }), // 1-10 scale
  
  brand: text("brand").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const facilityRequests = pgTable("facility_requests", {
  id: serial("id").primaryKey(),
  requestNumber: text("request_number").notNull().unique(),
  requestType: text("request_type").notNull(), // maintenance, repair, space_allocation, equipment, access, cleaning, catering
  facilityId: integer("facility_id").references(() => facilities.id).notNull(),
  
  // Request details
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location"), // specific room, floor, area within facility
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent, emergency
  
  // Requester information
  requestedBy: text("requested_by").notNull(),
  requestedByEmail: text("requested_by_email"),
  requestedByPhone: text("requested_by_phone"),
  department: text("department"),
  
  // Status and workflow
  status: text("status").notNull().default("open"), // open, assigned, in_progress, waiting_approval, completed, cancelled, on_hold
  assignedTo: text("assigned_to"),
  assignedTeam: text("assigned_team"),
  
  // Timeline
  requestDate: timestamp("request_date").defaultNow(),
  dueDate: timestamp("due_date"),
  startDate: timestamp("start_date"),
  completionDate: timestamp("completion_date"),
  
  // Cost and approvals
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }),
  approvalRequired: boolean("approval_required").default(false),
  approvedBy: text("approved_by"),
  approvalDate: timestamp("approval_date"),
  
  // Resolution and feedback
  resolution: text("resolution"),
  workaroundProvided: text("workaround_provided"),
  satisfactionRating: decimal("satisfaction_rating", { precision: 3, scale: 1 }), // 1-10 scale
  feedback: text("feedback"),
  
  // Technical details
  tags: text("tags").array(),
  attachments: text("attachments").array(), // file URLs or references
  relatedRequests: integer("related_requests").array(), // related request IDs
  
  brand: text("brand").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const facilityIncidents = pgTable("facility_incidents", {
  id: serial("id").primaryKey(),
  incidentNumber: text("incident_number").notNull().unique(),
  facilityId: integer("facility_id").references(() => facilities.id).notNull(),
  
  // Incident details
  title: text("title").notNull(),
  description: text("description").notNull(),
  incidentType: text("incident_type").notNull(), // safety, security, equipment_failure, environmental, fire, medical, power_outage
  severity: text("severity").notNull(), // low, medium, high, critical, catastrophic
  location: text("location"), // specific area within facility
  
  // People involved
  reportedBy: text("reported_by").notNull(),
  reportedByContact: text("reported_by_contact"),
  witnessess: text("witnesses").array(),
  injuredPersons: text("injured_persons").array(),
  evacuationRequired: boolean("evacuation_required").default(false),
  
  // Timeline
  occurredAt: timestamp("occurred_at").notNull(),
  reportedAt: timestamp("reported_at").defaultNow(),
  responseTime: integer("response_time"), // minutes from report to first response
  resolutionTime: integer("resolution_time"), // minutes from report to resolution
  
  // Response and resolution
  status: text("status").notNull().default("open"), // open, investigating, in_progress, resolved, closed
  assignedTo: text("assigned_to"),
  firstResponder: text("first_responder"),
  emergencyServicesNotified: boolean("emergency_services_notified").default(false),
  emergencyServices: text("emergency_services").array(), // fire, police, medical, building_management
  
  // Impact assessment
  businessImpact: text("business_impact"), // none, minimal, moderate, significant, severe
  facilityClosure: boolean("facility_closure").default(false),
  areasClosed: text("areas_closed").array(),
  peopleAffected: integer("people_affected").default(0),
  estimatedDowntime: integer("estimated_downtime"), // minutes
  
  // Resolution details
  rootCause: text("root_cause"),
  corrective_actions: text("corrective_actions"),
  preventive_actions: text("preventive_actions"),
  lessonLearned: text("lesson_learned"),
  
  // Compliance and reporting
  regulatoryReporting: boolean("regulatory_reporting").default(false),
  insuranceClaim: boolean("insurance_claim").default(false),
  investigationRequired: boolean("investigation_required").default(false),
  
  // Cost impact
  repairCosts: decimal("repair_costs", { precision: 12, scale: 2 }),
  businessLoss: decimal("business_loss", { precision: 12, scale: 2 }),
  insuranceCoverage: decimal("insurance_coverage", { precision: 12, scale: 2 }),
  
  brand: text("brand").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for facilities management
export const insertFacilitySchema = createInsertSchema(facilities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFacilityProjectSchema = createInsertSchema(facilityProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFacilityImprovementSchema = createInsertSchema(facilityImprovements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFacilityRequestSchema = createInsertSchema(facilityRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFacilityIncidentSchema = createInsertSchema(facilityIncidents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Facilities management types
export type InsertFacility = z.infer<typeof insertFacilitySchema>;
export type Facility = typeof facilities.$inferSelect;

export type InsertFacilityProject = z.infer<typeof insertFacilityProjectSchema>;
export type FacilityProject = typeof facilityProjects.$inferSelect;

export type InsertFacilityImprovement = z.infer<typeof insertFacilityImprovementSchema>;
export type FacilityImprovement = typeof facilityImprovements.$inferSelect;

export type InsertFacilityRequest = z.infer<typeof insertFacilityRequestSchema>;
export type FacilityRequest = typeof facilityRequests.$inferSelect;

export type InsertFacilityIncident = z.infer<typeof insertFacilityIncidentSchema>;
export type FacilityIncident = typeof facilityIncidents.$inferSelect;

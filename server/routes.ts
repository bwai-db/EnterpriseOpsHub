import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertVendorSchema, insertLicenseSchema, insertIncidentSchema, insertCloudServiceSchema,
  insertCorporateSchema, insertDivisionSchema, insertDepartmentSchema, insertFunctionSchema, insertPersonaSchema, insertUserSchema,
  insertStoreSchema, insertStoreInventorySchema, insertStoreSalesSchema, insertStoreStaffSchema,
  insertStoreDisplaySchema, insertStoreScheduleSchema, insertKeyholderAssignmentSchema, insertCorporateMessageSchema, insertMessageAcknowledgmentSchema,
  insertServiceCategorySchema, insertItilServiceSchema, insertConfigurationItemSchema,
  insertChangeRequestSchema, insertServiceLevelAgreementSchema,
  insertIntegrationLibrarySchema, insertIntegrationEndpointSchema, insertIntegrationCredentialSchema,
  insertManufacturerSchema, insertProductSchema, insertProductionOrderSchema, 
  insertManufacturingMetricsSchema, insertSupplierSchema, insertSupplyChainKpisSchema,
  insertFacilitySchema, insertFacilityProjectSchema, insertFacilityImprovementSchema, insertFacilityRequestSchema, insertFacilityIncidentSchema,
  insertCorporateLicensePackSchema, insertEntitlementLicenseSchema, insertSpecializedLicenseSchema,
  insertUserLicenseAssignmentSchema, insertMicrosoftLicenseKpisSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Corporates
  app.get("/api/corporates", async (req, res) => {
    try {
      const { brand } = req.query;
      const corporates = await storage.getCorporates(brand as string);
      res.json(corporates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch corporates" });
    }
  });

  app.get("/api/corporates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const corporate = await storage.getCorporate(id);
      if (!corporate) {
        return res.status(404).json({ message: "Corporate not found" });
      }
      res.json(corporate);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch corporate" });
    }
  });

  app.post("/api/corporates", async (req, res) => {
    try {
      const corporateData = insertCorporateSchema.parse(req.body);
      const corporate = await storage.createCorporate(corporateData);
      res.status(201).json(corporate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid corporate data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create corporate" });
    }
  });

  app.put("/api/corporates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const corporateData = insertCorporateSchema.partial().parse(req.body);
      const corporate = await storage.updateCorporate(id, corporateData);
      res.json(corporate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid corporate data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update corporate" });
    }
  });

  app.delete("/api/corporates/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCorporate(id);
      if (!success) {
        return res.status(404).json({ message: "Corporate not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete corporate" });
    }
  });

  // Divisions
  app.get("/api/divisions", async (req, res) => {
    try {
      const { brand, corporateId } = req.query;
      const divisions = await storage.getDivisions(
        brand as string,
        corporateId ? parseInt(corporateId as string) : undefined
      );
      res.json(divisions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch divisions" });
    }
  });

  app.post("/api/divisions", async (req, res) => {
    try {
      const divisionData = insertDivisionSchema.parse(req.body);
      const division = await storage.createDivision(divisionData);
      res.status(201).json(division);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid division data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create division" });
    }
  });

  // Departments
  app.get("/api/departments", async (req, res) => {
    try {
      const { brand, divisionId } = req.query;
      const departments = await storage.getDepartments(
        brand as string, 
        divisionId ? parseInt(divisionId as string) : undefined
      );
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  app.post("/api/departments", async (req, res) => {
    try {
      const departmentData = insertDepartmentSchema.parse(req.body);
      const department = await storage.createDepartment(departmentData);
      res.status(201).json(department);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid department data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create department" });
    }
  });

  // Functions
  app.get("/api/functions", async (req, res) => {
    try {
      const { brand, departmentId } = req.query;
      const functions = await storage.getFunctions(
        brand as string, 
        departmentId ? parseInt(departmentId as string) : undefined
      );
      res.json(functions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch functions" });
    }
  });

  app.post("/api/functions", async (req, res) => {
    try {
      const functionData = insertFunctionSchema.parse(req.body);
      const func = await storage.createFunction(functionData);
      res.status(201).json(func);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid function data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create function" });
    }
  });

  // Personas
  app.get("/api/personas", async (req, res) => {
    try {
      const { brand } = req.query;
      const personas = await storage.getPersonas(brand as string);
      res.json(personas);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch personas" });
    }
  });

  app.post("/api/personas", async (req, res) => {
    try {
      const personaData = insertPersonaSchema.parse(req.body);
      const persona = await storage.createPersona(personaData);
      res.status(201).json(persona);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid persona data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create persona" });
    }
  });

  // Users
  app.get("/api/users", async (req, res) => {
    try {
      const { brand } = req.query;
      const users = await storage.getUsers(brand as string);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/users/sync-entra", async (req, res) => {
    try {
      const { entraData } = req.body;
      if (!entraData) {
        return res.status(400).json({ message: "EntraID data is required" });
      }
      const user = await storage.syncUserFromEntra(entraData);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to sync user from EntraID" });
    }
  });

  // Vendors
  app.get("/api/vendors", async (req, res) => {
    try {
      const { brand } = req.query;
      const vendors = await storage.getVendors(brand as string);
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendors" });
    }
  });

  app.get("/api/vendors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vendor = await storage.getVendor(id);
      if (!vendor) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendor" });
    }
  });

  app.post("/api/vendors", async (req, res) => {
    try {
      const vendorData = insertVendorSchema.parse(req.body);
      const vendor = await storage.createVendor(vendorData);
      res.status(201).json(vendor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vendor data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create vendor" });
    }
  });

  app.put("/api/vendors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertVendorSchema.partial().parse(req.body);
      const vendor = await storage.updateVendor(id, updateData);
      res.json(vendor);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid vendor data", errors: error.errors });
      }
      if (error instanceof Error && error.message === "Vendor not found") {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.status(500).json({ message: "Failed to update vendor" });
    }
  });

  app.delete("/api/vendors/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteVendor(id);
      if (!deleted) {
        return res.status(404).json({ message: "Vendor not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete vendor" });
    }
  });

  // Vendor Team Members
  app.get("/api/vendor-team-members", async (req, res) => {
    try {
      const { vendorId } = req.query;
      const members = await storage.getVendorTeamMembers(
        vendorId ? parseInt(vendorId as string) : undefined
      );
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendor team members" });
    }
  });

  app.get("/api/vendor-team-members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.getVendorTeamMember(id);
      if (!member) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team member" });
    }
  });

  app.post("/api/vendor-team-members", async (req, res) => {
    try {
      const memberData = req.body; // TODO: Add schema validation
      const member = await storage.createVendorTeamMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to create team member" });
    }
  });

  app.put("/api/vendor-team-members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body; // TODO: Add schema validation
      const member = await storage.updateVendorTeamMember(id, updateData);
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to update team member" });
    }
  });

  app.delete("/api/vendor-team-members/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteVendorTeamMember(id);
      if (!deleted) {
        return res.status(404).json({ message: "Team member not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });

  // Vendor Agreements
  app.get("/api/vendor-agreements", async (req, res) => {
    try {
      const { vendorId } = req.query;
      const agreements = await storage.getVendorAgreements(
        vendorId ? parseInt(vendorId as string) : undefined
      );
      res.json(agreements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vendor agreements" });
    }
  });

  app.get("/api/vendor-agreements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const agreement = await storage.getVendorAgreement(id);
      if (!agreement) {
        return res.status(404).json({ message: "Agreement not found" });
      }
      res.json(agreement);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agreement" });
    }
  });

  app.post("/api/vendor-agreements", async (req, res) => {
    try {
      const agreementData = req.body; // TODO: Add schema validation
      const agreement = await storage.createVendorAgreement(agreementData);
      res.status(201).json(agreement);
    } catch (error) {
      res.status(500).json({ message: "Failed to create agreement" });
    }
  });

  app.put("/api/vendor-agreements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body; // TODO: Add schema validation
      const agreement = await storage.updateVendorAgreement(id, updateData);
      res.json(agreement);
    } catch (error) {
      res.status(500).json({ message: "Failed to update agreement" });
    }
  });

  app.delete("/api/vendor-agreements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteVendorAgreement(id);
      if (!deleted) {
        return res.status(404).json({ message: "Agreement not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete agreement" });
    }
  });

  // Licenses
  app.get("/api/licenses", async (req, res) => {
    try {
      const { brand } = req.query;
      const licenses = await storage.getLicenses(brand as string);
      res.json(licenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch licenses" });
    }
  });

  app.post("/api/licenses", async (req, res) => {
    try {
      const licenseData = insertLicenseSchema.parse(req.body);
      const license = await storage.createLicense(licenseData);
      res.status(201).json(license);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid license data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create license" });
    }
  });

  app.put("/api/licenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertLicenseSchema.partial().parse(req.body);
      const license = await storage.updateLicense(id, updateData);
      res.json(license);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid license data", errors: error.errors });
      }
      if (error instanceof Error && error.message === "License not found") {
        return res.status(404).json({ message: "License not found" });
      }
      res.status(500).json({ message: "Failed to update license" });
    }
  });

  // Incidents
  app.get("/api/incidents", async (req, res) => {
    try {
      const { brand } = req.query;
      const incidents = await storage.getIncidents(brand as string);
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch incidents" });
    }
  });

  app.post("/api/incidents", async (req, res) => {
    try {
      const incidentData = insertIncidentSchema.parse(req.body);
      const incident = await storage.createIncident(incidentData);
      res.status(201).json(incident);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid incident data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create incident" });
    }
  });

  app.put("/api/incidents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertIncidentSchema.partial().parse(req.body);
      const incident = await storage.updateIncident(id, updateData);
      res.json(incident);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid incident data", errors: error.errors });
      }
      if (error instanceof Error && error.message === "Incident not found") {
        return res.status(404).json({ message: "Incident not found" });
      }
      res.status(500).json({ message: "Failed to update incident" });
    }
  });

  // Cloud Services
  app.get("/api/cloud-services", async (req, res) => {
    try {
      const { brand } = req.query;
      const services = await storage.getCloudServices(brand as string);
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cloud services" });
    }
  });

  app.put("/api/cloud-services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertCloudServiceSchema.partial().parse(req.body);
      const service = await storage.updateCloudService(id, updateData);
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      if (error instanceof Error && error.message === "Cloud service not found") {
        return res.status(404).json({ message: "Cloud service not found" });
      }
      res.status(500).json({ message: "Failed to update cloud service" });
    }
  });

  // Dashboard metrics
  // Holistic Business KPI Dashboard
  app.get("/api/dashboard/holistic-kpis", async (req, res) => {
    try {
      const { brand } = req.query;
      
      // Core Operations Data
      const vendors = await storage.getVendors(brand as string);
      const licenses = await storage.getLicenses(brand as string);
      const incidents = await storage.getIncidents(brand as string);
      const cloudServices = await storage.getCloudServices(brand as string);
      
      // Organizational Data
      const users = await storage.getUsers(brand as string);
      const stores = await storage.getStores(brand as string);
      const corporates = await storage.getCorporates(brand as string);
      const divisions = await storage.getDivisions(brand as string);
      
      // Manufacturing & Supply Chain Data
      const manufacturers = await storage.getManufacturers(brand as string);
      const products = await storage.getProducts(brand as string);
      const productionOrders = await storage.getProductionOrders(brand as string);
      const suppliers = await storage.getSuppliers(brand as string);
      
      // Facilities & Infrastructure
      const facilities = await storage.getFacilities(brand as string);
      const facilityProjects = await storage.getFacilityProjects(brand as string);
      
      // Licensing & Compliance
      const corporateLicensePacks = await storage.getCorporateLicensePacks(brand as string);
      const specializedLicenses = await storage.getSpecializedLicenses(brand as string);
      const microsoftKpis = await storage.getMicrosoftLicenseKpis(brand as string);
      
      // Calculate time-based metrics
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      const ninetyDaysAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
      
      // Operational Excellence KPIs
      const activeVendors = vendors.filter(v => v.status === "active").length;
      const expiringLicenses = licenses.filter(l => 
        l.expiryDate && new Date(l.expiryDate) <= thirtyDaysFromNow && l.status === "active"
      ).length;
      const openIncidents = incidents.filter(i => 
        i.status === "open" || i.status === "assigned" || i.status === "in_progress"
      ).length;
      const criticalIncidents = incidents.filter(i => 
        i.priority === "critical" && (i.status === "open" || i.status === "assigned" || i.status === "in_progress")
      ).length;
      
      // Service Health & Reliability
      const operationalServices = cloudServices.filter(s => s.status === "operational").length;
      const cloudHealth = cloudServices.length > 0 
        ? Math.round((operationalServices / cloudServices.length) * 1000) / 10 
        : 100;
      
      // Human Capital & Organization
      const totalEmployees = users.length;
      const activeStores = stores.filter(s => s.status === "active").length;
      const totalLocations = facilities.length + activeStores;
      
      // Manufacturing & Supply Chain Performance
      const activeProductionOrders = productionOrders.filter(po => po.status === "in_progress").length;
      const completedProductionOrders = productionOrders.filter(po => po.status === "completed").length;
      const manufacturingEfficiency = productionOrders.length > 0 
        ? Math.round((completedProductionOrders / productionOrders.length) * 100) 
        : 0;
      
      // Financial & Licensing Performance
      const totalLicenseCost = corporateLicensePacks.reduce((sum, pack) => sum + parseFloat(pack.totalCost || "0"), 0);
      const currentMonthKpis = microsoftKpis.filter(kpi => 
        kpi.month === now.getMonth() + 1 && kpi.year === now.getFullYear()
      );
      const averageUtilization = currentMonthKpis.length > 0
        ? currentMonthKpis.reduce((sum, kpi) => sum + parseFloat(kpi.utilizationRate || "0"), 0) / currentMonthKpis.length
        : 0;
      
      // Facilities & Project Management
      const activeFacilityProjects = facilityProjects.filter(p => p.status === "in_progress").length;
      const completedFacilityProjects = facilityProjects.filter(p => p.status === "completed").length;
      
      // Risk & Compliance Metrics
      const complianceScore = currentMonthKpis.length > 0
        ? currentMonthKpis.reduce((sum, kpi) => sum + parseFloat(kpi.complianceScore || "0"), 0) / currentMonthKpis.length
        : 95;
      const securityScore = currentMonthKpis.length > 0
        ? currentMonthKpis.reduce((sum, kpi) => sum + parseFloat(kpi.securityScore || "0"), 0) / currentMonthKpis.length
        : 93;

      res.json({
        // Business Overview
        totalEmployees,
        totalLocations,
        activeStores,
        activeFacilities: facilities.length,
        
        // Operational Excellence
        activeVendors,
        openIncidents,
        criticalIncidents,
        expiringLicenses,
        cloudHealth,
        
        // Financial Performance
        totalLicenseCost: Math.round(totalLicenseCost),
        averageUtilization: Math.round(averageUtilization * 100) / 100,
        
        // Manufacturing & Supply Chain
        totalProducts: products.length,
        activeProductionOrders,
        completedProductionOrders,
        manufacturingEfficiency,
        totalSuppliers: suppliers.length,
        totalManufacturers: manufacturers.length,
        
        // Infrastructure & Facilities
        activeFacilityProjects,
        completedFacilityProjects,
        facilityProjectEfficiency: facilityProjects.length > 0 
          ? Math.round((completedFacilityProjects / facilityProjects.length) * 100) 
          : 0,
        
        // Risk & Compliance
        complianceScore: Math.round(complianceScore * 100) / 100,
        securityScore: Math.round(securityScore * 100) / 100,
        
        // Organizational Structure
        totalCorporates: corporates.length,
        totalDivisions: divisions.length,
        
        // Performance Trends (calculated)
        incidentTrend: criticalIncidents > 0 ? "increasing" : "stable",
        licensingTrend: averageUtilization > 5 ? "healthy" : "underutilized",
        manufacturingTrend: manufacturingEfficiency > 80 ? "excellent" : manufacturingEfficiency > 60 ? "good" : "needs_improvement",
        facilityTrend: activeFacilityProjects > 0 ? "active_expansion" : "stable"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch holistic business KPIs" });
    }
  });

  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const { brand } = req.query;
      
      const vendors = await storage.getVendors(brand as string);
      const licenses = await storage.getLicenses(brand as string);
      const incidents = await storage.getIncidents(brand as string);
      const cloudServices = await storage.getCloudServices(brand as string);

      const activeVendors = vendors.filter(v => v.status === "active").length;
      
      const now = new Date();
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      const expiringLicenses = licenses.filter(l => 
        l.expiryDate && new Date(l.expiryDate) <= thirtyDaysFromNow && l.status === "active"
      ).length;

      const openIncidents = incidents.filter(i => 
        i.status === "open" || i.status === "assigned" || i.status === "in_progress"
      ).length;

      const operationalServices = cloudServices.filter(s => s.status === "operational").length;
      const cloudHealth = cloudServices.length > 0 
        ? Math.round((operationalServices / cloudServices.length) * 1000) / 10 
        : 100;

      const criticalIncidents = incidents.filter(i => 
        i.priority === "critical" && (i.status === "open" || i.status === "assigned" || i.status === "in_progress")
      ).length;

      res.json({
        activeVendors,
        expiringLicenses,
        openIncidents,
        cloudHealth,
        criticalIncidents
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Retail Store Operations Routes
  // Stores
  app.get("/api/stores", async (req, res) => {
    try {
      const { brand } = req.query;
      const stores = await storage.getStores(brand as string);
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });

  app.post("/api/stores", async (req, res) => {
    try {
      const storeData = insertStoreSchema.parse(req.body);
      const store = await storage.createStore(storeData);
      res.status(201).json(store);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid store data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create store" });
    }
  });

  // Store Inventory
  app.get("/api/store-inventory", async (req, res) => {
    try {
      const { storeId, brand } = req.query;
      const inventory = await storage.getStoreInventory(
        storeId ? parseInt(storeId as string) : undefined,
        brand as string
      );
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.post("/api/store-inventory", async (req, res) => {
    try {
      const inventoryData = insertStoreInventorySchema.parse(req.body);
      const inventory = await storage.createInventoryItem(inventoryData);
      res.status(201).json(inventory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid inventory data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create inventory item" });
    }
  });

  // Store Sales
  app.get("/api/store-sales", async (req, res) => {
    try {
      const { storeId, brand } = req.query;
      const sales = await storage.getStoreSales(
        storeId ? parseInt(storeId as string) : undefined,
        brand as string
      );
      res.json(sales);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales" });
    }
  });

  app.post("/api/store-sales", async (req, res) => {
    try {
      const salesData = insertStoreSalesSchema.parse(req.body);
      const sale = await storage.createSalesRecord(salesData);
      res.status(201).json(sale);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid sales data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create sales record" });
    }
  });

  // Store Staff
  app.get("/api/store-staff", async (req, res) => {
    try {
      const { storeId, brand } = req.query;
      const staff = await storage.getStoreStaff(
        storeId ? parseInt(storeId as string) : undefined,
        brand as string
      );
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff" });
    }
  });

  app.post("/api/store-staff", async (req, res) => {
    try {
      const staffData = insertStoreStaffSchema.parse(req.body);
      const staff = await storage.createStaffMember(staffData);
      res.status(201).json(staff);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid staff data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create staff member" });
    }
  });

  // Enhanced Retail Operations Routes
  // Store Displays
  app.get("/api/store-displays", async (req, res) => {
    try {
      const { storeId, brand } = req.query;
      const displays = await storage.getStoreDisplays(
        storeId ? parseInt(storeId as string) : undefined,
        brand as string
      );
      res.json(displays);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch store displays" });
    }
  });

  app.post("/api/store-displays", async (req, res) => {
    try {
      const displayData = insertStoreDisplaySchema.parse(req.body);
      const display = await storage.createStoreDisplay(displayData);
      res.status(201).json(display);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid display data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create store display" });
    }
  });

  app.put("/api/store-displays/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const displayData = insertStoreDisplaySchema.partial().parse(req.body);
      const display = await storage.updateStoreDisplay(id, displayData);
      res.json(display);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid display data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update store display" });
    }
  });

  app.delete("/api/store-displays/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteStoreDisplay(id);
      if (!success) {
        return res.status(404).json({ message: "Store display not found" });
      }
      res.json({ message: "Store display deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete store display" });
    }
  });

  // Store Schedules
  app.get("/api/store-schedules", async (req, res) => {
    try {
      const { storeId, staffId } = req.query;
      const schedules = await storage.getStoreSchedules(
        storeId ? parseInt(storeId as string) : undefined,
        staffId ? parseInt(staffId as string) : undefined
      );
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch store schedules" });
    }
  });

  app.post("/api/store-schedules", async (req, res) => {
    try {
      const scheduleData = insertStoreScheduleSchema.parse(req.body);
      const schedule = await storage.createStoreSchedule(scheduleData);
      res.status(201).json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid schedule data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create store schedule" });
    }
  });

  app.put("/api/store-schedules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const scheduleData = insertStoreScheduleSchema.partial().parse(req.body);
      const schedule = await storage.updateStoreSchedule(id, scheduleData);
      res.json(schedule);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid schedule data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update store schedule" });
    }
  });

  app.delete("/api/store-schedules/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteStoreSchedule(id);
      if (!success) {
        return res.status(404).json({ message: "Store schedule not found" });
      }
      res.json({ message: "Store schedule deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete store schedule" });
    }
  });

  // Keyholder Assignments
  app.get("/api/keyholder-assignments", async (req, res) => {
    try {
      const { storeId, staffId } = req.query;
      const assignments = await storage.getKeyholderAssignments(
        storeId ? parseInt(storeId as string) : undefined,
        staffId ? parseInt(staffId as string) : undefined
      );
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch keyholder assignments" });
    }
  });

  app.post("/api/keyholder-assignments", async (req, res) => {
    try {
      const assignmentData = insertKeyholderAssignmentSchema.parse(req.body);
      const assignment = await storage.createKeyholderAssignment(assignmentData);
      res.status(201).json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid assignment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create keyholder assignment" });
    }
  });

  app.put("/api/keyholder-assignments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assignmentData = insertKeyholderAssignmentSchema.partial().parse(req.body);
      const assignment = await storage.updateKeyholderAssignment(id, assignmentData);
      res.json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid assignment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update keyholder assignment" });
    }
  });

  app.delete("/api/keyholder-assignments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteKeyholderAssignment(id);
      if (!success) {
        return res.status(404).json({ message: "Keyholder assignment not found" });
      }
      res.json({ message: "Keyholder assignment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete keyholder assignment" });
    }
  });

  // Corporate Messages
  app.get("/api/corporate-messages", async (req, res) => {
    try {
      const { brand, targetAudience } = req.query;
      const messages = await storage.getCorporateMessages(
        brand as string,
        targetAudience as string
      );
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch corporate messages" });
    }
  });

  app.post("/api/corporate-messages", async (req, res) => {
    try {
      const messageData = insertCorporateMessageSchema.parse(req.body);
      const message = await storage.createCorporateMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create corporate message" });
    }
  });

  app.put("/api/corporate-messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const messageData = insertCorporateMessageSchema.partial().parse(req.body);
      const message = await storage.updateCorporateMessage(id, messageData);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update corporate message" });
    }
  });

  app.delete("/api/corporate-messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCorporateMessage(id);
      if (!success) {
        return res.status(404).json({ message: "Corporate message not found" });
      }
      res.json({ message: "Corporate message deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete corporate message" });
    }
  });

  // Message Acknowledgments
  app.get("/api/message-acknowledgments", async (req, res) => {
    try {
      const { messageId, storeId } = req.query;
      const acknowledgments = await storage.getMessageAcknowledgments(
        messageId ? parseInt(messageId as string) : undefined,
        storeId ? parseInt(storeId as string) : undefined
      );
      res.json(acknowledgments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch message acknowledgments" });
    }
  });

  app.post("/api/message-acknowledgments", async (req, res) => {
    try {
      const acknowledgmentData = insertMessageAcknowledgmentSchema.parse(req.body);
      const acknowledgment = await storage.createMessageAcknowledgment(acknowledgmentData);
      res.status(201).json(acknowledgment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid acknowledgment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create message acknowledgment" });
    }
  });

  // ITIL Service Management and CMDB Routes
  // Service Categories
  app.get("/api/service-categories", async (req, res) => {
    try {
      const { brand } = req.query;
      const categories = await storage.getServiceCategories(brand as string);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service categories" });
    }
  });

  app.post("/api/service-categories", async (req, res) => {
    try {
      const categoryData = insertServiceCategorySchema.parse(req.body);
      const category = await storage.createServiceCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create service category" });
    }
  });

  // ITIL Services
  app.get("/api/itil-services", async (req, res) => {
    try {
      const { brand, categoryId } = req.query;
      const services = await storage.getItilServices(
        brand as string,
        categoryId ? parseInt(categoryId as string) : undefined
      );
      res.json(services);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ITIL services" });
    }
  });

  app.post("/api/itil-services", async (req, res) => {
    try {
      const serviceData = insertItilServiceSchema.parse(req.body);
      const service = await storage.createItilService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ITIL service" });
    }
  });

  app.delete("/api/itil-services/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteItilService(id);
      if (!success) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete ITIL service" });
    }
  });

  // Configuration Items (CMDB)
  app.get("/api/configuration-items", async (req, res) => {
    try {
      const { brand, serviceId, ciClass } = req.query;
      const cis = await storage.getConfigurationItems(
        brand as string,
        serviceId ? parseInt(serviceId as string) : undefined,
        ciClass as string
      );
      res.json(cis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch configuration items" });
    }
  });

  app.post("/api/configuration-items", async (req, res) => {
    try {
      const ciData = insertConfigurationItemSchema.parse(req.body);
      const ci = await storage.createConfigurationItem(ciData);
      res.status(201).json(ci);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid CI data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create configuration item" });
    }
  });

  app.post("/api/configuration-items/sync/:ciClass", async (req, res) => {
    try {
      const { ciClass } = req.params;
      const { brand } = req.query;
      const cis = await storage.syncConfigurationItems(ciClass, brand as string);
      res.json({ message: `Synced ${cis.length} configuration items`, items: cis });
    } catch (error) {
      res.status(500).json({ message: "Failed to sync configuration items" });
    }
  });

  // Change Requests
  app.get("/api/change-requests", async (req, res) => {
    try {
      const { brand, status } = req.query;
      const changes = await storage.getChangeRequests(brand as string, status as string);
      res.json(changes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch change requests" });
    }
  });

  app.post("/api/change-requests", async (req, res) => {
    try {
      const changeData = insertChangeRequestSchema.parse(req.body);
      const change = await storage.createChangeRequest(changeData);
      res.status(201).json(change);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid change request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create change request" });
    }
  });

  app.patch("/api/change-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const change = await storage.updateChangeRequest(id, updateData);
      res.json(change);
    } catch (error) {
      res.status(500).json({ message: "Failed to update change request" });
    }
  });

  // Service Level Agreements
  app.get("/api/service-level-agreements", async (req, res) => {
    try {
      const { serviceId } = req.query;
      const slas = await storage.getServiceLevelAgreements(
        serviceId ? parseInt(serviceId as string) : undefined
      );
      res.json(slas);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch SLAs" });
    }
  });

  app.post("/api/service-level-agreements", async (req, res) => {
    try {
      const slaData = insertServiceLevelAgreementSchema.parse(req.body);
      const sla = await storage.createServiceLevelAgreement(slaData);
      res.status(201).json(sla);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid SLA data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create SLA" });
    }
  });

  // Service and CI Relationships
  app.get("/api/service-relationships", async (req, res) => {
    try {
      const { serviceId } = req.query;
      const relationships = await storage.getServiceRelationships(
        serviceId ? parseInt(serviceId as string) : undefined
      );
      res.json(relationships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service relationships" });
    }
  });

  app.get("/api/ci-relationships", async (req, res) => {
    try {
      const { ciId } = req.query;
      const relationships = await storage.getCiRelationships(
        ciId ? parseInt(ciId as string) : undefined
      );
      res.json(relationships);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch CI relationships" });
    }
  });

  // Distribution Centers Routes
  app.get("/api/distribution-centers", async (req, res) => {
    try {
      const { brand } = req.query;
      const centers = await storage.getDistributionCenters(brand as string);
      res.json(centers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch distribution centers" });
    }
  });

  app.get("/api/distribution-centers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const center = await storage.getDistributionCenter(id);
      if (!center) {
        return res.status(404).json({ message: "Distribution center not found" });
      }
      res.json(center);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch distribution center" });
    }
  });

  app.get("/api/distribution-center-metrics", async (req, res) => {
    try {
      const { centerId, quarter, year } = req.query;
      const metrics = await storage.getDistributionCenterMetrics(
        centerId ? parseInt(centerId as string) : undefined,
        quarter as string,
        year ? parseInt(year as string) : undefined
      );
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch distribution center metrics" });
    }
  });

  // Integration Libraries
  app.get("/api/integration-libraries", async (req, res) => {
    try {
      const { brand } = req.query;
      const libraries = await storage.getIntegrationLibraries(brand as string);
      res.json(libraries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integration libraries" });
    }
  });

  app.get("/api/integration-libraries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const library = await storage.getIntegrationLibrary(id);
      if (!library) {
        return res.status(404).json({ message: "Integration library not found" });
      }
      res.json(library);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integration library" });
    }
  });

  app.post("/api/integration-libraries", async (req, res) => {
    try {
      const libraryData = insertIntegrationLibrarySchema.parse(req.body);
      const library = await storage.createIntegrationLibrary(libraryData);
      res.status(201).json(library);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid library data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create integration library" });
    }
  });

  app.put("/api/integration-libraries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body; // TODO: Add schema validation
      const library = await storage.updateIntegrationLibrary(id, updateData);
      res.json(library);
    } catch (error) {
      res.status(500).json({ message: "Failed to update integration library" });
    }
  });

  app.delete("/api/integration-libraries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteIntegrationLibrary(id);
      if (!deleted) {
        return res.status(404).json({ message: "Integration library not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete integration library" });
    }
  });

  // Integration Endpoints
  app.get("/api/integration-endpoints", async (req, res) => {
    try {
      const { libraryId } = req.query;
      const endpoints = await storage.getIntegrationEndpoints(
        libraryId ? parseInt(libraryId as string) : undefined
      );
      res.json(endpoints);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integration endpoints" });
    }
  });

  app.post("/api/integration-endpoints", async (req, res) => {
    try {
      const endpointData = insertIntegrationEndpointSchema.parse(req.body);
      const endpoint = await storage.createIntegrationEndpoint(endpointData);
      res.status(201).json(endpoint);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid endpoint data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create integration endpoint" });
    }
  });

  // Integration Credentials
  app.get("/api/integration-credentials", async (req, res) => {
    try {
      const { libraryId } = req.query;
      const credentials = await storage.getIntegrationCredentials(
        libraryId ? parseInt(libraryId as string) : undefined
      );
      res.json(credentials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch integration credentials" });
    }
  });

  app.post("/api/integration-credentials", async (req, res) => {
    try {
      const credentialData = insertIntegrationCredentialSchema.parse(req.body);
      const credential = await storage.createIntegrationCredential(credentialData);
      res.status(201).json(credential);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid credential data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create integration credential" });
    }
  });

  app.put("/api/integration-credentials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body; // TODO: Add schema validation
      const credential = await storage.updateIntegrationCredential(id, updateData);
      res.json(credential);
    } catch (error) {
      res.status(500).json({ message: "Failed to update integration credential" });
    }
  });

  // Manufacturing Management API Routes
  // Manufacturers
  app.get("/api/manufacturers", async (req, res) => {
    try {
      const { brand } = req.query;
      const manufacturers = await storage.getManufacturers(brand as string);
      res.json(manufacturers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch manufacturers" });
    }
  });

  app.post("/api/manufacturers", async (req, res) => {
    try {
      const manufacturerData = insertManufacturerSchema.parse(req.body);
      const manufacturer = await storage.createManufacturer(manufacturerData);
      res.status(201).json(manufacturer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid manufacturer data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create manufacturer" });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const { brand } = req.query;
      const products = await storage.getProducts(brand as string);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid product data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Production Orders
  app.get("/api/production-orders", async (req, res) => {
    try {
      const { brand, manufacturerId } = req.query;
      const orders = await storage.getProductionOrders(
        brand as string,
        manufacturerId ? parseInt(manufacturerId as string) : undefined
      );
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch production orders" });
    }
  });

  app.post("/api/production-orders", async (req, res) => {
    try {
      const orderData = insertProductionOrderSchema.parse(req.body);
      const order = await storage.createProductionOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid production order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create production order" });
    }
  });

  // Manufacturing Metrics
  app.get("/api/manufacturing-metrics", async (req, res) => {
    try {
      const { manufacturerId, productId, month, year } = req.query;
      const metrics = await storage.getManufacturingMetrics(
        manufacturerId ? parseInt(manufacturerId as string) : undefined,
        productId ? parseInt(productId as string) : undefined,
        month ? parseInt(month as string) : undefined,
        year ? parseInt(year as string) : undefined
      );
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch manufacturing metrics" });
    }
  });

  app.post("/api/manufacturing-metrics", async (req, res) => {
    try {
      const metricsData = insertManufacturingMetricsSchema.parse(req.body);
      const metrics = await storage.createManufacturingMetrics(metricsData);
      res.status(201).json(metrics);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid metrics data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create manufacturing metrics" });
    }
  });

  // Suppliers
  app.get("/api/suppliers", async (req, res) => {
    try {
      const { brand } = req.query;
      const suppliers = await storage.getSuppliers(brand as string);
      res.json(suppliers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suppliers" });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const supplierData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.createSupplier(supplierData);
      res.status(201).json(supplier);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid supplier data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create supplier" });
    }
  });

  // Supply Chain KPIs
  app.get("/api/supply-chain-kpis", async (req, res) => {
    try {
      const { brand, month, year } = req.query;
      const kpis = await storage.getSupplyChainKpis(
        brand as string,
        month ? parseInt(month as string) : undefined,
        year ? parseInt(year as string) : undefined
      );
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch supply chain KPIs" });
    }
  });

  app.post("/api/supply-chain-kpis", async (req, res) => {
    try {
      const kpiData = insertSupplyChainKpisSchema.parse(req.body);
      const kpis = await storage.createSupplyChainKpis(kpiData);
      res.status(201).json(kpis);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid KPI data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create supply chain KPIs" });
    }
  });

  // Facilities Management Routes
  // Facilities
  app.get("/api/facilities", async (req, res) => {
    try {
      const { brand } = req.query;
      const facilities = await storage.getFacilities(brand as string);
      res.json(facilities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facilities" });
    }
  });

  app.get("/api/facilities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const facility = await storage.getFacility(id);
      if (!facility) {
        return res.status(404).json({ message: "Facility not found" });
      }
      res.json(facility);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facility" });
    }
  });

  app.post("/api/facilities", async (req, res) => {
    try {
      const facilityData = insertFacilitySchema.parse(req.body);
      const facility = await storage.createFacility(facilityData);
      res.status(201).json(facility);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid facility data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create facility" });
    }
  });

  // Facility Projects
  app.get("/api/facility-projects", async (req, res) => {
    try {
      const { brand, facilityId } = req.query;
      const projects = await storage.getFacilityProjects(
        brand as string,
        facilityId ? parseInt(facilityId as string) : undefined
      );
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facility projects" });
    }
  });

  app.post("/api/facility-projects", async (req, res) => {
    try {
      const projectData = insertFacilityProjectSchema.parse(req.body);
      const project = await storage.createFacilityProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create facility project" });
    }
  });

  // Facility Improvements
  app.get("/api/facility-improvements", async (req, res) => {
    try {
      const { brand, facilityId } = req.query;
      const improvements = await storage.getFacilityImprovements(
        brand as string,
        facilityId ? parseInt(facilityId as string) : undefined
      );
      res.json(improvements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facility improvements" });
    }
  });

  app.post("/api/facility-improvements", async (req, res) => {
    try {
      const improvementData = insertFacilityImprovementSchema.parse(req.body);
      const improvement = await storage.createFacilityImprovement(improvementData);
      res.status(201).json(improvement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid improvement data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create facility improvement" });
    }
  });

  // Facility Requests
  app.get("/api/facility-requests", async (req, res) => {
    try {
      const { brand, facilityId } = req.query;
      const requests = await storage.getFacilityRequests(
        brand as string,
        facilityId ? parseInt(facilityId as string) : undefined
      );
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facility requests" });
    }
  });

  app.post("/api/facility-requests", async (req, res) => {
    try {
      const requestData = insertFacilityRequestSchema.parse(req.body);
      const request = await storage.createFacilityRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create facility request" });
    }
  });

  // Facility Incidents
  app.get("/api/facility-incidents", async (req, res) => {
    try {
      const { brand, facilityId } = req.query;
      const incidents = await storage.getFacilityIncidents(
        brand as string,
        facilityId ? parseInt(facilityId as string) : undefined
      );
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facility incidents" });
    }
  });

  app.post("/api/facility-incidents", async (req, res) => {
    try {
      const incidentData = insertFacilityIncidentSchema.parse(req.body);
      const incident = await storage.createFacilityIncident(incidentData);
      res.status(201).json(incident);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid incident data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create facility incident" });
    }
  });

  // =====================================
  // LICENSING MANAGEMENT ROUTES
  // =====================================

  // Corporate License Packs
  app.get("/api/corporate-license-packs", async (req, res) => {
    try {
      const { brand } = req.query;
      const packs = await storage.getCorporateLicensePacks(brand as string);
      res.json(packs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch corporate license packs" });
    }
  });

  app.get("/api/corporate-license-packs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pack = await storage.getCorporateLicensePack(id);
      if (!pack) {
        return res.status(404).json({ message: "Corporate license pack not found" });
      }
      res.json(pack);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch corporate license pack" });
    }
  });

  app.post("/api/corporate-license-packs", async (req, res) => {
    try {
      const packData = insertCorporateLicensePackSchema.parse(req.body);
      const pack = await storage.createCorporateLicensePack(packData);
      res.status(201).json(pack);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid license pack data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create corporate license pack" });
    }
  });

  app.patch("/api/corporate-license-packs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const packData = insertCorporateLicensePackSchema.partial().parse(req.body);
      const pack = await storage.updateCorporateLicensePack(id, packData);
      res.json(pack);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid license pack data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update corporate license pack" });
    }
  });

  app.delete("/api/corporate-license-packs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCorporateLicensePack(id);
      if (!success) {
        return res.status(404).json({ message: "Corporate license pack not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete corporate license pack" });
    }
  });

  // Entitlement Licenses
  app.get("/api/entitlement-licenses", async (req, res) => {
    try {
      const { brand, packId } = req.query;
      const licenses = await storage.getEntitlementLicenses(
        brand as string,
        packId ? parseInt(packId as string) : undefined
      );
      res.json(licenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entitlement licenses" });
    }
  });

  app.get("/api/entitlement-licenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const license = await storage.getEntitlementLicense(id);
      if (!license) {
        return res.status(404).json({ message: "Entitlement license not found" });
      }
      res.json(license);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entitlement license" });
    }
  });

  app.post("/api/entitlement-licenses", async (req, res) => {
    try {
      const licenseData = insertEntitlementLicenseSchema.parse(req.body);
      const license = await storage.createEntitlementLicense(licenseData);
      res.status(201).json(license);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid entitlement license data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create entitlement license" });
    }
  });

  app.patch("/api/entitlement-licenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const licenseData = insertEntitlementLicenseSchema.partial().parse(req.body);
      const license = await storage.updateEntitlementLicense(id, licenseData);
      res.json(license);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid entitlement license data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update entitlement license" });
    }
  });

  app.delete("/api/entitlement-licenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEntitlementLicense(id);
      if (!success) {
        return res.status(404).json({ message: "Entitlement license not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete entitlement license" });
    }
  });

  // Specialized Licenses
  app.get("/api/specialized-licenses", async (req, res) => {
    try {
      const { brand, packId } = req.query;
      const licenses = await storage.getSpecializedLicenses(
        brand as string,
        packId ? parseInt(packId as string) : undefined
      );
      res.json(licenses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch specialized licenses" });
    }
  });

  app.get("/api/specialized-licenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const license = await storage.getSpecializedLicense(id);
      if (!license) {
        return res.status(404).json({ message: "Specialized license not found" });
      }
      res.json(license);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch specialized license" });
    }
  });

  app.post("/api/specialized-licenses", async (req, res) => {
    try {
      const licenseData = insertSpecializedLicenseSchema.parse(req.body);
      const license = await storage.createSpecializedLicense(licenseData);
      res.status(201).json(license);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid specialized license data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create specialized license" });
    }
  });

  app.patch("/api/specialized-licenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const licenseData = insertSpecializedLicenseSchema.partial().parse(req.body);
      const license = await storage.updateSpecializedLicense(id, licenseData);
      res.json(license);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid specialized license data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update specialized license" });
    }
  });

  app.delete("/api/specialized-licenses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSpecializedLicense(id);
      if (!success) {
        return res.status(404).json({ message: "Specialized license not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete specialized license" });
    }
  });

  // User License Assignments
  app.get("/api/user-license-assignments", async (req, res) => {
    try {
      const { brand, userId } = req.query;
      const assignments = await storage.getUserLicenseAssignments(
        brand as string,
        userId ? parseInt(userId as string) : undefined
      );
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user license assignments" });
    }
  });

  app.get("/api/user-license-assignments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assignment = await storage.getUserLicenseAssignment(id);
      if (!assignment) {
        return res.status(404).json({ message: "User license assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user license assignment" });
    }
  });

  app.post("/api/user-license-assignments", async (req, res) => {
    try {
      const assignmentData = insertUserLicenseAssignmentSchema.parse(req.body);
      const assignment = await storage.createUserLicenseAssignment(assignmentData);
      res.status(201).json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid assignment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user license assignment" });
    }
  });

  app.post("/api/user-license-assignments/assign", async (req, res) => {
    try {
      const { userId, licenseType, licenseId, assignedBy, reason } = req.body;
      const assignment = await storage.assignLicenseToUser(userId, licenseType, licenseId, assignedBy, reason);
      res.status(201).json(assignment);
    } catch (error) {
      res.status(500).json({ message: "Failed to assign license to user" });
    }
  });

  app.post("/api/user-license-assignments/:id/revoke", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { revokedBy, reason } = req.body;
      const success = await storage.revokeLicenseFromUser(id, revokedBy, reason);
      if (!success) {
        return res.status(404).json({ message: "User license assignment not found" });
      }
      res.json({ message: "License revoked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to revoke license from user" });
    }
  });

  app.patch("/api/user-license-assignments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assignmentData = insertUserLicenseAssignmentSchema.partial().parse(req.body);
      const assignment = await storage.updateUserLicenseAssignment(id, assignmentData);
      res.json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid assignment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user license assignment" });
    }
  });

  app.delete("/api/user-license-assignments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteUserLicenseAssignment(id);
      if (!success) {
        return res.status(404).json({ message: "User license assignment not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user license assignment" });
    }
  });

  // Microsoft License KPIs
  app.get("/api/microsoft-license-kpis", async (req, res) => {
    try {
      const { brand, month, year } = req.query;
      const kpis = await storage.getMicrosoftLicenseKpis(
        brand as string,
        month ? parseInt(month as string) : undefined,
        year ? parseInt(year as string) : undefined
      );
      res.json(kpis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Microsoft license KPIs" });
    }
  });

  app.get("/api/microsoft-license-kpis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const kpi = await storage.getMicrosoftLicenseKpi(id);
      if (!kpi) {
        return res.status(404).json({ message: "Microsoft license KPI not found" });
      }
      res.json(kpi);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch Microsoft license KPI" });
    }
  });

  app.post("/api/microsoft-license-kpis", async (req, res) => {
    try {
      const kpiData = insertMicrosoftLicenseKpisSchema.parse(req.body);
      const kpi = await storage.createMicrosoftLicenseKpis(kpiData);
      res.status(201).json(kpi);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid KPI data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create Microsoft license KPIs" });
    }
  });

  app.post("/api/microsoft-license-kpis/sync", async (req, res) => {
    try {
      const { tenantId, brand } = req.body;
      const kpi = await storage.syncMicrosoftLicenseData(tenantId, brand);
      res.status(201).json(kpi);
    } catch (error) {
      res.status(500).json({ message: "Failed to sync Microsoft license data" });
    }
  });

  app.patch("/api/microsoft-license-kpis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const kpiData = insertMicrosoftLicenseKpisSchema.partial().parse(req.body);
      const kpi = await storage.updateMicrosoftLicenseKpis(id, kpiData);
      res.json(kpi);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid KPI data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update Microsoft license KPIs" });
    }
  });

  app.delete("/api/microsoft-license-kpis/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMicrosoftLicenseKpis(id);
      if (!success) {
        return res.status(404).json({ message: "Microsoft license KPI not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete Microsoft license KPIs" });
    }
  });

  // Seed Enterprise Licenses
  app.post("/api/licenses/seed-enterprise", async (req, res) => {
    try {
      await storage.seedEnterpriseLicenses();
      res.json({ message: "Successfully seeded enterprise licenses with Microsoft 365, Power Platform, and Adobe products" });
    } catch (error) {
      console.error("Error seeding enterprise licenses:", error);
      res.status(500).json({ message: "Failed to seed enterprise licenses" });
    }
  });

  // Seed Realistic Staff
  app.post("/api/seed/realistic-staff", async (req, res) => {
    try {
      await storage.seedRealisticStaff();
      res.json({ message: "Successfully seeded realistic enterprise staff across all divisions and brands" });
    } catch (error) {
      console.error("Error seeding realistic staff:", error);
      res.status(500).json({ message: "Failed to seed realistic staff" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

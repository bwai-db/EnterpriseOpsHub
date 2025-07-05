import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertVendorSchema, insertLicenseSchema, insertIncidentSchema, insertCloudServiceSchema,
  insertDivisionSchema, insertDepartmentSchema, insertFunctionSchema, insertPersonaSchema, insertUserSchema,
  insertStoreSchema, insertStoreInventorySchema, insertStoreSalesSchema, insertStoreStaffSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Divisions
  app.get("/api/divisions", async (req, res) => {
    try {
      const { brand } = req.query;
      const divisions = await storage.getDivisions(brand as string);
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

  const httpServer = createServer(app);
  return httpServer;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVendorSchema, insertLicenseSchema, insertIncidentSchema, insertCloudServiceSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}

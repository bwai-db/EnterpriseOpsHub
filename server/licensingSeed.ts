import { storage } from "./storage";

// Comprehensive licensing seeding for all brands (Blorcs, Shaypops, TechNova)
export async function seedEnhancedLicensing() {
  console.log("Seeding enhanced licensing structure for all brands...");

  try {
    // Corporate License Packs for each brand
    const licensePacks = [
      // Blorcs Corporation - Enterprise Focus
      {
        packName: "Microsoft 365 E5 Enterprise",
        packType: "microsoft_365",
        description: "Complete Microsoft 365 Enterprise suite with advanced security and analytics",
        vendor: "Microsoft",
        totalLicenses: 1200,
        availableLicenses: 73,
        assignedLicenses: 1127,
        costPerLicense: "57.00",
        totalCost: "68400.00",
        renewalDate: "2025-12-15",
        purchaseDate: "2024-12-15",
        contractTerm: 12,
        autoRenewal: true,
        licenseKey: "BLORCS-M365-E5-2024-ENT",
        features: ["Advanced Threat Protection", "Power BI Pro", "Audio Conferencing", "Phone System", "Microsoft Defender", "Azure Information Protection"],
        restrictions: "Enterprise deployment only",
        complianceNotes: "GDPR and SOX compliant",
        contactEmail: "licensing@microsoft.com",
        status: "active",
        brand: "blorcs"
      },
      {
        packName: "Microsoft 365 E3 Standard",
        packType: "microsoft_365",
        description: "Core Microsoft 365 productivity suite for standard business users",
        vendor: "Microsoft",
        totalLicenses: 800,
        availableLicenses: 47,
        assignedLicenses: 753,
        costPerLicense: "36.00",
        totalCost: "28800.00",
        renewalDate: "2025-12-15",
        purchaseDate: "2024-12-15",
        contractTerm: 12,
        autoRenewal: true,
        licenseKey: "BLORCS-M365-E3-2024-STD",
        features: ["Office Apps", "Exchange Online", "SharePoint", "Teams", "OneDrive", "Power Automate"],
        restrictions: "Standard deployment",
        complianceNotes: "Standard compliance",
        contactEmail: "licensing@microsoft.com",
        status: "active",
        brand: "blorcs"
      },
      {
        packName: "Azure DevOps Server Enterprise",
        packType: "azure",
        description: "Enterprise development and deployment platform",
        vendor: "Microsoft",
        totalLicenses: 150,
        availableLicenses: 28,
        assignedLicenses: 122,
        costPerLicense: "6.00",
        totalCost: "900.00",
        renewalDate: "2025-11-30",
        purchaseDate: "2024-11-30",
        contractTerm: 12,
        autoRenewal: true,
        licenseKey: "BLORCS-AZDO-ENT-2024",
        features: ["Source Control", "CI/CD Pipelines", "Test Management", "Package Management", "Reporting"],
        restrictions: "Development teams only",
        complianceNotes: "SOX compliance for code management",
        contactEmail: "azure-licensing@microsoft.com",
        status: "active",
        brand: "blorcs"
      },

      // Shaypops Inc. - Creative Focus
      {
        packName: "Adobe Creative Cloud All Apps",
        packType: "creative_suite",
        description: "Complete Adobe Creative Cloud suite for creative professionals",
        vendor: "Adobe",
        totalLicenses: 180,
        availableLicenses: 15,
        assignedLicenses: 165,
        costPerLicense: "79.99",
        totalCost: "14398.20",
        renewalDate: "2025-09-20",
        purchaseDate: "2024-09-20",
        contractTerm: 12,
        autoRenewal: true,
        licenseKey: "SHAYPOPS-ACC-ALL-2024",
        features: ["Photoshop", "Illustrator", "InDesign", "Premiere Pro", "After Effects", "XD", "Dimension", "Creative Cloud Storage"],
        restrictions: "Creative team members only",
        complianceNotes: "Asset licensing compliance",
        contactEmail: "enterprise@adobe.com",
        status: "active",
        brand: "shaypops"
      },
      {
        packName: "Microsoft 365 E3 Creative",
        packType: "microsoft_365",
        description: "Microsoft 365 for creative workflows and collaboration",
        vendor: "Microsoft",
        totalLicenses: 200,
        availableLicenses: 23,
        assignedLicenses: 177,
        costPerLicense: "36.00",
        totalCost: "7200.00",
        renewalDate: "2025-10-15",
        purchaseDate: "2024-10-15",
        contractTerm: 12,
        autoRenewal: true,
        licenseKey: "SHAYPOPS-M365-E3-2024",
        features: ["Office Apps", "Teams", "SharePoint", "Stream", "Forms", "Power Platform"],
        restrictions: "Creative collaboration focus",
        complianceNotes: "Creative asset compliance",
        contactEmail: "licensing@microsoft.com",
        status: "active",
        brand: "shaypops"
      },
      {
        packName: "Figma Professional Team",
        packType: "design_collaboration",
        description: "Professional design and prototyping platform",
        vendor: "Figma",
        totalLicenses: 85,
        availableLicenses: 12,
        assignedLicenses: 73,
        costPerLicense: "15.00",
        totalCost: "1275.00",
        renewalDate: "2025-08-10",
        purchaseDate: "2024-08-10",
        contractTerm: 12,
        autoRenewal: true,
        licenseKey: "SHAYPOPS-FIGMA-PRO-2024",
        features: ["Design Systems", "Prototyping", "Collaboration", "Version History", "Team Libraries"],
        restrictions: "Design team only",
        complianceNotes: "Design IP protection",
        contactEmail: "teams@figma.com",
        status: "active",
        brand: "shaypops"
      },

      // TechNova Enterprises - Innovation Focus
      {
        packName: "Microsoft 365 E5 Developer",
        packType: "microsoft_365",
        description: "Advanced Microsoft 365 for developers and researchers",
        vendor: "Microsoft",
        totalLicenses: 300,
        availableLicenses: 35,
        assignedLicenses: 265,
        costPerLicense: "57.00",
        totalCost: "17100.00",
        renewalDate: "2025-11-01",
        purchaseDate: "2024-11-01",
        contractTerm: 12,
        autoRenewal: true,
        licenseKey: "TECHNOVA-M365-E5-DEV-2024",
        features: ["Advanced Analytics", "AI Builder", "Power BI Premium", "Advanced Security", "Development Tools"],
        restrictions: "R&D teams only",
        complianceNotes: "Research data protection",
        contactEmail: "licensing@microsoft.com",
        status: "active",
        brand: "technova"
      },
      {
        packName: "GitHub Enterprise Cloud",
        packType: "development_platform",
        description: "Enterprise-grade development platform with advanced security",
        vendor: "GitHub",
        totalLicenses: 250,
        availableLicenses: 41,
        assignedLicenses: 209,
        costPerLicense: "21.00",
        totalCost: "5250.00",
        renewalDate: "2025-07-15",
        purchaseDate: "2024-07-15",
        contractTerm: 12,
        autoRenewal: true,
        licenseKey: "TECHNOVA-GH-ENT-2024",
        features: ["Advanced Security", "Code Scanning", "Dependency Review", "GitHub Copilot Business", "SAML SSO"],
        restrictions: "Development teams only",
        complianceNotes: "Open source compliance",
        contactEmail: "enterprise@github.com",
        status: "active",
        brand: "technova"
      },
      {
        packName: "JetBrains All Products Pack",
        packType: "development_tools",
        description: "Complete JetBrains IDE suite for professional development",
        vendor: "JetBrains",
        totalLicenses: 120,
        availableLicenses: 18,
        assignedLicenses: 102,
        costPerLicense: "779.00",
        totalCost: "93480.00",
        renewalDate: "2025-06-30",
        purchaseDate: "2024-06-30",
        contractTerm: 12,
        autoRenewal: true,
        licenseKey: "TECHNOVA-JB-ALL-2024",
        features: ["IntelliJ IDEA Ultimate", "PyCharm Professional", "WebStorm", "DataGrip", "CLion", "TeamCity"],
        restrictions: "Software engineers only",
        complianceNotes: "Development license compliance",
        contactEmail: "sales@jetbrains.com",
        status: "active",
        brand: "technova"
      }
    ];

    // Entitlement Licenses - Individual license types
    const entitlementLicenses = [
      // Microsoft 365 Entitlements
      {
        licenseName: "Microsoft 365 E5",
        licenseType: "user",
        category: "productivity",
        vendor: "Microsoft",
        sku: "ENTERPRISEPREMIUM",
        productId: "6fd2c87f-b296-42f0-b197-1e91e994b900",
        servicePlanId: "c7df2760-2c81-4ef7-b578-5b5392b571df",
        maxAssignments: 1200,
        currentAssignments: 1127,
        unitCost: "57.00",
        billingCycle: "monthly",
        features: ["Advanced Threat Protection", "Azure Information Protection P2", "Microsoft Defender for Office 365", "Power BI Pro"],
        prerequisites: ["Azure AD Premium P2"],
        compatiblePlatforms: ["windows", "mac", "ios", "android", "web"],
        lastSyncDate: new Date(),
        syncSource: "microsoft_graph",
        status: "active",
        brand: "blorcs"
      },
      {
        licenseName: "Microsoft 365 E3",
        licenseType: "user",
        category: "productivity",
        vendor: "Microsoft",
        sku: "ENTERPRISEPACK",
        productId: "6fd2c87f-b296-42f0-b197-1e91e994b900",
        servicePlanId: "c42b9cae-ea4f-4ab7-9717-81576235ccac",
        maxAssignments: 1000,
        currentAssignments: 930,
        unitCost: "36.00",
        billingCycle: "monthly",
        features: ["Office Apps", "Exchange Online Plan 2", "SharePoint Online", "Microsoft Teams"],
        prerequisites: [],
        compatiblePlatforms: ["windows", "mac", "ios", "android", "web"],
        lastSyncDate: new Date(),
        syncSource: "microsoft_graph",
        status: "active",
        brand: "all"
      },
      {
        licenseName: "Power BI Premium Per User",
        licenseType: "user",
        category: "analytics",
        vendor: "Microsoft",
        sku: "POWER_BI_PREMIUM_PER_USER",
        productId: "07699545-9485-468e-95b6-2fca3738be01",
        servicePlanId: "ded3d325-1bdc-453e-8432-5bac26d7a014",
        maxAssignments: 150,
        currentAssignments: 89,
        unitCost: "20.00",
        billingCycle: "monthly",
        features: ["Premium Analytics", "AI-powered insights", "Large dataset support", "Dataflows"],
        prerequisites: ["Power BI Pro"],
        compatiblePlatforms: ["windows", "web"],
        lastSyncDate: new Date(),
        syncSource: "microsoft_graph",
        status: "active",
        brand: "all"
      },

      // Adobe Creative Cloud Entitlements
      {
        licenseName: "Adobe Photoshop",
        licenseType: "user",
        category: "creative",
        vendor: "Adobe",
        sku: "PHSP",
        productId: "photoshop-cc-2024",
        maxAssignments: 180,
        currentAssignments: 165,
        unitCost: "22.99",
        billingCycle: "monthly",
        features: ["Advanced editing", "Neural filters", "Cloud sync", "Creative Cloud Libraries"],
        prerequisites: [],
        compatiblePlatforms: ["windows", "mac"],
        lastSyncDate: new Date(),
        syncSource: "manual",
        status: "active",
        brand: "shaypops"
      },
      {
        licenseName: "Adobe Illustrator",
        licenseType: "user",
        category: "creative",
        vendor: "Adobe",
        sku: "ILST",
        productId: "illustrator-cc-2024",
        maxAssignments: 180,
        currentAssignments: 157,
        unitCost: "22.99",
        billingCycle: "monthly",
        features: ["Vector graphics", "Typography tools", "3D effects", "Cloud sync"],
        prerequisites: [],
        compatiblePlatforms: ["windows", "mac"],
        lastSyncDate: new Date(),
        syncSource: "manual",
        status: "active",
        brand: "shaypops"
      },

      // Development Tools
      {
        licenseName: "GitHub Copilot Business",
        licenseType: "user",
        category: "development",
        vendor: "GitHub",
        sku: "COPILOT_BUSINESS",
        productId: "github-copilot-business",
        maxAssignments: 250,
        currentAssignments: 209,
        unitCost: "19.00",
        billingCycle: "monthly",
        features: ["AI code completion", "Code suggestions", "Security scanning", "Policy management"],
        prerequisites: ["GitHub Enterprise"],
        compatiblePlatforms: ["windows", "mac", "linux"],
        lastSyncDate: new Date(),
        syncSource: "api_sync",
        status: "active",
        brand: "technova"
      },
      {
        licenseName: "JetBrains IntelliJ IDEA Ultimate",
        licenseType: "user",
        category: "development",
        vendor: "JetBrains",
        sku: "II",
        productId: "intellij-idea-ultimate",
        maxAssignments: 120,
        currentAssignments: 102,
        unitCost: "649.00",
        billingCycle: "annual",
        features: ["Advanced debugging", "Framework support", "Database tools", "Web development"],
        prerequisites: [],
        compatiblePlatforms: ["windows", "mac", "linux"],
        lastSyncDate: new Date(),
        syncSource: "manual",
        status: "active",
        brand: "technova"
      }
    ];

    // Specialized Licenses - High-value, restricted licenses
    const specializedLicenses = [
      {
        licenseName: "Microsoft Defender for Office 365 Plan 2",
        licenseType: "enterprise",
        specialization: "advanced_threat_protection",
        vendor: "Microsoft",
        sku: "ATP_ENTERPRISE",
        productId: "microsoft-defender-office-365-p2",
        departmentRestriction: "IT Security, Executive",
        roleRestriction: "Security Admin, IT Admin",
        maxUsers: 50,
        currentUsers: 47,
        unitCost: "5.00",
        specialFeatures: ["Threat Investigation", "Automated Response", "Advanced Hunting", "Safe Attachments"],
        complianceRequirements: ["SOX", "GDPR", "HIPAA"],
        trainingRequired: true,
        approvalRequired: true,
        lastSyncDate: new Date(),
        syncSource: "microsoft_graph",
        status: "active",
        brand: "blorcs"
      },
      {
        licenseName: "Azure Information Protection Premium P2",
        licenseType: "premium",
        specialization: "data_protection",
        vendor: "Microsoft",
        sku: "RIGHTSMANAGEMENT_ADHOC",
        productId: "azure-information-protection-p2",
        departmentRestriction: "Legal, HR, Finance",
        roleRestriction: "Data Protection Officer, Compliance Manager",
        maxUsers: 25,
        currentUsers: 23,
        unitCost: "10.00",
        specialFeatures: ["Document Classification", "Data Loss Prevention", "Rights Management", "Advanced Analytics"],
        complianceRequirements: ["GDPR", "CCPA", "SOX"],
        trainingRequired: true,
        approvalRequired: true,
        lastSyncDate: new Date(),
        syncSource: "microsoft_graph",
        status: "active",
        brand: "all"
      },
      {
        licenseName: "Adobe Creative Cloud Enterprise",
        licenseType: "enterprise",
        specialization: "creative_enterprise",
        vendor: "Adobe",
        sku: "CCENT",
        productId: "creative-cloud-enterprise",
        departmentRestriction: "Creative, Marketing",
        roleRestriction: "Creative Director, Senior Designer",
        maxUsers: 30,
        currentUsers: 28,
        unitCost: "89.99",
        specialFeatures: ["Admin Console", "Storage Management", "Font Management", "Brand Kit"],
        complianceRequirements: ["Brand Guidelines", "Asset Management"],
        trainingRequired: false,
        approvalRequired: true,
        lastSyncDate: new Date(),
        syncSource: "manual",
        status: "active",
        brand: "shaypops"
      },
      {
        licenseName: "GitHub Advanced Security",
        licenseType: "premium",
        specialization: "code_security",
        vendor: "GitHub",
        sku: "GHAS",
        productId: "github-advanced-security",
        departmentRestriction: "Engineering, Security",
        roleRestriction: "Security Engineer, Lead Developer",
        maxUsers: 40,
        currentUsers: 35,
        unitCost: "49.00",
        specialFeatures: ["Secret Scanning", "Code Scanning", "Dependency Review", "Security Advisories"],
        complianceRequirements: ["SOC 2", "Security Standards"],
        trainingRequired: true,
        approvalRequired: true,
        lastSyncDate: new Date(),
        syncSource: "api_sync",
        status: "active",
        brand: "technova"
      }
    ];

    // Microsoft License KPIs for realistic tracking
    const microsoftKpis = [
      {
        tenantId: "blorcs-tenant-001",
        month: 1,
        year: 2025,
        totalLicenses: 2000,
        assignedLicenses: 1880,
        unassignedLicenses: 120,
        utilizationRate: "94.00",
        costPerMonth: "97200.00",
        costPerLicense: "51.70",
        activeUsers: 1847,
        inactiveUsers: 33,
        newAssignments: 25,
        revokedLicenses: 8,
        expiringLicenses: 15,
        m365E3Licenses: 753,
        m365E5Licenses: 1127,
        m365F3Licenses: 0,
        powerBiLicenses: 89,
        teamsLicenses: 1880,
        azureAdP1Licenses: 1500,
        azureAdP2Licenses: 500,
        intuneDeviceLicenses: 1200,
        defenderLicenses: 800,
        brand: "blorcs"
      },
      {
        tenantId: "shaypops-tenant-001",
        month: 1,
        year: 2025,
        totalLicenses: 400,
        assignedLicenses: 377,
        unassignedLicenses: 23,
        utilizationRate: "94.25",
        costPerMonth: "13572.00",
        costPerLicense: "36.00",
        activeUsers: 365,
        inactiveUsers: 12,
        newAssignments: 8,
        revokedLicenses: 3,
        expiringLicenses: 5,
        m365E3Licenses: 177,
        m365E5Licenses: 0,
        m365F3Licenses: 200,
        powerBiLicenses: 25,
        teamsLicenses: 377,
        azureAdP1Licenses: 300,
        azureAdP2Licenses: 50,
        intuneDeviceLicenses: 250,
        defenderLicenses: 100,
        brand: "shaypops"
      },
      {
        tenantId: "technova-tenant-001",
        month: 1,
        year: 2025,
        totalLicenses: 600,
        assignedLicenses: 565,
        unassignedLicenses: 35,
        utilizationRate: "94.17",
        costPerMonth: "32205.00",
        costPerLicense: "57.00",
        activeUsers: 548,
        inactiveUsers: 17,
        newAssignments: 12,
        revokedLicenses: 5,
        expiringLicenses: 8,
        m365E3Licenses: 300,
        m365E5Licenses: 265,
        m365F3Licenses: 0,
        powerBiLicenses: 45,
        teamsLicenses: 565,
        azureAdP1Licenses: 400,
        azureAdP2Licenses: 200,
        intuneDeviceLicenses: 350,
        defenderLicenses: 300,
        brand: "technova"
      }
    ];

    console.log("Creating corporate license packs...");
    for (const pack of licensePacks) {
      try {
        await storage.createCorporateLicensePack(pack);
        console.log(`✓ Created license pack: ${pack.packName} (${pack.brand})`);
      } catch (error) {
        console.log(`- License pack ${pack.packName} may already exist`);
      }
    }

    console.log("Creating entitlement licenses...");
    for (const license of entitlementLicenses) {
      try {
        await storage.createEntitlementLicense(license);
        console.log(`✓ Created entitlement license: ${license.licenseName} (${license.brand})`);
      } catch (error) {
        console.log(`- Entitlement license ${license.licenseName} may already exist`);
      }
    }

    console.log("Creating specialized licenses...");
    for (const license of specializedLicenses) {
      try {
        await storage.createSpecializedLicense(license);
        console.log(`✓ Created specialized license: ${license.licenseName} (${license.brand})`);
      } catch (error) {
        console.log(`- Specialized license ${license.licenseName} may already exist`);
      }
    }

    console.log("Creating Microsoft license KPIs...");
    for (const kpi of microsoftKpis) {
      try {
        await storage.createMicrosoftLicenseKpis(kpi);
        console.log(`✓ Created Microsoft KPI for: ${kpi.brand} tenant`);
      } catch (error) {
        console.log(`- Microsoft KPI for ${kpi.brand} may already exist`);
      }
    }

    console.log("✅ Successfully seeded comprehensive licensing structure");
    console.log(`📊 Seeded ${licensePacks.length} license packs, ${entitlementLicenses.length} entitlement licenses, ${specializedLicenses.length} specialized licenses, and ${microsoftKpis.length} KPI records`);

    return {
      licensePacks: licensePacks.length,
      entitlementLicenses: entitlementLicenses.length,
      specializedLicenses: specializedLicenses.length,
      microsoftKpis: microsoftKpis.length,
      brands: ["blorcs", "shaypops", "technova"],
      totalValue: licensePacks.reduce((sum, pack) => sum + parseFloat(pack.totalCost), 0)
    };

  } catch (error) {
    console.error("❌ Error seeding licensing structure:", error);
    throw error;
  }
}
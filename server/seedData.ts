import { storage } from "./storage";
import { corporates, divisions, departments, functions, personas } from "@shared/schema";

// Comprehensive organizational structure seeding for all brands
export async function seedOrganizationalStructure() {
  console.log("Seeding comprehensive organizational structure...");

  try {
    // Enhanced Corporates for all brands
    const corporateData = [
      {
        name: "Blorcs Corporation",
        description: "Global technology and retail enterprise focused on innovative solutions and customer experience",
        brand: "blorcs"
      },
      {
        name: "Shaypops Inc.",
        description: "Creative lifestyle brand specializing in sustainable fashion and modern living solutions",
        brand: "shaypops"
      },
      {
        name: "TechNova Enterprises",
        description: "Next-generation technology company driving digital transformation and AI innovation",
        brand: "technova"
      }
    ];

    console.log("Inserting corporate entities...");
    const insertedCorporates = [];
    for (const corporate of corporateData) {
      const inserted = await storage.createCorporate(corporate);
      insertedCorporates.push(inserted);
    }

    // Enhanced Divisions with comprehensive coverage
    const divisionData = [
      // Blorcs Corporation Divisions
      {
        name: "Technology Division",
        description: "Enterprise technology infrastructure, software development, and digital innovation",
        corporateId: insertedCorporates.find(c => c.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Operations Division",
        description: "Manufacturing, supply chain, logistics, and operational excellence",
        corporateId: insertedCorporates.find(c => c.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Commercial Division",
        description: "Sales, marketing, customer experience, and business development",
        corporateId: insertedCorporates.find(c => c.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Corporate Services",
        description: "Human resources, finance, legal, and administrative support",
        corporateId: insertedCorporates.find(c => c.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      
      // Shaypops Inc. Divisions
      {
        name: "Creative Division",
        description: "Design, brand management, content creation, and artistic direction",
        corporateId: insertedCorporates.find(c => c.brand === "shaypops")!.id,
        brand: "shaypops"
      },
      {
        name: "Production Division",
        description: "Manufacturing, quality control, and sustainable production processes",
        corporateId: insertedCorporates.find(c => c.brand === "shaypops")!.id,
        brand: "shaypops"
      },
      {
        name: "Marketing Division",
        description: "Digital marketing, social media, influencer relations, and brand promotion",
        corporateId: insertedCorporates.find(c => c.brand === "shaypops")!.id,
        brand: "shaypops"
      },
      {
        name: "Business Operations",
        description: "Finance, operations, human resources, and business intelligence",
        corporateId: insertedCorporates.find(c => c.brand === "shaypops")!.id,
        brand: "shaypops"
      },

      // TechNova Enterprises Divisions
      {
        name: "Research & Development",
        description: "Advanced research, AI development, and emerging technology innovation",
        corporateId: insertedCorporates.find(c => c.brand === "technova")!.id,
        brand: "technova"
      },
      {
        name: "Engineering Division",
        description: "Software engineering, cloud architecture, and technical infrastructure",
        corporateId: insertedCorporates.find(c => c.brand === "technova")!.id,
        brand: "technova"
      },
      {
        name: "Product Division",
        description: "Product management, user experience, and customer solutions",
        corporateId: insertedCorporates.find(c => c.brand === "technova")!.id,
        brand: "technova"
      },
      {
        name: "Enterprise Services",
        description: "Professional services, consulting, and enterprise solutions",
        corporateId: insertedCorporates.find(c => c.brand === "technova")!.id,
        brand: "technova"
      }
    ];

    console.log("Inserting divisions...");
    const insertedDivisions = [];
    for (const division of divisionData) {
      const inserted = await storage.createDivision(division);
      insertedDivisions.push(inserted);
    }

    // Comprehensive Departments for all brands
    const departmentData = [
      // Blorcs Technology Division Departments
      {
        name: "IT Infrastructure",
        description: "Enterprise servers, networking, cloud services, and infrastructure management",
        divisionId: insertedDivisions.find(d => d.name === "Technology Division" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Software Development",
        description: "Application development, web services, mobile apps, and software engineering",
        divisionId: insertedDivisions.find(d => d.name === "Technology Division" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Data & Analytics",
        description: "Business intelligence, data science, analytics platforms, and reporting",
        divisionId: insertedDivisions.find(d => d.name === "Technology Division" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Cybersecurity",
        description: "Information security, threat management, compliance, and risk assessment",
        divisionId: insertedDivisions.find(d => d.name === "Technology Division" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Digital Innovation",
        description: "Emerging technologies, AI/ML initiatives, and digital transformation",
        divisionId: insertedDivisions.find(d => d.name === "Technology Division" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },

      // Blorcs Operations Division Departments
      {
        name: "Manufacturing Operations",
        description: "Production planning, quality control, and manufacturing excellence",
        divisionId: insertedDivisions.find(d => d.name === "Operations Division" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Supply Chain Management",
        description: "Procurement, vendor relations, logistics, and inventory management",
        divisionId: insertedDivisions.find(d => d.name === "Operations Division" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Facilities Management",
        description: "Building operations, maintenance, security, and workplace services",
        divisionId: insertedDivisions.find(d => d.name === "Operations Division" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Quality Assurance",
        description: "Quality control, testing, compliance, and process improvement",
        divisionId: insertedDivisions.find(d => d.name === "Operations Division" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },

      // Blorcs Commercial Division Departments
      {
        name: "Sales Operations",
        description: "Sales management, account relations, and revenue operations",
        divisionId: insertedDivisions.find(d => d.name === "Commercial Division" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Marketing & Communications",
        description: "Brand marketing, communications, advertising, and public relations",
        divisionId: insertedDivisions.find(d => d.name === "Commercial Division" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Customer Experience",
        description: "Customer service, support operations, and experience management",
        divisionId: insertedDivisions.find(d => d.name === "Commercial Division" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Business Development",
        description: "Partnerships, strategic alliances, and market expansion",
        divisionId: insertedDivisions.find(d => d.name === "Commercial Division" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },

      // Blorcs Corporate Services Departments
      {
        name: "Human Resources",
        description: "Talent management, employee relations, and organizational development",
        divisionId: insertedDivisions.find(d => d.name === "Corporate Services" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Finance & Accounting",
        description: "Financial planning, accounting, treasury, and financial reporting",
        divisionId: insertedDivisions.find(d => d.name === "Corporate Services" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Legal & Compliance",
        description: "Legal affairs, regulatory compliance, and risk management",
        divisionId: insertedDivisions.find(d => d.name === "Corporate Services" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },
      {
        name: "Corporate Strategy",
        description: "Strategic planning, business analysis, and performance management",
        divisionId: insertedDivisions.find(d => d.name === "Corporate Services" && d.brand === "blorcs")!.id,
        brand: "blorcs"
      },

      // Shaypops Creative Division Departments
      {
        name: "Brand Management",
        description: "Brand strategy, creative direction, and brand identity management",
        divisionId: insertedDivisions.find(d => d.name === "Creative Division" && d.brand === "shaypops")!.id,
        brand: "shaypops"
      },
      {
        name: "Product Design",
        description: "Fashion design, product development, and design innovation",
        divisionId: insertedDivisions.find(d => d.name === "Creative Division" && d.brand === "shaypops")!.id,
        brand: "shaypops"
      },
      {
        name: "Content Creation",
        description: "Photography, videography, graphic design, and digital content",
        divisionId: insertedDivisions.find(d => d.name === "Creative Division" && d.brand === "shaypops")!.id,
        brand: "shaypops"
      },
      {
        name: "Art Direction",
        description: "Creative vision, artistic direction, and visual brand management",
        divisionId: insertedDivisions.find(d => d.name === "Creative Division" && d.brand === "shaypops")!.id,
        brand: "shaypops"
      },

      // Shaypops Production Division Departments
      {
        name: "Sustainable Manufacturing",
        description: "Eco-friendly production, sustainable materials, and green operations",
        divisionId: insertedDivisions.find(d => d.name === "Production Division" && d.brand === "shaypops")!.id,
        brand: "shaypops"
      },
      {
        name: "Quality Control",
        description: "Product testing, quality standards, and production excellence",
        divisionId: insertedDivisions.find(d => d.name === "Production Division" && d.brand === "shaypops")!.id,
        brand: "shaypops"
      },
      {
        name: "Sourcing & Materials",
        description: "Material sourcing, vendor management, and ethical procurement",
        divisionId: insertedDivisions.find(d => d.name === "Production Division" && d.brand === "shaypops")!.id,
        brand: "shaypops"
      },

      // Shaypops Marketing Division Departments
      {
        name: "Digital Marketing",
        description: "Online marketing, e-commerce, and digital advertising campaigns",
        divisionId: insertedDivisions.find(d => d.name === "Marketing Division" && d.brand === "shaypops")!.id,
        brand: "shaypops"
      },
      {
        name: "Social Media Marketing",
        description: "Social platforms, influencer relations, and community management",
        divisionId: insertedDivisions.find(d => d.name === "Marketing Division" && d.brand === "shaypops")!.id,
        brand: "shaypops"
      },
      {
        name: "Brand Communications",
        description: "Public relations, brand messaging, and communications strategy",
        divisionId: insertedDivisions.find(d => d.name === "Marketing Division" && d.brand === "shaypops")!.id,
        brand: "shaypops"
      },

      // Shaypops Business Operations Departments
      {
        name: "Financial Planning",
        description: "Budgeting, financial analysis, and business planning",
        divisionId: insertedDivisions.find(d => d.name === "Business Operations" && d.brand === "shaypops")!.id,
        brand: "shaypops"
      },
      {
        name: "Operations Management",
        description: "Business operations, process optimization, and efficiency management",
        divisionId: insertedDivisions.find(d => d.name === "Business Operations" && d.brand === "shaypops")!.id,
        brand: "shaypops"
      },
      {
        name: "People & Culture",
        description: "Human resources, culture development, and employee engagement",
        divisionId: insertedDivisions.find(d => d.name === "Business Operations" && d.brand === "shaypops")!.id,
        brand: "shaypops"
      },

      // TechNova R&D Division Departments
      {
        name: "AI Research",
        description: "Artificial intelligence research, machine learning, and AI innovation",
        divisionId: insertedDivisions.find(d => d.name === "Research & Development" && d.brand === "technova")!.id,
        brand: "technova"
      },
      {
        name: "Advanced Computing",
        description: "Quantum computing, edge computing, and advanced computational research",
        divisionId: insertedDivisions.find(d => d.name === "Research & Development" && d.brand === "technova")!.id,
        brand: "technova"
      },
      {
        name: "Innovation Labs",
        description: "Experimental projects, proof-of-concepts, and technology incubation",
        divisionId: insertedDivisions.find(d => d.name === "Research & Development" && d.brand === "technova")!.id,
        brand: "technova"
      },

      // TechNova Engineering Division Departments
      {
        name: "Cloud Engineering",
        description: "Cloud architecture, infrastructure, and distributed systems",
        divisionId: insertedDivisions.find(d => d.name === "Engineering Division" && d.brand === "technova")!.id,
        brand: "technova"
      },
      {
        name: "Platform Engineering",
        description: "Development platforms, tools, and engineering productivity",
        divisionId: insertedDivisions.find(d => d.name === "Engineering Division" && d.brand === "technova")!.id,
        brand: "technova"
      },
      {
        name: "Security Engineering",
        description: "Application security, infrastructure security, and security architecture",
        divisionId: insertedDivisions.find(d => d.name === "Engineering Division" && d.brand === "technova")!.id,
        brand: "technova"
      },

      // TechNova Product Division Departments
      {
        name: "Product Management",
        description: "Product strategy, roadmap planning, and product lifecycle management",
        divisionId: insertedDivisions.find(d => d.name === "Product Division" && d.brand === "technova")!.id,
        brand: "technova"
      },
      {
        name: "User Experience",
        description: "UX design, user research, and design systems",
        divisionId: insertedDivisions.find(d => d.name === "Product Division" && d.brand === "technova")!.id,
        brand: "technova"
      },
      {
        name: "Customer Solutions",
        description: "Solution architecture, customer integration, and technical consulting",
        divisionId: insertedDivisions.find(d => d.name === "Product Division" && d.brand === "technova")!.id,
        brand: "technova"
      },

      // TechNova Enterprise Services Departments
      {
        name: "Professional Services",
        description: "Technical consulting, implementation services, and customer success",
        divisionId: insertedDivisions.find(d => d.name === "Enterprise Services" && d.brand === "technova")!.id,
        brand: "technova"
      },
      {
        name: "Technical Support",
        description: "Customer support, technical assistance, and issue resolution",
        divisionId: insertedDivisions.find(d => d.name === "Enterprise Services" && d.brand === "technova")!.id,
        brand: "technova"
      },
      {
        name: "Business Development",
        description: "Sales engineering, partnerships, and enterprise relationships",
        divisionId: insertedDivisions.find(d => d.name === "Enterprise Services" && d.brand === "technova")!.id,
        brand: "technova"
      }
    ];

    console.log("Inserting departments...");
    const insertedDepartments = [];
    for (const department of departmentData) {
      const inserted = await storage.createDepartment(department);
      insertedDepartments.push(inserted);
    }

    // Comprehensive Personas with detailed permissions
    const personaData = [
      // Executive Level Personas
      {
        name: "Chief Executive Officer",
        description: "Executive leadership with full organizational authority and strategic decision-making",
        permissions: [
          "global.admin", "financial.view", "financial.approve", "strategic.planning", 
          "organizational.restructure", "executive.reports", "board.communications",
          "merger.acquisition", "policy.creation", "audit.oversight"
        ],
        brand: "all"
      },
      {
        name: "Chief Technology Officer",
        description: "Technology leadership with authority over IT strategy and digital transformation",
        permissions: [
          "technology.admin", "infrastructure.manage", "security.oversight", 
          "innovation.planning", "technology.budget", "vendor.technology",
          "architecture.decisions", "development.standards", "digital.transformation"
        ],
        brand: "all"
      },
      {
        name: "Chief Operating Officer",
        description: "Operations leadership with authority over business processes and efficiency",
        permissions: [
          "operations.admin", "process.optimization", "quality.management",
          "supply.chain", "manufacturing.oversight", "performance.metrics",
          "operational.budget", "vendor.operations", "facilities.management"
        ],
        brand: "all"
      },

      // Technology Personas
      {
        name: "IT Administrator",
        description: "System administration with full access to infrastructure and security management",
        permissions: [
          "system.admin", "user.management", "security.config", "backup.restore",
          "network.config", "server.management", "monitoring.setup", "incident.response"
        ],
        brand: "all"
      },
      {
        name: "Software Developer",
        description: "Development access with code repository and deployment permissions",
        permissions: [
          "code.repository", "development.environment", "testing.environment",
          "code.review", "bug.tracking", "feature.development", "documentation.write"
        ],
        brand: "all"
      },
      {
        name: "DevOps Engineer",
        description: "Infrastructure and deployment pipeline management with automation access",
        permissions: [
          "deployment.pipeline", "infrastructure.code", "monitoring.config",
          "performance.tuning", "automation.scripts", "cloud.management", "container.orchestration"
        ],
        brand: "all"
      },
      {
        name: "Data Scientist",
        description: "Data analysis and machine learning with access to data platforms and analytics",
        permissions: [
          "data.analysis", "machine.learning", "analytics.platform", "data.modeling",
          "statistical.analysis", "reporting.advanced", "data.visualization", "research.access"
        ],
        brand: "all"
      },
      {
        name: "Security Analyst",
        description: "Cybersecurity monitoring and incident response with security tool access",
        permissions: [
          "security.monitoring", "incident.investigation", "threat.analysis",
          "vulnerability.assessment", "compliance.audit", "security.reporting", "forensics.analysis"
        ],
        brand: "all"
      },

      // Business Operations Personas
      {
        name: "Project Manager",
        description: "Project coordination with task management and resource allocation permissions",
        permissions: [
          "project.management", "resource.allocation", "timeline.management",
          "stakeholder.communication", "budget.tracking", "risk.management", "reporting.project"
        ],
        brand: "all"
      },
      {
        name: "Business Analyst",
        description: "Business process analysis with requirements gathering and documentation access",
        permissions: [
          "requirements.gathering", "process.analysis", "documentation.business",
          "stakeholder.interviews", "workflow.design", "gap.analysis", "solution.design"
        ],
        brand: "all"
      },
      {
        name: "Quality Assurance Manager",
        description: "Quality control with testing oversight and compliance management",
        permissions: [
          "quality.testing", "compliance.monitoring", "process.audit",
          "quality.metrics", "improvement.initiatives", "standards.enforcement", "training.quality"
        ],
        brand: "all"
      },

      // Human Resources Personas
      {
        name: "HR Manager",
        description: "Human resources management with employee data and policy administration",
        permissions: [
          "employee.records", "hiring.process", "performance.reviews",
          "policy.administration", "benefits.management", "training.coordination", "hr.reporting"
        ],
        brand: "all"
      },
      {
        name: "Talent Acquisition Specialist",
        description: "Recruitment and hiring with candidate management and interview coordination",
        permissions: [
          "candidate.management", "interview.scheduling", "hiring.decisions",
          "recruiter.tools", "job.posting", "background.checks", "onboarding.initiation"
        ],
        brand: "all"
      },

      // Finance Personas
      {
        name: "Financial Controller",
        description: "Financial management with accounting oversight and budget administration",
        permissions: [
          "financial.reporting", "budget.management", "accounting.oversight",
          "audit.coordination", "tax.compliance", "financial.analysis", "cost.accounting"
        ],
        brand: "all"
      },
      {
        name: "Procurement Manager",
        description: "Vendor management with purchasing authority and contract negotiation",
        permissions: [
          "vendor.management", "contract.negotiation", "purchase.orders",
          "supplier.evaluation", "cost.analysis", "procurement.reporting", "vendor.onboarding"
        ],
        brand: "all"
      },

      // Sales & Marketing Personas
      {
        name: "Sales Manager",
        description: "Sales operations with customer relationship and revenue management",
        permissions: [
          "customer.management", "sales.pipeline", "revenue.tracking",
          "sales.reporting", "team.management", "commission.calculation", "territory.management"
        ],
        brand: "all"
      },
      {
        name: "Marketing Manager",
        description: "Marketing campaigns with brand management and promotional activities",
        permissions: [
          "campaign.management", "brand.guidelines", "marketing.analytics",
          "content.creation", "social.media", "event.management", "marketing.budget"
        ],
        brand: "all"
      },
      {
        name: "Customer Success Manager",
        description: "Customer relationship management with support coordination and satisfaction tracking",
        permissions: [
          "customer.support", "satisfaction.tracking", "relationship.management",
          "support.tickets", "customer.communication", "retention.strategies", "feedback.analysis"
        ],
        brand: "all"
      },

      // Specialized Brand Personas
      {
        name: "Brand Manager",
        description: "Brand strategy and creative direction for Shaypops creative initiatives",
        permissions: [
          "brand.strategy", "creative.direction", "marketing.campaigns",
          "content.approval", "brand.guidelines", "creative.assets", "influencer.relations"
        ],
        brand: "shaypops"
      },
      {
        name: "AI Research Scientist",
        description: "Advanced AI research and development for TechNova innovation projects",
        permissions: [
          "research.projects", "ai.development", "machine.learning.advanced",
          "data.science.advanced", "research.publication", "patent.filing", "innovation.funding"
        ],
        brand: "technova"
      },
      {
        name: "Manufacturing Supervisor",
        description: "Production oversight with quality control and operations management",
        permissions: [
          "production.oversight", "quality.control", "equipment.management",
          "safety.compliance", "production.metrics", "inventory.management", "workforce.scheduling"
        ],
        brand: "blorcs"
      },

      // Entry Level Personas
      {
        name: "Junior Developer",
        description: "Development support with limited code access and supervised project work",
        permissions: [
          "code.read", "bug.reporting", "testing.manual", "documentation.read",
          "development.environment.limited", "code.review.participate", "learning.resources"
        ],
        brand: "all"
      },
      {
        name: "Help Desk Technician",
        description: "Basic IT support with user assistance and ticket management",
        permissions: [
          "user.support", "ticket.management", "basic.troubleshooting",
          "password.reset", "hardware.basic", "software.installation.basic", "knowledge.base"
        ],
        brand: "all"
      },
      {
        name: "Content Creator",
        description: "Creative content development with social media and marketing asset creation",
        permissions: [
          "content.creation", "social.media.posting", "graphic.design",
          "photography.basic", "brand.assets", "content.calendar", "creative.collaboration"
        ],
        brand: "shaypops"
      },

      // Guest/External Personas
      {
        name: "Vendor Representative",
        description: "External vendor access with limited system permissions for collaboration",
        permissions: [
          "vendor.portal", "contract.view", "communication.limited",
          "documentation.vendor", "project.collaboration.limited", "support.vendor"
        ],
        brand: "all"
      },
      {
        name: "Consultant",
        description: "External consultant with project-specific access and collaboration tools",
        permissions: [
          "project.access.specific", "documentation.read", "collaboration.tools",
          "reporting.limited", "communication.project", "knowledge.sharing"
        ],
        brand: "all"
      },
      {
        name: "Auditor",
        description: "Compliance and audit access with read-only permissions for regulatory review",
        permissions: [
          "audit.access", "compliance.view", "documentation.audit",
          "financial.review", "process.review", "security.audit", "reporting.compliance"
        ],
        brand: "all"
      }
    ];

    console.log("Inserting personas...");
    for (const persona of personaData) {
      await storage.createPersona(persona);
    }

    console.log("✅ Successfully seeded comprehensive organizational structure");
    console.log(`📊 Created ${corporateData.length} corporates, ${divisionData.length} divisions, ${departmentData.length} departments, and ${personaData.length} personas`);

  } catch (error) {
    console.error("❌ Error seeding organizational structure:", error);
    throw error;
  }
}

// Function to clear existing organizational data (for re-seeding)
export async function clearOrganizationalData() {
  console.log("Clearing existing organizational data...");
  
  try {
    // Get all data and delete in reverse dependency order
    const allPersonas = await storage.getPersonas();
    const allFunctions = await storage.getFunctions();
    const allDepartments = await storage.getDepartments();
    const allDivisions = await storage.getDivisions();
    const allCorporates = await storage.getCorporates();
    
    // Delete personas
    for (const persona of allPersonas) {
      await storage.deletePersona(persona.id);
    }
    
    // Delete functions
    for (const func of allFunctions) {
      await storage.deleteFunction(func.id);
    }
    
    // Delete departments
    for (const dept of allDepartments) {
      await storage.deleteDepartment(dept.id);
    }
    
    // Delete divisions
    for (const div of allDivisions) {
      await storage.deleteDivision(div.id);
    }
    
    // Delete corporates
    for (const corp of allCorporates) {
      await storage.deleteCorporate(corp.id);
    }
    
    console.log("✅ Cleared existing organizational data");
  } catch (error) {
    console.error("❌ Error clearing organizational data:", error);
    throw error;
  }
}
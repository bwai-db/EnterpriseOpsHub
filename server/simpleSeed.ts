import { storage } from "./storage";

// Simple seeding function that works with the current storage system
export async function seedEnhancedOrganization() {
  console.log("Seeding enhanced organizational structure...");

  try {
    // Enhanced departments for each brand
    const departmentSeeds = [
      // Blorcs Corporation Departments
      { name: "IT Infrastructure", description: "Enterprise servers, networking, cloud services, and infrastructure management", brand: "blorcs" },
      { name: "Software Development", description: "Application development, web services, mobile apps, and software engineering", brand: "blorcs" },
      { name: "Data & Analytics", description: "Business intelligence, data science, analytics platforms, and reporting", brand: "blorcs" },
      { name: "Cybersecurity", description: "Information security, threat management, compliance, and risk assessment", brand: "blorcs" },
      { name: "Digital Innovation", description: "Emerging technologies, AI/ML initiatives, and digital transformation", brand: "blorcs" },
      { name: "Manufacturing Operations", description: "Production planning, quality control, and manufacturing excellence", brand: "blorcs" },
      { name: "Supply Chain Management", description: "Procurement, vendor relations, logistics, and inventory management", brand: "blorcs" },
      { name: "Facilities Management", description: "Building operations, maintenance, security, and workplace services", brand: "blorcs" },
      { name: "Quality Assurance", description: "Quality control, testing, compliance, and process improvement", brand: "blorcs" },
      { name: "Sales Operations", description: "Sales management, account relations, and revenue operations", brand: "blorcs" },
      { name: "Marketing & Communications", description: "Brand marketing, communications, advertising, and public relations", brand: "blorcs" },
      { name: "Customer Experience", description: "Customer service, support operations, and experience management", brand: "blorcs" },
      { name: "Business Development", description: "Partnerships, strategic alliances, and market expansion", brand: "blorcs" },
      { name: "Human Resources", description: "Talent management, employee relations, and organizational development", brand: "blorcs" },
      { name: "Finance & Accounting", description: "Financial planning, accounting, treasury, and financial reporting", brand: "blorcs" },
      { name: "Legal & Compliance", description: "Legal affairs, regulatory compliance, and risk management", brand: "blorcs" },

      // Shaypops Inc. Departments
      { name: "Brand Management", description: "Brand strategy, creative direction, and brand identity management", brand: "shaypops" },
      { name: "Product Design", description: "Fashion design, product development, and design innovation", brand: "shaypops" },
      { name: "Content Creation", description: "Photography, videography, graphic design, and digital content", brand: "shaypops" },
      { name: "Art Direction", description: "Creative vision, artistic direction, and visual brand management", brand: "shaypops" },
      { name: "Sustainable Manufacturing", description: "Eco-friendly production, sustainable materials, and green operations", brand: "shaypops" },
      { name: "Quality Control", description: "Product testing, quality standards, and production excellence", brand: "shaypops" },
      { name: "Sourcing & Materials", description: "Material sourcing, vendor management, and ethical procurement", brand: "shaypops" },
      { name: "Digital Marketing", description: "Online marketing, e-commerce, and digital advertising campaigns", brand: "shaypops" },
      { name: "Social Media Marketing", description: "Social platforms, influencer relations, and community management", brand: "shaypops" },
      { name: "Brand Communications", description: "Public relations, brand messaging, and communications strategy", brand: "shaypops" },
      { name: "Financial Planning", description: "Budgeting, financial analysis, and business planning", brand: "shaypops" },
      { name: "Operations Management", description: "Business operations, process optimization, and efficiency management", brand: "shaypops" },
      { name: "People & Culture", description: "Human resources, culture development, and employee engagement", brand: "shaypops" },

      // TechNova Enterprises Departments
      { name: "AI Research", description: "Artificial intelligence research, machine learning, and AI innovation", brand: "technova" },
      { name: "Advanced Computing", description: "Quantum computing, edge computing, and advanced computational research", brand: "technova" },
      { name: "Innovation Labs", description: "Experimental projects, proof-of-concepts, and technology incubation", brand: "technova" },
      { name: "Cloud Engineering", description: "Cloud architecture, infrastructure, and distributed systems", brand: "technova" },
      { name: "Platform Engineering", description: "Development platforms, tools, and engineering productivity", brand: "technova" },
      { name: "Security Engineering", description: "Application security, infrastructure security, and security architecture", brand: "technova" },
      { name: "Product Management", description: "Product strategy, roadmap planning, and product lifecycle management", brand: "technova" },
      { name: "User Experience", description: "UX design, user research, and design systems", brand: "technova" },
      { name: "Customer Solutions", description: "Solution architecture, customer integration, and technical consulting", brand: "technova" },
      { name: "Professional Services", description: "Technical consulting, implementation services, and customer success", brand: "technova" },
      { name: "Technical Support", description: "Customer support, technical assistance, and issue resolution", brand: "technova" },
      { name: "Business Development", description: "Sales engineering, partnerships, and enterprise relationships", brand: "technova" }
    ];

    // Enhanced personas with comprehensive permissions
    const personaSeeds = [
      // Executive Level Personas
      {
        name: "Chief Executive Officer",
        description: "Executive leadership with full organizational authority and strategic decision-making",
        permissions: ["global.admin", "financial.view", "financial.approve", "strategic.planning", "organizational.restructure", "executive.reports"],
        brand: "all"
      },
      {
        name: "Chief Technology Officer",
        description: "Technology leadership with authority over IT strategy and digital transformation",
        permissions: ["technology.admin", "infrastructure.manage", "security.oversight", "innovation.planning", "technology.budget", "vendor.technology"],
        brand: "all"
      },
      {
        name: "Chief Operating Officer",
        description: "Operations leadership with authority over business processes and efficiency",
        permissions: ["operations.admin", "process.optimization", "quality.management", "supply.chain", "manufacturing.oversight", "performance.metrics"],
        brand: "all"
      },

      // Technology Personas
      {
        name: "IT Administrator",
        description: "System administration with full access to infrastructure and security management",
        permissions: ["system.admin", "user.management", "security.config", "backup.restore", "network.config", "server.management"],
        brand: "all"
      },
      {
        name: "Software Developer",
        description: "Development access with code repository and deployment permissions",
        permissions: ["code.repository", "development.environment", "testing.environment", "code.review", "bug.tracking", "feature.development"],
        brand: "all"
      },
      {
        name: "DevOps Engineer",
        description: "Infrastructure and deployment pipeline management with automation access",
        permissions: ["deployment.pipeline", "infrastructure.code", "monitoring.config", "performance.tuning", "automation.scripts", "cloud.management"],
        brand: "all"
      },
      {
        name: "Data Scientist",
        description: "Data analysis and machine learning with access to data platforms and analytics",
        permissions: ["data.analysis", "machine.learning", "analytics.platform", "data.modeling", "statistical.analysis", "reporting.advanced"],
        brand: "all"
      },
      {
        name: "Security Analyst",
        description: "Cybersecurity monitoring and incident response with security tool access",
        permissions: ["security.monitoring", "incident.investigation", "threat.analysis", "vulnerability.assessment", "compliance.audit", "security.reporting"],
        brand: "all"
      },

      // Business Operations Personas
      {
        name: "Project Manager",
        description: "Project coordination with task management and resource allocation permissions",
        permissions: ["project.management", "resource.allocation", "timeline.management", "stakeholder.communication", "budget.tracking", "risk.management"],
        brand: "all"
      },
      {
        name: "Business Analyst",
        description: "Business process analysis with requirements gathering and documentation access",
        permissions: ["requirements.gathering", "process.analysis", "documentation.business", "stakeholder.interviews", "workflow.design", "gap.analysis"],
        brand: "all"
      },
      {
        name: "Quality Assurance Manager",
        description: "Quality control with testing oversight and compliance management",
        permissions: ["quality.testing", "compliance.monitoring", "process.audit", "quality.metrics", "improvement.initiatives", "standards.enforcement"],
        brand: "all"
      },

      // Human Resources Personas
      {
        name: "HR Manager",
        description: "Human resources management with employee data and policy administration",
        permissions: ["employee.records", "hiring.process", "performance.reviews", "policy.administration", "benefits.management", "training.coordination"],
        brand: "all"
      },
      {
        name: "Talent Acquisition Specialist",
        description: "Recruitment and hiring with candidate management and interview coordination",
        permissions: ["candidate.management", "interview.scheduling", "hiring.decisions", "recruiter.tools", "job.posting", "background.checks"],
        brand: "all"
      },

      // Finance Personas
      {
        name: "Financial Controller",
        description: "Financial management with accounting oversight and budget administration",
        permissions: ["financial.reporting", "budget.management", "accounting.oversight", "audit.coordination", "tax.compliance", "financial.analysis"],
        brand: "all"
      },
      {
        name: "Procurement Manager",
        description: "Vendor management with purchasing authority and contract negotiation",
        permissions: ["vendor.management", "contract.negotiation", "purchase.orders", "supplier.evaluation", "cost.analysis", "procurement.reporting"],
        brand: "all"
      },

      // Sales & Marketing Personas
      {
        name: "Sales Manager",
        description: "Sales operations with customer relationship and revenue management",
        permissions: ["customer.management", "sales.pipeline", "revenue.tracking", "sales.reporting", "team.management", "commission.calculation"],
        brand: "all"
      },
      {
        name: "Marketing Manager",
        description: "Marketing campaigns with brand management and promotional activities",
        permissions: ["campaign.management", "brand.guidelines", "marketing.analytics", "content.creation", "social.media", "event.management"],
        brand: "all"
      },
      {
        name: "Customer Success Manager",
        description: "Customer relationship management with support coordination and satisfaction tracking",
        permissions: ["customer.support", "satisfaction.tracking", "relationship.management", "support.tickets", "customer.communication", "retention.strategies"],
        brand: "all"
      },

      // Specialized Brand Personas
      {
        name: "Brand Manager",
        description: "Brand strategy and creative direction for Shaypops creative initiatives",
        permissions: ["brand.strategy", "creative.direction", "marketing.campaigns", "content.approval", "brand.guidelines", "creative.assets"],
        brand: "shaypops"
      },
      {
        name: "AI Research Scientist",
        description: "Advanced AI research and development for TechNova innovation projects",
        permissions: ["research.projects", "ai.development", "machine.learning.advanced", "data.science.advanced", "research.publication", "patent.filing"],
        brand: "technova"
      },
      {
        name: "Manufacturing Supervisor",
        description: "Production oversight with quality control and operations management",
        permissions: ["production.oversight", "quality.control", "equipment.management", "safety.compliance", "production.metrics", "inventory.management"],
        brand: "blorcs"
      },

      // Entry Level Personas
      {
        name: "Junior Developer",
        description: "Development support with limited code access and supervised project work",
        permissions: ["code.read", "bug.reporting", "testing.manual", "documentation.read", "development.environment.limited", "code.review.participate"],
        brand: "all"
      },
      {
        name: "Help Desk Technician",
        description: "Basic IT support with user assistance and ticket management",
        permissions: ["user.support", "ticket.management", "basic.troubleshooting", "password.reset", "hardware.basic", "software.installation.basic"],
        brand: "all"
      },
      {
        name: "Content Creator",
        description: "Creative content development with social media and marketing asset creation",
        permissions: ["content.creation", "social.media.posting", "graphic.design", "photography.basic", "brand.assets", "content.calendar"],
        brand: "shaypops"
      },

      // External Personas
      {
        name: "Vendor Representative",
        description: "External vendor access with limited system permissions for collaboration",
        permissions: ["vendor.portal", "contract.view", "communication.limited", "documentation.vendor", "project.collaboration.limited"],
        brand: "all"
      },
      {
        name: "Consultant",
        description: "External consultant with project-specific access and collaboration tools",
        permissions: ["project.access.specific", "documentation.read", "collaboration.tools", "reporting.limited", "communication.project"],
        brand: "all"
      }
    ];

    console.log("Creating enhanced departments...");
    for (const dept of departmentSeeds) {
      try {
        await storage.createDepartment(dept);
        console.log(`✓ Created department: ${dept.name} (${dept.brand})`);
      } catch (error) {
        console.log(`- Department ${dept.name} may already exist`);
      }
    }

    console.log("Creating enhanced personas...");
    for (const persona of personaSeeds) {
      try {
        await storage.createPersona(persona);
        console.log(`✓ Created persona: ${persona.name} (${persona.brand})`);
      } catch (error) {
        console.log(`- Persona ${persona.name} may already exist`);
      }
    }

    console.log("✅ Successfully seeded enhanced organizational structure");
    console.log(`📊 Seeded ${departmentSeeds.length} departments and ${personaSeeds.length} personas across all brands`);

    return {
      departments: departmentSeeds.length,
      personas: personaSeeds.length,
      brands: ["blorcs", "shaypops", "technova"]
    };

  } catch (error) {
    console.error("❌ Error seeding organizational structure:", error);
    throw error;
  }
}
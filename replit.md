# Enterprise Operations Platform

## Overview

This is a full-stack enterprise operations management platform built with React, TypeScript, Express.js, and PostgreSQL. The application provides comprehensive management tools for IT operations including vendor management, licensing, cloud services, ITIL processes, supply chain, security compliance, and HR services across multiple business brands (Blorcs and Shaypops).

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom alias configuration

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Style**: RESTful API with JSON responses
- **Middleware**: Custom logging, error handling, and JSON parsing
- **Build Tool**: esbuild for production bundling

### Database Architecture
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Migrations**: Drizzle Kit for schema management
- **Schema Location**: `shared/schema.ts` for type safety across frontend/backend

## Key Components

### Data Models
The system manages fourteen core entities with hierarchical organizational structure:
1. **Users**: Enhanced user management with EntraID integration
2. **Corporates**: Top-level corporate entities (Blorcs Corporation, Shaypops Inc.)
3. **Divisions**: Organizational divisions under corporate entities (Technology, Operations, Marketing, HR)
4. **Departments**: Departments within divisions (IT Infrastructure, Software Development, etc.)
5. **Functions**: Specific job functions within departments
6. **Personas**: Role-based permissions and access control
6. **Vendors**: Software, hardware, cloud, and manufacturing vendor tracking
7. **Licenses**: Software license lifecycle management
8. **Incidents**: ITIL incident management system
9. **Cloud Services**: Cloud infrastructure monitoring
10. **Stores**: Physical retail store locations and management
11. **Store Inventory**: Product inventory tracking per store location
12. **Store Sales**: Transaction records and sales performance tracking
13. **Store Staff**: Employee management for retail locations

### Multi-Brand Support
- **Brand Filtering**: All entities support brand-specific filtering (Blorcs, Shaypops, All)
- **Isolated Data**: Each brand maintains separate operational views
- **Unified Interface**: Single application serves multiple business units

### UI Component System
- **Design System**: Microsoft-inspired theme with custom CSS variables
- **Component Library**: shadcn/ui components with Radix UI primitives
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: ARIA compliance through Radix UI components

## Data Flow

### Request Flow
1. Client initiates request through React components
2. TanStack Query manages caching and request state
3. Custom `apiRequest` utility handles HTTP communication
4. Express.js routes process requests with middleware chain
5. Storage layer abstracts database operations
6. Drizzle ORM handles PostgreSQL interactions

### State Management
- **Server State**: TanStack Query with automatic caching and invalidation
- **Form State**: React Hook Form with Zod schema validation
- **UI State**: React hooks for component-level state
- **Brand State**: Global brand selection managed in App component

### Error Handling
- **Client-side**: React Query error boundaries and toast notifications
- **Server-side**: Express error middleware with status code handling
- **Validation**: Zod schemas shared between frontend and backend

## External Dependencies

### Core Framework Dependencies
- React ecosystem (React, ReactDOM, React Hook Form)
- Express.js with Node.js runtime
- TypeScript for type safety
- Vite for development and build tooling

### Database and ORM
- `@neondatabase/serverless`: PostgreSQL serverless driver
- `drizzle-orm`: TypeScript-first ORM
- `drizzle-kit`: Schema migration tool

### UI and Styling
- Tailwind CSS for utility-first styling
- Radix UI primitives for accessible components
- Lucide React for consistent iconography
- shadcn/ui component system

### Development Tools
- TSX for TypeScript execution
- ESBuild for production bundling
- PostCSS for CSS processing
- Replit development environment integration

## Deployment Strategy

### Development Environment
- **Local Development**: `npm run dev` starts TSX server with hot reload
- **Database**: Drizzle Kit manages schema changes with `npm run db:push`
- **Type Checking**: `npm run check` validates TypeScript compilation

### Production Build
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: ESBuild bundles Express server to `dist/index.js`
- **Database**: Environment variable `DATABASE_URL` configures PostgreSQL connection
- **Deployment**: `npm start` runs production server from bundled code

### Environment Configuration
- **Development**: NODE_ENV=development enables development features
- **Production**: NODE_ENV=production optimizes for performance
- **Database**: DATABASE_URL environment variable required for connection
- **Replit Integration**: Special handling for Replit development environment

## Changelog

```
Changelog:
- July 05, 2025. Initial setup with React/TypeScript frontend and Node.js backend
- July 05, 2025. Added PostgreSQL database integration with Drizzle ORM
- July 05, 2025. Replaced in-memory storage with persistent database storage
- July 05, 2025. Added organizational structure (divisions, departments, functions, personas)
- July 05, 2025. Enhanced user management with EntraID integration and synchronization
- July 05, 2025. Created People & Organization page with user directory and org structure
- July 05, 2025. Added comprehensive retail operations management with stores, inventory, sales, and staff tracking
- July 05, 2025. Implemented ITIL Service Management with CMDB integration for M365, Azure, Intune, Hybrid Endpoint, Identity, Print, CAD Workstation, and 3D Printing services
- July 05, 2025. Added interactive service dependency mapping with visual relationship tracking and impact analysis capabilities
- July 05, 2025. Added Corporate organizational level above Divisions to enable hierarchical brand separation between Blorcs and Shaypops with complete CRUD operations and UI integration
- July 05, 2025. Implemented comprehensive vendor agreement tracking system with NDA, MSA, SOW, DPA, SLA and other agreement types with status monitoring, approval workflows, and legal compliance tracking
- July 05, 2025. Enhanced Integration Center with Microsoft Graph API, GitHub API, and ServiceNow API libraries including endpoints, credentials, and configuration management
- July 05, 2025. Expanded CMDB with 50+ additional configuration items covering enterprise infrastructure, cloud services, security devices, and development tools
- July 05, 2025. Redesigned Service Management with comprehensive KPI dashboards on each tab showing real-time metrics, trends, and operational insights
- July 05, 2025. Re-mapped service dependencies with 34 comprehensive relationships showing realistic enterprise service integrations and infrastructure dependencies
- July 05, 2025. Added comprehensive secure baseline configurations to all 61 configuration items covering encryption, access control, monitoring, compliance, and operational security standards
- July 05, 2025. Generated DSC-compatible JSON configuration details for all configuration items supporting PowerShell Desired State Configuration for automated compliance enforcement and drift detection
- July 06, 2025. Implemented comprehensive manufacturing management system with manufacturers, products, production orders, manufacturing metrics, suppliers, and supply chain KPIs to drive advanced supply chain management analytics and operational insights
- July 06, 2025. Enhanced licensing operations platform with comprehensive enterprise license seeding including Microsoft 365 E5/E3/F3, Power Platform Premium, Adobe Creative Cloud All Apps, specialized compliance licenses, and realistic Microsoft Graph API integration with advanced KPI calculations and cost modeling
- July 06, 2025. Completely redesigned licensing management interface with AI-powered insights, comprehensive KPIs dashboard, cost optimization recommendations, utilization analytics, compliance monitoring, and intelligent license management across 5 specialized tabs with real-time metrics and automated optimization suggestions
- July 06, 2025. Implemented AI-powered license redistribution system with intelligent recommendations for license downgrades, reassignments, and removals based on usage patterns, saving up to $146K annually with comprehensive tracking of affected users and business impact assessment
- July 07, 2025. Redesigned People & Organization users tab with comprehensive workforce analytics KPIs including total workforce metrics (2,847 employees), EntraID sync rates, department/location distribution charts, and enhanced user directory with real-time sync activity dashboard
- July 07, 2025. Developed comprehensive user detail modal with 6 specialized tabs: Overview (key metrics, recent activity, cost summary), Licenses (software entitlements with utilization tracking), Devices (assigned hardware with compliance status), Service Tickets (incidents/requests/changes), Profile (personal/organizational/employment details), and AI Insights (intelligent professional introduction with utilization analysis and optimization recommendations)
- July 07, 2025. Created complete GitHub deployment package with comprehensive README.md, .gitignore, LICENSE, .env.example, automated setup.sh script, and detailed deployment instructions for multiple platforms including Vercel, Railway, DigitalOcean, and self-hosted VPS options
- July 08, 2025. Implemented comprehensive Azure deployment infrastructure using Bicep templates with azd (Azure Developer CLI) support including intelligent App Service Plan auto-scaling, SQL Managed Instance with 4 vCores, API Management with rate limiting, Application Insights monitoring, Key Vault secrets management, Virtual Network isolation, and automated Entra ID SSO configuration with app registration and SAML support
- July 08, 2025. Added comprehensive Azure OpenAI Service deployment with environment-specific configurations: Dev (GPT-4o, GPT-3.5-turbo, embeddings with public access) and Prod (same models plus DALL-E 3 with private endpoints and VNet integration), including intelligent content filtering, diagnostic monitoring, and automated Key Vault secret management for seamless AI-powered documentation features
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
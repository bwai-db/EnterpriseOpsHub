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
The system manages five core entities:
1. **Users**: Authentication and user management
2. **Vendors**: Software, hardware, cloud, and manufacturing vendor tracking
3. **Licenses**: Software license lifecycle management
4. **Incidents**: ITIL incident management system
5. **Cloud Services**: Cloud infrastructure monitoring

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
- July 05, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```
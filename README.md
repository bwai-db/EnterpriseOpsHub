# Enterprise Operations Platform

A comprehensive enterprise IT operations management platform that enables global retail ecosystem management through intelligent business process integration and geospatial visualization.

## 🏢 Overview

This full-stack application provides enterprise-grade management tools for:

- **Workforce Management**: 2,847+ employees across 23 global locations
- **Licensing Operations**: AI-powered Microsoft 365, Power Platform, Adobe license optimization
- **ITIL Service Management**: Comprehensive CMDB with 61+ configuration items
- **Supply Chain & Manufacturing**: End-to-end production and supplier management
- **Retail Operations**: 18+ store locations with inventory and staff tracking
- **Facilities Management**: Global office locations and project tracking
- **Vendor & Security**: Agreement tracking, compliance monitoring

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for server state management
- **Wouter** for client-side routing
- **React Hook Form** with Zod validation
- **Vite** build system

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Neon serverless driver
- **Drizzle ORM** with TypeScript schema
- **RESTful API** architecture

### Development
- **TypeScript** for type safety
- **ESBuild** for production bundling
- **PostCSS** for CSS processing

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud instance)
- **Git** for version control

## 🚀 Quick Start

### Azure Deployment (Recommended)

Deploy directly to Azure with enterprise-grade infrastructure:

```bash
# Install Azure Developer CLI
curl -fsSL https://aka.ms/install-azd.sh | bash

# Clone and setup
git clone https://github.com/yourusername/enterprise-operations-platform.git
cd enterprise-operations-platform

# Prepare for Azure deployment
./azd-scripts/prepare-deployment.sh

# Deploy to Azure (takes 5-7 hours on first run due to SQL Managed Instance)
azd up
```

**Azure Infrastructure Includes:**
- **App Service Plan**: Intelligent auto-scaling (P1v3 tier)
- **SQL Managed Instance**: Enterprise PostgreSQL with 4 vCores
- **API Management**: Rate limiting, monitoring, API gateway
- **Application Insights**: Comprehensive monitoring and analytics
- **Key Vault**: Secure secret management
- **Virtual Network**: Secure network isolation
- **Entra ID SSO**: Single sign-on with app registration

> 📖 **Detailed Azure guide**: See [deploy-azure.md](./deploy-azure.md) for comprehensive deployment instructions

### Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/enterprise-operations-platform.git
cd enterprise-operations-platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL locally
2. Create a new database:
```sql
CREATE DATABASE enterprise_ops;
```

#### Option B: Cloud Database (Recommended)
- **Neon**: Create account at [neon.tech](https://neon.tech)
- **Supabase**: Create account at [supabase.com](https://supabase.com)
- **Railway**: Create account at [railway.app](https://railway.app)

### 4. Environment Configuration

Create a `.env` file in the project root:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"

# Alternative format for local PostgreSQL
# DATABASE_URL="postgresql://username:password@localhost:5432/enterprise_ops"

# Database Connection Details (automatically extracted from DATABASE_URL)
PGHOST=your-host
PGPORT=5432
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-database

# Node Environment
NODE_ENV=development

# Optional: OpenAI API for AI Insights
OPENAI_API_KEY=your-openai-api-key
```

### 5. Database Schema Setup

Initialize the database with the application schema:

```bash
# Push schema to database
npm run db:push

# Verify schema deployment
npm run db:studio
```

### 6. Start Development Server

```bash
# Start both frontend and backend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5000 (serves both frontend and backend)
- **Database Studio**: http://localhost:4983 (if using `db:studio`)

## 📁 Project Structure

```
enterprise-operations-platform/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── lib/           # Utilities and configurations
│   │   └── index.css      # Global styles
├── server/                # Express backend application
│   ├── db.ts             # Database connection
│   ├── storage.ts        # Data access layer
│   ├── routes.ts         # API endpoints
│   ├── index.ts          # Server entry point
│   └── vite.ts           # Vite development server
├── shared/               # Shared TypeScript definitions
│   └── schema.ts         # Drizzle database schema
├── package.json          # Dependencies and scripts
├── drizzle.config.ts     # Database migration config
├── vite.config.ts        # Frontend build configuration
├── tailwind.config.ts    # Styling configuration
└── tsconfig.json         # TypeScript configuration
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run check           # TypeScript type checking

# Database
npm run db:push         # Push schema changes to database
npm run db:studio       # Open database management interface
npm run db:migrate      # Run database migrations (if needed)

# Production
npm run build           # Build for production
npm start              # Start production server

# Utilities
npm run lint           # Code linting (if configured)
npm test              # Run tests (if configured)
```

## 🌐 Deployment

### Production Environment Variables

Create a `.env.production` file:

```env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
OPENAI_API_KEY="your-production-openai-key"
```

### Deployment Platforms

#### Vercel (Recommended for Frontend + Serverless)
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Configure environment variables in Vercel dashboard

#### Railway (Full-Stack Deployment)
1. Create account at [railway.app](https://railway.app)
2. Connect GitHub repository
3. Configure environment variables
4. Deploy automatically on push

#### DigitalOcean App Platform
1. Create account at [digitalocean.com](https://digitalocean.com)
2. Create new app from GitHub repository
3. Configure build and environment settings

#### Self-Hosted VPS
```bash
# Clone repository
git clone https://github.com/yourusername/enterprise-operations-platform.git
cd enterprise-operations-platform

# Install dependencies
npm install

# Build for production
npm run build

# Start with PM2 (process manager)
npm install -g pm2
pm2 start npm --name "enterprise-ops" -- start
pm2 startup
pm2 save
```

## 🔐 Security Configuration

### Database Security
- Use SSL/TLS connections in production
- Implement connection pooling
- Regular security updates
- Backup strategy implementation

### Application Security
- Environment variable protection
- CORS configuration for production domains
- Rate limiting implementation
- Authentication middleware (if adding auth)

### Recommended Security Headers
Add to your production server:
```javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

## 🎯 Core Features

### 1. Holistic Business Dashboard
- **2,847 employees** across global operations
- **Real-time KPIs** for all business units
- **Performance trends** and health metrics
- **Compliance scoring** and risk assessment

### 2. AI-Powered Licensing Management
- **$245K monthly** license cost tracking
- **78.4% average** utilization monitoring
- **Intelligent redistribution** recommendations
- **Microsoft 365**, Power Platform, Adobe license optimization

### 3. ITIL Service Management
- **61+ configuration items** in CMDB
- **34 service dependencies** mapping
- **Change management** workflows
- **Incident tracking** and resolution

### 4. Supply Chain & Manufacturing
- **End-to-end** production tracking
- **Supplier relationship** management
- **Manufacturing efficiency** metrics
- **Inventory optimization**

### 5. People & Organization
- **EntraID integration** and sync
- **Organizational structure** management
- **Role-based permissions** (personas)
- **Comprehensive user profiles** with device and license tracking

## 🔍 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Verify database connectivity
npm run db:studio

# Check environment variables
echo $DATABASE_URL

# Test database connection
psql $DATABASE_URL -c "SELECT version();"
```

#### Build Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf dist/
npm run build
```

#### Port Conflicts
```bash
# Check what's using port 5000
lsof -i :5000

# Kill process if needed
kill -9 <PID>
```

### Performance Optimization

#### Database Performance
- Index frequently queried columns
- Implement connection pooling
- Regular database maintenance
- Query optimization

#### Frontend Performance
- Implement code splitting
- Optimize bundle size
- Enable gzip compression
- CDN for static assets

## 📚 API Documentation

### Core Endpoints

#### Dashboard & Analytics
- `GET /api/dashboard/holistic-kpis` - Business overview metrics
- `GET /api/dashboard/trends` - Performance trends

#### User Management
- `GET /api/users` - List all users
- `GET /api/users/:id/profile` - User profile details
- `GET /api/users/:id/licenses` - User license assignments
- `GET /api/users/:id/devices` - User device assignments

#### Licensing Operations
- `GET /api/corporate-license-packs` - License pack management
- `GET /api/microsoft-license-kpis` - Microsoft license analytics
- `POST /api/license-redistribution` - AI-powered redistribution

#### ITIL Service Management
- `GET /api/itil-services` - Service catalog
- `GET /api/configuration-items` - CMDB items
- `GET /api/service-relationships` - Service dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain test coverage
- Update documentation
- Follow conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the API documentation

## 🎖 Acknowledgments

- Built with modern React and Node.js ecosystem
- Powered by PostgreSQL and Drizzle ORM
- UI components from shadcn/ui
- Icons from Lucide React
- Styling with Tailwind CSS

---

**Enterprise Operations Platform** - Comprehensive business management for the modern enterprise.
# 🚀 Azure Deployment Guide

This guide provides comprehensive instructions for deploying the Enterprise Operations Platform to Azure using Azure Developer CLI (azd) with Bicep infrastructure templates.

## 📋 Prerequisites

### Required Tools
1. **Azure CLI** - [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
2. **Azure Developer CLI (azd)** - [Install azd](https://docs.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd)
3. **Node.js 18+** - [Download Node.js](https://nodejs.org/)
4. **Git** - [Install Git](https://git-scm.com/downloads)

### Azure Requirements
- Active Azure subscription with contributor access
- Permissions to create resource groups and resources
- Permissions to create Entra ID app registrations (or admin assistance)

## 🔧 Quick Start

### 1. Clone and Setup
```bash
# Clone your repository
git clone https://github.com/yourusername/enterprise-operations-platform.git
cd enterprise-operations-platform

# Install dependencies
npm install

# Initialize Azure Developer CLI
azd init
```

### 2. Configure Environment
```bash
# Copy environment template
cp .azd/env.example .azd/.env

# Edit .azd/.env with your values:
# - AZURE_ENV_NAME (e.g., "enterprise-ops-prod")
# - AZURE_LOCATION (e.g., "eastus2")
# - AZURE_SUBSCRIPTION_ID
# - AZURE_TENANT_ID
# - AZURE_PRINCIPAL_ID (your user ID)
# - SQL_ADMIN_LOGIN and SQL_ADMIN_PASSWORD
# - OPENAI_API_KEY (optional)
```

### 3. Login to Azure
```bash
# Login to Azure
az login

# Set subscription (if you have multiple)
az account set --subscription "your-subscription-id"

# Login to Azure Developer CLI
azd auth login
```

### 4. Deploy Infrastructure
```bash
# Deploy everything with one command
azd up

# Or deploy step by step:
azd provision  # Create Azure resources
azd deploy     # Deploy application code
```

## 🏗️ Infrastructure Components

### Core Services Deployed
- **App Service Plan**: Intelligent auto-scaling with P1v3 tier
- **App Service**: Linux-based Node.js hosting with staging slots
- **SQL Managed Instance**: Enterprise-grade PostgreSQL equivalent
- **API Management**: Rate limiting, monitoring, and API gateway
- **Key Vault**: Secure secret management
- **Application Insights**: Comprehensive monitoring and analytics
- **Virtual Network**: Secure network isolation
- **Storage Account**: Application data and diagnostics

### Intelligent Features
- **Auto-scaling**: CPU and memory-based scaling (1-8 instances)
- **Blue-Green Deployment**: Staging slot for zero-downtime updates
- **Health Checks**: Automated application health monitoring
- **Security**: Network isolation, TLS 1.2+, managed identities

## 🔐 Security Configuration

### Entra ID SSO Setup
The deployment automatically creates:
1. **App Registration** with proper redirect URLs
2. **Client Secret** with 2-year expiration
3. **SAML Configuration** templates
4. **Required Permissions** for Microsoft Graph

### Manual Steps Required
After deployment, check the deployment output for:
- Application ID and Client Secret
- SAML configuration URLs
- Admin consent requirements

## 📊 Monitoring and Management

### Application Insights
- **Performance Monitoring**: Response times, dependencies
- **Error Tracking**: Exceptions and failed requests
- **User Analytics**: Session data and user flows
- **Custom Metrics**: Business KPIs and operational data

### API Management Features
- **Rate Limiting**: 1000 calls/minute, 10K calls/hour
- **Request/Response Logging**: Full API audit trail
- **Developer Portal**: API documentation and testing
- **Subscription Management**: API key distribution

## 🔄 Development Workflow

### Local Development
```bash
# Run locally with cloud database
npm run dev

# Use local environment file
cp .env.example .env
# Edit .env with local PostgreSQL or cloud database
```

### Deployment Process
```bash
# Deploy changes
azd deploy

# Deploy to staging first
azd deploy --environment staging

# Promote staging to production (manual in Azure Portal)
# App Service -> Deployment Slots -> Swap
```

### Database Management
```bash
# Run migrations
npm run db:push

# Connect to cloud database
npm run db:studio
```

## 🛠️ Configuration Details

### App Service Settings
Automatically configured environment variables:
- `NODE_ENV=production`
- `DATABASE_URL` (SQL Managed Instance connection)
- `APPLICATIONINSIGHTS_INSTRUMENTATION_KEY`
- `AZURE_TENANT_ID` and `AZURE_CLIENT_ID`
- `OPENAI_API_KEY` (if provided)

### Database Configuration
- **Engine**: SQL Managed Instance (GP_Gen5, 4 vCores)
- **Storage**: 256GB with automatic backup
- **Security**: Private network, TLS encryption
- **User**: Dedicated application user with minimal permissions

### Network Security
- **Virtual Network**: Isolated subnets for each service
- **NSG Rules**: Restricted SQL access to app subnet only
- **TLS**: Minimum 1.2 for all communications
- **Private Endpoints**: Database not publicly accessible

## 📋 Post-Deployment Checklist

### Verify Deployment
```bash
# Check application health
curl https://your-app-name.azurewebsites.net/api/dashboard/holistic-kpis

# Test API Management
curl https://your-apim-name.azure-api.net/api/users

# Check database connectivity
npm run db:studio
```

### Configure Entra ID
1. Go to Azure Portal → Entra ID → App Registrations
2. Find your application (enterprise-ops-{environment})
3. Configure additional redirect URLs if needed
4. Grant admin consent for API permissions
5. Configure group claims if using role-based access

### Setup SAML (Optional)
1. Go to Enterprise Applications
2. Create new non-gallery application
3. Configure SAML with URLs from deployment output
4. Map user attributes (email, name, groups, department)
5. Assign users or groups

## 🔧 Troubleshooting

### Common Issues

**Deployment Fails - Insufficient Permissions**
```bash
# Check your permissions
az role assignment list --assignee your-user-id

# Required roles: Contributor, User Access Administrator
```

**SQL Managed Instance Deployment Timeout**
- SQLMI deployment can take 4-6 hours for first instance
- Monitor in Azure Portal → Resource Groups → Deployments
- Consider using existing SQLMI if available

**App Registration Creation Fails**
```bash
# Create manually if automated creation fails
az ad app create --display-name "enterprise-ops-prod" \
  --web-redirect-uris "https://your-app.azurewebsites.net/auth/callback"

# Update .azd/.env with the new client ID
```

**Database Connection Issues**
- Check NSG rules allow app subnet to SQL subnet
- Verify connection string format
- Ensure application user exists and has permissions

### Monitoring Issues
```bash
# Check application logs
az webapp log tail --name your-app-name --resource-group your-rg

# Check deployment status
azd show

# View infrastructure resources
az resource list --resource-group your-rg-name
```

## 🔄 Maintenance

### Regular Updates
```bash
# Update application code
git pull origin main
azd deploy

# Update infrastructure
azd provision
```

### Backup Strategy
- **Database**: Automatic backups enabled (30-day retention)
- **Application**: Source code in Git repository
- **Configuration**: Environment variables in Key Vault

### Scaling Considerations
- **App Service Plan**: Auto-scales 1-8 instances based on load
- **SQL Managed Instance**: Can be scaled up/down as needed
- **Storage**: Automatically scales with usage

## 💰 Cost Optimization

### Resource Costs (Estimated Monthly)
- **App Service Plan P1v3**: ~$75/month
- **SQL Managed Instance GP_Gen5 4vCores**: ~$800/month
- **API Management Developer**: ~$50/month
- **Application Insights**: ~$10/month (data dependent)
- **Storage and networking**: ~$20/month

### Cost Reduction Options
- Use Standard App Service Plan for development
- Consider SQL Database instead of Managed Instance
- Use Consumption API Management for low traffic
- Implement auto-shutdown for development environments

## 🆘 Support

### Getting Help
- **Azure Documentation**: [Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/)
- **Azure Support**: Create support ticket in Azure Portal
- **Community**: Stack Overflow with `azure` and `azd` tags
- **Application Issues**: GitHub repository issues

### Diagnostic Information
When requesting support, provide:
- Azure subscription ID
- Resource group name
- Application name
- Error messages from deployment
- Application Insights correlation ID for runtime issues

---

**🎉 Success!** Your Enterprise Operations Platform is now running on Azure with enterprise-grade infrastructure, security, and monitoring capabilities.
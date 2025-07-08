#!/bin/bash

# Azure Developer CLI preparation script
# This script prepares the environment for Azure deployment

set -e

echo "🔧 Preparing Azure deployment environment..."

# Check if azd is installed
if ! command -v azd &> /dev/null; then
    echo "❌ Azure Developer CLI (azd) is not installed"
    echo "Please install azd: https://docs.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd"
    exit 1
fi

# Check if az is installed
if ! command -v az &> /dev/null; then
    echo "❌ Azure CLI (az) is not installed"
    echo "Please install Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

echo "✅ Azure tools detected"

# Create .azd directory if it doesn't exist
mkdir -p .azd

# Copy environment template if .env doesn't exist
if [ ! -f ".azd/.env" ]; then
    if [ -f ".azd/env.example" ]; then
        cp .azd/env.example .azd/.env
        echo "✅ Created .azd/.env from template"
        echo ""
        echo "🔧 NEXT STEPS:"
        echo "1. Edit .azd/.env with your Azure configuration:"
        echo "   - AZURE_ENV_NAME (e.g., 'enterprise-ops-prod')"
        echo "   - AZURE_LOCATION (e.g., 'eastus2')"
        echo "   - AZURE_SUBSCRIPTION_ID"
        echo "   - AZURE_TENANT_ID"
        echo "   - AZURE_PRINCIPAL_ID (your user principal ID)"
        echo "   - SQL_ADMIN_LOGIN and SQL_ADMIN_PASSWORD"
        echo "   - OPENAI_API_KEY (optional)"
        echo ""
        echo "2. Get your principal ID:"
        echo "   az ad signed-in-user show --query id -o tsv"
        echo ""
        echo "3. Get your tenant ID:"
        echo "   az account show --query tenantId -o tsv"
        echo ""
        echo "4. Get your subscription ID:"
        echo "   az account show --query id -o tsv"
        echo ""
    else
        echo "❌ .azd/env.example not found"
        exit 1
    fi
else
    echo "✅ .azd/.env already exists"
fi

# Check if logged into Azure
if ! az account show &> /dev/null; then
    echo "⚠️ Not logged into Azure CLI"
    echo "Please run: az login"
    exit 1
fi

# Check if logged into azd
if ! azd auth login --check-status &> /dev/null; then
    echo "⚠️ Not logged into Azure Developer CLI"
    echo "Please run: azd auth login"
    exit 1
fi

echo "✅ Azure authentication verified"

# Validate .azd/.env file
if [ -f ".azd/.env" ]; then
    echo "🔍 Validating environment configuration..."
    
    # Check required variables
    required_vars=("AZURE_ENV_NAME" "AZURE_LOCATION" "AZURE_SUBSCRIPTION_ID" "AZURE_TENANT_ID" "AZURE_PRINCIPAL_ID" "SQL_ADMIN_LOGIN" "SQL_ADMIN_PASSWORD")
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .azd/.env; then
            echo "❌ Missing required variable: $var"
            echo "Please edit .azd/.env and add: $var=your-value"
            exit 1
        fi
        
        # Check if value is set (not empty)
        value=$(grep "^${var}=" .azd/.env | cut -d'=' -f2)
        if [ -z "$value" ]; then
            echo "❌ Empty value for required variable: $var"
            echo "Please edit .azd/.env and set a value for: $var"
            exit 1
        fi
    done
    
    echo "✅ Environment configuration validated"
fi

# Estimate deployment time
echo ""
echo "⏱️ DEPLOYMENT TIME ESTIMATE:"
echo "- Resource provisioning: 60-90 minutes"
echo "- SQL Managed Instance: 4-6 hours (first deployment)"
echo "- Application deployment: 5-10 minutes"
echo "- Total first deployment: 5-7 hours"
echo "- Subsequent deployments: 10-15 minutes"

echo ""
echo "💰 ESTIMATED MONTHLY COSTS:"
echo "- App Service Plan (P1v3): ~$75"
echo "- SQL Managed Instance (4 vCores): ~$800"
echo "- API Management (Developer): ~$50"
echo "- Application Insights: ~$10"
echo "- Storage & Networking: ~$20"
echo "- Total estimated: ~$955/month"

echo ""
echo "🚀 Ready for deployment!"
echo "Run the following commands to deploy:"
echo ""
echo "  azd up                    # Full deployment (provision + deploy)"
echo "  azd provision             # Infrastructure only"
echo "  azd deploy                # Application code only"
echo ""
echo "⚠️ WARNING: SQL Managed Instance deployment takes 4-6 hours on first run!"
echo "Consider using an existing SQLMI or SQL Database for faster testing."
# Post-deployment configuration script for Enterprise Operations Platform
# This PowerShell script handles post-deployment setup tasks

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$true)]
    [string]$AppServiceName,
    
    [Parameter(Mandatory=$true)]
    [string]$EnvironmentName,
    
    [Parameter(Mandatory=$false)]
    [string]$TenantId = "",
    
    [Parameter(Mandatory=$false)]
    [string]$SubscriptionId = ""
)

Write-Host "🔧 Post-deployment configuration for Enterprise Operations Platform" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Green

# Function to check if command exists
function Test-CommandExists {
    param($Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-CommandExists "az")) {
    Write-Error "Azure CLI (az) is not installed or not in PATH"
    exit 1
}

if (-not (Test-CommandExists "azd")) {
    Write-Error "Azure Developer CLI (azd) is not installed or not in PATH"
    exit 1
}

Write-Host "✅ Prerequisites satisfied" -ForegroundColor Green

# Login check
try {
    $account = az account show --query "id" -o tsv 2>$null
    if (-not $account) {
        Write-Error "Not logged into Azure CLI. Please run: az login"
        exit 1
    }
    Write-Host "✅ Azure CLI authenticated" -ForegroundColor Green
} catch {
    Write-Error "Failed to verify Azure CLI authentication"
    exit 1
}

# Get deployment information
Write-Host "📊 Gathering deployment information..." -ForegroundColor Yellow

try {
    # Get App Service details
    $appService = az webapp show --name $AppServiceName --resource-group $ResourceGroupName | ConvertFrom-Json
    $appServiceUrl = "https://$($appService.defaultHostName)"
    
    # Get API Management details
    $apimList = az apim list --resource-group $ResourceGroupName | ConvertFrom-Json
    $apimUrl = if ($apimList.Count -gt 0) { "https://$($apimList[0].gatewayUrl)" } else { "Not deployed" }
    
    # Get SQL Managed Instance details
    $sqlmiList = az sql mi list --resource-group $ResourceGroupName | ConvertFrom-Json
    $sqlmiName = if ($sqlmiList.Count -gt 0) { $sqlmiList[0].name } else { "Not found" }
    
    Write-Host "✅ Deployment information gathered" -ForegroundColor Green
    Write-Host "   App Service URL: $appServiceUrl" -ForegroundColor Cyan
    Write-Host "   API Management URL: $apimUrl" -ForegroundColor Cyan
    Write-Host "   SQL Managed Instance: $sqlmiName" -ForegroundColor Cyan
    
} catch {
    Write-Error "Failed to gather deployment information: $($_.Exception.Message)"
    exit 1
}

# Health check
Write-Host "🩺 Performing health checks..." -ForegroundColor Yellow

try {
    $healthUrl = "$appServiceUrl/api/health"
    $response = Invoke-RestMethod -Uri $healthUrl -TimeoutSec 30
    
    if ($response.status -eq "healthy") {
        Write-Host "✅ Application health check passed" -ForegroundColor Green
        Write-Host "   Status: $($response.status)" -ForegroundColor Cyan
        Write-Host "   Database: $($response.services.database)" -ForegroundColor Cyan
    } else {
        Write-Warning "⚠️ Application health check failed: $($response.status)"
    }
} catch {
    Write-Warning "⚠️ Health check failed: $($_.Exception.Message)"
    Write-Host "   This might be normal if the application is still starting up" -ForegroundColor Yellow
}

# Test API endpoints
Write-Host "🔍 Testing API endpoints..." -ForegroundColor Yellow

$testEndpoints = @(
    "/api/dashboard/holistic-kpis",
    "/api/users",
    "/api/corporates",
    "/api/licenses"
)

foreach ($endpoint in $testEndpoints) {
    try {
        $testUrl = "$appServiceUrl$endpoint"
        $response = Invoke-RestMethod -Uri $testUrl -TimeoutSec 15
        Write-Host "✅ $endpoint - Working" -ForegroundColor Green
    } catch {
        Write-Warning "⚠️ $endpoint - Failed: $($_.Exception.Message)"
    }
}

# Entra ID Configuration
Write-Host "🔐 Entra ID Configuration Status..." -ForegroundColor Yellow

if ($TenantId) {
    try {
        # List app registrations to find ours
        $appRegs = az ad app list --filter "displayName eq 'enterprise-ops-$EnvironmentName'" | ConvertFrom-Json
        
        if ($appRegs.Count -gt 0) {
            $appReg = $appRegs[0]
            Write-Host "✅ Found Entra ID app registration" -ForegroundColor Green
            Write-Host "   Application ID: $($appReg.appId)" -ForegroundColor Cyan
            Write-Host "   Display Name: $($appReg.displayName)" -ForegroundColor Cyan
            
            # Check redirect URLs
            $webRedirectUris = $appReg.web.redirectUris
            if ($webRedirectUris -contains "$appServiceUrl/auth/callback") {
                Write-Host "✅ Redirect URLs configured correctly" -ForegroundColor Green
            } else {
                Write-Warning "⚠️ Redirect URLs may need updating"
                Write-Host "   Expected: $appServiceUrl/auth/callback" -ForegroundColor Yellow
            }
        } else {
            Write-Warning "⚠️ Entra ID app registration not found"
            Write-Host "   Manual creation may be required" -ForegroundColor Yellow
        }
    } catch {
        Write-Warning "⚠️ Failed to check Entra ID configuration: $($_.Exception.Message)"
    }
} else {
    Write-Host "ℹ️ Tenant ID not provided, skipping Entra ID checks" -ForegroundColor Blue
}

# Database connectivity test
Write-Host "🗄️ Testing database connectivity..." -ForegroundColor Yellow

try {
    # Test database through the application
    $dbTestUrl = "$appServiceUrl/api/corporates"
    $dbResponse = Invoke-RestMethod -Uri $dbTestUrl -TimeoutSec 30
    
    if ($dbResponse) {
        Write-Host "✅ Database connectivity confirmed" -ForegroundColor Green
        Write-Host "   Retrieved $($dbResponse.Count) corporate records" -ForegroundColor Cyan
    }
} catch {
    Write-Warning "⚠️ Database connectivity test failed: $($_.Exception.Message)"
}

# Generate summary report
Write-Host "📋 Deployment Summary Report" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

$summary = @"

🎉 Enterprise Operations Platform Deployment Complete!

📊 Resource Information:
   Resource Group: $ResourceGroupName
   App Service: $AppServiceName
   Environment: $EnvironmentName
   
🌐 Application URLs:
   Main Application: $appServiceUrl
   Health Check: $appServiceUrl/api/health
   API Management: $apimUrl
   
🔧 Next Steps:
   1. Configure Entra ID SSO (if not already done)
   2. Set up SAML authentication (optional)
   3. Configure user groups and permissions
   4. Import existing enterprise data
   5. Set up monitoring alerts
   
📚 Management URLs:
   Azure Portal: https://portal.azure.com/#@/resource/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroupName
   App Service: https://portal.azure.com/#@/resource/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroupName/providers/Microsoft.Web/sites/$AppServiceName
   
🔍 Monitoring:
   Application Insights: Check Azure Portal for performance metrics
   Health Endpoint: $appServiceUrl/api/health
   
🆘 Support:
   For issues, check Azure Portal logs or create a support ticket
   Application logs: Azure Portal > App Service > Log stream

"@

Write-Host $summary -ForegroundColor Cyan

# Save summary to file
$summaryFile = "deployment-summary-$(Get-Date -Format 'yyyy-MM-dd-HHmmss').txt"
$summary | Out-File -FilePath $summaryFile -Encoding UTF8
Write-Host "💾 Summary saved to: $summaryFile" -ForegroundColor Green

Write-Host "🎯 Deployment configuration completed successfully!" -ForegroundColor Green
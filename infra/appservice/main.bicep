param environmentName string
param location string
param resourceToken string
param sqlConnectionString string
param keyVaultName string
param appInsightsInstrumentationKey string
param openAiApiKey string
param tenantId string
param appClientId string
param tags object = {}

// Azure OpenAI parameters
param azureOpenAIEndpoint string = ''
param azureOpenAIKey string = ''
param azureOpenAIModels object = {}

// Intelligent App Service Plan with auto-scaling
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: 'asp-${environmentName}-${resourceToken}'
  location: location
  tags: tags
  sku: {
    name: 'P1v3'  // Premium v3 for production workloads
    tier: 'PremiumV3'
    size: 'P1v3'
    family: 'Pv3'
    capacity: 1
  }
  kind: 'linux'
  properties: {
    reserved: true  // Linux App Service Plan
    targetWorkerCount: 1
    targetWorkerSizeId: 0
    elasticScaleEnabled: true
    maximumElasticWorkerCount: 5
    isSpot: false
    perSiteScaling: false
    zoneRedundant: false
  }
}

// Auto-scaling settings for intelligent scaling
resource autoScaleSettings 'Microsoft.Insights/autoscalesettings@2022-10-01' = {
  name: 'autoscale-${environmentName}-${resourceToken}'
  location: location
  tags: tags
  properties: {
    enabled: true
    targetResourceUri: appServicePlan.id
    profiles: [
      {
        name: 'Default-Profile'
        capacity: {
          minimum: '1'
          maximum: '5'
          default: '1'
        }
        rules: [
          {
            metricTrigger: {
              metricName: 'CpuPercentage'
              metricResourceUri: appServicePlan.id
              timeGrain: 'PT1M'
              statistic: 'Average'
              timeWindow: 'PT5M'
              timeAggregation: 'Average'
              operator: 'GreaterThan'
              threshold: 70
            }
            scaleAction: {
              direction: 'Increase'
              type: 'ChangeCount'
              value: '1'
              cooldown: 'PT5M'
            }
          }
          {
            metricTrigger: {
              metricName: 'CpuPercentage'
              metricResourceUri: appServicePlan.id
              timeGrain: 'PT1M'
              statistic: 'Average'
              timeWindow: 'PT10M'
              timeAggregation: 'Average'
              operator: 'LessThan'
              threshold: 30
            }
            scaleAction: {
              direction: 'Decrease'
              type: 'ChangeCount'
              value: '1'
              cooldown: 'PT10M'
            }
          }
          {
            metricTrigger: {
              metricName: 'MemoryPercentage'
              metricResourceUri: appServicePlan.id
              timeGrain: 'PT1M'
              statistic: 'Average'
              timeWindow: 'PT5M'
              timeAggregation: 'Average'
              operator: 'GreaterThan'
              threshold: 80
            }
            scaleAction: {
              direction: 'Increase'
              type: 'ChangeCount'
              value: '1'
              cooldown: 'PT5M'
            }
          }
        ]
      }
      {
        name: 'Business-Hours-Profile'
        capacity: {
          minimum: '2'
          maximum: '8'
          default: '2'
        }
        rules: [
          {
            metricTrigger: {
              metricName: 'CpuPercentage'
              metricResourceUri: appServicePlan.id
              timeGrain: 'PT1M'
              statistic: 'Average'
              timeWindow: 'PT5M'
              timeAggregation: 'Average'
              operator: 'GreaterThan'
              threshold: 60
            }
            scaleAction: {
              direction: 'Increase'
              type: 'ChangeCount'
              value: '2'
              cooldown: 'PT3M'
            }
          }
          {
            metricTrigger: {
              metricName: 'CpuPercentage'
              metricResourceUri: appServicePlan.id
              timeGrain: 'PT1M'
              statistic: 'Average'
              timeWindow: 'PT10M'
              timeAggregation: 'Average'
              operator: 'LessThan'
              threshold: 25
            }
            scaleAction: {
              direction: 'Decrease'
              type: 'ChangeCount'
              value: '1'
              cooldown: 'PT15M'
            }
          }
        ]
        recurrence: {
          frequency: 'Week'
          schedule: {
            timeZone: 'UTC'
            days: [
              'Monday'
              'Tuesday'
              'Wednesday'
              'Thursday'
              'Friday'
            ]
            hours: [
              8
            ]
            minutes: [
              0
            ]
          }
        }
        fixedDate: null
      }
    ]
    notifications: []
  }
}

// App Service for the Enterprise Operations Platform
resource appService 'Microsoft.Web/sites@2023-01-01' = {
  name: 'app-${environmentName}-${resourceToken}'
  location: location
  tags: tags
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    reserved: true
    httpsOnly: true
    clientAffinityEnabled: false
    virtualNetworkSubnetId: null  // Will be set if VNet integration is needed
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      appCommandLine: 'npm start'
      alwaysOn: true
      http20Enabled: true
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      remoteDebuggingEnabled: false
      webSocketsEnabled: true
      use32BitWorkerProcess: false
      healthCheckPath: '/api/health'
      appSettings: [
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'DATABASE_URL'
          value: sqlConnectionString
        }
        {
          name: 'APPLICATIONINSIGHTS_INSTRUMENTATION_KEY'
          value: appInsightsInstrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: 'InstrumentationKey=${appInsightsInstrumentationKey}'
        }
        {
          name: 'OPENAI_API_KEY'
          value: openAiApiKey
        }
        {
          name: 'AZURE_OPENAI_ENDPOINT'
          value: azureOpenAIEndpoint
        }
        {
          name: 'AZURE_OPENAI_KEY'
          value: azureOpenAIKey
        }
        {
          name: 'AZURE_OPENAI_GPT4O_DEPLOYMENT'
          value: !empty(azureOpenAIModels) ? azureOpenAIModels.gpt4o : ''
        }
        {
          name: 'AZURE_OPENAI_GPT35_DEPLOYMENT'
          value: !empty(azureOpenAIModels) ? azureOpenAIModels.gpt35turbo : ''
        }
        {
          name: 'AZURE_OPENAI_EMBEDDING_DEPLOYMENT'
          value: !empty(azureOpenAIModels) ? azureOpenAIModels.embedding : ''
        }
        {
          name: 'AZURE_OPENAI_DALLE_DEPLOYMENT'
          value: !empty(azureOpenAIModels) && azureOpenAIModels.dalle != null ? azureOpenAIModels.dalle : ''
        }
        {
          name: 'AZURE_TENANT_ID'
          value: tenantId
        }
        {
          name: 'AZURE_CLIENT_ID'
          value: appClientId
        }
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'WEBSITES_PORT'
          value: '5000'
        }
        {
          name: 'SCM_DO_BUILD_DURING_DEPLOYMENT'
          value: 'true'
        }
        {
          name: 'ENABLE_ORYX_BUILD'
          value: 'true'
        }
      ]
      connectionStrings: [
        {
          name: 'DefaultConnection'
          connectionString: sqlConnectionString
          type: 'SQLAzure'
        }
      ]
    }
  }
}

// Grant App Service access to Key Vault
resource keyVaultAccessPolicy 'Microsoft.KeyVault/vaults/accessPolicies@2023-07-01' = {
  name: '${keyVaultName}/add'
  properties: {
    accessPolicies: [
      {
        tenantId: appService.identity.tenantId
        objectId: appService.identity.principalId
        permissions: {
          secrets: [
            'get'
            'list'
          ]
        }
      }
    ]
  }
}

// Health check configuration
resource healthCheck 'Microsoft.Web/sites/config@2023-01-01' = {
  parent: appService
  name: 'web'
  properties: {
    healthCheckPath: '/api/health'
    numberOfWorkers: 1
  }
}

// Deployment configuration
resource deploymentConfig 'Microsoft.Web/sites/config@2023-01-01' = {
  parent: appService
  name: 'appsettings'
  properties: {
    'NODE_ENV': 'production'
    'DATABASE_URL': sqlConnectionString
    'APPLICATIONINSIGHTS_INSTRUMENTATION_KEY': appInsightsInstrumentationKey
    'OPENAI_API_KEY': openAiApiKey
    'AZURE_TENANT_ID': tenantId
    'AZURE_CLIENT_ID': appClientId
    'WEBSITES_ENABLE_APP_SERVICE_STORAGE': 'false'
    'WEBSITES_PORT': '5000'
    'SCM_DO_BUILD_DURING_DEPLOYMENT': 'true'
    'ENABLE_ORYX_BUILD': 'true'
    'PRE_BUILD_COMMAND': 'npm install'
    'POST_BUILD_COMMAND': 'npm run build'
  }
}

// Staging slot for blue-green deployments
resource stagingSlot 'Microsoft.Web/sites/slots@2023-01-01' = {
  parent: appService
  name: 'staging'
  location: location
  tags: tags
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    reserved: true
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      appCommandLine: 'npm start'
      alwaysOn: false
      http20Enabled: true
      minTlsVersion: '1.2'
      ftpsState: 'Disabled'
      appSettings: [
        {
          name: 'NODE_ENV'
          value: 'staging'
        }
        {
          name: 'DATABASE_URL'
          value: sqlConnectionString
        }
        {
          name: 'APPLICATIONINSIGHTS_INSTRUMENTATION_KEY'
          value: appInsightsInstrumentationKey
        }
        {
          name: 'WEBSITES_PORT'
          value: '5000'
        }
      ]
    }
  }
}

// Diagnostic settings for App Service
resource appServiceDiagnostics 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'app-diagnostics'
  scope: appService
  properties: {
    logs: [
      {
        category: 'AppServiceHTTPLogs'
        enabled: true
        retentionPolicy: {
          enabled: true
          days: 30
        }
      }
      {
        category: 'AppServiceConsoleLogs'
        enabled: true
        retentionPolicy: {
          enabled: true
          days: 30
        }
      }
      {
        category: 'AppServiceAppLogs'
        enabled: true
        retentionPolicy: {
          enabled: true
          days: 30
        }
      }
      {
        category: 'AppServicePlatformLogs'
        enabled: true
        retentionPolicy: {
          enabled: true
          days: 30
        }
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
        retentionPolicy: {
          enabled: true
          days: 30
        }
      }
    ]
  }
}

// Outputs
output appServiceName string = appService.name
output appServiceUrl string = 'https://${appService.properties.defaultHostName}'
output appServicePrincipalId string = appService.identity.principalId
output stagingSlotUrl string = 'https://${stagingSlot.properties.defaultHostName}'
output appServicePlanName string = appServicePlan.name
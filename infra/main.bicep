targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

@description('Id of the user or app to assign application roles')
param principalId string = ''

@description('The application registration client ID for Entra ID SSO')
param appClientId string = ''

@description('The tenant ID for Entra ID authentication')
param tenantId string = ''

@description('SQL Administrator login name')
@secure()
param sqlAdminLogin string

@description('SQL Administrator password')
@secure()
param sqlAdminPassword string

@description('OpenAI API key for AI insights')
@secure()
param openAiApiKey string = ''

// Generate a unique suffix for globally unique resources
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var tags = {
  'azd-env-name': environmentName
  'application': 'enterprise-operations-platform'
  'tier': 'production'
}

// Create resource group
resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

// Deploy core infrastructure
module coreInfra 'core/main.bicep' = {
  name: 'core-infrastructure'
  scope: rg
  params: {
    environmentName: environmentName
    location: location
    resourceToken: resourceToken
    principalId: principalId
    tags: tags
  }
}

// Deploy SQL Managed Instance
module sqlmi 'database/sqlmi.bicep' = {
  name: 'sql-managed-instance'
  scope: rg
  params: {
    environmentName: environmentName
    location: location
    resourceToken: resourceToken
    sqlAdminLogin: sqlAdminLogin
    sqlAdminPassword: sqlAdminPassword
    subnetId: coreInfra.outputs.sqlSubnetId
    tags: tags
  }
}

// Deploy API Management
module apim 'apimanagement/apim.bicep' = {
  name: 'api-management'
  scope: rg
  params: {
    environmentName: environmentName
    location: location
    resourceToken: resourceToken
    appServiceUrl: appService.outputs.appServiceUrl
    tags: tags
  }
}

// Deploy App Service with intelligent scaling
module appService 'appservice/main.bicep' = {
  name: 'app-service'
  scope: rg
  params: {
    environmentName: environmentName
    location: location
    resourceToken: resourceToken
    sqlConnectionString: sqlmi.outputs.connectionString
    keyVaultName: coreInfra.outputs.keyVaultName
    appInsightsInstrumentationKey: coreInfra.outputs.appInsightsInstrumentationKey
    openAiApiKey: openAiApiKey
    azureOpenAIEndpoint: azureOpenAI.outputs.openAIEndpoint
    azureOpenAIKey: '@Microsoft.KeyVault(SecretUri=${coreInfra.outputs.keyVaultUri}secrets/AZURE-OPENAI-KEY/)'
    azureOpenAIModels: azureOpenAI.outputs.deploymentNames
    tenantId: tenantId
    appClientId: appClientId
    tags: tags
  }
  dependsOn: [
    coreInfra
    sqlmi
    azureOpenAI
  ]
}

// Deploy Azure OpenAI Service
module azureOpenAI 'ai/aoai.bicep' = {
  name: 'azure-openai'
  scope: rg
  params: {
    environmentName: environmentName
    location: location
    resourceToken: resourceToken
    principalId: principalId
    keyVaultName: coreInfra.outputs.keyVaultName
    virtualNetworkId: coreInfra.outputs.virtualNetworkId
    privateEndpointSubnetId: coreInfra.outputs.privateEndpointSubnetId
    tags: tags
  }
  dependsOn: [
    coreInfra
  ]
}

// Deploy Entra ID configuration
module entraId 'identity/entraid.bicep' = {
  name: 'entra-id-config'
  scope: rg
  params: {
    environmentName: environmentName
    appServiceUrl: appService.outputs.appServiceUrl
    tenantId: tenantId
    tags: tags
  }
}

// Outputs
output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenantId
output APPLICATIONINSIGHTS_CONNECTION_STRING string = coreInfra.outputs.appInsightsConnectionString
output AZURE_KEY_VAULT_ENDPOINT string = coreInfra.outputs.keyVaultEndpoint
output AZURE_OPENAI_ENDPOINT string = azureOpenAI.outputs.openAIEndpoint
output AZURE_OPENAI_RESOURCE_NAME string = azureOpenAI.outputs.openAIName
output AZURE_OPENAI_GPT4O_DEPLOYMENT string = azureOpenAI.outputs.deploymentNames.gpt4o
output AZURE_OPENAI_GPT35_DEPLOYMENT string = azureOpenAI.outputs.deploymentNames.gpt35turbo
output AZURE_OPENAI_EMBEDDING_DEPLOYMENT string = azureOpenAI.outputs.deploymentNames.embedding
output AZURE_OPENAI_DALLE_DEPLOYMENT string = environmentName == 'prod' ? azureOpenAI.outputs.deploymentNames.dalle : ''
output WEB_APP_URL string = appService.outputs.appServiceUrl
output DATABASE_URL string = sqlmi.outputs.connectionString
output API_BASE_URL string = appService.outputs.appServiceUrl
output APIM_GATEWAY_URL string = apim.outputs.gatewayUrl
output ENTRA_CLIENT_ID string = appClientId
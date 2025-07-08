@description('Environment name for resource naming')
param environmentName string

@description('Primary location for resources')
param location string

@description('Resource token for unique naming')
param resourceToken string

@description('Principal ID for role assignments')
param principalId string = ''

@description('Tags to apply to all resources')
param tags object = {}

@description('Key Vault name for storing secrets')
param keyVaultName string

@description('Virtual Network ID for private endpoints')
param virtualNetworkId string

@description('Private endpoints subnet ID')
param privateEndpointSubnetId string

// Environment-specific configurations
var environmentConfigs = {
  dev: {
    sku: 'S0'
    capacity: 10
    models: [
      {
        name: 'gpt-4o'
        version: '2024-05-13'
        capacity: 10
      }
      {
        name: 'gpt-35-turbo'
        version: '0613'
        capacity: 20
      }
      {
        name: 'text-embedding-ada-002'
        version: '2'
        capacity: 30
      }
    ]
    networkRestrictions: false
    privateEndpoint: false
  }
  prod: {
    sku: 'S0'
    capacity: 100
    models: [
      {
        name: 'gpt-4o'
        version: '2024-05-13'
        capacity: 50
      }
      {
        name: 'gpt-35-turbo'
        version: '0613'
        capacity: 100
      }
      {
        name: 'text-embedding-ada-002'
        version: '2'
        capacity: 120
      }
      {
        name: 'dall-e-3'
        version: '3.0'
        capacity: 2
      }
    ]
    networkRestrictions: true
    privateEndpoint: true
  }
}

var config = contains(environmentConfigs, environmentName) ? environmentConfigs[environmentName] : environmentConfigs.dev

// Azure OpenAI Service
resource openAI 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: 'aoai-${environmentName}-${resourceToken}'
  location: location
  tags: tags
  kind: 'OpenAI'
  sku: {
    name: config.sku
  }
  properties: {
    customSubDomainName: 'aoai-${environmentName}-${resourceToken}'
    publicNetworkAccess: config.networkRestrictions ? 'Disabled' : 'Enabled'
    networkAcls: config.networkRestrictions ? {
      defaultAction: 'Deny'
      virtualNetworkRules: []
      ipRules: []
    } : null
  }
}

// Deploy AI models based on environment
resource gpt4oDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAI
  name: 'gpt-4o'
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-4o'
      version: '2024-05-13'
    }
    raiPolicyName: 'Microsoft.Default'
  }
  sku: {
    name: 'Standard'
    capacity: config.models[0].capacity
  }
}

resource gpt35turboDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAI
  name: 'gpt-35-turbo'
  properties: {
    model: {
      format: 'OpenAI'
      name: 'gpt-35-turbo'
      version: '0613'
    }
    raiPolicyName: 'Microsoft.Default'
  }
  sku: {
    name: 'Standard'
    capacity: config.models[1].capacity
  }
  dependsOn: [
    gpt4oDeployment
  ]
}

resource embeddingDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = {
  parent: openAI
  name: 'text-embedding-ada-002'
  properties: {
    model: {
      format: 'OpenAI'
      name: 'text-embedding-ada-002'
      version: '2'
    }
    raiPolicyName: 'Microsoft.Default'
  }
  sku: {
    name: 'Standard'
    capacity: config.models[2].capacity
  }
  dependsOn: [
    gpt35turboDeployment
  ]
}

// Deploy DALL-E 3 for production only
resource dalleDeployment 'Microsoft.CognitiveServices/accounts/deployments@2023-05-01' = if (environmentName == 'prod') {
  parent: openAI
  name: 'dall-e-3'
  properties: {
    model: {
      format: 'OpenAI'
      name: 'dall-e-3'
      version: '3.0'
    }
    raiPolicyName: 'Microsoft.Default'
  }
  sku: {
    name: 'Standard'
    capacity: environmentName == 'prod' ? config.models[3].capacity : 1
  }
  dependsOn: [
    embeddingDeployment
  ]
}

// Private endpoint for production
resource privateEndpoint 'Microsoft.Network/privateEndpoints@2023-05-01' = if (config.privateEndpoint) {
  name: 'pe-aoai-${environmentName}-${resourceToken}'
  location: location
  tags: tags
  properties: {
    subnet: {
      id: privateEndpointSubnetId
    }
    privateLinkServiceConnections: [
      {
        name: 'aoai-connection'
        properties: {
          privateLinkServiceId: openAI.id
          groupIds: [
            'account'
          ]
        }
      }
    ]
  }
}

// Private DNS zone for private endpoint
resource privateDnsZone 'Microsoft.Network/privateDnsZones@2020-06-01' = if (config.privateEndpoint) {
  name: 'privatelink.openai.azure.com'
  location: 'global'
  tags: tags
}

resource privateDnsZoneLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2020-06-01' = if (config.privateEndpoint) {
  parent: privateDnsZone
  name: 'aoai-dns-link'
  location: 'global'
  properties: {
    registrationEnabled: false
    virtualNetwork: {
      id: virtualNetworkId
    }
  }
}

resource privateDnsZoneGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2023-05-01' = if (config.privateEndpoint) {
  parent: privateEndpoint
  name: 'default'
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'config'
        properties: {
          privateDnsZoneId: privateDnsZone.id
        }
      }
    ]
  }
}

// Role assignments for OpenAI
resource cognitiveServicesUserRole 'Microsoft.Authorization/roleDefinitions@2018-01-01-preview' existing = {
  scope: subscription()
  name: 'a97b65f3-24c7-4388-baec-2e87135dc908' // Cognitive Services User
}

resource openAIUserAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (!empty(principalId)) {
  scope: openAI
  name: guid(openAI.id, principalId, cognitiveServicesUserRole.id)
  properties: {
    roleDefinitionId: cognitiveServicesUserRole.id
    principalId: principalId
    principalType: 'User'
  }
}

// Store OpenAI secrets in Key Vault
resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' existing = {
  name: keyVaultName
}

resource openAIEndpointSecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: keyVault
  name: 'AZURE-OPENAI-ENDPOINT'
  properties: {
    value: openAI.properties.endpoint
    contentType: 'application/text'
  }
}

resource openAIKeySecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: keyVault
  name: 'AZURE-OPENAI-KEY'
  properties: {
    value: openAI.listKeys().key1
    contentType: 'application/text'
  }
}

resource openAIModelConfigSecret 'Microsoft.KeyVault/vaults/secrets@2023-02-01' = {
  parent: keyVault
  name: 'AZURE-OPENAI-MODELS'
  properties: {
    value: string({
      gpt4o: gpt4oDeployment.name
      gpt35turbo: gpt35turboDeployment.name
      embedding: embeddingDeployment.name
      dalle: environmentName == 'prod' ? dalleDeployment.name : null
    })
    contentType: 'application/json'
  }
}

// Diagnostic settings for monitoring
resource diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  scope: openAI
  name: 'aoai-diagnostics'
  properties: {
    workspaceId: '/subscriptions/${subscription().subscriptionId}/resourceGroups/rg-${environmentName}/providers/Microsoft.OperationalInsights/workspaces/log-${environmentName}-${resourceToken}'
    logs: [
      {
        categoryGroup: 'allLogs'
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

// Content filter policy for responsible AI
resource contentFilterPolicy 'Microsoft.CognitiveServices/accounts/raiPolicies@2023-05-01' = {
  parent: openAI
  name: 'enterprise-content-filter'
  properties: {
    mode: 'Default'
    contentFilters: [
      {
        name: 'hate'
        allowedContentLevel: 'medium'
        blocking: true
        enabled: true
        source: 'Prompt'
      }
      {
        name: 'violence'
        allowedContentLevel: 'medium'
        blocking: true
        enabled: true
        source: 'Prompt'
      }
      {
        name: 'selfharm'
        allowedContentLevel: 'medium'
        blocking: true
        enabled: true
        source: 'Prompt'
      }
      {
        name: 'sexual'
        allowedContentLevel: 'medium'
        blocking: true
        enabled: true
        source: 'Prompt'
      }
    ]
  }
}

// Output values
output openAIEndpoint string = openAI.properties.endpoint
output openAIId string = openAI.id
output openAIName string = openAI.name
output deploymentNames object = {
  gpt4o: gpt4oDeployment.name
  gpt35turbo: gpt35turboDeployment.name
  embedding: embeddingDeployment.name
  dalle: environmentName == 'prod' ? dalleDeployment.name : null
}
output privateEndpointId string = config.privateEndpoint ? privateEndpoint.id : ''
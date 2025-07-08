param environmentName string
param location string
param resourceToken string
param principalId string
param tags object = {}

// Create Virtual Network for secure communication
resource vnet 'Microsoft.Network/virtualNetworks@2023-04-01' = {
  name: 'vnet-${environmentName}-${resourceToken}'
  location: location
  tags: tags
  properties: {
    addressSpace: {
      addressPrefixes: [
        '10.0.0.0/16'
      ]
    }
    subnets: [
      {
        name: 'subnet-app'
        properties: {
          addressPrefix: '10.0.1.0/24'
          delegations: [
            {
              name: 'delegation'
              properties: {
                serviceName: 'Microsoft.Web/serverfarms'
              }
            }
          ]
        }
      }
      {
        name: 'subnet-sql'
        properties: {
          addressPrefix: '10.0.2.0/24'
          delegations: [
            {
              name: 'managedInstanceDelegation'
              properties: {
                serviceName: 'Microsoft.Sql/managedInstances'
              }
            }
          ]
        }
      }
      {
        name: 'subnet-apim'
        properties: {
          addressPrefix: '10.0.3.0/24'
        }
      }
    ]
  }
}

// Network Security Group for SQL Managed Instance
resource nsgSql 'Microsoft.Network/networkSecurityGroups@2023-04-01' = {
  name: 'nsg-sql-${environmentName}-${resourceToken}'
  location: location
  tags: tags
  properties: {
    securityRules: [
      {
        name: 'allow_tds_inbound'
        properties: {
          description: 'Allow access to data'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '1433'
          sourceAddressPrefix: 'VirtualNetwork'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 1000
          direction: 'Inbound'
        }
      }
      {
        name: 'allow_redirect_inbound'
        properties: {
          description: 'Allow inbound redirect traffic to Managed Instance inside the virtual network'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '11000-11999'
          sourceAddressPrefix: 'VirtualNetwork'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 1100
          direction: 'Inbound'
        }
      }
      {
        name: 'allow_geodr_inbound'
        properties: {
          description: 'Allow inbound geodr traffic inside the virtual network'
          protocol: 'Tcp'
          sourcePortRange: '*'
          destinationPortRange: '5022'
          sourceAddressPrefix: 'VirtualNetwork'
          destinationAddressPrefix: '*'
          access: 'Allow'
          priority: 1200
          direction: 'Inbound'
        }
      }
      {
        name: 'deny_all_inbound'
        properties: {
          description: 'Deny all other inbound traffic'
          protocol: '*'
          sourcePortRange: '*'
          destinationPortRange: '*'
          sourceAddressPrefix: '*'
          destinationAddressPrefix: '*'
          access: 'Deny'
          priority: 4096
          direction: 'Inbound'
        }
      }
    ]
  }
}

// Associate NSG with SQL subnet
resource sqlSubnetNsgAssociation 'Microsoft.Network/virtualNetworks/subnets@2023-04-01' = {
  parent: vnet
  name: 'subnet-sql'
  properties: {
    addressPrefix: '10.0.2.0/24'
    networkSecurityGroup: {
      id: nsgSql.id
    }
    delegations: [
      {
        name: 'managedInstanceDelegation'
        properties: {
          serviceName: 'Microsoft.Sql/managedInstances'
        }
      }
    ]
  }
}

// Key Vault for secrets management
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: 'kv-${environmentName}-${resourceToken}'
  location: location
  tags: tags
  properties: {
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    accessPolicies: [
      {
        tenantId: subscription().tenantId
        objectId: principalId
        permissions: {
          secrets: [
            'get'
            'list'
            'set'
            'delete'
          ]
          certificates: [
            'get'
            'list'
            'create'
            'delete'
          ]
        }
      }
    ]
    enabledForDeployment: true
    enabledForTemplateDeployment: true
    enabledForDiskEncryption: true
    enableRbacAuthorization: false
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      defaultAction: 'Allow'
      bypass: 'AzureServices'
    }
  }
}

// Log Analytics Workspace
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: 'log-${environmentName}-${resourceToken}'
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      searchVersion: 1
      legacy: 0
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

// Application Insights
resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'appi-${environmentName}-${resourceToken}'
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
    IngestionMode: 'LogAnalytics'
    publicNetworkAccessForIngestion: 'Enabled'
    publicNetworkAccessForQuery: 'Enabled'
  }
}

// Storage Account for application data and diagnostics
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'st${environmentName}${resourceToken}'
  location: location
  tags: tags
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: false
    allowSharedKeyAccess: true
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
    networkAcls: {
      defaultAction: 'Allow'
    }
  }
}

// Container for application logs
resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-01-01' = {
  parent: storageAccount
  name: 'default'
}

resource logsContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: blobService
  name: 'logs'
  properties: {
    publicAccess: 'None'
  }
}

// Outputs
output keyVaultName string = keyVault.name
output keyVaultEndpoint string = keyVault.properties.vaultUri
output appInsightsInstrumentationKey string = appInsights.properties.InstrumentationKey
output appInsightsConnectionString string = appInsights.properties.ConnectionString
output logAnalyticsWorkspaceId string = logAnalyticsWorkspace.id
output vnetId string = vnet.id
output appSubnetId string = '${vnet.id}/subnets/subnet-app'
output sqlSubnetId string = '${vnet.id}/subnets/subnet-sql'
output apimSubnetId string = '${vnet.id}/subnets/subnet-apim'
output storageAccountName string = storageAccount.name
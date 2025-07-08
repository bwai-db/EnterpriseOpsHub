param environmentName string
param location string
param resourceToken string
param appServiceUrl string
param tags object = {}

// API Management instance
resource apiManagement 'Microsoft.ApiManagement/service@2023-05-01-preview' = {
  name: 'apim-${environmentName}-${resourceToken}'
  location: location
  tags: tags
  sku: {
    name: 'Developer'  // Use Developer for testing, change to Standard/Premium for production
    capacity: 1
  }
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    publisherName: 'Enterprise Operations'
    publisherEmail: 'admin@enterprise-ops.com'
    notificationSenderEmail: 'apimgmt-noreply@mail.windowsazure.com'
    hostnameConfigurations: [
      {
        type: 'Proxy'
        hostName: 'apim-${environmentName}-${resourceToken}.azure-api.net'
        negotiateClientCertificate: false
        defaultSslBinding: true
        certificateSource: 'BuiltIn'
      }
    ]
    customProperties: {
      'Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Protocols.Tls10': 'False'
      'Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Protocols.Tls11': 'False'
      'Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Protocols.Ssl30': 'False'
      'Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Backend.Protocols.Tls10': 'False'
      'Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Backend.Protocols.Tls11': 'False'
      'Microsoft.WindowsAzure.ApiManagement.Gateway.Security.Backend.Protocols.Ssl30': 'False'
      'Microsoft.WindowsAzure.ApiManagement.Gateway.Protocols.Server.Http2': 'True'
    }
    virtualNetworkType: 'None'
    disableGateway: false
    natGatewayState: 'Unsupported'
    apiVersionConstraint: {}
    publicNetworkAccess: 'Enabled'
    legacyPortalStatus: 'Enabled'
    developerPortalStatus: 'Enabled'
  }
}

// Backend for the App Service
resource appServiceBackend 'Microsoft.ApiManagement/service/backends@2023-05-01-preview' = {
  parent: apiManagement
  name: 'enterprise-ops-backend'
  properties: {
    description: 'Enterprise Operations Platform Backend'
    url: appServiceUrl
    protocol: 'http'
    resourceId: '${environment().resourceManager}${subscription().id}/resourceGroups/${resourceGroup().name}/providers/Microsoft.Web/sites/${last(split(appServiceUrl, '/'))}'
    credentials: {
      certificateIds: []
      query: {}
      header: {}
    }
    proxy: {
      url: ''
      username: ''
    }
    tls: {
      validateCertificateChain: true
      validateCertificateName: true
    }
  }
}

// Product for Enterprise Operations API
resource enterpriseOpsProduct 'Microsoft.ApiManagement/service/products@2023-05-01-preview' = {
  parent: apiManagement
  name: 'enterprise-operations'
  properties: {
    displayName: 'Enterprise Operations API'
    description: 'Comprehensive enterprise IT operations management platform APIs'
    subscriptionRequired: true
    approvalRequired: false
    subscriptionsLimit: 100
    state: 'published'
    terms: 'Terms of use for Enterprise Operations API'
  }
}

// API for Enterprise Operations
resource enterpriseOpsApi 'Microsoft.ApiManagement/service/apis@2023-05-01-preview' = {
  parent: apiManagement
  name: 'enterprise-ops-api'
  properties: {
    displayName: 'Enterprise Operations API'
    description: 'APIs for managing enterprise operations including users, licensing, incidents, and more'
    serviceUrl: appServiceUrl
    path: 'api'
    protocols: [
      'https'
    ]
    subscriptionRequired: true
    subscriptionKeyParameterNames: {
      header: 'Ocp-Apim-Subscription-Key'
      query: 'subscription-key'
    }
    apiRevision: '1'
    apiVersion: 'v1'
    apiVersionSetId: null
    authenticationSettings: {
      oAuth2: null
      openid: null
    }
    format: 'openapi+json'
    value: '''
{
  "openapi": "3.0.0",
  "info": {
    "title": "Enterprise Operations API",
    "version": "1.0.0",
    "description": "Comprehensive enterprise IT operations management platform"
  },
  "servers": [
    {
      "url": "${appServiceUrl}/api"
    }
  ],
  "paths": {
    "/dashboard/holistic-kpis": {
      "get": {
        "summary": "Get holistic business KPIs",
        "operationId": "getHolisticKpis",
        "responses": {
          "200": {
            "description": "Successful response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "totalEmployees": { "type": "number" },
                    "totalLicenses": { "type": "number" },
                    "totalIncidents": { "type": "number" },
                    "totalVendors": { "type": "number" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/users": {
      "get": {
        "summary": "Get all users",
        "operationId": "getUsers",
        "responses": {
          "200": {
            "description": "List of users",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": { "type": "number" },
                      "username": { "type": "string" },
                      "email": { "type": "string" },
                      "firstName": { "type": "string" },
                      "lastName": { "type": "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/licenses": {
      "get": {
        "summary": "Get license information",
        "operationId": "getLicenses",
        "responses": {
          "200": {
            "description": "License data"
          }
        }
      }
    },
    "/incidents": {
      "get": {
        "summary": "Get incidents",
        "operationId": "getIncidents",
        "responses": {
          "200": {
            "description": "Incident data"
          }
        }
      }
    }
  }
}
'''
  }
}

// Link API to Product
resource productApi 'Microsoft.ApiManagement/service/products/apis@2023-05-01-preview' = {
  parent: enterpriseOpsProduct
  name: enterpriseOpsApi.name
}

// CORS Policy for API
resource corsPolicy 'Microsoft.ApiManagement/service/apis/policies@2023-05-01-preview' = {
  parent: enterpriseOpsApi
  name: 'policy'
  properties: {
    value: '''
<policies>
  <inbound>
    <base />
    <cors allow-credentials="true">
      <allowed-origins>
        <origin>*</origin>
      </allowed-origins>
      <allowed-methods>
        <method>GET</method>
        <method>POST</method>
        <method>PUT</method>
        <method>DELETE</method>
        <method>OPTIONS</method>
      </allowed-methods>
      <allowed-headers>
        <header>*</header>
      </allowed-headers>
    </cors>
    <set-backend-service backend-id="enterprise-ops-backend" />
    <rate-limit calls="1000" renewal-period="60" />
    <quota calls="10000" renewal-period="3600" />
  </inbound>
  <backend>
    <base />
  </backend>
  <outbound>
    <base />
    <set-header name="X-Powered-By" exists-action="delete" />
    <set-header name="Server" exists-action="delete" />
  </outbound>
  <on-error>
    <base />
  </on-error>
</policies>
'''
  }
}

// Named Values for configuration
resource appServiceUrlNamedValue 'Microsoft.ApiManagement/service/namedValues@2023-05-01-preview' = {
  parent: apiManagement
  name: 'app-service-url'
  properties: {
    displayName: 'App Service URL'
    value: appServiceUrl
    secret: false
  }
}

// Application Insights Logger
resource appInsightsLogger 'Microsoft.ApiManagement/service/loggers@2023-05-01-preview' = {
  parent: apiManagement
  name: 'applicationinsights'
  properties: {
    loggerType: 'applicationInsights'
    description: 'Application Insights logger for API Management'
    credentials: {
      instrumentationKey: '{{instrumentation-key}}'
    }
    isBuffered: true
    resourceId: null
  }
}

// Diagnostic settings for API logging
resource apiDiagnostics 'Microsoft.ApiManagement/service/apis/diagnostics@2023-05-01-preview' = {
  parent: enterpriseOpsApi
  name: 'applicationinsights'
  properties: {
    alwaysLog: 'allErrors'
    httpCorrelationProtocol: 'W3C'
    verbosity: 'information'
    logClientIp: true
    loggerId: appInsightsLogger.id
    sampling: {
      samplingType: 'fixed'
      percentage: 100
    }
    frontend: {
      request: {
        headers: []
        body: {
          bytes: 0
        }
      }
      response: {
        headers: []
        body: {
          bytes: 0
        }
      }
    }
    backend: {
      request: {
        headers: []
        body: {
          bytes: 0
        }
      }
      response: {
        headers: []
        body: {
          bytes: 0
        }
      }
    }
  }
}

// Subscription for internal use
resource internalSubscription 'Microsoft.ApiManagement/service/subscriptions@2023-05-01-preview' = {
  parent: apiManagement
  name: 'internal-subscription'
  properties: {
    scope: '/products/${enterpriseOpsProduct.id}'
    displayName: 'Internal Enterprise Operations Subscription'
    state: 'active'
    allowTracing: true
  }
}

// Output
output apiManagementName string = apiManagement.name
output gatewayUrl string = 'https://${apiManagement.properties.gatewayUrl}'
output managementUrl string = 'https://${apiManagement.properties.managementApiUrl}'
output portalUrl string = 'https://${apiManagement.properties.portalUrl}'
output subscriptionKey string = internalSubscription.listSecrets().primaryKey
output apiManagementPrincipalId string = apiManagement.identity.principalId
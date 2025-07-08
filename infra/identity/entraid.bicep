param environmentName string
param appServiceUrl string
param tenantId string
param tags object = {}

// This template creates the configuration for Entra ID SSO
// Note: Actual app registration must be done via Azure CLI or Portal
// This template provides the configuration needed

// Variables for Entra ID configuration
var appName = 'enterprise-ops-${environmentName}'
var replyUrls = [
  '${appServiceUrl}/auth/callback'
  '${appServiceUrl}/auth/microsoft/callback'
  '${appServiceUrl}/.auth/login/aad/callback'
]

// User-assigned managed identity for the application
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'id-${environmentName}-entraid'
  location: resourceGroup().location
  tags: tags
}

// Output configuration script for Entra ID app registration
resource appRegistrationScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'entra-app-registration-${environmentName}'
  location: resourceGroup().location
  tags: tags
  kind: 'AzurePowerShell'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    azPowerShellVersion: '9.0'
    retentionInterval: 'P1D'
    timeout: 'PT30M'
    scriptContent: '''
      # Install required modules
      Install-Module -Name Microsoft.Graph.Authentication -Force -AllowClobber
      Install-Module -Name Microsoft.Graph.Applications -Force -AllowClobber
      
      # Connect to Microsoft Graph
      try {
          Connect-MgGraph -Identity
      } catch {
          Write-Error "Failed to connect to Microsoft Graph: $($_.Exception.Message)"
          throw
      }
      
      $appName = "${appName}"
      $replyUrls = @(
          "${appServiceUrl}/auth/callback",
          "${appServiceUrl}/auth/microsoft/callback", 
          "${appServiceUrl}/.auth/login/aad/callback"
      )
      
      # Check if app registration already exists
      $existingApp = Get-MgApplication -Filter "displayName eq '$appName'" -ErrorAction SilentlyContinue
      
      if ($existingApp) {
          Write-Output "App registration '$appName' already exists with ID: $($existingApp.AppId)"
          $appId = $existingApp.AppId
          $objectId = $existingApp.Id
          
          # Update reply URLs
          $webApp = @{
              RedirectUris = $replyUrls
              ImplicitGrantSettings = @{
                  EnableIdTokenIssuance = $true
                  EnableAccessTokenIssuance = $false
              }
          }
          
          Update-MgApplication -ApplicationId $objectId -Web $webApp
          Write-Output "Updated existing app registration"
      } else {
          # Create new app registration
          $appParams = @{
              DisplayName = $appName
              SignInAudience = "AzureADMyOrg"
              Web = @{
                  RedirectUris = $replyUrls
                  ImplicitGrantSettings = @{
                      EnableIdTokenIssuance = $true
                      EnableAccessTokenIssuance = $false
                  }
              }
              RequiredResourceAccess = @(
                  @{
                      ResourceAppId = "00000003-0000-0000-c000-000000000000"  # Microsoft Graph
                      ResourceAccess = @(
                          @{
                              Id = "e1fe6dd8-ba31-4d61-89e7-88639da4683d"    # User.Read
                              Type = "Scope"
                          },
                          @{
                              Id = "64a6cdd6-aab1-4aaf-94b8-3cc8405e90d0"    # email
                              Type = "Scope"
                          },
                          @{
                              Id = "14dad69e-099b-42c9-810b-d002981feec1"    # profile
                              Type = "Scope"
                          },
                          @{
                              Id = "37f7f235-527c-4136-accd-4a02d197296e"    # openid
                              Type = "Scope"
                          }
                      )
                  }
              )
              Api = @{
                  RequestedAccessTokenVersion = 2
              }
          }
          
          try {
              $newApp = New-MgApplication @appParams
              $appId = $newApp.AppId
              $objectId = $newApp.Id
              Write-Output "Created new app registration with ID: $appId"
          } catch {
              Write-Error "Failed to create app registration: $($_.Exception.Message)"
              throw
          }
      }
      
      # Create client secret
      $secretParams = @{
          ApplicationId = $objectId
          PasswordCredential = @{
              DisplayName = "Enterprise Ops Secret $(Get-Date -Format 'yyyy-MM-dd')"
              EndDateTime = (Get-Date).AddYears(2)
          }
      }
      
      try {
          $clientSecret = Add-MgApplicationPassword @secretParams
          Write-Output "Created client secret"
      } catch {
          Write-Warning "Failed to create client secret: $($_.Exception.Message)"
          $clientSecret = $null
      }
      
      # Output configuration
      $config = @{
          ApplicationId = $appId
          TenantId = "${tenantId}"
          ClientSecret = if ($clientSecret) { $clientSecret.SecretText } else { "MANUAL_CREATION_REQUIRED" }
          AuthorityUrl = "https://login.microsoftonline.com/${tenantId}/v2.0"
          CallbackUrl = "${appServiceUrl}/auth/microsoft/callback"
          LogoutUrl = "${appServiceUrl}/auth/logout"
      } | ConvertTo-Json -Depth 3
      
      Write-Output "Entra ID Configuration:"
      Write-Output $config
      
      # Save configuration to deployment outputs
      $DeploymentScriptOutputs = @{
          'applicationId' = $appId
          'tenantId' = "${tenantId}"
          'authorityUrl' = "https://login.microsoftonline.com/${tenantId}/v2.0"
          'callbackUrl' = "${appServiceUrl}/auth/microsoft/callback"
      }
    '''
    environmentVariables: [
      {
        name: 'APP_NAME'
        value: appName
      }
      {
        name: 'APP_SERVICE_URL'
        value: appServiceUrl
      }
      {
        name: 'TENANT_ID'
        value: tenantId
      }
    ]
  }
}

// SAML Configuration Template (for reference)
resource samlConfigTemplate 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'saml-config-template-${environmentName}'
  location: resourceGroup().location
  tags: tags
  kind: 'AzurePowerShell'
  properties: {
    azPowerShellVersion: '9.0'
    retentionInterval: 'P1D'
    timeout: 'PT10M'
    scriptContent: '''
      # SAML Configuration Template for Enterprise Operations Platform
      
      $samlConfig = @{
          EntityId = "${appServiceUrl}"
          AssertionConsumerServiceUrl = "${appServiceUrl}/auth/saml/callback"
          LogoutUrl = "${appServiceUrl}/auth/saml/logout"
          Certificate = "CERTIFICATE_REQUIRED"
          Issuer = "https://sts.windows.net/${tenantId}/"
          AttributeMapping = @{
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name" = "user.userprincipalname"
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress" = "user.mail"
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname" = "user.givenname"
              "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname" = "user.surname"
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/groups" = "user.groups"
              "Department" = "user.department"
              "JobTitle" = "user.jobtitle"
          }
          ClaimsConfiguration = @{
              NameIdFormat = "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent"
              AuthnContextClassRef = "urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport"
          }
      }
      
      Write-Output "SAML Configuration Template:"
      Write-Output ($samlConfig | ConvertTo-Json -Depth 4)
      
      Write-Output "
      MANUAL SAML SETUP INSTRUCTIONS:
      ================================
      
      1. In Azure Portal, go to Enterprise Applications
      2. Create new Non-gallery application named 'Enterprise Operations Platform'
      3. Go to Single Sign-On and select SAML
      4. Configure with these settings:
         - Identifier (Entity ID): ${appServiceUrl}
         - Reply URL (ACS URL): ${appServiceUrl}/auth/saml/callback
         - Logout URL: ${appServiceUrl}/auth/saml/logout
         
      5. Configure User Attributes & Claims:
         - Add claims for: email, name, givenname, surname, groups, department, jobtitle
         
      6. Download Certificate (Base64) and configure in app settings
      
      7. Note the Login URL for application configuration
      "
      
      $DeploymentScriptOutputs = @{
          'samlEntityId' = "${appServiceUrl}"
          'samlAcsUrl' = "${appServiceUrl}/auth/saml/callback"
          'samlLogoutUrl' = "${appServiceUrl}/auth/saml/logout"
      }
    '''
  }
}

// Outputs
output managedIdentityId string = managedIdentity.id
output managedIdentityPrincipalId string = managedIdentity.properties.principalId
output appRegistrationInstructions string = 'Check deployment script outputs for Entra ID configuration details'
output samlConfigurationInstructions string = 'Check deployment script outputs for SAML setup instructions'
output recommendedAppSettings object = {
  'AZURE_TENANT_ID': tenantId
  'AZURE_CLIENT_ID': 'OUTPUT_FROM_APP_REGISTRATION_SCRIPT'
  'AZURE_CLIENT_SECRET': 'OUTPUT_FROM_APP_REGISTRATION_SCRIPT'
  'AZURE_AUTHORITY_URL': 'https://login.microsoftonline.com/${tenantId}/v2.0'
  'SAML_ENTITY_ID': appServiceUrl
  'SAML_ACS_URL': '${appServiceUrl}/auth/saml/callback'
  'SAML_LOGOUT_URL': '${appServiceUrl}/auth/saml/logout'
}
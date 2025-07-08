param environmentName string
param location string
param resourceToken string
param sqlAdminLogin string
@secure()
param sqlAdminPassword string
param subnetId string
param tags object = {}

// Route Table for SQL Managed Instance
resource routeTable 'Microsoft.Network/routeTables@2023-04-01' = {
  name: 'rt-sqlmi-${environmentName}-${resourceToken}'
  location: location
  tags: tags
  properties: {
    disableBgpRoutePropagation: false
    routes: [
      {
        name: 'subnet-to-vnetlocal'
        properties: {
          addressPrefix: '0.0.0.0/0'
          nextHopType: 'VnetLocal'
        }
      }
    ]
  }
}

// SQL Managed Instance
resource sqlManagedInstance 'Microsoft.Sql/managedInstances@2023-08-01-preview' = {
  name: 'sqlmi-${environmentName}-${resourceToken}'
  location: location
  tags: tags
  sku: {
    name: 'GP_Gen5'
    tier: 'GeneralPurpose'
    family: 'Gen5'
    capacity: 4
  }
  properties: {
    administratorLogin: sqlAdminLogin
    administratorLoginPassword: sqlAdminPassword
    subnetId: subnetId
    licenseType: 'LicenseIncluded'
    vCores: 4
    storageSizeInGB: 256
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    publicDataEndpointEnabled: false
    proxyOverride: 'Proxy'
    timezoneId: 'UTC'
    maintenanceConfigurationId: '/subscriptions/${subscription().subscriptionId}/providers/Microsoft.Maintenance/publicMaintenanceConfigurations/SQL_Default'
    minimalTlsVersion: '1.2'
  }
}

// Enterprise Operations Database
resource enterpriseOpsDatabase 'Microsoft.Sql/managedInstances/databases@2023-08-01-preview' = {
  parent: sqlManagedInstance
  name: 'enterprise-ops'
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    restorePointInTime: null
    catalogCollation: 'SQL_Latin1_General_CP1_CI_AS'
    createMode: 'Default'
  }
}

// Application user for the database
resource appDatabaseUser 'Microsoft.Sql/managedInstances/databases/schemas/tables@2023-08-01-preview' = {
  parent: enterpriseOpsDatabase
  name: 'app_user_setup'
  properties: {}
  dependsOn: [
    enterpriseOpsDatabase
  ]
}

// SQL Script to create application user and permissions
resource sqlScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'sql-setup-${environmentName}-${resourceToken}'
  location: location
  tags: tags
  kind: 'AzurePowerShell'
  properties: {
    azPowerShellVersion: '9.0'
    retentionInterval: 'P1D'
    scriptContent: '''
      $serverName = "${sqlManagedInstance.properties.fullyQualifiedDomainName}"
      $databaseName = "enterprise-ops"
      $adminLogin = "${sqlAdminLogin}"
      $adminPassword = ConvertTo-SecureString "${sqlAdminPassword}" -AsPlainText -Force
      
      # Install SqlServer module if not present
      if (-not (Get-Module -ListAvailable -Name SqlServer)) {
          Install-Module -Name SqlServer -Force -AllowClobber
      }
      
      # Create application user and grant permissions
      $sql = @"
      -- Create application user
      IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'enterprise_app_user')
      BEGIN
          CREATE USER [enterprise_app_user] WITH PASSWORD = '${sqlAdminPassword}App123!';
      END
      
      -- Grant necessary permissions
      ALTER ROLE db_datareader ADD MEMBER [enterprise_app_user];
      ALTER ROLE db_datawriter ADD MEMBER [enterprise_app_user];
      ALTER ROLE db_ddladmin ADD MEMBER [enterprise_app_user];
      
      -- Grant specific permissions for application
      GRANT CREATE TABLE TO [enterprise_app_user];
      GRANT CREATE VIEW TO [enterprise_app_user];
      GRANT CREATE PROCEDURE TO [enterprise_app_user];
      GRANT CREATE FUNCTION TO [enterprise_app_user];
      GRANT CREATE SCHEMA TO [enterprise_app_user];
      
      -- Create application schema if it doesn't exist
      IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'enterprise')
      BEGIN
          EXEC('CREATE SCHEMA enterprise AUTHORIZATION [enterprise_app_user]');
      END
"@
      
      try {
          Invoke-Sqlcmd -ServerInstance $serverName -Database $databaseName -Username $adminLogin -Password (ConvertFrom-SecureString $adminPassword -AsPlainText) -Query $sql
          Write-Output "Database setup completed successfully"
      }
      catch {
          Write-Error "Database setup failed: $($_.Exception.Message)"
          throw
      }
    '''
    environmentVariables: [
      {
        name: 'SQL_ADMIN_LOGIN'
        value: sqlAdminLogin
      }
      {
        name: 'SQL_ADMIN_PASSWORD'
        secureValue: sqlAdminPassword
      }
    ]
  }
  dependsOn: [
    enterpriseOpsDatabase
  ]
}

// Diagnostic settings for monitoring
resource diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'sqlmi-diagnostics'
  scope: sqlManagedInstance
  properties: {
    logs: [
      {
        category: 'SQLInsights'
        enabled: true
        retentionPolicy: {
          enabled: true
          days: 30
        }
      }
      {
        category: 'QueryStoreRuntimeStatistics'
        enabled: true
        retentionPolicy: {
          enabled: true
          days: 30
        }
      }
      {
        category: 'QueryStoreWaitStatistics'
        enabled: true
        retentionPolicy: {
          enabled: true
          days: 30
        }
      }
      {
        category: 'Errors'
        enabled: true
        retentionPolicy: {
          enabled: true
          days: 30
        }
      }
    ]
    metrics: [
      {
        category: 'Basic'
        enabled: true
        retentionPolicy: {
          enabled: true
          days: 30
        }
      }
      {
        category: 'InstanceAndAppAdvanced'
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
output sqlManagedInstanceName string = sqlManagedInstance.name
output sqlManagedInstanceFqdn string = sqlManagedInstance.properties.fullyQualifiedDomainName
output databaseName string = enterpriseOpsDatabase.name
output connectionString string = 'Server=${sqlManagedInstance.properties.fullyQualifiedDomainName};Database=${enterpriseOpsDatabase.name};User Id=enterprise_app_user;Password=${sqlAdminPassword}App123!;Encrypt=true;TrustServerCertificate=false;Connection Timeout=30;'
output appUserName string = 'enterprise_app_user'
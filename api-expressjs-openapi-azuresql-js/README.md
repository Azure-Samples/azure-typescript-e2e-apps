---
page_type: sample
languages:
- javascript
- typescript
- nodejs
products:
- azure-app-service
- azure-sql
---

# Express.js with OpenAPI with Azure SQL (JavaScript)

* /users
* /api-docs

## App Service app settings

When you use the Azure CLI service connector to add a system-assigned identity between the App Service and the Azure SQL server, the process creates 4 environment variables in the App Service:

* Don't change the environment variable names
* Use the environment variables in the **mssql** configuration object

```bash
AZURE_SQL_SERVER=SERVER.database.windows.net
AZURE_SQL_DATABASE=mySampleDatabase
AZURE_SQL_PORT=1433
AZURE_SQL_AUTHENTICATIONTYPE=azure-active-directory-default
```

## Passwordless config

```javascript
// ./src/config.ts
export const passwordlessConfiguration = {
    server: process.env.AZURE_SQL_SERVER,
    port: +process.env.AZURE_SQL_PORT,
    database: process.env.AZURE_SQL_DATABASE,
    authentication: {
        type: process.env.AZURE_SQL_AUTHENTICATIONTYPE,
    },
    options: {
      encrypt: true // for Azure users
    }
  };
```
## Troubleshooting 

### Local development

* Use [mssql-no-password.js](mssql-no-password.js) to verify you can connect to the database
* If you connect through a VPN or Proxy, make sure that IP address is allowed in the Azure SQL firewall.

### Azure App Service

* Passwords: 
    * Add environment variables to App Service
    * Use [SQL script to create user with roles](./scripts/create-azure-sql-user.sql)
* No Passwords:
    Use [Azure CLI service connector script](./scripts/create-service-connector-connection.sh)
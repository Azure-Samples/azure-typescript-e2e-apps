---
name: Connect to and query Azure SQL Database using Node.js and mssql npm package
description: Learn how to connect to a database in Azure SQL Database and query data using Node.js and mssql npm package.
page_type: sample
languages:
- javascript
- typescript
products:
- azure-app-service
- azure-sql-database
---

# Connect to and query Azure SQL Database using Node.js and mssql

Learn how to connect to a database in Azure SQL Database and query data using Node.js and mssql npm package.

* [Quickstart in official documentation](https://learn.microsoft.com/azure/azure-sql/database/azure-sql-javascript-mssql-quickstart)

## Set up

1. Install dependencies: 

    ```
    npm install
    ```

1. Create `.env.development` and set the environment variables:

   ```
    AZURE_SQL_SERVER=<YOURSERVERNAME>.database.windows.net
    AZURE_SQL_DATABASE=<YOURDATABASENAME>
    AZURE_SQL_PORT=1433
    # Passwordless
    # AZURE_SQL_AUTHENTICATIONTYPE=azure-active-directory-default
    # With password
    AZURE_SQL_USER=<YOURUSERNAME>
    AZURE_SQL_PASSWORD=<YOURPASSWORD>   
   ```

1. In `person.js`, verify or set which configuration you want:

    * `const config = noPasswordConfig;`
    * `const config = passwordConfig;`

1. Start the app:

    ```
    NODE_ENV=development node index.js
    ```
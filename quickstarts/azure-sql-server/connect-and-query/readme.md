# Azure SQL Quickstarts

* [Migrate to passwordless](https://learn.microsoft.com/azure/azure-sql/database/azure-sql-passwordless-migration-nodejs)
* [Connect and query](https://learn.microsoft.com/azure/azure-sql/database/azure-sql-javascript-mssql-quickstart)

## Environment variables for SQL Authentication

```
AZURE_SQL_SERVER=<YOURSERVERNAME>.database.windows.net
AZURE_SQL_DATABASE=<YOURDATABASENAME>
AZURE_SQL_PORT=1433
AZURE_SQL_USER=<YOURUSERNAME>
AZURE_SQL_PASSWORD=<YOURPASSWORD>
```

## Environment variables for Entra ID 

```
AZURE_SQL_SERVER=<YOURSERVERNAME>.database.windows.net
AZURE_SQL_DATABASE=<YOURDATABASENAME>
AZURE_SQL_PORT=1433
AZURE_SQL_AUTHENTICATIONTYPE=azure-active-directory-default
```

## Create user

```sql
CREATE USER [user@domain] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [user@domain];
ALTER ROLE db_datawriter ADD MEMBER [user@domain];
ALTER ROLE db_ddladmin ADD MEMBER [user@domain];
GO
```
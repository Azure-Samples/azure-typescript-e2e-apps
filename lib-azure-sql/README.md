# Custom mssql library

This library is a custom library for Azure SQL Database using the [mssql](https://www.npmjs.com/package/mssql) package.

## Environment variables



## Connect with passwordless (recommended)


```ini
AZURE_SQL_SERVER=<YOUR_SERVER_NAME>.database.windows.net
AZURE_SQL_DATABASE=<YOUR_DATABASE_NAME>
AZURE_SQL_PORT=1433
AZURE_SQL_AUTHENTICATIONTYPE=azure-active-directory-default
```


```javascript
const config = {
    server:process.env.AZURE_SQL_SERVER,
    port: process.env.AZURE_SQL_PORT,
    database: process.env.AZURE_SQL_DATABASE,
    authentication: {
        type: process.env.AZURE_SQL_AUTHENTICATIONTYPE //azure-active-directory-default
    },
    options: {
        encrypt: true
    }
};
```

## Connect with connection string

```ini
AZURE_SQL_SERVER=<YOUR_SERVER_NAME>.database.windows.net
AZURE_SQL_DATABASE=<YOUR_DATABASE_NAME>
AZURE_SQL_PORT=1433
AZURE_DATABASE_USER=<YOUR-USER>
AZURE_DATABASE_PASSWORD=<YOUR-PASSWORD>
```

```javascript
const config = `Server=${process.env.AZURE_SQL_SERVER},${process.env.AZURE_SQL_PORT};Database=${process.env.AZURE_SQL_DATABASE};User Id=${process.env.AZURE_DATABASE_USER};Password=${process.env.AZURE_DATABASE_PASSWORD};Encrypt=true`
```

## Connect with user name and password

```ini
AZURE_SQL_SERVER=<YOUR_SERVER_NAME>.database.windows.net
AZURE_SQL_DATABASE=<YOUR_DATABASE_NAME>
AZURE_SQL_PORT=1433
AZURE_DATABASE_USER=<YOUR-USER>
AZURE_DATABASE_PASSWORD=<YOUR-PASSWORD>
```

```javascript
const sqlConfig = {
  user: process.env.AZURE_DATABASE_USER,
  password: process.env.AZURE_DATABASE_PASSWORD,
  database: process.env.AZURE_SQL_DATABASE,
  server: process.env.AZURE_SQL_SERVER,
  port: process.env.AZURE_SQL_PORT,
  options: {
    encrypt: true // for azure
  }
};
```


export const passwordlessConfiguration = {
    server: process.env.AZURE_SQL_SERVER,
    port: process.env.AZURE_SQL_SERVER_PORT,
    database: process.env.AZURE_SQL_DATABASE,
    authentication: {
        type: 'azure-active-directory-default',
    },
    options: {
      encrypt: true // for Azure users
    }
  };
import * as dotenv from 'dotenv'
dotenv.config()

export const passwordConfig = {
    server: process.env.AZURE_SQL_SERVER,
    port: +process.env.AZURE_SQL_SERVER_PORT,
    database: process.env.AZURE_SQL_DATABASE,
    user: process.env.AZURE_SQL_SERVER_USERNAME,
    password: process.env.AZURE_SQL_SERVER_PASSWORD,
    options: {
      encrypt: true // for Azure users
    }
  };


export const nopasswordConfig = {
    server: process.env.AZURE_SQL_SERVER,
    port: +process.env.AZURE_SQL_SERVER_PORT,
    database: process.env.AZURE_SQL_DATABASE,
    authentication: {
        type: 'azure-active-directory-default',
    },
    options: {
      encrypt: true // for Azure users
    }
  };


import * as dotenv from 'dotenv'
dotenv.config()

export const config = {
    server: process.env.AZURE_SQL_SERVER,
    port: +process.env.AZURE_SQL_SERVER_PORT,
    database: process.env.AZURE_SQL_DATABASE,
    user: process.env.AZURE_SQL_SERVER_USERNAME,
    password: process.env.AZURE_SQL_SERVER_PASSWORD,
    options: {
      encrypt: true // for Azure users
    }
  };
console.log(config)  
  /*
  export const passwordlessConfiguration = {
    server: process.env.AZURE_SQL_SERVER,
    port: process.env.AZURE_SQL_SERVER_PORT,
    database: process.env.AZURE_SQL_DATABASE,
    user: process.env.AZURE_SQL_SERVER_USERNAME,
    password: process.env.AZURE_SQL_SERVER_PASSWORD,
    authentication: {
        type: 'azure-active-directory-default',
    },
    options: {
      encrypt: true // for Azure users
    }
  };
  */
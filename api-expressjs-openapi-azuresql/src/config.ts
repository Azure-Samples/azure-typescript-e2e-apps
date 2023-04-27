import * as dotenv from 'dotenv'
dotenv.config({ debug: true })

/*

Example .env file:

AZURE_SQL_SERVER=SERVER.database.windows.net
AZURE_SQL_DATABASE=mySampleDatabase
AZURE_SQL_SERVER_PORT=1433
AZURE_SQL_SERVER_AUTHENTICATION_TYPE=azure-active-directory-default
AZURE_SQL_USER=
AZURE_SQL_PASSWORD=

*/

// <snippet_passwordless_connect>

// TIP: Port must be a number, not a string!

const server = process.env.AZURE_SQL_SERVER;
const database = process.env.AZURE_SQL_DATABASE;
const port = +process.env.AZURE_SQL_SERVER_PORT;
const type = process.env.AZURE_SQL_SERVER_AUTHENTICATION;
const user = process.env.AZURE_SQL_USER;
const password = process.env.AZURE_SQL_PASSWORD;

export const noPasswordConfig = {
    server,
    port,
    database,
    authentication: {
        type
    },
    options: {
        encrypt: true
    }
}
// </snippet_passwordless_connect>

export const passwordConfig = {
    server,
    port,
    database,
    user,
    password,
    options: {
        encrypt: true
    }
}




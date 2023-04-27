import * as dotenv from 'dotenv'
dotenv.config({ debug: true })

const server = process.env.AZURE_SQL_SERVER;
const database = process.env.AZURE_SQL_DATABASE;
const port = +process.env.AZURE_SQL_SERVER_PORT;
const type = process.env.AZURE_SQL_SERVER_AUTHENTICATION;
const user = process.env.AZURE_SQL_USER;
const password = process.env.AZURE_SQL_PASSWORD;

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


const sql = require('mssql')
require('dotenv').config({ debug: true })

const server = process.env.AZURE_SQL_SERVER;
const database = process.env.AZURE_SQL_DATABASE;
const port = +process.env.AZURE_SQL_PORT;
const type = process.env.AZURE_SQL_AUTHENTICATIONTYPE;
const user = process.env.AZURE_SQL_USER;
const password = process.env.AZURE_SQL_PASSWORD;

const passwordConfig = {
    server,
    port,
    database,
    user,
    password,
    options: {
        encrypt: true
    }
}
const noPasswordConfig = {
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


const getAllPersons = `select * from [dbo].[Users]`;

const myQuery = async () => {

    const config = noPasswordConfig;
    // console.log(config)

    var poolConnection = await sql.connect(config);
    const result = await poolConnection.request().query(getAllPersons)
    console.log(`Result: ${JSON.stringify(result)}`)
    poolConnection.close();
    return;
}

myQuery().then(() => console.log('done')).catch(err => console.log(err))
const sql = require('mssql')
require('dotenv').config({ debug: true })

const server = process.env.AZURE_SQL_SERVER;
const database = process.env.AZURE_SQL_DATABASE;
const port = +process.env.AZURE_SQL_SERVER_PORT;
const type = process.env.AZURE_SQL_SERVER_AUTHENTICATION;
const user = process.env.AZURE_SQL_USER;
const password = process.env.AZURE_SQL_PASSWORD;

// const passwordConfig = {
//     server,
//     port,
//     database,
//     user,
//     password,
//     options: {
//         encrypt: true
//     }
// }
// console.log(passwordConfig)

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
console.log(noPasswordConfig)

const getAllPersons = `select * from BuildVersion`;

const myQuery = async () => {

    // make sure that any items are correctly URL encoded in the connection string
    // await sql.connect('Server=localhost,1433;Database=database;User Id=username;Password=password;Encrypt=true')
    var poolConnection = await sql.connect(noPasswordConfig);
    const result = await poolConnection.request().query(getAllPersons)
    console.log(`Result: ${JSON.stringify(result)}`)
    poolConnection.close();
    return;
}

myQuery().then(() => console.log('done')).catch(err => console.log(err))
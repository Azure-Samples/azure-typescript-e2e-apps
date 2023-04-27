const sql = require('mssql')

const passwordConfig = {
    server: 'dfberry-dbserver-1.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: 'dfberry-db-1', // better stored in an app setting such as process.env.DB_NAME
    user: 'dbserveradmin',
    password: '',
    options: {
        encrypt: true
    }
}

const noPasswordConfig = {
    server: 'dfberry-dbserver-1.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: 'dfberry-db-1', // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'azure-active-directory-default'
    },
    options: {
        encrypt: true
    }
}

const getAllPersons = `select * from People`;

const myQuery = async() => {
    try {
        // make sure that any items are correctly URL encoded in the connection string
        // await sql.connect('Server=localhost,1433;Database=database;User Id=username;Password=password;Encrypt=true')
        var poolConnection = await sql.connect(noPasswordConfig);
        const result = await poolConnection.request().query(getAllPersons)
        console.log(`Result: ${JSON.stringify(result)}`)
        poolConnection.close();
        return;
    } catch (err) {
        console.log(`error: ${JSON.stringify(err)}`)
    }
}

myQuery().then(() => console.log('done')).catch(err => console.log(err))
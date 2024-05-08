import sql from 'mssql';

// Environment settings - no user or password
const server = process.env.AZURE_SQL_SERVER;
const database = process.env.AZURE_SQL_DATABASE;
const port = parseInt(process.env.AZURE_SQL_PORT);

// Passwordless configuration
const config = {
    server,
    port,
    database,
    authentication: {
        type: 'azure-active-directory-default',
    },
    options: {
        encrypt: true,
        clientId: process.env.AZURE_CLIENT_ID  // <----- user-assigned managed identity        
    }
};

// Existing applicaton code
export default class Database {
    config = {};
    poolconnection = null;
    connected = false;
    
    constructor(config) {
        this.config = config;
        console.log(`Database: config: ${JSON.stringify(config)}`);
    }
    
    async connect() {
        try {
            console.log(`Database connecting...${this.connected}`);
            if (this.connected === false) {
                this.poolconnection = await sql.connect(this.config);
                this.connected = true;
                console.log('Database connection successful');
            } else {
                console.log('Database already connected');
            }
        } catch (error) {
            console.error(`Error connecting to database: ${JSON.stringify(error)}`);
        }
    }
    
    async disconnect() {
        try {
            this.poolconnection.close();
            console.log('Database connection closed');
        } catch (error) {
            console.error(`Error closing database connection: ${error}`);
        }
    }
    
    async executeQuery(query) {
        await this.connect();
        const request = this.poolconnection.request();
        const result = await request.query(query);
    
        return result.rowsAffected[0];
    }
}

const databaseClient = new Database(config);
const result = await databaseClient.executeQuery(`select * from mytable where id = 10`);
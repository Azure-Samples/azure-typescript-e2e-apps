import sql, { config, ConnectionPool } from 'mssql';
export { config, ConnectionPool } from 'mssql';

export default class Database {
  #config: config | string | undefined = undefined;
  #poolconnection: ConnectionPool | undefined = undefined;
  #connected = false;

  constructor(config: config) {
    this.#config = config;
    console.log(`Database: config: ${JSON.stringify(config)}`);
  }

  async connect() {
    try {
      console.log(`Database connecting...${this.#connected}`);
      if (!this.#connected && this.#config !== undefined) {
        this.#poolconnection = await sql.connect(this.#config);
        this.#connected = true;
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
      if (this.#poolconnection !== undefined) {
        this.#poolconnection.close();
        console.log('Database connection closed');
      }
    } catch (error) {
      console.error(`Error closing database connection: ${error}`);
    }
  }

  async executeQuery(query: string) {
    await this.connect();
    if (this.#poolconnection !== undefined) {
      const request = this.#poolconnection.request();
      const result = await request.query(query);

      return result.rowsAffected[0];
    } else {
      throw new Error('Database connection not established');
    }
  }
}

/*

// .env
AZURE_SQL_SERVER=<YOUR_SERVER_NAME>.database.windows.net
AZURE_SQL_DATABASE=<YOUR_DATABASE_NAME>
AZURE_SQL_PORT=1433
AZURE_SQL_AUTHENTICATIONTYPE=azure-active-directory-default

const config = {
    server:process.env.AZURE_SQL_SERVER,
    port: process.env.AZURE_SQL_PORT,
    database: process.env.AZURE_SQL_DATABASE,
    authentication: {
        type: process.env.AZURE_SQL_AUTHENTICATIONTYPE // `azure-active-directory-default`
    },
    options: {
        encrypt: true
    }
};

const database = new Database(config);
const result = await database.executeQuery(`select * from mytable where id = 10`)

*/

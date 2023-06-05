import sql, { IOptions, config, ConnectionPool } from 'mssql';

const passwordless = 'azure-active-directory-default';

/*
export interface config {
    driver?: string | undefined;
    user?: string | undefined;
    password?: string | undefined;
    server: string;
    port?: number | undefined;
    domain?: string | undefined;
    database?: string | undefined;
    connectionTimeout?: number | undefined;
    requestTimeout?: number | undefined;
    stream?: boolean | undefined;
    parseJSON?: boolean | undefined;
    options?: IOptions | undefined;
    pool?: PoolOpts<Connection> | undefined;
    arrayRowMode?: boolean | undefined;
    authentication?: tds.ConnectionAuthentication | undefined;
}
*/

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
const server = process.env.AZURE_SQL_SERVER;
const database = process.env.AZURE_SQL_DATABASE;
const port = parseInt(process.env.AZURE_SQL_PORT);
const type = process.env.AZURE_SQL_AUTHENTICATIONTYPE;

const config = {
    server,
    port,
    database,
    authentication: {
        type           // passwordless config setting:azure-active-directory-default
    },
    options: {
        encrypt: true
    }
};

const database = new Database(config);
const result = await database.executeQuery(`select * from mytable where id = 10`)
*/

import sql from 'mssql';

/*
const config = {
  user: 'username',
  password: 'password',
  server: 'serverurl',
  database: 'databaseName',
  options: {
    encrypt: true // for Azure users
  }
};
*/

class Database {

  private config: any;
  private poolconnection: sql.ConnectionPool;
  private connected: boolean=false;

  constructor(config) {
    this.config = config;
  }

  async connect() {
    try {
      if(!this.connected){
        this.poolconnection = await sql.connect(this.config);
        this.connected=true;
        console.log('Database connection successful');
      } else {
        console.log('Database already connected');
      }

    } catch (error) {
      console.error(`Error connecting to database: ${error}`);
    }
  }

  async disconnect() {
    try {
      // @ts-ignore
      sql.close();
      console.log('Database connection closed');
    } catch (error) {
      console.error(`Error closing database connection: ${error}`);
    }
  }

  async create(table, data) {
    try {
      await this.connect();
      const request = this.poolconnection.request();

      request.input('name', sql.NVarChar(255), data.name);
      request.input('email', sql.NVarChar(255), data.email);
      request.input('password', sql.NVarChar(255), data.password);

      const result = await request
        .query(`INSERT INTO ${table} (name, email, password) VALUES (@name, @email, @password)`);
      return result.recordset[0];
    } catch (error) {
      console.error(`Error creating record: ${error}`);
    }
  }

  async readAll(table) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .query(`SELECT * FROM ${table}`);
      return result.recordset[0];
    } catch (error) {
      console.error(`Error reading record: ${error}`);
    }
  }

  async read(table, id) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('id', sql.Int, id)
        .query(`SELECT * FROM ${table} WHERE id = @id`);
      return result.recordset[0];
    } catch (error) {
      console.error(`Error reading record: ${error}`);
    }
  }

  async update(table, id, data) {
    try {
      await this.connect();
      const request = this.poolconnection.request();

      request.input('id', sql.Int, id);
      request.input('name', sql.NVarChar(255), data.name);
      request.input('email', sql.NVarChar(255), data.email);
      request.input('password', sql.NVarChar(255), data.password);

      const result = await request
        .query(`UPDATE ${table} SET name=@name, email=@email, password=@password WHERE id = @id`);
      return result.recordset[0];
    } catch (error) {
      console.error(`Error updating record: ${error}`);
    }
  }

  async delete(table, id) {
    try {
      await this.connect();
      const request = this.poolconnection.request();
      const result = await request
        .input('id', sql.Int, id)
        .query(`DELETE FROM ${table} WHERE id = @id`);
      return result.recordset[0];
    } catch (error) {
      console.error(`Error deleting record: ${error}`);
    }
  }
}

export default Database;
import sql from 'mssql';

let database = null;

export default class Database {
  private config: any;
  private poolconnection: sql.ConnectionPool;
  private connected = false;

  constructor(config) {
    this.config = config;
  }

  async connect() {
    try {
      this.poolconnection = await sql.connect(this.config);
      this.connected = true;
      console.log('Database connected successfully.');
      return this.poolconnection;
    } catch (error) {
      console.error('Error connecting to the database:', error);
      this.connected = false;
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

  async create(table, data) {
    const request = this.poolconnection.request();

    request.input('firstName', sql.NVarChar(255), data.firstName);
    request.input('lastName', sql.NVarChar(255), data.lastName);

    const result = await request.query(
      `INSERT INTO ${table} (firstName, lastName) VALUES (@firstName, @lastName)`
    );

    return result.rowsAffected[0];
  }

  async readAll(table) {
    const request = this.poolconnection.request();
    const result = await request.query(`SELECT * FROM ${table}`);

    return result.recordsets[0];
  }

  async read(table, id) {
    const request = this.poolconnection.request();
    const result = await request
      .input('id', sql.Int, +id)
      .query(`SELECT * FROM ${table} WHERE id = @id`);

    return result.recordset[0];
  }

  async update(table, id, data) {
    const request = this.poolconnection.request();

    request.input('id', sql.Int, +id);
    request.input('firstName', sql.NVarChar(255), data.firstName);
    request.input('lastName', sql.NVarChar(255), data.lastName);

    const result = await request.query(
      `UPDATE ${table} SET firstName=@firstName, lastName=@lastName WHERE id = @id`
    );

    return result.rowsAffected[0];
  }

  async delete(table, id) {
    console.log(`id: ${JSON.stringify(+id)}`);
    const idAsNumber = Number(id);

    const request = this.poolconnection.request();
    const result = await request
      .input('id', sql.Int, idAsNumber)
      .query(`DELETE FROM ${table} WHERE id = @id`);

    return result.rowsAffected[0];
  }
}

async function createTable() {
  if (process.env.NODE_ENV === 'development') {
    this.executeQuery(
      `IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Person')
       BEGIN
         CREATE TABLE Person (
           id int NOT NULL IDENTITY, 
           firstName varchar(255), 
           lastName varchar(255)
         );
       END`
    )
      .then(() => {
        console.log('Table created');
      })
      .catch((err) => {
        // Table may already exist
        console.error(`Error creating table: ${err}`);
      });
  }
}

export const createDatabaseConnection = async (passwordConfig) => {
  database = new Database(passwordConfig);
  await database.connect();
  return database;
};

import sql from "mssql";

class Database {
  private config: any;
  private poolconnection: sql.ConnectionPool;
  private connected: boolean = false;

  constructor(config) {
    this.config = config;
    console.log(`Database: config: ${JSON.stringify}`)
  }

  async connect() {
    try {
      console.log(`Database connecting...${this.connected}`)
      if (this.connected===false) {
        this.poolconnection = await sql.connect(this.config);
        this.connected = true;
        console.log("Database connection successful");
      } else {
        console.log("Database already connected");
      }
    } catch (error) {
      console.error(`Error connecting to database: ${JSON.stringify(error)}`);
    }
  }

  async disconnect() {
    try {
      this.poolconnection.close();
      console.log("Database connection closed");
    } catch (error) {
      console.error(`Error closing database connection: ${error}`);
    }
  }

  async create(table, data) {

    await this.connect();
    const request = this.poolconnection.request();

    request.input("name", sql.NVarChar(255), data.name);
    request.input("email", sql.NVarChar(255), data.email);
    request.input("password", sql.NVarChar(255), data.password);

    const result = await request.query(
      `INSERT INTO ${table} (name, email, password) VALUES (@name, @email, @password)`
    );

    return result.rowsAffected[0];
  }

  async readAll(table) {

    await this.connect();
    const request = this.poolconnection.request();
    const result = await request.query(`SELECT * FROM ${table}`);

    return result.recordsets[0];
  }

  async read(table, id) {

    await this.connect();

    const request = this.poolconnection.request();
    const result = await request
      .input("id", sql.Int, +id)
      .query(`SELECT * FROM ${table} WHERE id = @id`);

    return result.recordset[0];

  }

  async update(table, id, data) {

    await this.connect();

    const request = this.poolconnection.request();

    request.input("id", sql.Int, +id);
    request.input("name", sql.NVarChar(255), data.name);
    request.input("email", sql.NVarChar(255), data.email);
    request.input("password", sql.NVarChar(255), data.password);

    const result = await request.query(
      `UPDATE ${table} SET name=@name, email=@email, password=@password WHERE id = @id`
    );

    return result.rowsAffected[0];
  }

  async delete(table, id) {

    await this.connect();

    console.log(`id: ${JSON.stringify(+id)}`);
    const idAsNumber = Number(id)

    const request = this.poolconnection.request();
    const result = await request
      .input("id", sql.Int, idAsNumber)
      .query(`DELETE FROM ${table} WHERE id = @id`);

    return result.rowsAffected[0];
  }
}

export default Database;

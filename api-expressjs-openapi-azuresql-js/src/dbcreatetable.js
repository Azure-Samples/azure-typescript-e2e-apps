// Create SQL table - don't do this in production
const Database = require('./dbazuresql');
const { noPasswordConfig, passwordConfig } = require('./config');

const config = noPasswordConfig;
console.log(`DB Config: ${JSON.stringify(config)}`);

async function createTable() {
  const database = new Database(config);
  await database.createTable();
}

module.exports = { createTable };

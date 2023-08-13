const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = "";
const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });

// Database Name
const dbName = 'test';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('users');

  // the following code examples can be pasted here...
  const findResult = await collection.find({}).toArray();

  return findResult;
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
import { CosmosClient } from '@azure/cosmos';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout exceeded'));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeout);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeout);
        reject(error);
      });
  });
}

async function insertData(
  resourceName: string,
  key: string,
  data: any,
  databaseName = 'test',
  containerName = 'test'
): Promise<any> {
  const client = new CosmosClient({
    endpoint: `https://${resourceName}.documents.azure.com`,
    key
  });
  console.log('client created');
  const { database } = await client.databases.createIfNotExists({
    id: databaseName
  });
  console.log('database created');
  const { container } = await database.containers.createIfNotExists({
    id: containerName
  });
  console.log('container created');
  const { resource: item } = await container.items.create({
    id: uuidv4().toString(),
    ...data
  });
  console.log('item created');
  return item;
}

const name = process.env.AZURE_COSMOSDB_NAME as string;
const key = process.env.AZURE_COSMOSDB_KEY as string;
const timeoutMs = 300000;
const wrappedPromise = withTimeout(
  insertData(name, key, { name: 'hello', age: 21 }),
  timeoutMs
);

wrappedPromise
  .then((result) => {
    console.log('Operation finished ', result); // Data fetched successfully
    process.exit(0);
  })
  .catch((error) => {
    console.log("Operation didn't finish", error.message); // Timeout exceeded
    process.exit(1);
  });

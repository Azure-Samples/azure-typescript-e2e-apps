import { CosmosClient } from '@azure/cosmos';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

const name = process.env.AZURE_COSMOSDB_NAME as string;
const key = process.env.AZURE_COSMOSDB_KEY as string;
const client = new CosmosClient({
  endpoint: `https://${name}.documents.azure.com`,
  key
});
console.log('client created');
async function findDatabases(): Promise<any> {
  const database1 = await client.databases.createIfNotExists({
    id: 'test1'
  });
  const database2 = await client.databases.createIfNotExists({
    id: 'test2'
  });

  const { resources } = await client.databases
    .query({
      query: `SELECT * FROM root r where r.id =@dbId`,
      parameters: [
        {
          name: '@dbId',
          value: 'test1'
        }
      ]
    })
    .fetchAll();

  console.log('databases found');
  return resources;
}

findDatabases()
  .then((result) => {
    console.log('Operation finished ', result); // Data fetched successfully
    process.exit(0);
  })
  .catch((error) => {
    console.log("Operation didn't finish", error.message); // Timeout exceeded
    process.exit(1);
  });

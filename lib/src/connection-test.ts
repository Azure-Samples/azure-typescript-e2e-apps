import { CosmosClient } from '@azure/cosmos';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();

/*

This should eventually fail if resource isn't there or permissions are wrong. 

TBD: Why doesn't it fail for those circumstances?

*/

async function main() {
  const name = process.env.AZURE_COSMOSDB_NAME as string;
  const key = process.env.AZURE_COSMOSDB_KEY as string;
  const client = new CosmosClient({
    endpoint: `https://${name}.documents.azure.com`,
    key,
    connectionPolicy: {
      requestTimeout: 1000,
      retryOptions: {
        maxRetryAttemptCount: 0,
        fixedRetryIntervalInMilliseconds: 0,
        maxWaitTimeInSeconds: 1000
      }
    }
  });
  const { database } = await client.databases.createIfNotExists({
    id: 'test'
  });
  const { container } = await database.containers.createIfNotExists({
    id: 'test'
  });
  const { resource: item } = await container.items.create({
    id: uuidv4().toString(),
    name: 'test'
  });
  console.log('Created item:', item);
}
main().catch((error: any) => {
  console.error('Error running connection test:', error);
});

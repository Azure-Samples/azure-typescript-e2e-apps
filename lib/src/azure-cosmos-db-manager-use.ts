import { ItemManager } from './azure-cosmos-db-manager';

async function run() {
  try {
    const name = process.env.AZURE_COSMOSDB_NAME as string;
    const key = process.env.AZURE_COSMOSDB_KEY as string;
    const databaseManager = new ItemManager(name, key);

    try {
      const resourceResult = await databaseManager.getInfo();
      console.log(resourceResult);
    } catch (error) {
      console.log(error);
    }

    // const itemResponse = await databaseManager.createItem({
    //   id: '1',
    //   name: 'test',
    //   age: 1
    // });
    // console.log(itemResponse);

    /*
      const databaseResponse = await databaseManager.createDatabase(
        `test-database-${+new Date()}`
      );
      if (!isOk(databaseResponse.statusCode)) {
        console.log("Database wasn't created:", databaseResponse.statusCode);
      }
  
      const containerResponse = await databaseManager.createContainer(
        databaseResponse.database,
        `test-container-${+new Date()}`
      );
      if (!isOk(containerResponse.statusCode)) {
        console.log("Container wasn't created:", containerResponse.statusCode);
      }
      */
  } catch (error) {
    console.error('Error running CRUD operations:', error);
  }
}

run().catch((error) => {
  console.error('Error running CRUD operations:', error);
});

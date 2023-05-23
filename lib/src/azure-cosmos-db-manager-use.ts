import { Resource } from '@azure/cosmos';
import { ItemManager } from './azure-cosmos-db-manager';
import { v4 as uuidv4 } from 'uuid';

type MyItem = {
  id: string;
  name: string;
  age: number;
};

function toMyItem(data: MyItem & Resource) {
  const { id, name, age } = data;
  return { id, name, age };
}
async function run() {
  try {
    const name = process.env.AZURE_COSMOSDB_NAME as string;
    const key = process.env.AZURE_COSMOSDB_KEY as string;
    const databaseManager = new ItemManager<MyItem & Resource>(name, key);

    const resourceResult = await databaseManager.getInfo();
    console.log(resourceResult);

    // name defaults to 'test'
    const databaseResult = await databaseManager.createDatabase();
    console.log(databaseResult);

    // name defaults to 'test'
    const containerResult = await databaseManager.createContainer();
    console.log(containerResult);

    const itemResponseCreate: MyItem = await databaseManager.createItem({
      id: uuidv4(),
      name: 'test',
      age: 1
    });
    // Remove CosmosDB Resource properties
    console.log(itemResponseCreate);

    const itemResponseRead = await databaseManager.readItem(
      itemResponseCreate.id
    );
    console.log(itemResponseRead);

    const itemResponseUpdate = await databaseManager.updateItem(
      itemResponseRead.id,
      {
        id: itemResponseRead.id,
        name: 'test2',
        age: 2
      }
    );
    console.log(itemResponseUpdate);

    const itemResponseRead2 = await databaseManager.readItem(
      itemResponseUpdate.id
    );
    console.log(itemResponseRead2);

    const itemResponseUpsert = await databaseManager.upsertItem({
      id: uuidv4(),
      name: 'test3',
      age: 3
    });
    console.log(itemResponseUpsert);

    // get all items
    const itemResponseReadAll = await databaseManager.queryItems();
    for (const item of itemResponseReadAll) {
      console.log(item);
    }

    await databaseManager.deleteItem(itemResponseRead2.id);
    const myDeletedItem = itemResponseRead2 as MyItem;
    console.log(myDeletedItem);

    // get all items
    const itemResponseReadAll2 = await databaseManager.queryItems();
    for (const item of itemResponseReadAll2) {
      console.log(item);
    }

    // delete container (and all items in it)
    await databaseManager.deleteContainer('test', 'test');
    console.log(`Container deleted`);
  } catch (error) {
    console.error('Error running CRUD operations:', error);
  }
}

run().catch((error) => {
  console.error('Error running CRUD operations:', error);
});

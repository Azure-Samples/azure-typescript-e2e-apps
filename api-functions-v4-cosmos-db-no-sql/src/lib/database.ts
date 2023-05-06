import { CosmosClient } from "@azure/cosmos";

export interface IProduct {
  id: string
  categoryId: string
  categoryName: string
  sku: string
  name: string
  description: string
  price: number
}

class CosmosDb {

  key: string;
  endpoint: string;
  databaseName: string;
  containerName: string;
  partitionKeyPath: string[];

  // Initialize connection variable
  connected = false;

  // Database client
  cosmosClient = null;
  database = null;
  container = null;

  constructor({ key, endpoint, databaseName, containerName, partitionKeyPath }) {
    this.key = key;
    this.endpoint = endpoint;
    this.databaseName = databaseName;
    this.containerName = containerName;
    this.partitionKeyPath = partitionKeyPath;
  }

  async init() {

    if (!this.connected) {

      console.log('Connecting to Cosmos DB');

      // Authenticate to Azure Cosmos DB
      this.cosmosClient = new CosmosClient({ endpoint: this.endpoint, key: this.key });

      const createDbResult = await this.cosmosClient.databases.createIfNotExists({
        id: this.databaseName,
      });
      this.database = createDbResult.database;

      const createContainerResult = await this.database.containers.createIfNotExists({
        id: this.containerName,
        partitionKey: {
          paths: this.partitionKeyPath,
        },
      });
      this.container = createContainerResult.container;
      this.connected = true;
      console.log('Connected to Cosmos DB');

    } else {
      console.log('Already connected to Cosmos DB');
    }
  }

  async getProducts() {
    await this.init()
    const querySpec = {
      query: "SELECT * from c",
    };
    const { resources } = await this.container.items
      .query(querySpec)
      .fetchAll();
    return resources;
  }

  async getProduct(id: string) {
    await this.init()
    const { resource: product } = await this.container.item(id).read();
    return product;
  }

  async addProduct(product: IProduct) {
    await this.init()
    const { resource: createdProduct } = await this.container.items.create(product);
    return createdProduct;
  }

  async updateProduct(product: IProduct) {
    await this.init()
    const { resource: updatedProduct } = await this.container
      .item(product.id)
      .replace(product);
    return updatedProduct;
  }

  async deleteProduct(id: string) {
    await this.init()
    await this.container.item(id).delete();
  }
}


export default CosmosDb;
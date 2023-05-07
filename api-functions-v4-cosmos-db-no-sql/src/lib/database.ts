import { CosmosClient } from "@azure/cosmos";

export interface IProductDocument{
  id: string
  _ird: string
  _self: string
  _etag: string
  _attachments: string
  _ts: number

  name: string
  categoryId: string
  categoryName: string
  sku: string
  description: string
  price: number
}

type OmitUnderscore<T> = Pick<T, Exclude<keyof T, `_${string}`>>

export type IProduct = OmitUnderscore<IProductDocument>
export type IProductInput = Omit<IProduct, "id">

class CosmosDb {

  // Cosmos DB connection information
  // Other connection options can be found here: https://docs.microsoft.com/en-us/azure/cosmos-db/sql-api-sdk-node
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

  getIProductFields(product: IProduct): IProduct {
    return {
      id: product.id,
      name: product.name,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      sku: product.sku,
      description: product.description,
      price: product.price,
    }
  }
  getIProductFieldsFromArray(products: IProduct[]): IProduct[] {
    return products.map(product => this.getIProductFields(product))
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

  async getProducts(): Promise<IProduct[]> {
    await this.init()
    const querySpec = {
      query: "SELECT * from c",
    };
    const { resources } = await this.container.items
      .query(querySpec)
      .fetchAll();

    return this.getIProductFieldsFromArray(resources);
  }

  async getProduct(id: string) {
    await this.init()
    const product: IProduct = await this.container.item(id).read();
    return this.getIProductFields(product);
  }

  async addProduct(product: IProductInput): Promise<IProduct> {
    await this.init()
    const addedProduct = await this.container.items.create(product);
    return this.getIProductFields(addedProduct.resource);
  }

  async updateProduct(id, product: IProductInput): Promise<IProduct>  {
    await this.init()
    const updatedProduct = await this.container
      .item(id)
      .replace({ id, ...product });
    return this.getIProductFields(updatedProduct.resource);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.init()
    await this.container.item(id).delete();
    return;
  }
}


export default CosmosDb;
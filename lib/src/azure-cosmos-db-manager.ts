import {
  CosmosClient,
  DatabaseResponse,
  ContainerResponse,
  ResourceResponse,
  Resource,
  ItemResponse,
  ItemDefinition,
  DatabaseAccount
} from '@azure/cosmos';

import * as dotenv from 'dotenv';
dotenv.config();
type CustomData<T> = Omit<T, '_etag' | '_rid' | '_self' | '_ts'>; // Resource
type CosmosDBData<T> = T;
type HttpResponse<T> = {
  statusCode: number;
  data: T;
};

function isOk<T>(statusCode: number): boolean {
  return statusCode >= 200 && statusCode < 300;
}
type IErrorStatus = {
  statusCode: number;
  statusMessage: string;
};

/**
 * This class expects a resource name and key in the constructor.
 * You must create the database and container before using items in
 * the container. If you don't pass in values, they are defaulted to
 * 'test' and 'test' respectively. When you make any calls to container's
 * items or item, those defaults are also used.
 *
 * @class ItemManager
 */
export class ItemManager<T extends Resource> {
  client: CosmosClient;

  #databaseId = 'test';
  #containerId = 'test';

  constructor(private name: string, private key: string) {
    if (!name || !key) {
      throw new Error('Database name and key must be specified');
    }
    this.client = new CosmosClient({
      endpoint: `https://${name}.documents.azure.com`,
      key
    });
  }
  public async getInfo(): Promise<DatabaseAccount | IErrorStatus> {
    const response = await this.client.getDatabaseAccount();
    if (!isOk(response.statusCode)) {
      return {
        statusCode: response.statusCode,
        statusMessage: 'Error getting database account information.'
      };
    } else {
      if (response.resource) {
        return response.resource;
      } else {
        return {
          statusCode: 500,
          statusMessage: 'DbManager: No resource found'
        };
      }
    }
  }

  async createItem(
    item: CustomData<T>,
    databaseId: string = this.#databaseId,
    containerId: string = this.#containerId
  ): Promise<CustomData<T>> {
    return this.executeAction(
      () =>
        this.client
          .database(databaseId)
          .container(containerId)
          .items.create(item),
      'create item'
    );
  }

  async readItem(
    id: string,
    databaseId: string = this.#databaseId,
    containerId: string = this.#containerId
  ): Promise<CustomData<T>> {
    return this.executeAction(
      () =>
        this.client
          .database(databaseId)
          .container(containerId)
          .item(id)
          .read<CustomData<T>>(),
      'read item'
    );
  }

  async updateItem(
    id: string,
    updatedItem: CustomData<T>,
    databaseId: string = this.#databaseId,
    containerId: string = this.#containerId
  ): Promise<CustomData<T>> {
    const currentItem = await this.readItem(id);
    const itemToUpdate = { ...currentItem, ...updatedItem };
    return this.executeAction(
      () =>
        this.client
          .database(databaseId)
          .container(containerId)
          .item(id)
          .replace(itemToUpdate),
      'update item'
    );
  }

  async deleteItem(
    id: string,
    databaseId: string = this.#databaseId,
    containerId: string = this.#containerId
  ): Promise<void> {
    await this.executeAction(
      () =>
        this.client
          .database(databaseId)
          .container(containerId)
          .item(id)
          .delete(),
      'delete item'
    );
  }

  async queryItems(
    query = 'SELECT * from c',
    databaseId: string = this.#databaseId,
    containerId: string = this.#containerId
  ): Promise<CustomData<T>[]> {
    return (
      await this.client
        .database(databaseId)
        .container(containerId)
        .items.query(query)
        .fetchAll()
    ).resources as CustomData<T>[];
  }

  async upsertItem(
    item: CustomData<T>,
    databaseId: string = this.#databaseId,
    containerId: string = this.#containerId
  ): Promise<CustomData<T>> {
    const { resource, statusCode } = await this.client
      .database(databaseId)
      .container(containerId)
      .items.upsert<CustomData<T>>(item);
    this.checkStatusCode(statusCode, 'upsert item');
    const customData = resource as CustomData<T>;
    return customData;
  }

  async createDatabase(
    databaseId: string = this.#databaseId
  ): Promise<DatabaseResponse> {
    return await this.client.databases.createIfNotExists({
      id: databaseId
    });
  }

  async deleteDatabase(databaseId: string): Promise<DatabaseResponse> {
    return await this.client.database(databaseId).delete();
  }

  async createContainer(
    databaseId: string = this.#databaseId,
    containerId: string = this.#containerId
  ): Promise<ContainerResponse> {
    return await this.client.database(databaseId).containers.createIfNotExists({
      id: containerId
    });
  }

  async deleteContainer(
    databaseId: string = this.#databaseId,
    containerId: string
  ): Promise<ContainerResponse> {
    return await this.client
      .database(databaseId)
      .container(containerId)
      .delete();
  }
  private checkStatusCode(statusCode: number, action: string): void {
    if (statusCode >= 400) {
      throw new Error(`Failed to ${action}. Status code: ${statusCode}`);
    }
  }

  private async executeAction<R>(
    action: () => Promise<ResourceResponse<T> | ItemResponse<ItemDefinition>>,
    actionName: string
  ): Promise<CustomData<T>> {
    const response = await action();
    this.checkStatusCode(response.statusCode, actionName);
    const customData = response.resource as CustomData<T>;
    return customData;
  }

  createTFromResource<T extends Resource, K extends keyof T>(
    obj: T,
    ...keys: K[]
  ): Pick<T, K> {
    const picked: Partial<Pick<T, K>> = {};

    keys.forEach((key) => {
      picked[key] = obj[key];
    });

    return picked as Pick<T, K>;
  }
}

import {
  CosmosClient,
  Database,
  DatabaseResponse,
  Container,
  ContainerResponse,
  ResourceResponse,
  ItemResponse,
  ItemDefinition,
  DatabaseAccount
} from '@azure/cosmos';

import * as dotenv from 'dotenv';
dotenv.config();
type CustomData<T> = Omit<T, '_etag' | '_rid' | '_self' | '_ts'>;
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
type ItemManagerOptions = {
  databaseId: string;
  containerId: string;
};

export class ItemManager<T> {
  client: CosmosClient;

  options: ItemManagerOptions = {
    databaseId: 'test',
    containerId: `test-${+new Date()}`
  };

  constructor(
    private name: string,
    private key: string,
    private databaseOptions?: ItemManagerOptions
  ) {
    if (databaseOptions?.databaseId) {
      this.options.databaseId = databaseOptions.databaseId;
    }

    if (databaseOptions?.containerId) {
      this.options.containerId = databaseOptions.containerId;
    }

    if (!name || !key) {
      throw new Error('Database name and key must be specified');
    }

    this.client = new CosmosClient({
      endpoint: `https://${name}.documents.azure.com`,
      key
    });
    console.log(`Created client for ${name} and ${key.substring(0, 3)}...`);
  }
  public async getInfo(): Promise<
    ResourceResponse<DatabaseAccount> | IErrorStatus
  > {
    if (!this.client) {
      return { statusCode: 400, statusMessage: 'Client not found' };
    }
    const response = await this.client.getDatabaseAccount();
    return response;
  }
  private async getContainer(
    options?: ItemManagerOptions
  ): Promise<Container | undefined> {
    const databaseResult = await this.createDatabase(
      options?.databaseId || this.options.databaseId
    );

    if (!isOk(databaseResult.statusCode) || !('database' in databaseResult)) {
      return undefined;
    }

    if (!databaseResult.database) {
      const containerResult = await this.createContainer(
        databaseResult.database,
        options?.containerId || this.options.containerId
      );

      if (!isOk(containerResult.statusCode)) {
        return undefined;
      }
      return containerResult.container;
    }
  }

  async createItem(
    item: CustomData<T>,
    settings?: ItemManagerOptions
  ): Promise<CustomData<T>> {
    const container = await this.getContainer(settings);
    if (!container) {
      throw new Error('Container not found');
    }
    return this.executeAction(
      () => container.items.create(item),
      'create item'
    );
  }
  /*
  async readItem(id: string): Promise<CustomData<T>> {
    return this.executeAction(
      () => container.item(id).read<CustomData<T>>(),
      'read item'
    );
  }

  async updateItem(
    id: string,
    updatedItem: CustomData<T>
  ): Promise<CustomData<T>> {
    const currentItem = await this.readItem(id);
    const itemToUpdate = { ...currentItem, ...updatedItem };
    return this.executeAction(
      () => this.container.item(id).replace(itemToUpdate),
      'update item'
    );
  }

  async deleteItem(id: string): Promise<void> {
    await this.executeAction(
      () => this.container.item(id).delete(),
      'delete item'
    );
  }

  async queryItems(query: string): Promise<CustomData<T>[]> {
    return (await this.container.items.query(query).fetchAll())
      .resources as CustomData<T>[];
  }

  async upsertItem(item: CustomData<T>): Promise<CustomData<T>> {
    const { resource, statusCode } = await this.container.items.upsert<
      CustomData<T>
    >(item);
    this.checkStatusCode(statusCode, 'upsert item');
    const customData = resource as CustomData<T>;
    return customData;
  }
*/
  private async createDatabase(
    databaseId: string
  ): Promise<DatabaseResponse | IErrorStatus> {
    const errorResult: IErrorStatus = {
      statusCode: 500,
      statusMessage: 'Error - Default error'
    };
    try {
      if (databaseId) {
        const databaseCreateResult =
          await this.client.databases.createIfNotExists({
            id: databaseId
          });
        return databaseCreateResult;
      }
    } catch (e) {
      console.log(e);
    }
    return errorResult;
  }

  private async deleteDatabase(databaseId: string): Promise<DatabaseResponse> {
    return await this.client.database(databaseId).delete();
  }

  private async createContainer(
    database: Database,
    containerName: string
  ): Promise<ContainerResponse> {
    return await database.containers.create({ id: containerName });
  }

  private async deleteContainer(
    database: Database,
    containerName: string
  ): Promise<ContainerResponse> {
    const container = await database.container(containerName);
    return container.delete();
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
}

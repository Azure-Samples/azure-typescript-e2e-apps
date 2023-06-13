import { DefaultAzureCredential } from '@azure/identity';
import {
  BlobClient,
  BlobItem,
  BlockBlobClient,
  BlobUploadCommonResponse,
  ContainerClient,
  BlobSASPermissions,
  BlobServiceClient,
  SASProtocol,
  ContainerDeleteIfExistsResponse
} from '@azure/storage-blob';
import { Response, AuthenticationConfigurationOptions } from './models';

export default class AzureSampleStorageBlobClient {
  #connectionConfig: AuthenticationConfigurationOptions;
  #storageClient: any;

  constructor(connectionConfiguration: AuthenticationConfigurationOptions) {
    this.#connectionConfig = connectionConfiguration;
  }
  async uploadWithSasToken(
    uploadUrlWithFileName: string,
    sasToken: string,
    blob: any
  ): Promise<Response> {
    let blobServiceClient: BlobServiceClient;

    if (!sasToken) {
      return {
        status: 'error',
        data: undefined,
        error: new Error('No SAS Token provided')
      };
    }

    if (!uploadUrlWithFileName) {
      return {
        status: 'error',
        data: undefined,
        error: new Error('No uploadUrl provided')
      };
    }
    if (!blob) {
      return {
        status: 'error',
        data: undefined,
        error: new Error('No blob provided')
      };
    }

    const blockBlobClient = new BlockBlobClient(
      // URL includes SAS token
      `${uploadUrlWithFileName}?${sasToken}`
    );

    // upload file
    await blockBlobClient.uploadData(blob);

    return {
      status: 'success',
      data: undefined,
      error: undefined
    };
  }

  async getContainerClient(
    blobServiceClient: BlobServiceClient,
    containerName: string
  ): Promise<ContainerClient> {
    const containerClient: ContainerClient =
      await blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();
    return containerClient;
  }
  async getBlockBlobClient(
    containerClient: ContainerClient,
    blobName: string
  ): Promise<BlockBlobClient> {
    const blockBlobClient: BlockBlobClient =
      containerClient.getBlockBlobClient(blobName);
    return blockBlobClient;
  }

  async uploadBlob(
    blobClient: BlockBlobClient,
    blob: Blob | ArrayBuffer | ArrayBufferView | Buffer
  ): Promise<BlobUploadCommonResponse> {
    return await blobClient.uploadData(blob);
  }

  /**
   * Utility method for generating a secure short-lived SAS URL for a blob.
   * To know more about SAS URLs, see: https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview
   * @connectionString connectionString - string
   * @param containerName - string (User's alias)
   * @param filename - string
   */
  async generateReadOnlySASUrl(
    connectionString: string,
    containerName: string,
    filename: string
  ): Promise<Response> {
    // get storage client
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);

    // get container client
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // connect to blob client
    const blobClient = containerClient.getBlobClient(filename);

    // Best practice: create time limits
    const SIXTY_MINUTES = 60 * 60 * 1000;
    const NOW = new Date();

    // Create SAS URL
    const accountSasTokenUrl = await blobClient.generateSasUrl({
      startsOn: NOW,
      expiresOn: new Date(new Date().valueOf() + SIXTY_MINUTES),
      permissions: BlobSASPermissions.parse('r'), // Read only permission to the blob
      protocol: SASProtocol.Https // Only allow HTTPS access to the blob
    });
    return {
      data: {
        storageSasUrl: accountSasTokenUrl,
        storageAccountName: blobClient.accountName
      },
      status: 'success',
      error: undefined
    };
  }
  async getBlobsInContainer(
    containerClient: ContainerClient
  ): Promise<BlobItem[]> {
    const returnedBlobUrls: BlobItem[] = [];

    // get list of blobs in container
    // eslint-disable-next-line
    for await (const blob of containerClient.listBlobsFlat()) {
      console.log(`Blob: ${blob.name}`);
      returnedBlobUrls.push(blob);
    }

    return returnedBlobUrls;
  }
  async createContainer(
    containerName: string,
    blobServiceClient: BlobServiceClient
  ): Promise<ContainerClient> {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();
    return containerClient;
  }
  async deleteContainer(
    containerName: string,
    blobServiceClient: BlobServiceClient
  ): Promise<void> {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.deleteIfExists();
  }
}

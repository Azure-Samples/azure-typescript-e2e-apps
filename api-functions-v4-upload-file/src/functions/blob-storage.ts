
import {
  BlobClient,
  BlobItem,
  BlockBlobClient,
  BlobUploadCommonResponse,
  ContainerClient,
  BlobSASPermissions,
  BlobServiceClient,
  SASProtocol,
  ContainerDeleteIfExistsResponse,
  BlockBlobParallelUploadOptions
} from '@azure/storage-blob';
export type Response = {
  data?: any;
  status: string | number;
  error?: Error;
};

export type DebugOptions = {
  debug: boolean;
  logger: (message: string) => void;
};

export default class AzureSampleStorageBlobClient {
  #connectionConfig: any;
  #storageClient: any;

  constructor(connectionConfiguration: any) {
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

  async uploadBlob(
    blobClient: BlockBlobClient,
    blob: Buffer | Blob | ArrayBuffer | ArrayBufferView,
    options?: BlockBlobParallelUploadOptions
  ): Promise<BlobUploadCommonResponse> {
    return await blobClient.uploadData(blob, options);
  }

  async createBlobFromReadStream(containerClient, blobName, readableStream, uploadOptions) {

    // Transform stream
    // Reasons to transform:
    // 1. Sanitize the data - remove PII
    // 2. Compress or uncompress
    // @ts-ignore
    const myTransform = new Transform({
      transform(chunk, encoding, callback) {
        // see what is in the artificially
        // small chunk
        console.log(chunk);
        callback(null, chunk);
      },
      decodeStrings: false
    });

    // Create blob client from container client
    const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

    // Size of every buffer allocated, also 
    // the block size in the uploaded block blob. 
    // Default value is 8MB
    const bufferSize = 4 * 1024 * 1024;

    // Max concurrency indicates the max number of 
    // buffers that can be allocated, positive correlation 
    // with max uploading concurrency. Default value is 5
    const maxConcurrency = 20;

    // use transform per chunk - only to see chunck
    const transformedReadableStream = readableStream.pipe(myTransform);

    // Upload stream
    await blockBlobClient.uploadStream(transformedReadableStream, bufferSize, maxConcurrency, uploadOptions);

    // do something with blob
    const getTagsResponse = await blockBlobClient.getTags();
    console.log(`tags for ${blobName} = ${JSON.stringify(getTagsResponse.tags)}`);
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

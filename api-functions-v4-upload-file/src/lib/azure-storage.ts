// Used to get read-only SAS token URL
import {
  BlobSASPermissions,
  BlobServiceClient,
  ContainerClient,
  SASProtocol,
  StorageSharedKeyCredential
} from '@azure/storage-blob';

function getBlobServiceClient(serviceName, serviceKey) {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    serviceName,
    serviceKey
  );
  const blobServiceClient = new BlobServiceClient(
    `https://${serviceName}.blob.core.windows.net`,
    sharedKeyCredential
  );

  return blobServiceClient;
}

async function createContainer(
  containerName: string,
  blobServiceClient: BlobServiceClient
): Promise<ContainerClient> {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  return containerClient;
}

export async function uploadBlob(
  serviceName: string,
  serviceKey: string,
  fileName: string,
  containerName: string,
  blob: Buffer
): Promise<string> {
  if (!serviceName || !serviceKey || !fileName || !containerName || !blob) {
    return 'Upload function missing parameters';
  }

  const blobServiceClient = getBlobServiceClient(serviceName, serviceKey);

  const containerClient = await createContainer(
    containerName,
    blobServiceClient
  );
  const blockBlobClient = await containerClient.getBlockBlobClient(fileName);
  const response = await blockBlobClient.uploadData(blob);

  return response.errorCode;
}

export const generateSASUrl = async (
  serviceName: string,
  serviceKey: string,
  containerName: string,
  fileName: string, // hierarchy of folders and file name: 'folder1/folder2/filename.ext'
  permissions = 'r'
): Promise<string> => {
  if (!serviceName || !serviceKey || !fileName || !containerName) {
    return 'Generate SAS function missing parameters';
  }

  const blobServiceClient = getBlobServiceClient(serviceName, serviceKey);
  const containerClient = await createContainer(
    containerName,
    blobServiceClient
  );
  const blockBlobClient = await containerClient.getBlockBlobClient(fileName);

  // Best practice: create time limits
  const SIXTY_MINUTES = 60 * 60 * 1000;
  const NOW = new Date();

  // Create SAS URL
  const accountSasTokenUrl = await blockBlobClient.generateSasUrl({
    startsOn: NOW,
    expiresOn: new Date(new Date().valueOf() + SIXTY_MINUTES),
    permissions: BlobSASPermissions.parse(permissions), // Read only permission to the blob
    protocol: SASProtocol.Https // Only allow HTTPS access to the blob
  });

  return accountSasTokenUrl;
};

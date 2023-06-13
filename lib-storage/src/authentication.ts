import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  AnonymousCredential
} from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';

function getServiceUrl(accountName: string): string {
  return `https://${accountName}.blob.core.windows.net`;
}

export function blobServiceClientFromAccountNameAndKey(
  accountName: string,
  accountKey: string
): BlobServiceClient {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );
  return new BlobServiceClient(getServiceUrl(accountName), sharedKeyCredential);
}
export function blobServiceClientFromConnectionString(
  connectionString: string
): BlobServiceClient {
  return BlobServiceClient.fromConnectionString(connectionString);
}
export function blobServiceClientFromSasTokenUrl(
  accountName: string,
  sasToken: string
): BlobServiceClient {
  return new BlobServiceClient(
    `${getServiceUrl(accountName)}?${sasToken}`,
    undefined
  );
}
export function blobServiceClientFromAnonymousCredential(
  accountName: string
): BlobServiceClient {
  return new BlobServiceClient(
    getServiceUrl(accountName),
    new AnonymousCredential()
  );
}
export function blobServiceClientFromDefaultAzureCredential(
  accountName: string
): BlobServiceClient {
  return new BlobServiceClient(
    getServiceUrl(accountName),
    new DefaultAzureCredential()
  );
}

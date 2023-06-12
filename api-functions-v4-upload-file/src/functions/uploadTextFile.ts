import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { File } from "buffer";
const {
  StorageSharedKeyCredential,
  BlobServiceClient,
  ContainerClient,
} = require("@azure/storage-blob");

async function getContainerClient(containerName: string): Promise<any> {
  const accountName = process.env.Azure_Storage_AccountName;
  const accountKey = process.env.Azure_Storage_AccountKey;

  const baseUrl = `https://${accountName}.blob.core.windows.net`;
  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );
  // Create BlobServiceClient
  const blobServiceClient = new BlobServiceClient(
    `${baseUrl}`,
    sharedKeyCredential
  );
  const containerClient: any = await blobServiceClient.getContainerClient(containerName);
  const containerCreatedResult = await containerClient.createIfNotExists();

  if (containerCreatedResult.succeeded) {
    return containerClient;
  } else {
    return containerCreatedResult.errorCode;
  }
}

export async function postUploadTextFile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    // file content must be passed in as body
    const formData = await request.formData();

    // Form field: name
    const nameObject = formData.get('name') + Date.now().toString();

    /** Set up storage */
    const containerClient = await getContainerClient(nameObject.toString());

    // @ts-ignore
    // Form field: filename
    const textFile: File = formData.get('filename');
    // @ts-ignore
    console.log(`v = ${textFile?.lastModified}`)
    const blobClient = containerClient.getBlockBlobClient(textFile.name);
    // @ts-ignore
    const fileContents = await textFile.text();
    console.log(`fileContents = ${fileContents}`)
    const uploadResult = await blobClient.upload(fileContents, textFile.size);
    console.log(`uploadResult = ${uploadResult}`);

    return { body: `success` };
  }
  catch (error) {
    context.log(`Error: ${error}`);
    return { body: `Error: ${error}` };
  }

};

app.http('upload-text-file', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: postUploadTextFile
});

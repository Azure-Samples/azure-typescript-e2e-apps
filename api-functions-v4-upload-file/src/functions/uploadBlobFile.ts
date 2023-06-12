import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { BlockBlobClient } from "@azure/storage-blob";
import { Transform, Readable, pipeline } from "stream";
import  { Blob, File } from "buffer";
// Azure Storage dependency
const {
    StorageSharedKeyCredential,
    BlobServiceClient,
  } = require("@azure/storage-blob");

  function readableStreamToReadable(stream) {
    const readable = new Readable();
  
    // @ts-ignore 
    pipeline(stream, readable, (err) => {
      if (err) {
        console.error('Error occurred during stream conversion:', err);
      }
    });
  
    return readable;
  }
const streamToText = async (blob) => {
    const readableStream = await blob.getReader();
    const chunk = await readableStream.read();

    return new TextDecoder('utf-8').decode(chunk.value);
  };
  function arrayBufferToReadable(arrayBuffer) {
    const buffer = Buffer.from(arrayBuffer);
    return Readable.from(buffer);
  }
  const bufferToText = (buffer) => {
    const bufferByteLength = buffer.byteLength;
    const bufferUint8Array = new Uint8Array(buffer, 0, bufferByteLength);

    return new TextDecoder().decode(bufferUint8Array);
  };
  async function createBlobFromReadStream(containerClient, blobName, readable, uploadOptions) {

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
    const blockBlobClient: BlockBlobClient = await containerClient.getBlockBlobClient(blobName);
  
    // Size of every buffer allocated, also 
    // the block size in the uploaded block blob. 
    // Default value is 8MB
    const bufferSize = 4 * 1024 * 1024;
  
    // Max concurrency indicates the max number of 
    // buffers that can be allocated, positive correlation 
    // with max uploading concurrency. Default value is 5
    const maxConcurrency = 20;
  
    // use transform per chunk - only to see chunck
    //const transformedReadableStream = readableStream.pipe(myTransform);
  
    // Upload stream
    await blockBlobClient.uploadStream(readable, bufferSize, maxConcurrency, uploadOptions);
  
    // do something with blob
    const getTagsResponse = await blockBlobClient.getTags();
    console.log(`tags for ${blobName} = ${JSON.stringify(getTagsResponse.tags)}`);
  }

export async function postUploadBlobFile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        // file content must be passed in as body
        const formData = await request.formData();

        // Form field: name
        const name = formData.get('name');

/** Set up storage */
const accountName = process.env.Azure_Storage_AccountName;
const accountKey = process.env.Azure_Storage_AccountKey;

const baseUrl = `https://${accountName}.blob.core.windows.net`;
const containerName = `my-container`;
const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
);
// Create BlobServiceClient
const blobServiceClient = new BlobServiceClient(
    `${baseUrl}`,
    sharedKeyCredential
);
const containerClient = await blobServiceClient.getContainerClient(containerName);


        // @ts-ignore
        // Form field: filename
        const textFile:File = formData.get('filename');
        // @ts-ignore
        console.log(`v = ${textFile?.lastModified}`)
        const blobClient = containerClient.getBlockBlobClient(textFile.name);
        // @ts-ignore
        const fileContents = await textFile.text();
        console.log(`fileContents = ${fileContents}`)
        const uploadResult = await blobClient.upload(fileContents, textFile.size);
        console.log(`uploadResult = ${uploadResult}`);

        // // @ts-ignore
        // // Form field: celebrities
        // const imageFile: File = formData.get('celebrities');
        // // @ts-ignore
        // const stream: ReadableStream = await imageFile.stream();
        // const arrayBuffer: ArrayBuffer = await imageFile.arrayBuffer();
        // const readable: Readable = readableStreamToReadable(stream);
            


        //     // Size of every buffer allocated, also 
        //     // the block size in the uploaded block blob. 
        //     // Default value is 8MB
        //     const bufferSize = 4 * 1024 * 1024;

        //     // Max concurrency indicates the max number of 
        //     // buffers that can be allocated, positive correlation 
        //     // with max uploading concurrency. Default value is 5
        //     const maxConcurrency = 20;


        //     // Upload stream
        //     // Create credential

        //     await createBlobFromReadStream(containerClient, imageFile.name, readable, {

        //         // not indexed for searching
        //         metadata: {
        //           owner: 'PhillyProject'
        //         },
            
        //         // indexed for searching
        //         tags: {
        //           createdBy: 'YOUR-NAME',
        //           createdWith: `StorageSnippetsForDocs`,
        //           createdOn: (new Date()).toDateString()
        //         }
        //       });
        //       context.log(`uploaded ${imageFile.name} to ${containerName}`);

        //}

        console.log(name);
        return { body: `Hello ${name}` };
    }
    catch (error) {
        context.log(`Error: ${error}`);
        return { body: `Error: ${error}` };
    }

};

app.http('upload-blob-file', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: postUploadBlobFile
});

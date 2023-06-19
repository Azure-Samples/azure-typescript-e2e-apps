import {
    HttpRequest,
    HttpResponseInit,
    InvocationContext,
    app,
    output
  } from '@azure/functions';

const blobInputConfig = output.storageBlob({
    connection: 'AzureStorage_Uploads',
    path: '{username}/{rand-guid}-{filename}'
  });
  
export async function postUpload(
    request: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
  
    // values from querystring - usable in outbinding for storage
    const username = request.query.get('username') || 'anonymous';
    const filename = request.query.get('filename') || 'unknown-' + Date.now();
  
    // file content must be passed in body
    const formData = await request.formData();
    const temp: any = formData.get('file');
    const uploadedFile: File = temp as File;
  
    // File
    const fileContents = await uploadedFile.arrayBuffer();
    const fileContentsBuffer: Buffer = Buffer.from(fileContents);
    const size = fileContentsBuffer.byteLength;
    console.log(`lastModified = ${uploadedFile?.lastModified}, size = ${size}`);

    // Send File to Inbound blob trigger
    context.extraOutputs.set(blobInputConfig, fileContentsBuffer)

    // return success
    return {
      body: "complete"
    };
  }
  
  app.post('postUpload', {
    route: 'upload',
    authLevel: 'function',
    handler: postUpload,
    extraOutputs: [blobInputConfig],
  });
  
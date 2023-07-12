import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app
} from '@azure/functions';
import { uploadBlob } from '../lib/azure-storage';

export async function postUploadAnyFile(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    /*
    if (
      !process.env?.Azure_Storage_AccountName ||
      !process.env?.Azure_Storage_AccountKey
    ) {
      return {
        status: 500,
        body: 'Missing required app configuration'
      };
    }

    context.log(`Http function processed request for url "${request.url}"`);

    const username = request.query.get('username') || 'anonymous';
    const filename = request.query.get('filename') || 'unknown' + Date.now();
    //const path = `${username}/${filename}`;
    //context.log(path);
    if (!username || !filename) {
      return {
        status: 400,
        body: 'Missing required request properties'
      };
    }

    // file content must be passed in body
    const formData = await request.formData();
    const temp: File = formData.get('file') as unknown as File;
    const uploadedFile: File = temp as File;

    if (!uploadedFile || !uploadedFile.name) {
      return {
        status: 400,
        body: 'Missing required file properties'
      };
    }

    // File
    const fileContents = await uploadedFile.arrayBuffer();
    const fileContentsBuffer: Buffer = Buffer.from(fileContents);
    //const size = fileContentsBuffer.byteLength;

    const uploadStatus = await uploadBlob(
      process.env?.Azure_Storage_AccountName as string,
      process.env?.Azure_Storage_AccountKey as string,
      filename,
      username,
      fileContentsBuffer
    );

    return {
      status: 200,
      jsonBody: {
        uploadStatus
      }
    };
    */
    return {
      jsonBody: { status: 'ok' }
    };
  } catch (error) {
    return {
      status: 500,
      jsonBody: error
    };
  }
}

app.http('upload', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: postUploadAnyFile
});

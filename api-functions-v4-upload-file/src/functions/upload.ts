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
  context.log(`Http function processed request for url "${request.url}"`);

  const username = request.query.get('username') || 'anonymous';
  const filename = request.query.get('filename') || 'unknown' + Date.now();
  const path = `${username}/${filename}`;
  context.log(path);

  // file content must be passed in body
  const formData = await request.formData();
  const temp: any = formData.get('file');
  const uploadedFile: File = temp as File;

  // File
  const fileContents = await uploadedFile.arrayBuffer();
  const fileContentsBuffer: Buffer = Buffer.from(fileContents);
  const size = fileContentsBuffer.byteLength;
  console.log(`lastModified = ${uploadedFile?.lastModified}, size = ${size}`);

  const sasTokenUrl = await uploadBlob(
    process.env?.Azure_Storage_AccountName as string,
    process.env?.Azure_Storage_AccountKey as string,
    filename,
    username,
    fileContentsBuffer
  );

  return {
    jsonBody: {
      filename,
      storageAccountName: process.env.Azure_Storage_AccountName,
      containername: username,
      sasTokenUrl
    }
  };
}

app.http('upload', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: postUploadAnyFile
});

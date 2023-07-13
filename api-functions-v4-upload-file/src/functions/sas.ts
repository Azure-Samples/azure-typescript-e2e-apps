import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app
} from '@azure/functions';
import { getSasUrls } from '../lib/azure-storage.js';

export async function getGenerateSasToken(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log(`Http function processed request for url "${request.url}"`);

  try {
    if (
      !process.env?.Azure_Storage_AccountName ||
      !process.env?.Azure_Storage_AccountKey
    ) {
      return {
        status: 405,
        jsonBody: 'Missing required app configuration'
      };
    }

    const container = request.query.get('container') || 'anonymous';

    const body = await request.json();

    if (!body)
      return {
        status: 406,
        jsonBody: {
          error: 'Missing POST body'
        }
      };
    const fileNames: string[] = body['files'] as string[];
    if (!fileNames || fileNames.length === 0)
      return {
        status: 407,
        jsonBody: {
          error: 'Missing POST body `files` containing file names'
        }
      };
    const permissions = request.query.get('permission') || 'r';

    const sasUrlsResponse = await getSasUrls(fileNames, container, permissions);
    //const sasUrlsResponse = {};

    return {
      jsonBody: {
        sasUrlsResponse,
        storageAccountName: process.env.Azure_Storage_AccountName,
        containername: container
      }
    };
  } catch (error) {
    console.log(error);

    return {
      status: 500,
      jsonBody: error
    };
  }
}

app.http('sas', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: getGenerateSasToken
});

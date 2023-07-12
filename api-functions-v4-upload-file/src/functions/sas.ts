import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  app
} from '@azure/functions';
import { generateSASUrl } from '../lib/azure-storage.js';

export async function getGenerateSasToken(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
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

    context.log(`Http function processed request for url "${request.url}"`);

    const container = request.query.get('container') || 'anonymous';

    const body = await request.json();

    if (!body)
      return {
        status: 404,
        jsonBody: {
          error: 'Missing POST body'
        }
      };
    const fileNames: string[] = body['files'] as string[];
    if (!fileNames || fileNames.length === 0)
      return {
        status: 404,
        jsonBody: {
          error: 'Missing POST body `files` containing file names'
        }
      };
    const permissions = request.query.get('permission') || 'r';

    const sasTokenUrls = [];
    const errors = [];
    const sasTokenPromises = [];

    /*
        for (const name of fileNames) {
          const sasTokenUrl = await generateSASUrl(
            process.env?.Azure_Storage_AccountName as string,
            process.env?.Azure_Storage_AccountKey as string,
            container,
            name,
            permissions
          );
          if (sasTokenUrl) {
            sasTokenUrls.push({ fileName: name, sasTokenUrl: sasTokenUrl });
          } else {
            errors.push(name);
          }
        }
    
        return {
          jsonBody: {
            tokenUrls: sasTokenUrls,
            errors: errors,
            storageAccountName: process.env.Azure_Storage_AccountName,
            containername: container
          }
        };
        */

    return {
      jsonBody: { status: 'ok' }
    };
  } catch (error) {
    console.log(JSON.stringify(error));

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

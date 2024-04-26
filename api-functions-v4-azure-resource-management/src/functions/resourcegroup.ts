/*
-----------------------------------------------------------------------------------
Create Resource Group:

curl -X POST 'http://localhost:7071/api/resourcegroup?name=my-test-1&location=westus'

curl -X POST 'http://localhost:7071/api/resourcegroup?name=my-test-1&location=westus' \
  -H 'content-type: application/json' \
  -d '{"tags": {"a":"b"}}'

  -----------------------------------------------------------------------------------
Delete Resource Group

curl -X DELETE 'http://localhost:7071/api/resourcegroup?name=my-test-1' \
  -H 'Content-Type: application/json'

*/
// <snippet_resourcegroup>
import { ResourceGroup } from '@azure/arm-resources';
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext
} from '@azure/functions';
import {
  createResourceGroup,
  deleteResourceGroup
} from '../lib/azure-resource-groups';
import { processError } from '../lib/error';

export async function resourcegroup(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    console.log(JSON.stringify(request.query));
    console.log(JSON.stringify(request.params));

    const name: string = request.query.get('name');
    const location: string = request.query.get('location');
    console.log(`name: ${name}`);
    console.log(`location: ${location}`);

    switch (request.method) {
      case 'POST': // wait for create to complete before returning
        if (!name || !location) {
          return { body: 'Missing required parameters.', status: 400 };
        }

        if (request.headers.get('content-type') === 'application/json') {
          // create with tags

          const body: Record<string, unknown> =
            (await request.json()) as Record<string, string>;
          const tags: Record<string, string> = body?.tags
            ? (body?.tags as Record<string, string>)
            : null;
          const resourceGroup: ResourceGroup = await createResourceGroup(
            name,
            location,
            tags
          );
          return { jsonBody: resourceGroup, status: 200 };
        } else {
          // create without tags

          const resourceGroup: ResourceGroup = await createResourceGroup(
            name,
            location,
            null
          );
          return { jsonBody: resourceGroup, status: 200 };
        }

      case 'DELETE': // wait for delete to complete before returning
        if (!name) {
          return { body: 'Missing required parameters.', status: 400 };
        }
        await deleteResourceGroup(name);
        return { status: 204 };
    }
  } catch (err: unknown) {
    return processError(err);
  }
}

app.http('resourcegroup', {
  methods: ['DELETE', 'POST'],
  authLevel: 'anonymous',
  handler: resourcegroup
});
// </snippet_resourcegroup>

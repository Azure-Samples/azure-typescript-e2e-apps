/*

Get resources in a subscription

curl http://localhost:7071/api/resources

Get resources in a resource group

curl http://localhost:7071/api/resources?resourceGroupName=REPLACE-WITH-YOUR-RESOURCE-GROUP-NAME

*/
// <snippet_resources>
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext
} from '@azure/functions';
import {
  listResourceByResourceGroup, listResourceBySubscription
} from '../lib/azure-resource';
import { processError } from '../lib/error';

export async function resources(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const resourceGroupName: string = request.query.get('resourceGroupName');
    context.log(`resourceGroupName: '${resourceGroupName}'`);

    if (resourceGroupName) {
      const resourcesByName = await listResourceByResourceGroup(
        resourceGroupName
      );
      return { jsonBody: resourcesByName };
    } else {
      const resourcesBySubscription = await listResourceBySubscription();
      return { jsonBody: resourcesBySubscription };
    }
  } catch (err: unknown) {
    return processError(err);
  }
}
app.http('resources', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: resources
});
// </snippet_resources>
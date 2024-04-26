/*
Get resources in a resource group

curl http://localhost:7071/api/resource-groups
*/
// <snippet_resourcegroups>
import { ResourceGroup } from '@azure/arm-resources';
import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext
} from '@azure/functions';
import { listResourceGroups } from '../lib/azure-resource-groups';
import { processError } from '../lib/error';


export async function resourcegroups(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const {
      list,
      subscriptionId
    }: { list: ResourceGroup[]; subscriptionId: string } =
      await listResourceGroups();

    context.log(
      `${list && list.length ? list.length : 0} resource groups found`
    );

    return {
      jsonBody: {
        subscriptionId,
        list
      }
    };
  } catch (err: unknown) {
    return processError(err);
  }
}

app.http('resourcegroups', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: resourcegroups
});
// </snippet_resourcegroups>
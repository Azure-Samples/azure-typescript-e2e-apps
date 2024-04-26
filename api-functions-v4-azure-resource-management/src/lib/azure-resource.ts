// Include npm dependencies
import { Resource, ResourceManagementClient } from '@azure/arm-resources';
import { DefaultAzureCredential } from '@azure/identity';
import { getSubscriptionId } from './environment-vars';

const subscriptionId = getSubscriptionId();

// Create Azure authentication credentials
const credentials = new DefaultAzureCredential();

// Create Azure SDK client for Resource Management such as resource groups
const resourceManagement = new ResourceManagementClient(
  credentials,
  subscriptionId
);

// all resources groups in subscription
export const listResourceBySubscription = async (): Promise<{
  list: Resource[];
  subscriptionId: string;
}> => {
  const list: Resource[] = [];

  for await (const resource of resourceManagement.resources.list()) {
    list.push(resource);
  }

  return {
    subscriptionId,
    list
  };
};
// all resources groups in resource group
export const listResourceByResourceGroup = async (
  resourceGroupName: string
): Promise<{
  list: Resource[];
  subscriptionId: string;
  resourceGroupName: string;
}> => {
  const list: Resource[] = [];

  for await (const resource of resourceManagement.resources.listByResourceGroup(
    resourceGroupName
  )) {
    list.push(resource);
  }

  return {
    subscriptionId,
    resourceGroupName,
    list
  };
};

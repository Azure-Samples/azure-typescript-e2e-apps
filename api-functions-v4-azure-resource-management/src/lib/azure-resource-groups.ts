// Include npm dependencies
import {
  ResourceGroup, ResourceManagementClient
} from '@azure/arm-resources';
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
export const listResourceGroups = async (): Promise<{
  list: ResourceGroup[];
  subscriptionId: string;
}> => {
  const list: ResourceGroup[] = [];
  for await (const resourceGroup of resourceManagement.resourceGroups.list()) {
    list.push(resourceGroup);
  }
  return {
    subscriptionId,
    list
  };
};
export const createResourceGroup = async (
  resourceGroupName: string,
  location: string,
  tags: { [propertyName: string]: string }
): Promise<ResourceGroup> => {
  const resourceGroupParameters = {
    location: location,
    tags
  };

  return await resourceManagement.resourceGroups.createOrUpdate(
    resourceGroupName,
    resourceGroupParameters
  );
};
export const deleteResourceGroup = async (
  resourceGroupName: string
): Promise<void> => {
  return await resourceManagement.resourceGroups.beginDeleteAndWait(
    resourceGroupName
  );
};

export const checkAzureAuth = () => {
  // The following code is only used to check you have environment
  // variables configured. The DefaultAzureCredential reads your
  // environment - it doesn't read these variables.
  const tenantId = process.env['AZURE_TENANT_ID'];
  if (!tenantId)
    throw Error('AZURE_TENANT_ID is missing from environment variables.');
  const clientId = process.env['AZURE_CLIENT_ID'];
  if (!clientId)
    throw Error('AZURE_CLIENT_ID is missing from environment variables.');
  const secret = process.env['AZURE_CLIENT_SECRET'];
  if (!secret)
    throw Error('AZURE_CLIENT_SECRET is missing from environment variables.');
};

export const getSubscriptionId = (): string => {
  checkAzureAuth();

  // Get subscription from environment variables
  const subscriptionId = process.env['AZURE_SUBSCRIPTION_ID'];
  if (!subscriptionId)
    throw Error('Azure Subscription is missing from environment variables.');
  return subscriptionId;
};

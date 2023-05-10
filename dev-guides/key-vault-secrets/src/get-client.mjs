import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';

export function getClient(keyVaultName) {

  if(!keyVaultName) return;

  // Passwordless authentication
  const credential = new DefaultAzureCredential({});

  // Key vault endpoint URL
  const url = `https://${keyVaultName}.vault.azure.net`;

  // Create client
  const client = new SecretClient(url, credential);

  return client;
}

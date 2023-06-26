import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const credential = new DefaultAzureCredential({});

const vaultName = process.env.KEY_VAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`;
const client = new SecretClient(url, credential);

//-------------------------------------------------

const mySecretName = 'mySecret';
const mySecretValue = 'mySecretValue';

const { name, value, properties } = await client.setSecret(
  mySecretName,
  mySecretValue,
  { enabled: false }
);

// get disable secret value fails
try {
  const secret = await client.getSecret(mySecretName, properties.version);
} catch (err) {
  // Prints out `Operation get is not allowed on a disabled secret.`
  console.log(err.message);
}

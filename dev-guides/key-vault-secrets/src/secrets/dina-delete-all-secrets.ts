import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const credential = new DefaultAzureCredential({});

const vaultName = process.env.KEY_VAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`;
const client = new SecretClient(url, credential);

//-------------------------------------------------

for await (const { name } of client.listPropertiesOfSecrets()) {
  console.log(`Secret name: ${name}`);

  const poller = await client.beginDeleteSecret(name);
  await poller.pollUntilDone();
}

console.log(secretsFound);

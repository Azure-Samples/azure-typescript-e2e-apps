import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

import { DefaultAzureCredential } from "@azure/identity";
import { SecretClient } from "@azure/keyvault-secrets";

const credential = new DefaultAzureCredential({});

const vaultName = process.env.KEY_VAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`;
const client = new SecretClient(url, credential);

const secretName = 'mySecret';

for await (const secretProperties of client.listPropertiesOfSecretVersions(secretName)) {

  // do something with version's properties
  console.log(`Version ${secretProperties.version} created on: ${secretProperties.createdOn.toString()}`);
}
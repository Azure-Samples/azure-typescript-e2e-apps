import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const credential = new DefaultAzureCredential({});

const vaultName = process.env.KEY_VAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`;
const client = new SecretClient(url, credential);

//-------------------------------------------------

const mySecretName = `my-secret-${new Date().getTime()}`;
const secretValue = mySecretName;
const secretProperties = {
  tags: {
    project: 'webPortal',
    secretOwner: 'Jamie Owens',
    secretType: 'Database connection string',
    projectOwner: 'Central portal team'
  },
  contentType: 'Database connection string',
  enabled: false,
  notBefore: undefined, // date
  expiresOn: undefined // date
};

// create secret
const originalSecret = await client.setSecret(
  mySecretName,
  secretValue,
  secretProperties
);
console.log(`Create result: ${JSON.stringify(originalSecret)}`);

// delete secret
const deletePoller = await client.beginDeleteSecret(mySecretName);
const deleteResult = await deletePoller.pollUntilDone();

console.log(`Delete result: ${JSON.stringify(deleteResult)}`);

const recoverPoller = await client.beginRecoverDeletedSecret(mySecretName);
const recoverResult = await recoverPoller.pollUntilDone();

console.log(`Recovery result: ${JSON.stringify(recoverResult)}`);

const deletePoller2 = await client.beginDeleteSecret(mySecretName);
const deleteResult2 = await deletePoller2.pollUntilDone();

console.log(`Delete result: ${JSON.stringify(deleteResult2)}`);

const purgeResult = await client.purgeDeletedSecret(mySecretName);
console.log(`Purge result: ${JSON.stringify(purgeResult)}`);

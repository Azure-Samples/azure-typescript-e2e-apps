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
const createdOn = originalSecret.properties.createdOn;
console.log(`Create result: ${createdOn}`);

// create secret version 2
const originalSecret2 = await client.setSecret(
  mySecretName,
  secretValue + ' version 2',
  secretProperties
);
//console.log(`Create result: ${JSON.stringify(originalSecret2)}`);
//------------------------------------------------------------------------------------

const mySecretName2 = `my-secret2-${new Date().getTime()}`;
const secretValue2 = mySecretName2;
const secretProperties2 = {
  tags: {
    project: 'webPortal2',
    secretOwner: 'Jamie Owens2',
    secretType: 'Database connection string2',
    projectOwner: 'Central portal team2'
  },
  contentType: 'Database connection string',
  enabled: false,
  notBefore: undefined, // date
  expiresOn: undefined // date
};

// create secret
const originalSecret3 = await client.setSecret(
  mySecretName2,
  secretValue2,
  secretProperties2
);
//console.log(`Create result: ${JSON.stringify(originalSecret3)}`);

// create secret version 2
const originalSecret4 = await client.setSecret(
  mySecretName2,
  secretValue2 + ' version 2',
  secretProperties2
);
//console.log(`Create result: ${JSON.stringify(originalSecret4)}`);
//------------------------------------------------------------------------------------

const secretsFound = [];

const propertyName = 'enabled';
const propertyValue = false;

for await (const secretProperties of client.listPropertiesOfSecrets()) {
  if (propertyName === 'tags') {
    if (
      JSON.stringify(secretProperties.tags) === JSON.stringify(propertyValue)
    ) {
      secretsFound.push(secretProperties.name);
    }
  } else {
    if (
      secretProperties[propertyName].toString() === propertyValue.toString()
    ) {
      secretsFound.push(secretProperties.name);
    }
  }
}

console.log(secretsFound);

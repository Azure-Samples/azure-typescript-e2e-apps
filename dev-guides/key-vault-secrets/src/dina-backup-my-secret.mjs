import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

import { DefaultAzureCredential } from "@azure/identity";  
import { SecretClient } from "@azure/keyvault-secrets";  

const credential = new DefaultAzureCredential({}); 

const vaultName = process.env.KEY_VAULT_NAME;  
const vaultName2 = process.env.KEY_VAULT_NAME_2;

console.log(vaultName2)

const url = `https://${vaultName}.vault.azure.net`; 
const url2 = `https://${vaultName2}.vault.azure.net`; 

const client = new SecretClient(url, credential); 
const client2 = new SecretClient(url2, credential);

//-------------------------------------------------

const mySecretName = `my-secret-${new Date().getTime()}`;
const secretValue = mySecretName;
const secretProperties = {
  tags: {
    project: 'webPortal',
    secretOwner: 'Jamie Owens',
    secretType: 'Database connection string',
    projectOwner: 'Central portal team',
  },
  contentType: 'Database connection string',
  enabled: true,
  notBefore: undefined, // date
  expiresOn: undefined, // date
}

// create secret
const v1 = await client.setSecret(
  mySecretName,
  secretValue, 
  secretProperties
);
console.log(`Create 1 result: ${JSON.stringify(v1)}`);

// next version secret
const v2 = await client.setSecret(
  mySecretName,
  secretValue, 
  secretProperties
);
console.log(`Create 2 result: ${JSON.stringify(v2)}`);

const backupBuffer = await client.backupSecret(mySecretName);

// In Node "Buffer instances are also Uint8Array instances", so buf.toString() works in this case.
console.log(backupBuffer.toString());

const restoreResult = await client2.restoreSecretBackup(backupBuffer)
console.log(`Restore properties ${JSON.stringify(restoreResult)}`);

//const secret = await client2.getSecret(mySecretName)
//console.log(JSON.stringify(secret))
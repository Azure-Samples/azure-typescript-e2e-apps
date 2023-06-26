import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

const credential = new DefaultAzureCredential({});

const vaultName = process.env.KEY_VAULT_NAME;
const url = `https://${vaultName}.vault.azure.net`;
const client = new SecretClient(url, credential);

//-------------------------------------------------

const mySecretName = 'my-secret-1683664713942';

const poller = await client.beginDeleteSecret(mySecretName);
const deleteResult = await poller.pollUntilDone();

console.log(`SecretName: ${deleteResult.name}`);
console.log(`DeletedDate: ${deleteResult.deletedOn}`);
console.log(`PurgeDate: ${deleteResult.scheduledPurgeDate}`);
console.log(`RecoveryId: ${deleteResult.recoveryId}`);

import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });
import { parseKeyVaultSecretIdentifier } from '@azure/keyvault-secrets';
import assert from 'node:assert/strict';
import { getClient } from './get-client.mjs';
import { createSecret, updateSecretProperties } from './set-secret.js';
import { getSecretFromId, getCurrentSecret } from './get-secret.mjs';
import { listSecretIds, listSecretNames } from './list-secrets.mjs';
import { enableSecret, disableSecret } from './enable-secret.mjs';
import {
  deleteSecretSoftAndWaitUntilDone,
  recoverDeletedSecretAndWaitUntilDone,
  purgeDeletedSecretAndWaitUntilDone,
  getDeletedSecret
} from './delete-secret.mjs';
import { backupSecret, restoreSecret } from './backup-secret.mjs';

import { promises as fs } from 'fs';
// ---------------------------------------------------------------------------
const client = getClient(process.env.KEY_VAULT_NAME);
const client2 = getClient(process.env.KEY_VAULT_NAME_2);

if (!client) {
  console.log('client is empty');
}
const sleep = (waitTimeInMs) =>
  new Promise((resolve) => setTimeout(resolve, waitTimeInMs));
// ---------------------------------------------------------------------------
const secretName = `my-secret-${new Date().getTime()}`;
const secretValue = secretName;
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
const originalSecret = await createSecret(
  client,
  secretName,
  secretValue,
  secretProperties
);
console.log(originalSecret);

// const secretVersions = [];
// secretVersions.push(originalSecret);

// // update secret 4 times
// for (let i = 1; i < secretValues.length; i++) {
//   // Wait a few seconds
//   await sleep(1000); // so created at date is different
//   console.log(`update secret ${i}`)
//   const secret = await updateSecretValue(client, originalSecret.name, secretValues[i]);
//   secretVersions.push(secret);
// }

// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Wait a few seconds

// const updatedSecret2 = await updateSecretValueAndProperties(client, updatedSecret1, newValue2)

// const versions = await listSecretVersions(client);
// console.log(versions)

// const allSecretsIds = await listSecretIds(client)
// console.log(allSecretsIds)

// Get secret name from id
// const allSecretsNames = await listSecretNames(client)
// console.log(allSecretsNames)

// const lastSecretsName = allSecretsNames[allSecretsNames.length-3]

// const allVersionsOfSecret = await listSecretVersions(client, lastSecretsName)
// console.log(allVersionsOfSecret)

// ---------------------------------------------------------------------

// // disable current version
// const secretPropertiesDisabled = await disableSecret(client, originalSecret.name)
// console.log(secretPropertiesDisabled)

// // Can't get value of disabled secret (but can change properties)
// // try to get current version
// try {
//     const secret = await getCurrentSecret(client, originalSecret.name)
// } catch (err) {
//     console.log(err.message)
// }

// // Update properties - only pass in properties you want to change
// // Any existing properties that aren't passed in, aren't changed or reset
// // In this example: only changing tags to add new tag
// const updatedProperties = { tags: { ...originalSecret.properties.tags, "Updated": "World" } }

// // Change Properties of disabled secret
// const changedProperties = await updateSecretProperties(client, originalSecret.name, secretPropertiesDisabled.version, updatedProperties)

// // enable current version
// const secretPropertiesEnabled = await enableSecret(client, originalSecret.name)
// console.log(secretPropertiesEnabled)

// // Can get value of enabled secret
// const secret = await getCurrentSecret(client, originalSecret.name)

// // Check value
// assert(secret.value,updatedSecret1.value)

// // Check enabled
// assert(secretPropertiesEnabled.enabled,true)

// ---------------------------------------------------------------------

// const deleteResult = await deleteSecretSoftAndWaitUntilDone(
//   client,
//   originalSecret.name,
// );
// console.log(`${deleteResult.name} deleted on ${deleteResult.deletedOn}`);

// const deletedSecret = await getDeletedSecret(client, originalSecret.name);
// console.log(`${deletedSecret.name} deleted on ${deletedSecret.deletedOn}`);

// const recoveredSecretProperties = await recoverDeletedSecretAndWaitUntilDone(
//   client,
//   originalSecret.name,
// );
// console.log(
//   `${recoveredSecretProperties.name} recovered with version ${recoveredSecretProperties.version} and is enabled ${recoveredSecretProperties.enabled}`,
// );

// // Get secret
// const recoveredSecret = await getCurrentSecret(client, originalSecret.name);

// // verify the most recent value is available as the current secret
// assert(updatedSecret1.value, recoveredSecret.value);
// assert(updatedSecret1.properties.version, recoveredSecret.properties.version);

// ---------------------------------------------------------------------

// //Back up and restore to different Key vault

// const backupResultBundleAsBuffer = await backupSecret(client, originalSecret.name);
// console.log(backupResultBundleAsBuffer);

// /*

// )AzureKeyVaultSecretBackupV1.microsoft.comeyJraWQiOiI0Mzg1YjA3Yi1kNTQ3LTQyZTUtYWU5ZS02MTBkYzM5ZGZhZjgiLCJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIn0.JRvx-WKfu6vHS7Z9-KQln4Chi1wozjgXrnlRtcJ7O_i8gt9Mt7RX-R-vlMw1wqSviVTpIGSUFKWILdL81GQvQRC1fZh5wE2Yrm1tG3qIKq9SJybPidScsT10KNAqJHkL8V3pLuntfxTseSjKO8e9_CPvec9CuqcryWlIk22g7GiPZlKXWpLDyEEcZ1gLXhKq72AS7vXl8ejUKNuArmG_gQ60jKi0tsNuevCP7bRF1LdIKJ9qqX_oE4fs4GBkFyfs9PY6Rit2ebYEMHeE4gr46lbChhRzgO_uhOQsaF6eMeaPHPrsU2beko_5Y__xEbqKfEaBlLQ3Frevl4mk9…BnvedggKxXaq2uh5j7SAkqyGVj2sALrsSpMbR7ucl_YRoVjxZklDQCPjJTullPsGvXjQ2HkfNdVdj4R6y4o7CFUTlALGngG5AEiUGgV5mwEEF_W8S4_SzTwtOd6VvYwvRhxOhZTtGCV_F4hReG2bqPAXV-dxXNZW7EH9pfqP6Q98VYd-oi0JUPAnaOh7a1f7NBCuaKi1MoJhU72yjjXXhmyjKbsWNZFz7MucqReoadMZ1T5geNjn5TjYBi39DrbcK057OSOQBUZiZZNQIg3f-Wcnstc29B8PuPVsnoc0kMEIwJzyIoLSlqOviG46aa92WnCxrPL_GiIrgT8m1xn6VJgzQAgTw-IQXhi5Y2yQuQrjkXwdamCy7xxEgvsxRLu58uQVtrYrgMtmPuWTKLvSbxYXKRc5x1ty27zCije-tlonsD0FsACASv6ZsCptClNWfbCpzw.959HW3aDNDwWx2Lx5NK_4FiEf0jOHRm31HbyGnXbTXQ

// */

// // write buffer to file
// const fileWriteResult = await fs.writeFile(`${originalSecret.name}.txt`, backupResultBundleAsBuffer);

// const fileReadResult = await fs.readFile(`${originalSecret.name}.txt`);

// const restoredSecret = await restoreSecret(client2, backupResultBundleAsBuffer);
// console.log(restoredSecret);

// ---------------------------------------------------------------------

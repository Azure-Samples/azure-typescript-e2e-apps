import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

// Azure client libraries
import { DefaultAzureCredential } from '@azure/identity';
import { KeyClient } from '@azure/keyvault-keys';

async function main() {
  // Authenticate to Azure Key Vault
  const credential = new DefaultAzureCredential();
  const client = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
  );

  // Create key
  const keyName = `myKey-${Date.now()}`;
  const key = await client.createRsaKey(keyName);
  console.log(`${key.name} is created`);

  // Backup key and all versions (as Uint8Array)
  const keyBackup = await client.backupKey(keyName);
  console.log(`${key.name} is backed up`);

  // Delete key - wait until delete is complete
  await (await client.beginDeleteKey(keyName)).pollUntilDone();
  console.log(`${key.name} is deleted`);

  // Purge soft-deleted key
  await client.purgeDeletedKey(keyName);
  console.log(`Soft-deleted key, ${key.name}, is purged`);

  // or recover soft-deleted key

  if (keyBackup) {
    // Restore key and all versions to
    // Get last version
    const { name, key, properties } = await client.restoreKeyBackup(keyBackup);
    console.log(
      `${name} is restored from backup, latest version is ${properties.version}`
    );

    // do something with key
  }
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

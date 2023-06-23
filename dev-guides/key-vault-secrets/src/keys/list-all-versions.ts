import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });
import { KeyClient } from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

async function main() {
  const credential = new DefaultAzureCredential();
  const vaultName = process.env.AZURE_KEYVAULT_NAME;
  const url = `https://${vaultName}.vault.azure.net`;
  const client = new KeyClient(url, credential);

  // Get latest version of not-deleted keys
  for await (const keyProperties of client.listPropertiesOfKeys()) {
    console.log(keyProperties.name);

    // Get all versions of key
    for await (const versionProperties of client.listPropertiesOfKeyVersions(
      keyProperties.name
    )) {
      console.log(
        `\tversion: ${versionProperties.version} created on ${versionProperties.createdOn}`
      );
    }
  }
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

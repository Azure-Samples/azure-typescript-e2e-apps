import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });
import { KeyClient, CreateKeyOptions, KeyVaultKey } from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

export async function listKeys(client: KeyClient) {
  for await (const keyProperties of client.listPropertiesOfKeys()) {
    console.log(keyProperties.name);
    for await (const versionProperties of client.listPropertiesOfKeyVersions(
      keyProperties.name
    )) {
      console.log('\tVersion properties: ', versionProperties);
    }
  }
  for await (const deletedKey of client.listDeletedKeys()) {
    console.log('Deleted: ', deletedKey);
  }
}

async function main() {
  const credential = new DefaultAzureCredential();
  const vaultName = process.env.AZURE_KEYVAULT_NAME;
  const url = `https://${vaultName}.vault.azure.net`;
  const client = new KeyClient(url, credential);

  // Get latest version of not-deleted keys
  for await (const keyProperties of client.listPropertiesOfKeys()) {
    console.log(keyProperties.name);
  }
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

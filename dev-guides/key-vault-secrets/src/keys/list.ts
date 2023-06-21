import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });
import { KeyClient, CreateKeyOptions, KeyVaultKey } from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';
/*

  Create new key
  Update existing key value and properties - should pass in existing properties if not updating
  If you only want to update properties, use updateKeyProperties
*/
export async function createKey(
  client: KeyClient,
  keyName: string,
  keyValue: string,
  keyProperties?: CreateKeyOptions
) {
  if (!client || !keyName || !keyValue) return;

  const key: KeyVaultKey = await client.createKey(
    keyName,
    keyValue,
    keyProperties
  );

  return key;
}

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

  const keyProperties = {
    enabled: true,
    expiresOn: new Date('2024-01-01'),
    exportable: false,
    tags: {
      project: 'test-project'
    }
  };

  const client = new KeyClient(url, credential);
  // const key = await createKey(client, 'test-key', 'test-value');
  // if (key) {
  //   console.log(`key: ${key.id}:${key.name}:${key.key}`);
  // }
  await listKeys(client);
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

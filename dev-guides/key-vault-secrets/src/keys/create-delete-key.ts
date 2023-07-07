import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });
import {
  KeyClient,
  CreateKeyOptions,
  KeyVaultKey,
  KeyReleasePolicy,
  KnownKeyTypes
} from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';
/*

  Create new key
  Update existing key value and properties - should pass in existing properties if not updating
  If you only want to update properties, use updateKeyProperties
*/
export async function createKey(
  client: KeyClient,
  keyName: string,
  keyType: string,
  keyProperties?: CreateKeyOptions
) {
  if (!client || !keyName || !keyType) return;

  const key: KeyVaultKey = await client.createKey(
    keyName,
    keyType,
    keyProperties
  );

  return key;
}

async function createKeyFull(client: KeyClient, timestamp: string) {
  const keyReleasePolicy: KeyReleasePolicy = {
    immutable: true,
    contentType: 'application/json; charset=utf-8',
    encodedPolicy: undefined
  };

  const keyProperties: CreateKeyOptions = {
    curve: 'P-256', // Optional elliptic-curve
    hsm: false, // Optional hardware security module
    enabled: true,
    expiresOn: new Date('2024-01-01'),
    exportable: false,
    tags: {
      project: 'test-project'
    },
    keySize: 2048 // Optional key size in bits
    //keyOps: ['encrypt', 'decrypt', 'sign', 'verify', 'wrapKey', 'unwrapKey'], // Optional operations,
    //releasePolicy: keyReleasePolicy
  };

  const keyType = KnownKeyTypes.EC; //  'EC', 'EC-HSM', 'RSA', 'RSA-HSM', 'oct'

  const name = `MyKey-${timestamp}`;
  const key = await createKey(client, name, keyType, keyProperties);
  if (key) {
    console.log(key);
    return key;
  }

  return undefined;
}

async function main() {
  const credential = new DefaultAzureCredential();
  const vaultName = process.env.AZURE_KEYVAULT_NAME;
  const url = `https://${vaultName}.vault.azure.net`;
  const timestamp: string = Date.now().toString();
  const client = new KeyClient(url, credential);

  const keyName = `myKey-${timestamp}`

  const key = await client.createKey(keyName, KnownKeyTypes.EC);
  const poller = await client.beginDeleteKey(keyName);

  // Serializing the poller
  const serialized = poller.toString();
  // A new poller can be created with:
  // await client.beginDeleteKey("MyKey", { resumeFrom: serialized });
  
  // Waiting until it's done
  const deletedKey = await poller.pollUntilDone();
  console.log(deletedKey);
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

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

  const key: KeyVaultKey | undefined = await createKeyFull(client, timestamp);

  if (key) {
    const keyAgain: KeyVaultKey = await client.getKey(key.name);
    if (keyAgain) {
      console.log(keyAgain);
    }

    // TBD: when I rotate a key, I want the expiration to extend for a year
    // but expiration isn't set after rotation.
    // rotate === update === new version
    // I'm responsible for the new key
    const rotatedKey1: KeyVaultKey = await client.rotateKey(key.name);
    console.log(rotatedKey1);

    const rotatedKey2: KeyVaultKey = await client.rotateKey(key.name);
    console.log(rotatedKey2);

    // update properties of current key
    const updatedKeyPropertiesResult = await client.updateKeyProperties(
      key.name,
      { tags: { ...key.properties.tags, subproject: 'Health and wellness' } }
    );
    console.log(updatedKeyPropertiesResult);

    // update properties of specific key's version
    // @ts-ignore
    const updatedKeyPropertiesResult2 = await client.updateKeyProperties(
      key.name,
      key?.properties?.version,
      {
        tags: {
          ...key.properties.tags,
          subproject: 'UpdatedVersion: Health and wellness'
        }
      }
    );
    console.log(updatedKeyPropertiesResult2);

    const rotatedKey3: KeyVaultKey = await client.rotateKey(key.name);
    console.log(rotatedKey3);

    const innerKey = key.key;

    // @ts-ignore
    // TBD: when I try to import a key (used an existing key because I thought
    // it would be well-formed), I get an error
    // EC key is not valid - cannot instantiate crypto service
    // TBD: Timo
    const importKeyResult = await client.importKey(
      `ImportedKey-${timestamp}`,
      innerKey
    );
    console.log(importKeyResult);
  }

  // const keyRotationPolicy = await client.getKeyRotationPolicy(name);
  // if (keyRotationPolicy) {
  //   console.log(keyRotationPolicy);
  // }

  //let cryptographyClient = client.getCryptographyClient(name);

  // const keyOct = await createOctKey(client, `MyOctKey-${timestamp}`);
  // if (keyOct) {
  //   console.log(keyOct);
  // }

  // const keyEc = await createEcKey(client, `MyEcKey-${timestamp}`);
  // if (keyEc) {
  //   console.log(keyEc);
  // }
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

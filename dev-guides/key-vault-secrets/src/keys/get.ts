import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });
import {
  KeyClient,
  CreateKeyOptions,
  KeyVaultKey,
  KeyReleasePolicy
} from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

async function main() {
  const credential = new DefaultAzureCredential();
  const vaultName = process.env.AZURE_KEYVAULT_NAME;
  const url = `https://${vaultName}.vault.azure.net`;
  const name = `auto-rotate-dina`;

  const client = new KeyClient(url, credential);
  const keyAgain: KeyVaultKey = await client.getKey(name);
  console.log(keyAgain);

  const rotationPolicy = await client.getKeyRotationPolicy(name);
  console.log(rotationPolicy);
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

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

  const keyName = `MyKey`;

  // Get key
  let key = await client.getKey(keyName);
  console.log(key);

  if (key?.name) {
    key = await client.rotateKey(key.name);
    console.log(key);
  }
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });
import { KeyClient } from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

async function main() {
  const credential = new DefaultAzureCredential();
  const vaultName = process.env.AZURE_KEYVAULT_NAME;
  const url = `https://${vaultName}.vault.azure.net`;
  const client = new KeyClient(url, credential);

  for await (const deletedKey of client.listDeletedKeys()) {
    console.log(
      `Deleted: ${deletedKey.name} deleted on ${deletedKey.properties.deletedOn}, to be purged on ${deletedKey.properties.scheduledPurgeDate}`
    );
  }
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

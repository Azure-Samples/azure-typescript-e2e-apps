import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

// Azure client libraries
import { DefaultAzureCredential } from '@azure/identity';
import { KeyVaultSettingsClient } from '@azure/keyvault-admin';

async function main() {
  // Authenticate to Azure Key Vault
  const credential = new DefaultAzureCredential();
  const client = new KeyVaultSettingsClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
  );

  const settings = await client.getSettings();
  console.log(settings);
}
main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

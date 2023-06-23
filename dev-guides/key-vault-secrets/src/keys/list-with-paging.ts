import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });
import { KeyClient } from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

async function main() {
  const credential = new DefaultAzureCredential();
  const vaultName = process.env.AZURE_KEYVAULT_NAME;
  const url = `https://${vaultName}.vault.azure.net`;
  const client = new KeyClient(url, credential);

  let page = 1;

  // Get latest version of not-deleted keys
  for await (const keyProperties of client.listPropertiesOfKeys().byPage({
    maxPageSize: 5
  })) {
    console.log(`Page ${page++} ---------------------`);
    for (const props of keyProperties) {
      console.log(`${props.name}`);
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

import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });
import { KeyClient } from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

async function main() {
  const credential = new DefaultAzureCredential();
  const client = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
  );

  const name = `myRsaKey-1687440362047`;

  for await (const keyProperties of client.listPropertiesOfKeyVersions(name)) {
    const thisVersion = keyProperties.version;

    const { key } = await client.getKey(name, {
      version: thisVersion
    });

    // do something with key
  }
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

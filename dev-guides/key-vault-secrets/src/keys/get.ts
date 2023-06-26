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

  const latestKey = await client.getKey(name);
  console.log(`${latestKey.name} version is ${latestKey.properties.version}`);

  const keyPreviousVersionId = '2f2ec6d43db64d66ad8ffa12489acc8b';
  const keyByVersion = await client.getKey(name, {
    version: keyPreviousVersionId
  });
  console.log(`Previous key version is ${keyByVersion.properties.version}`);
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

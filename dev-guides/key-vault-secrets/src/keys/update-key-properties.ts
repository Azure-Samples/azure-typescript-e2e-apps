import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });
import { KeyClient } from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

async function main() {
  // Authenticate to Key Vault service
  const credential = new DefaultAzureCredential();
  const client = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
  );

  // Set key name
  const keyName = 'MyKey';

  const key = await client.getKey(keyName);

  if (key) {
    const updateKeyPropertiesOptions = {
      enabled: false,
      // expiresOn,
      // keyOps,
      // notBefore,
      // releasePolicy,
      tags: { ...key.properties.tags, subproject: 'Health and wellness' }
    };

    // update properties of current version
    await client.updateKeyProperties(key.name, updateKeyPropertiesOptions);

    // update properties of specific version
    await client.updateKeyProperties(
      key.name,
      key?.properties?.version as string,
      {
        enabled: true
      }
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

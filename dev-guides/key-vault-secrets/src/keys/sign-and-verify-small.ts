import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });
import { createHash } from 'crypto';
import { DefaultAzureCredential } from '@azure/identity';
import {
  CryptographyClient,
  KeyClient,
  KnownSignatureAlgorithms
} from '@azure/keyvault-keys';

async function main() {
  // get service client
  const credential = new DefaultAzureCredential();
  const serviceClient = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
  );

  // get existing key
  const keyVaultKey = await serviceClient.getKey('myRsaKey-1687440362047');

  if (keyVaultKey?.name) {
    // get encryption client with key
    const cryptoClient = new CryptographyClient(keyVaultKey, credential);

    const data = 'Hello you bright big beautiful world!';

    // sign
    const { result: signature } = await cryptoClient.signData(
      KnownSignatureAlgorithms.RS256,
      Buffer.from(data, 'utf8')
    );

    // verify signature
    const { result: verified } = await cryptoClient.verifyData(
      KnownSignatureAlgorithms.RS256,
      Buffer.from(data, 'utf8'),
      signature
    );
    console.log(`Verification ${verified ? 'succeeded' : 'failed'}.`);
  }
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

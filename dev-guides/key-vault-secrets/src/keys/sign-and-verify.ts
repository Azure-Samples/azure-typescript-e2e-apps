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

    // get digest
    const myPassword = '35:<Ugj<#4}cH?<=';
    const digest = createHash('sha256')
      .update(myPassword)
      .update(process.env.SYSTEM_SALT as string)
      .digest();

    // sign digest
    const { result: signature } = await cryptoClient.sign(
      KnownSignatureAlgorithms.RS256,
      digest
    );

    // store signed digest in database

    // verify signature
    const { result: verified } = await cryptoClient.verify(
      KnownSignatureAlgorithms.RS256,
      digest,
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

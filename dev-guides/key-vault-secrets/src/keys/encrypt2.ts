import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

import { DefaultAzureCredential } from '@azure/identity';
import {
  CryptographyClient,
  DecryptParameters,
  KeyClient,
  KnownEncryptionAlgorithms,
  RsaEncryptParameters
} from '@azure/keyvault-keys';

async function main() {
  // get service client
  const credential = new DefaultAzureCredential();
  const serviceClient = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
  );

  // get existing key
  const keyName = 'myRsaKey-1687440362047';
  const keyVaultKey = await serviceClient.getKey(keyName);

  if (keyVaultKey?.name) {
    // get encryption client
    const encryptClient = new CryptographyClient(keyVaultKey, credential);

    // set data to encrypt
    const originalInfo = 'Hello World';

    // set encryption algorithm
    const algorithm = KnownEncryptionAlgorithms.RSAOaep256;

    // encrypt settings: RsaEncryptParameters | AesGcmEncryptParameters | AesCbcEncryptParameters
    const encryptParams: RsaEncryptParameters = {
      algorithm,
      plaintext: Buffer.from(originalInfo)
    };

    // encrypt
    const encryptResult = await encryptClient.encrypt(encryptParams);

    // decrypt settings: DecryptParameters
    const decryptParams: DecryptParameters = {
      algorithm,
      ciphertext: encryptResult.result
    };

    // decrypt
    const decryptResult = await encryptClient.decrypt(decryptParams);
    console.log(decryptResult.result.toString());
  }
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

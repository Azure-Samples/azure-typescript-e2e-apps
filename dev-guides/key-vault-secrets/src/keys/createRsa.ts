import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });
import {
  KeyClient,
  CreateKeyOptions,
  KeyVaultKey,
  CryptographyClient,
  KnownEncryptionAlgorithms,
  RsaEncryptParameters,
  KnownKeyTypes,
  KnownKeyCurveNames,
  KnownKeyOperations,
  EncryptionAlgorithm,
  EncryptParameters,
  RsaEncryptionAlgorithm
} from '@azure/keyvault-keys';
import { DefaultAzureCredential } from '@azure/identity';

async function main() {
  const credential = new DefaultAzureCredential();
  const vaultName = process.env.AZURE_KEYVAULT_NAME;
  const url = `https://${vaultName}.vault.azure.net`;
  const client = new KeyClient(url, credential);

  const timestamp: string = Date.now().toString();
  const name = `myRsaKey-${timestamp}`;
  const originalInfo = `Hear we go again`;

  type MyRsaEncryptionConfiguration = {
    type: KnownKeyTypes;
    algorithm: RsaEncryptionAlgorithm;
    size: number;
  };

  const myEncryptionConfiguration: MyRsaEncryptionConfiguration = {
    type: KnownKeyTypes.RSA,
    algorithm: KnownEncryptionAlgorithms.RSAOaep256,
    size: 2048
  };
  const algorithm = myEncryptionConfiguration.algorithm;
  const encryptParams: EncryptParameters = {
    algorithm: algorithm,
    plaintext: Buffer.from(originalInfo)
  };

  const ONE_YEAR_FROM_TODAY = new Date(); // create a new date object
  ONE_YEAR_FROM_TODAY.setFullYear(ONE_YEAR_FROM_TODAY.getFullYear() + 1);
  console.log(ONE_YEAR_FROM_TODAY);

  const keyProperties: CreateKeyOptions = {
    //curve: KnownKeyCurveNames.P256, // Optional elliptic-curve
    hsm: false, // Optional hardware security module
    enabled: true,
    expiresOn: ONE_YEAR_FROM_TODAY,
    exportable: false,
    tags: {
      project: 'test-project'
    },
    keySize: myEncryptionConfiguration.size, // Optional key size in bits
    keyOps: [KnownKeyOperations.Encrypt, KnownKeyOperations.Decrypt] // Optional operations
  };

  const key: KeyVaultKey = await client.createKey(
    name,
    myEncryptionConfiguration.type,
    keyProperties
  );

  //const key: KeyVaultKey = await client.getKey(name);
  console.log(key);

  if (key && key.id && key.key) {
    console.log(`key name: ${key.name}`);
    return;
  }
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

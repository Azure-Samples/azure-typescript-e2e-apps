import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true });

// Azure client libraries
import { DefaultAzureCredential } from '@azure/identity';
import {
  CreateKeyOptions,
  KeyClient,
  KeyRotationPolicyProperties,
  KnownKeyOperations,
  KnownKeyTypes
} from '@azure/keyvault-keys';

// Day/time manipulation
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

async function main() {
  // Authenticate to Azure Key Vault
  const credential = new DefaultAzureCredential();
  const client = new KeyClient(
    `https://${process.env.AZURE_KEYVAULT_NAME}.vault.azure.net`,
    credential
  );

  // Name of key
  const timestamp: string = Date.now().toString();
  const keyName = `mykey-${timestamp}`;

  // Set key options
  const keyOptions: CreateKeyOptions = {
    enabled: true,
    expiresOn: dayjs().add(1, 'year').toDate(),
    exportable: false,
    tags: {
      project: 'test-project'
    },
    keySize: 2048,
    keyOps: [
      KnownKeyOperations.Encrypt,
      KnownKeyOperations.Decrypt
      // KnownKeyOperations.Verify,
      // KnownKeyOperations.Sign,
      // KnownKeyOperations.Import,
      // KnownKeyOperations.WrapKey,
      // KnownKeyOperations.UnwrapKey
    ]
  };

  // Set key type
  const keyType = KnownKeyTypes.RSA; //  'EC', 'EC-HSM', 'RSA', 'RSA-HSM', 'oct', 'oct-HSM'

  // Create key
  const key = await client.createKey(keyName, keyType, keyOptions);
  if (key) {
    // Set rotation policy properties: KeyRotationPolicyProperties
    const rotationPolicyProperties: KeyRotationPolicyProperties = {
      expiresIn: 'P90D',
      lifetimeActions: [
        {
          action: 'Rotate',
          timeAfterCreate: 'P30D'
        },
        {
          action: 'Notify',
          timeBeforeExpiry: dayjs.duration({ days: 7 }).toISOString()
        }
      ]
    };

    // Set rotation policy: KeyRotationPolicy
    const keyRotationPolicy = await client.updateKeyRotationPolicy(
      key.name,
      rotationPolicyProperties
    );
    console.log(keyRotationPolicy);

    // Rotate key with options: RotateKeyOptions
    const rotatedKey = await client.rotateKey(key.name);
    console.log(rotatedKey);
  }
}

main()
  .then(() => {
    console.log('done');
  })
  .catch((err) => {
    console.log(err);
  });

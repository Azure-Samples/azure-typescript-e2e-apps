import {
  KeyClient,
  KeyVaultKey,
  KeyProperties,
  DeletedKey,
} from "@azure/keyvault-keys";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

const credential = new DefaultAzureCredential();

// Get Key Vault name from environment variables
// such as `https://${keyVaultName}.vault.azure.net`
const keyVaultUrl = process.env.KEY_VAULT_URL;
if (!keyVaultUrl) throw new Error("KEY_VAULT_URL is empty");

function printKey(keyVaultKey: KeyVaultKey): void {
  const { name, key, id, keyType, keyOperations, properties } = keyVaultKey;
  console.log("Key: ", { name, key, id, keyType });

  const { vaultUrl, version, enabled, expiresOn }: KeyProperties = properties;
  console.log("Key Properties: ", { vaultUrl, version, enabled, expiresOn });

  console.log("Key Operations: ", keyOperations.join(", "));
}

async function main(): Promise<void> {
  // Create a new KeyClient
  const client = new KeyClient(keyVaultUrl, credential);

  // Create unique key names
  const uniqueString = Date.now().toString();
  const keyName = `sample-key-${uniqueString}`;
  const ecKeyName = `sample-ec-key-${uniqueString}`;
  const rsaKeyName = `sample-rsa-key-${uniqueString}`;

  // Create a EC key
  const ecKey = await client.createKey(keyName, "EC");
  printKey(ecKey);

  // Elliptic curve key
  const ec256Key = await client.createEcKey(ecKeyName, {
    curve: "P-256",
  });
  printKey(ec256Key);

  // RSA key
  const rsa2048Key = await client.createRsaKey(rsaKeyName, {
    keySize: 2048,
  });
  printKey(rsa2048Key);

  // Get a key
  const key = await client.getKey(keyName);
  printKey(key);

  // Get properties of all keys
  for await (const keyProperties of client.listPropertiesOfKeys()) {
    const iteratedKey = await client.getKey(keyProperties.name);
    printKey(iteratedKey);
  }

  // Update key properties - disable key
  const updatedKey = await client.updateKeyProperties(
    keyName,
    ecKey.properties.version,
    {
      enabled: false,
    }
  );
  printKey(updatedKey);

  // Delete key (without immediate purge)
  const deletePoller = await client.beginDeleteKey(keyName);
  await deletePoller.pollUntilDone();

  // Get a deleted key
  const deletedKey = await client.getDeletedKey(keyName);
  console.log("deleted key: ", deletedKey.name);

  // Purge a deleted key
  console.time("purge a single key");
  await client.purgeDeletedKey(keyName);
  console.timeEnd("purge a single key");
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});

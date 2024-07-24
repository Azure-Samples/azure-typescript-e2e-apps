import { KeyClient, KeyVaultKey, KeyProperties, DeletedKey } from "@azure/keyvault-keys";
import { DefaultAzureCredential } from "@azure/identity";
import 'dotenv/config'

const credential = new DefaultAzureCredential();

// Get Key Vault name from environment variables
const keyVaultName = process.env.KEY_VAULT_NAME;
if (!keyVaultName) throw new Error("KEY_VAULT_NAME is empty");

// URL to the Key Vault
const url = `https://${keyVaultName}.vault.azure.net`;

function printKey(keyVaultKey: KeyVaultKey) {
    const { name, key, id, keyType, keyOperations, properties } = keyVaultKey;
    console.log("Key: ", { name, key, id, keyType });

    const { vaultUrl, version, enabled, expiresOn }: KeyProperties = properties;
    console.log("Key Properties: ", { vaultUrl, version, enabled, expiresOn });

    console.log("Key Operations: ", keyOperations.join(", "));
}

async function main() {

    // Create a new KeyClient
    const client = new KeyClient(url, credential);

    // Create unique key names
    const uniqueString = Date.now().toString();
    const keyName = `sample-key-${uniqueString}`;
    const ecKeyName = `sample-ec-key-${uniqueString}`;
    const rsaKeyName = `sample-rsa-key-${uniqueString}`;

    // Create a EC key
    const ecKey: KeyVaultKey = await client.createKey(keyName, "EC");
    printKey(ecKey);

    // Elliptic curve key
    const ec256Key: KeyVaultKey = await client.createEcKey(ecKeyName, { curve: "P-256" });
    printKey(ec256Key);

    // RSA key
    const rsa2048Key: KeyVaultKey = await client.createRsaKey(rsaKeyName, { keySize: 2048 });
    printKey(rsa2048Key);

    // Get a key
    const key: KeyVaultKey = await client.getKey(keyName);
    printKey(key);

    // Get properties of all keys
    for await (const keyProperties of client.listPropertiesOfKeys()) {
        const iteratedKey: KeyVaultKey = await client.getKey(keyProperties.name);
        printKey(iteratedKey);
    }

    // Update key properties - disable key
    const updatedKey: KeyVaultKey = await client.updateKeyProperties(keyName, ecKey.properties.version, {
        enabled: false
    });
    printKey(updatedKey);

    // Delete key (without immediate purge)
    const deletePoller = await client.beginDeleteKey(keyName);
    await deletePoller.pollUntilDone();

    // Get a deleted key
    const deletedKey: DeletedKey = await client.getDeletedKey(keyName);
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
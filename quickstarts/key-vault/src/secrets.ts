import {
  SecretClient,
  KeyVaultSecret,
  SecretProperties,
} from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

// Passwordless credential
const credential = new DefaultAzureCredential();

// Get Key Vault name from environment variables
const keyVaultName = process.env.KEY_VAULT_NAME;
if (!keyVaultName) throw new Error("KEY_VAULT_NAME is empty");

// URL to the Key Vault
const url = `https://${keyVaultName}.vault.azure.net`;

function printSecret(secret: KeyVaultSecret) {
  const { name, value, properties } = secret;
  const { enabled, expiresOn, createdOn } = properties;
  console.log("Secret: ", { name, value, enabled, expiresOn, createdOn });
}
function printSecretProperties(secret: SecretProperties) {
  const { name, enabled, expiresOn, createdOn } = secret;
  console.log("Secret: ", { name, enabled, expiresOn, createdOn });
}

async function main() {
  // Create a new SecretClient
  const client = new SecretClient(url, credential);

  // Create a unique secret name
  const uniqueString = new Date().getTime().toString();
  const secretName = `secret${uniqueString}`;

  // Create a secret
  const createSecretResult: KeyVaultSecret = await client.setSecret(
    secretName,
    "MySecretValue",
  );
  printSecret(createSecretResult);

  // Get the secret by name
  const getSecretResult: KeyVaultSecret = await client.getSecret(secretName);
  printSecret(getSecretResult);

  // Update properties
  const updatedSecret: SecretProperties = await client.updateSecretProperties(
    secretName,
    getSecretResult.properties.version,
    {
      enabled: false,
    },
  );
  printSecretProperties(updatedSecret);

  // Delete secret (without immediate purge)
  const deletePoller = await client.beginDeleteSecret(secretName);
  await deletePoller.pollUntilDone();
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});

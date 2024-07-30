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
// such as `https://${keyVaultName}.vault.azure.net`
const keyVaultUrl = process.env.KEY_VAULT_URL;
if (!keyVaultUrl) throw new Error("KEY_VAULT_URL is empty");

function printSecret(secret: KeyVaultSecret): void {
  const { name, value, properties } = secret;
  const { enabled, expiresOn, createdOn } = properties;
  console.log("Secret: ", { name, value, enabled, expiresOn, createdOn });
}
function printSecretProperties(secret: SecretProperties): void {
  const { name, enabled, expiresOn, createdOn } = secret;
  console.log("Secret: ", { name, enabled, expiresOn, createdOn });
}

async function main(): Promise<void> {
  // Create a new SecretClient
  const client = new SecretClient(keyVaultUrl, credential);

  // Create a unique secret name
  const uniqueString = new Date().getTime().toString();
  const secretName = `secret${uniqueString}`;

  // Create a secret
  const createSecretResult = await client.setSecret(
    secretName,
    "MySecretValue"
  );
  printSecret(createSecretResult);

  // Get the secret by name
  const getSecretResult = await client.getSecret(secretName);
  printSecret(getSecretResult);

  // Update properties
  const updatedSecret = await client.updateSecretProperties(
    secretName,
    getSecretResult.properties.version,
    {
      enabled: false,
    }
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

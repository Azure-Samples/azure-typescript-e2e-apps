import { parseKeyVaultSecretIdentifier } from '@azure/keyvault-secrets';

export function getSecretFromId(id) {
  if (!id) return;

  // When you only have the secret id (URL), get more information
  // properties.id: `https://{Key-Vault-Name}.vault.azure.net/secrets/{Secret-name}/{Version}`
  const { sourceId, vaultUrl, version } = parseKeyVaultSecretIdentifier(id);

  return { sourceId, vaultUrl, version };
}

export async function getCurrentSecret(
  client,
  secretName,
  version = undefined
) {
  if (!client || !secretName) return;

  const { name, properties, value } = await client.getSecret(secretName, {
    version
  });

  return { name, properties, value };
}

/*
export async function getDisabledSecret(client, secretName) {
  throw new Error('You must enable secret first');
}
*/

export async function enableSecret(client, secretName, version = undefined) {
  if (!client || !secretName) return;

  const updatedProperties = await client.updateSecretProperties(
    secretName,
    version,
    {
      enabled: true
    }
  );
  return updatedProperties;
}
export async function disableSecret(client, secretName, version = undefined) {
  if (!client || !secretName) return;

  const updatedProperties = await client.updateSecretProperties(
    secretName,
    version,
    {
      enabled: false
    }
  );
  return updatedProperties;
}

/*

  Create new secret
  Update existing secret value and properties - should pass in existing properties if not updating
  If you only want to update properties, use updateSecretProperties
*/
export async function createSecret(
  client,
  secretName,
  secretValue,
  secretProperties
) {
  if (!client || !secretName || !secretValue) return;

  const { name, value, properties } = await client.setSecret(
    secretName,
    secretValue,
    secretProperties
  );

  return { name, value, properties };
}
// The updateSecret method changes specified attributes of an existing stored secret.
// Properties that are not specified in the request are left unchanged.
// The value of a secret itself cannot be changed. This operation requires the secrets/set permission.
export async function updateSecretProperties(
  client,
  secretName,
  secretVersion,
  completeProperties
) {
  if (!client || !secretName || !secretVersion || !completeProperties) return;

  // Update secret's properties - don't change secret name or value
  // Use setSecret to change value
  const properties = await client.updateSecretProperties(
    secretName,
    secretVersion,
    completeProperties
  );

  return properties;
}

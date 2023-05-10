// The updateSecret method changes specified attributes of an existing stored secret.
// Properties that are not specified in the request are left unchanged.
// The value of a secret itself cannot be changed. This operation requires the secrets/set permission.
export async function updateSecretProperties(
  client,
  secretName,
  secretVersion,
  completeProperties,
) {

  if(!client || !secretName || !secretVersion || !completeProperties) return;

  // Update secret's properties - don't change secret name or value
  // Use setSecret to change value
  const properties = await client.updateSecretProperties(
    secretName,
    secretVersion,
    completeProperties,
  );

  return properties;
}
